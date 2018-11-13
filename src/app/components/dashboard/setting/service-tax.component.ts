import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {TaxService} from '../../../model/service-tax';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
    selector: 'service-tax-component',
    templateUrl: '../../../templates/dashboard/setting/tax.template.html',

})
export class taxComponent implements OnInit {
    serviceTax: TaxService = new TaxService();

    dataTaxes: TaxService[] = [];
    isUpdateServiceTax: boolean = false;
    isSearchedTax: boolean = false;
    searchTax: string = '';
    cols: any[] = [
        {field: 'name', header: 'name'},
        {field: 'rate', header: 'rate'},
        {field: 'fromDate', header: 'fromDate'},
        {field: 'toDate', header: 'toDate'},
        {field: 'description', header: 'description'},
        {field: 'status', header: 'status'},
        {field: 'Action', header: 'Action'},
    ];

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {

    }

    ngOnInit() {
        document.title = 'HIS | Service Tax';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getAllTaxesForDataTable();
        }
    }

    getAllTaxesForDataTable() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_TAX_DATA_TABLE_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SER_TAX_SUC_01') {
                        this.dataTaxes = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }


    onTaxPopupLoad() {
        this.isUpdateServiceTax = false;
        this.serviceTax = new TaxService();
    }

    saveServiceTax(form: NgForm) {
        if (form.valid) {
            if (new Date(this.serviceTax.fromDate) > new Date(this.serviceTax.toDate)) {
                this.notificationService.warn('FROM DATE must be less than or equal to TO DATE.');
                document.getElementById('fromDate').focus();
                return;
            }

            if (this.serviceTax.rate < 0 || this.serviceTax.rate > 100) {
                this.notificationService.error('Please enter valid tax', 'Tax');
                return
            }
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(
                    AppConstants.SERVICE_TAX_SAVE_URL,
                    this.serviceTax
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SER_TAX_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'Tax');
                            this.getAllTaxesForDataTable();
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
            if (this.serviceTax.name === '') {
                this.notificationService.warn('Please enter Name.');
                document.getElementById('name').focus();
                return;
            }
            if (this.serviceTax.fromDate === '') {
                this.notificationService.warn('Please enter from date.');
                document.getElementById('fromDate').focus();
                return;
            }
            if (this.serviceTax.toDate === '') {
                this.notificationService.warn('Please enter to date.');
                document.getElementById('toDate').focus();
                return;
            }

            if (new Date(this.serviceTax.fromDate) > new Date(this.serviceTax.toDate)) {
                this.notificationService.warn('FROM DATE must be less than or equal to TO DATE.');
                document.getElementById('fromDate').focus();
                return;
            }


            if (this.serviceTax.rate < 0 || this.serviceTax.rate > 100) {
                this.notificationService.error('Please enter valid tax', 'Tax');
                return
            }
            this.notificationService.error('Required Fields are missing', 'Tax Service');
        }
    }

    deleteServiceTax(taxId: any) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are you soure?')) return;
            this.requestsService.deleteRequest(
                AppConstants.SERVICE_TAX_DELETE_URL + taxId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SER_TAX_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Tax');
                            this.getAllTaxesForDataTable();
                        } else {
                            this.getAllTaxesForDataTable();
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

            if (new Date(this.serviceTax.fromDate) > new Date(this.serviceTax.toDate)) {
                this.notificationService.warn('FROM DATE must be less than or equal to TO DATE.');
                document.getElementById('fromDate').focus();
                return;
            }

            if (this.serviceTax.rate < 0 || this.serviceTax.rate > 100) {
                this.notificationService.error('Please enter valid tax', 'Tax');
                return
            }
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(
                    AppConstants.SERVICE_TAX_UPDATE_URL, this.serviceTax
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SER_TAX_SUC_06') {
                            this.serviceTax = new TaxService();
                            this.notificationService.success(response['responseMessage'], 'Tax');
                            document.getElementById('close-btn').click();
                            this.getAllTaxesForDataTable();
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
            if (this.serviceTax.name === '') {
                this.notificationService.warn('Please enter Name.');
                document.getElementById('name').focus();
                return;
            }
            if (this.serviceTax.fromDate === '') {
                this.notificationService.warn('Please enter from date.');
                document.getElementById('fromDate').focus();
                return;
            }
            if (this.serviceTax.toDate === '') {
                this.notificationService.warn('Please enter to date.');
                document.getElementById('toDate').focus();
                return;
            }


            if (this.serviceTax.rate < 0 || this.serviceTax.rate > 100) {
                this.notificationService.error('Please enter valid tax', 'Tax');
                return
            }
            this.notificationService.error('Required Fields are missing', 'Tax');
        }
    }


    refreshTaxesTable() {
        this.isSearchedTax = false;
        this.searchTax = '';
        this.getAllTaxesForDataTable();
    }
}
