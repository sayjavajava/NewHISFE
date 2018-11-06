import {Component, OnInit, ViewChild} from "@angular/core";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";
import {AppConstants} from "../../../utils/app.constants";
import {FormGroup, NgForm} from '@angular/forms';
import { PaymentType } from '../../../model/PaymentType';
import {HISUtilService} from "../../../services/his-util.service";
import {LazyLoadEvent} from 'primeng/api';
import {FilterMetadata} from 'primeng/api';
import {Table} from "primeng/table";
import {GeneralLedgerModel} from "../../../model/GeneralLedgerModel";
import any = jasmine.any;



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
    accountList:GeneralLedgerModel= new GeneralLedgerModel();

    allTypePAYMENT = [
        {name: 'Cash'},
        {name: 'Card'},
        {name: 'Others'}
    ];

    loading: boolean;

    constructor(private service:RequestsService,private notificationService: NotificationService, private router: Router,private HISUtilService: HISUtilService){}

    ngOnInit(): void {

        this.cols = [
            { field: 'paymentTitle', header: 'Payment Title' },
            { field: 'paymentGlAccount', header: 'GL Account' },
            { field: 'serviceCharges', header: 'Charges' },
            { field: 'maxCardCharges', header: 'Max Card Charges' },
            { field: 'active', header: 'Status' },
            { field: 'Action', header: 'Action' }
        ];

        this.getPaymentTypeList();
        this.getAllAccountsList();


    }

    getPaymentTypeList(){

        this.service.getRequest(AppConstants.GET_ALL_PAYMENTTYPE).subscribe(
            (response: Response) => {
                if (response['responseCode'] === 'PAYMENT_SUC_11') {
                    debugger;

                    this.paymentlst= response['responseData'];
                    debugger;

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
                debugger;
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

           debugger;
           let charteredofAccount = this.chartOfAccountList.filter(x=>x.id==id);


    }



    savePaymentType(form: NgForm): void {
        if (window.localStorage.getItem(btoa('access_token'))) {


            var charteredofAccount = this.chartOfAccountList.filter(x=>x.id==this.newPaymentType.paymentGlAccount.id);
            this.newPaymentType.paymentGlAccount=charteredofAccount[0];
            if (form.valid) {
                if(this.newPaymentType.paymentMode==="CASH"){
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




    onAddPopup() {
        this.newPaymentType = new PaymentType();
        this.newPaymentType.paymentMode="Cash";
        debugger;
       this.newPaymentType.paymentGlAccount=this.chartOfAccountList[0];
       this.newPaymentType.bankGlCharges=this.chartOfAccountList[0];

    }

    onUpdatePopupLoad(objPaymentType: PaymentType) {
        debugger;
        console.log(objPaymentType);
        this.newPaymentType = new PaymentType();

        if(objPaymentType.paymentMode==="Card"){
            debugger;
            this.bankGlDiv = true;
            this.maxCardChargesDiv = true;
            this.payCreditDiv = true;
            this.serviceChargesDiv = true;
            this.newPaymentType.paymentMode="Card";

        }else if(objPaymentType.paymentMode==="Cash"){
            debugger;
            this.bankGlDiv = false;
            this.maxCardChargesDiv = false;
            this.payCreditDiv = false;
            this.serviceChargesDiv = false;
            this.newPaymentType.payCredit=true;
            this.newPaymentType.paymentMode="Cash";

        }else if(objPaymentType.paymentMode==="Others"){
            debugger;
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


                console.log(this.paymentlst);
                this.loading = false;
            }
        }, 1000);
    }


    sort(fieldName:string, order:number){
        console.log(fieldName);
        console.log(order)
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
            this.service.getRequest(AppConstants.FETCH_ACCOUNTS_CONFIGURATIONS
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.chartOfAccountList = response['responseData'];
                        this.accountList=response['responseData'];
                        debugger;

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


    updatePaymentType(form: NgForm) {
        if (window.localStorage.getItem(btoa('access_token'))) {

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
