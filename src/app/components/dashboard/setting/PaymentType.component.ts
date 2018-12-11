import {Component, OnInit, ViewChild} from "@angular/core";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";
import {AppConstants} from "../../../utils/app.constants";
import {FormGroup, NgForm} from '@angular/forms';
import { PaymentType } from '../../../model/PaymentType';
import {HISUtilService} from "../../../services/his-util.service";
import {LazyLoadEvent, SelectItem} from 'primeng/api';
import {FilterMetadata} from 'primeng/api';
import {Table} from "primeng/table";
import {GeneralLedgerModel} from "../../../model/GeneralLedgerModel";
import any = jasmine.any;
import {isEmpty} from "rxjs/operators";



@Component({
    selector: 'paymentType-component',
    templateUrl: '../../../templates/dashboard/setting/payment_type.template.html',
})
export class PaymentTypeComponent implements OnInit {

    paymentlst:PaymentType[];
    newPaymentType: PaymentType = new PaymentType();
    serviceChargesDiv:boolean;
    maxCardChargesDiv:boolean;
    payCreditDiv:boolean;
    bankGlDiv:boolean;
    cols: any[];
    copyListPayment: PaymentType[];
    totalRecords: number;
    chartOfAccountList: GeneralLedgerModel[];
    selectedCharteredAccount: SelectItem[] = [];
    chartofAccountListModified: SelectItem[] = [];
    accountList:GeneralLedgerModel= new GeneralLedgerModel();
    selectedSecondCharteredAccount:any;
    organizationDataList: any;
    currency:string;
 //   intPattern="/^[0-9]*$/";
    allTypePAYMENT = [
        {name: 'Cash'},
        {name: 'Card'},
        {name: 'Others'}
    ];

    loading: boolean;

    constructor(private service:RequestsService,private notificationService: NotificationService, private router: Router,private HISUtilService: HISUtilService){}

    ngOnInit(): void {

        this.getPaymentTypeList();
        this.getAllAccountsList();
        this.allorganizationData();

        this.cols = [
            { field: 'paymentTitle', header: 'Payment Title' },
            { field: 'paymentGlAccountName', header: 'GL Account' },
            { field: 'serviceCharges', header: 'Charges' },
            { field: 'maxCardCharges', header: 'Max Card Charges' },
            { field: 'active', header: 'Status' },
            { field: 'action', header: 'Action' }
        ];


    }

    getPaymentTypeList(){

        this.service.getRequest(AppConstants.GET_ALL_PAYMENTTYPE).subscribe(
            (response: Response) => {
                if (response['responseCode'] === 'PAYMENT_SUC_11') {


                    this.paymentlst= response['responseData'];

                }
            },
            (error: any) => {

                this.HISUtilService.tokenExpired(error.error.error);
            }
        );

    }


    public onPaymentMode(value: any) {

            if(value==="Cash"){

                this.bankGlDiv = false;
                this.maxCardChargesDiv = false;
                this.payCreditDiv = false;
                this.serviceChargesDiv = false;
                this.newPaymentType.payCredit=true;
                this.newPaymentType.paymentMode="Cash";


            }else if(value==="Card"){

                this.bankGlDiv = true;
                this.maxCardChargesDiv = true;
                this.payCreditDiv = true;
                this.serviceChargesDiv = true;
                this.newPaymentType.paymentMode="Card";
                this.newPaymentType.bankGlCharges=this.newPaymentType.paymentGlAccount;
            }else if(value==="Others"){

                this.bankGlDiv = false;
                this.maxCardChargesDiv = false;
                this.payCreditDiv = false;
                this.serviceChargesDiv = false;
                this.newPaymentType.payCredit=true;
                this.newPaymentType.paymentMode="Others";
            }
    }

    getSelectedAccount(id: number) {


           let charteredofAccount = this.chartOfAccountList.filter(x=>x.id==id);


    }



    savePaymentType(form: NgForm): void {
        if (window.localStorage.getItem(btoa('access_token'))) {




            var charteredofAccount = this.chartOfAccountList.filter(x=>x.id==this.selectedCharteredAccount);
            this.newPaymentType.paymentGlAccount=charteredofAccount[0];


            if (form.valid) {
                if(this.newPaymentType.paymentMode==="Cash"){
                    this.newPaymentType.serviceCharges='';
                    this.newPaymentType.maxCardCharges=''
                    this.newPaymentType.payCredit=false;
                    this.newPaymentType.bankGlCharges=null;

                }if(this.newPaymentType.paymentMode==="Card"){
                    var charteredofSecondAccount = this.chartOfAccountList.filter(x=>x.id==this.selectedSecondCharteredAccount);
                    this.newPaymentType.bankGlCharges=charteredofSecondAccount[0];
                }else{

                    this.newPaymentType.serviceCharges='';
                    this.newPaymentType.maxCardCharges=''
                    this.newPaymentType.payCredit=false;
                    this.newPaymentType.bankGlCharges=null;
                }


                this.service.postRequest(AppConstants.SAVE_PAYMENTTYPE, this.newPaymentType)
                    .subscribe((response: Response) => {
                            if (response['responseCode'] === 'PAYMENT_SUC_02') {
                                this.notificationService.success(response['responseMessage'], 'Payment Type');
                                this.getPaymentTypeList();
                                this.HISUtilService.hidePopupWithCloseButtonId('closeButton');

                            } else {
                                this.getPaymentTypeList();
                                this.notificationService.error(response['responseMessage'], 'Payment Type');
                            }
                        },
                        (error: any) => {

                            this.HISUtilService.tokenExpired(error.error.error);
                        })
            } else {
                this.notificationService.error('Required fields missing', 'Payment Type');
            }

        } else {
            this.router.navigate(['/login']);
        }
    };

    /*numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }*/


    onAddPopup() {
        this.newPaymentType = new PaymentType();
        this.newPaymentType.paymentMode="Cash";


        this.newPaymentType.active=true;
        this.selectedSecondCharteredAccount=this.chartOfAccountList[0].id;
        this.selectedCharteredAccount=this.chartOfAccountList[0].id;

    }

    onUpdatePopupLoad(objPaymentType: PaymentType) {




        this.newPaymentType = new PaymentType();

        if(objPaymentType.paymentMode==="Card"){


            this.bankGlDiv = true;
            this.maxCardChargesDiv = true;
            this.payCreditDiv = true;
            this.serviceChargesDiv = true;
            this.newPaymentType.paymentMode="Card";

        }else if(objPaymentType.paymentMode==="Cash"){


            this.bankGlDiv = false;
            this.maxCardChargesDiv = false;
            this.payCreditDiv = false;
            this.serviceChargesDiv = false;
            this.newPaymentType.payCredit=true;
            this.newPaymentType.paymentMode="Cash";

        }else if(objPaymentType.paymentMode==="Others"){


            this.bankGlDiv = false;
            this.maxCardChargesDiv = false;
            this.payCreditDiv = false;
            this.serviceChargesDiv = false;
            this.newPaymentType.payCredit=true;
            this.newPaymentType.paymentMode="Others";

        }

        this.newPaymentType = objPaymentType;
    }



    deletePaymentType(payId: number) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Sure You Want To Delete')) return;
            this.service.deleteRequest(
                AppConstants.DELETE_PAYMENTTYPE + payId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PAYMENT_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Payment Type Delete');
                            this.getPaymentTypeList();
                            this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                        } else {
                            this.getPaymentTypeList();
                            this.notificationService.error(response['responseMessage'], 'Payment Type Delete');
                        }
                    },
                    (error: any) => {

                        this.notificationService.error(error.error, 'Payment Type  Delete')
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );

        } else {
            this.router.navigate(['/login']);
        }
    }
    columnFilter(event: any) {

    }

    loadLazy(event: LazyLoadEvent) {
        this.loading = true;


        setTimeout(() => {
            if (this.copyListPayment) {

                this.paymentlst = this.copyListPayment.slice(event.first, (event.first + event.rows));




                this.loading = false;
            }
        }, 1000);
    }


    allorganizationData() {

        this.service.getRequest(AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_01') {

                        this.organizationDataList = response['responseData'];


                        this.currency=this.organizationDataList.currency;

                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
    }


    sort(fieldName:string, order:number){

        this.paymentlst.sort((row1,row2)=>{
            const val1=row1[fieldName];
            const val2=row2[fieldName];
            if(val1===val2){
                return 0;
            }
            let result=-1;
            if(val1>val2){
                result=1;
            }
            if(order<0){
                result=-result;
            }
            return result;
        });
    }


    getAllAccountsList() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.service.getRequest(AppConstants.FETCH_ACCOUNTS_PAYMENTTYPE
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.chartOfAccountList = response['responseData'];
                        this.accountList=response['responseData'];
                        for (let charteredAccount of this.chartOfAccountList) {

                            let pair: any = {label:charteredAccount.name, value: charteredAccount.id};
                            this.chartofAccountListModified.push(pair);

                        }
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Chart of Accounts Configurations');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], 'Chart of Accounts Configurations');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }

   /* public isEmpty(myVar): boolean {
        return (myVar && (Object.keys(myVar).length === 0));
    }*/
    updatePaymentType(form: NgForm) {
        if (window.localStorage.getItem(btoa('access_token'))) {

            var charteredofAccount = this.chartOfAccountList.filter(x=>x.id==this.selectedCharteredAccount);
            this.newPaymentType.paymentGlAccount=charteredofAccount[0];


            if(this.newPaymentType.paymentMode==="Cash"){

                this.newPaymentType.serviceCharges='';
                this.newPaymentType.maxCardCharges=''
                this.newPaymentType.payCredit=false;
                // this.newPaymentType.bankGlCharges=null;

            }if(this.newPaymentType.paymentMode==="Card"){
                var charteredofSecondAccount = this.chartOfAccountList.filter(x=>x.id==this.selectedSecondCharteredAccount);
                // this.newPaymentType.bankGlCharges=charteredofSecondAccount[0];
            }else{

                this.newPaymentType.serviceCharges='';
                this.newPaymentType.maxCardCharges=''
                this.newPaymentType.payCredit=false;
                // this.newPaymentType.bankGlCharges=null;
            }

            if (form.valid) {
                this.service.putRequest(
                    AppConstants.UPDATE_PAYMENTTYPE,
                    this.newPaymentType)
                    .subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'PAYMENT_SUC_03') {
                                this.notificationService.success(response['responseMessage'], 'Payment Type Update');
                                this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                                this.getPaymentTypeList();

                            } else {
                                this.getPaymentTypeList();
                                this.notificationService.error(response['responseMessage'], 'Payment Type Update');
                            }
                        },
                        (error: any) => {
                            this.notificationService.error(error.error, 'Payment Type Update')
                            this.HISUtilService.tokenExpired(error.error.error);


                        }
                    );
            } else {
                this.notificationService.error('Required fields missing', 'Payment Type Update');
            }
        }else {
            this.router.navigate(['/login']);
        }}
}
