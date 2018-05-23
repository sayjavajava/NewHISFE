import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {ServiceTax} from '../../../models/service-tax';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
    selector: 'service-tax-component',
    templateUrl: '../../../templates/dashboard/setting/service-tax.template.html',

})
export class ServiceTaxComponent implements OnInit {
    serviceTax: ServiceTax = new ServiceTax();
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    dataTaxes: ServiceTax[] = [];
    isUpdateServiceTax: boolean = false;
    isSearchedTax: boolean = false;
    searchTax: string = "";

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Service Tax';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getTaxesFromServer(0);
        }
    }

    getTaxesFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_TAX_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SER_TAX_SUC_01') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.dataTaxes = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    onTaxPopupLoad() {
        this.isUpdateServiceTax = false;
        this.serviceTax = new ServiceTax();
    }

    saveServiceTax(form: NgForm) {
        if (form.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(
                    AppConstants.SERVICE_TAX_SAVE_URL,
                    this.serviceTax
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SER_TAX_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'Tax');
                            this.getPageWiseICDs(this.currPage);
                            document.getElementById('close-btn').click();
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Tax');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
            } else {
                this.router.navigate(['/login']);
            }
        } else {
            this.notificationService.error('Required Fields are missing', 'Tax Service');
        }
    }

    deleteServiceTax(taxId: any) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are you soure?")) return;
            this.requestsService.deleteRequest(
                AppConstants.SERVICE_TAX_DELETE_URL + taxId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SER_TAX_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Tax');
                            this.getPageWiseICDs(this.currPage);
                        } else {
                            this.getPageWiseICDs(this.currPage);
                            this.notificationService.error(response['responseMessage'], 'Tax');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }

    editServiceTax(serviceTax: any) {
        this.isUpdateServiceTax = true;
        this.serviceTax = serviceTax;
    }

    updateServiceTax(updateServiceTaxForm: NgForm) {
        if (updateServiceTaxForm.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(
                    AppConstants.SERVICE_TAX_UPDATE_URL, this.serviceTax
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SER_TAX_SUC_06') {
                            this.serviceTax = new ServiceTax();
                            this.notificationService.success(response['responseMessage'], 'Tax');
                            document.getElementById('close-btn').click();
                            this.getPageWiseICDs(this.currPage);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Tax')
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
            } else {
                this.router.navigate(['/login']);
            }
        } else {
            this.notificationService.error('Required Fields are missing', 'Tax');
        }
    }

    getPageWiseICDs(page: number) {
        this.dataTaxes = [];
        if (this.isSearchedTax) {
            this.searchByTaxName();
        } else {
            this.getTaxesFromServer(page);
        }
    }

    refreshTaxesTable() {
        this.isSearchedTax = false;
        this.searchTax = '';
        this.getTaxesFromServer(0);
    }

    private searchByTaxName() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.isSearchedTax = true;
            this.requestsService.getRequest(
                AppConstants.SERVICE_TAX_SEARCH_URL + '0?searchTax=' + this.searchTax)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SER_TAX_SUC_07') {
                            this.nextPage = response['responseData']['nextPage'];
                            this.prePage = response['responseData']['prePage'];
                            this.currPage = response['responseData']['currPage'];
                            this.pages = response['responseData']['pages'];
                            this.dataTaxes = response['responseData']['data'];
                            this.notificationService.success('Taxes found successfully');
                        } else {
                            this.nextPage = 0;
                            this.prePage = 0;
                            this.currPage = 0;
                            this.pages = [];
                            this.dataTaxes = [];
                            this.notificationService.warn('Taxes not found');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        }
    }
}
