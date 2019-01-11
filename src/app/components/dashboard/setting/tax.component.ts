import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {TaxService} from '../../../model/service-tax';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {DatePicker} from "angular2-datetimepicker";

@Component({
    selector: 'service-tax-component',
    templateUrl: '../../../templates/dashboard/setting/tax.template.html',

})
export class TaxComponent {
    serviceTax: TaxService = new TaxService();
    dataTaxes: TaxService[] = [];
    isUpdateServiceTax: boolean = false;
    isSearchedTax: boolean = false;
    searchTax: string = '';
    organizationDataList: any;
    dateFormat:string;
    currency:string;
    dateFormatSystem:string;
    isComplete :boolean =false;
    cols: any[] = [
        {field: 'name', header: 'Name'},
        {field: 'rate', header: 'Rate'},
        {field: 'fromDate', header: 'From Date'},
        {field: 'toDate', header: 'To Date'},
        {field: 'description', header: 'Description'},
        {field: 'status', header: 'Status'},
        {field: 'action', header: 'Action'},
    ];
    loading: boolean = false;
    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {


    }

    pickDefaultDateSettings(){
        document.title = 'HIS | Service Tax';
       console.log(this.dateFormatSystem);


        console.log(this.dateFormat);
        DatePicker.prototype.ngOnInit = function()
        {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }

            this.settings.timePicker =false;
            this.settings.format=this.dateFormat;
            this.date = new Date();
        };
    }
    ngOnInit() {
        this.allorganizationData();
        this.pickDefaultDateSettings();
       /* this.requestsService.getRequest(AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(
                ( response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_01') {

                        this.organizationDataList = response['responseData'];
                        console.log(this.organizationDataList);
                        this.dateFormat=this.organizationDataList.dateFormat;
                        this.currency=this.organizationDataList.currency;

                        if(this.dateFormat != null){

                            console.log('formm:'+ this.dateFormat);
                            DatePicker.prototype.ngOnInit = function()
                            {   console.log("bef1")
                                this.settings = Object.assign(this.defaultSettings, this.settings);
                                if (this.settings.defaultOpen) {
                                    this.popover = true;
                                }
                                console.log("bef"+ this.settings.format)
                                this.settings.timePicker =false;
                                this.settings.format=this.dateFormat;
                                console.log("after"+ this.settings.format)
                                this.date = new Date();
                            };
                        }


                        this.getAllTaxesForDataTable();
                    }

                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
*/
    }

    getAllTaxesForDataTable() {
        this.loading = true;
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_TAX_DATA_TABLE_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SER_TAX_SUC_01') {
                        this.dataTaxes = response['responseData'];
                        this.dateFormatSystem=response['responseStatus'];
                    }
                    this.loading = false;
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                    this.loading = false;
                }
            );
    }


    onTaxPopupLoadNew() {

        this.isUpdateServiceTax = false;
        this.serviceTax = new TaxService();

      /*  DatePicker.prototype.ngOnInit = function()
        {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }

            this.settings.timePicker =false;
            console.log("after"+ this.settings.format)
            this.settings.format=this.dateFormat;
            console.log("exis"+ this.settings.format);
            this.date = new Date();

        };*/

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
            this.serviceTax.fromDate=new Date(this.serviceTax.fromDate);
            this.serviceTax.toDate=new Date(this.serviceTax.toDate);
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
            if (this.serviceTax.fromDate === null) {
                this.notificationService.warn('Please enter from date.');
                document.getElementById('fromDate').focus();
                return;
            }
            if (this.serviceTax.toDate === null) {
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
        debugger;
        let dateString = serviceTax.fromDate;
        let date1String =serviceTax.toDate;
        let newDate = new Date(dateString);
        let newDate1 = new Date(date1String);
        serviceTax.fromDate=newDate;
        serviceTax.toDate=newDate1;
        console.log(this.serviceTax);
        this.serviceTax = serviceTax;
    }

    updateServiceTax(updateServiceTaxForm: NgForm) {
        if (updateServiceTaxForm.valid) {

            if (new Date(this.serviceTax.fromDate) > new Date(this.serviceTax.toDate)) {
                debugger;
                this.notificationService.warn('FROM DATE must be less than or equal to TO DATE.');
                document.getElementById('fromDate').focus();
                return;
            }

            if (this.serviceTax.rate < 0 || this.serviceTax.rate > 100) {
                this.notificationService.error('Please enter valid tax', 'Tax');
                return
            }
            this.serviceTax.fromDate=new Date(this.serviceTax.fromDate);
            this.serviceTax.toDate=new Date(this.serviceTax.toDate);
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
           /* if (this.serviceTax.fromDate === '') {
                this.notificationService.warn('Please enter from date.');
                document.getElementById('fromDate').focus();
                return;
            }
            if (this.serviceTax.toDate === '') {
                this.notificationService.warn('Please enter to date.');
                document.getElementById('toDate').focus();
                return;
            }*/


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

      allorganizationData() {

        this.requestsService.getRequest(AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(
                ( response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_01') {

                        this.organizationDataList = response['responseData'];
                        console.log(this.organizationDataList);
                        this.dateFormat=this.organizationDataList.dateFormat;
                        this.currency=this.organizationDataList.currency;

                      /* if(this.dateFormat != null){ console.log('formm:'+ this.dateFormat);
                           DatePicker.prototype.ngOnInit = function()
                           {   console.log("bef1")
                               this.settings = Object.assign(this.defaultSettings, this.settings);
                               if (this.settings.defaultOpen) {
                                   this.popover = true;
                               }
                               console.log("bef"+ this.settings.format)
                               this.settings.timePicker =false;
                               this.settings.format=this.dateFormat;
                               console.log("after"+ this.settings.format)
                               this.date = new Date();
                           };
                       }*/


                        this.getAllTaxesForDataTable();
                    }

                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
    }

    /*combinedRequestServices() :Observable<any>{

        let service1 = this.requestsService.getRequest(AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(
                ( response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_01') {

                        this.organizationDataList = response['responseData'];
                        console.log(this.organizationDataList);
                        this.dateFormat=this.organizationDataList.dateFormat;
                        this.currency=this.organizationDataList.currency;

                        //this.pickDefaultDateSettings();
                        //  this.getAllTaxesForDataTable();
                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                });
        let service2 = this.pickDefaultDateSettings();
//        let service3 = this.getAllTaxesForDataTable();
        return Observable.forkJoin([service1,service2]);
    }*/


}
