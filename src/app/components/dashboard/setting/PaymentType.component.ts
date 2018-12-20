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
            { field: 'paymentGlAccount', header: 'GL Account' },
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
                    this.paymentlst=[];
                    this.paymentlst= response['responseData']['data'];

                    console.log(this.paymentlst);

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
            //    this.newPaymentType.payCredit=" ";
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
            //    this.newPaymentType.payCredit=true;
            this.newPaymentType.paymentMode="Others";
        }
    }

    getSelectedAccount(id: number) {


        let charteredofAccount = this.chartOfAccountList.filter(x=>x.id==id);


    }



    savePaymentType(form: NgForm): void {
        if (window.localStorage.getItem(btoa('access_token'))) {

            if (this.newPaymentType.paymentTitle =='' || this.newPaymentType.paymentTitle ==  null) {
                this.notificationService.warn('Please Enter Payment Title ');
                return;
            }

            if (this.newPaymentType.paymentGlAccount == null) {
                this.notificationService.warn('Please select Payment GL Account');
                return;
            }

            if (this.newPaymentType.paymentMode.toString().length <= 0) {
                this.notificationService.warn('Please Enter Payment Mode.');
                //   document.getElementById('icdVersionId').focus();
                return;
            }


            var charteredofAccount = this.chartOfAccountList.filter(x=>x.id==this.selectedCharteredAccount);
            this.newPaymentType.paymentGlAccount=charteredofAccount[0];

            if (form.valid) {
                if(this.newPaymentType.paymentMode==="Cash"){

                }if(this.newPaymentType.paymentMode==="Card"){
                    var charteredofSecondAccount = this.chartOfAccountList.filter(x=>x.id==this.selectedSecondCharteredAccount);
                    this.newPaymentType.bankGlCharges=charteredofSecondAccount[0];
                }else{

                    this.newPaymentType.bankGlCharges=new GeneralLedgerModel();
                }


                this.service.postRequest(AppConstants.SAVE_PAYMENTTYPE, this.newPaymentType)
                    .subscribe((response: Response) => {
                            if (response['responseCode'] === 'PAYMENT_SUC_02') {
                                this.notificationService.success(response['responseMessage'], 'Payment Type');

                                this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                                this.getPaymentTypeList();

                            } else {
                                //  this.getPaymentTypeList();
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
        this.newPaymentType.active=true;

        if(this.chartOfAccountList.length>0) {
            this.selectedSecondCharteredAccount = this.chartOfAccountList[0].id;
            this.selectedCharteredAccount = this.chartOfAccountList[0].id;
        }else{

        }
           this.bankGlDiv = false;
           this.maxCardChargesDiv = false;
           this.payCreditDiv = false;
           this.serviceChargesDiv = false;

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
            this.newPaymentType.paymentMode="Cash";


        }else if(objPaymentType.paymentMode==="Others"){


            this.bankGlDiv = false;
            this.maxCardChargesDiv = false;
            this.payCreditDiv = false;
            this.serviceChargesDiv = false;
            this.newPaymentType.paymentMode="Others";


        }


        this.newPaymentType = objPaymentType;
        if(this.selectedCharteredAccount!=null){
            this.selectedCharteredAccount=this.newPaymentType.paymentGlAccount[0];
        }
        if(this.selectedSecondCharteredAccount!=null){
            this.selectedSecondCharteredAccount=this.newPaymentType.bankGlCharges[0];
        }

        this.newPaymentType.isPatient=objPaymentType.patient;
        if(objPaymentType.bankGlCharges != null){


        }


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


    updatePaymentType(form: NgForm) {
        if (window.localStorage.getItem(btoa('access_token'))) {

            if(this.selectedCharteredAccount != undefined){
            var charteredofAccount = this.chartOfAccountList.filter(x=>x.id==this.selectedCharteredAccount);
            this.newPaymentType.paymentGlAccount=charteredofAccount[0];
            }


            if(this.newPaymentType.paymentMode==="Cash"){

                this.newPaymentType.serviceCharges=0;
                this.newPaymentType.maxCardCharges=0
                this.newPaymentType.payCredit='';


            }if(this.newPaymentType.paymentMode==="Card"){
                if(this.selectedSecondCharteredAccount != undefined) {
                    var charteredofSecondAccount = this.chartOfAccountList.filter(x => x.id == this.selectedSecondCharteredAccount);
                }
            }else{

                this.newPaymentType.serviceCharges=0;
                this.newPaymentType.maxCardCharges=0;
                this.newPaymentType.payCredit="";

            }


            if (form.valid) {
                this.service.putRequest(AppConstants.UPDATE_PAYMENTTYPE,this.newPaymentType)
                    .subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'PAYMENT_SUC_03') {
                             //   this.paymentlst=[];
                                this.notificationService.success(response['responseMessage'], 'Payment Type Update');
                                this.HISUtilService.hidePopupWithCloseButtonId('closeButton');



                            } else {
                                //     this.getPaymentTypeList();
                                this.notificationService.error(response['responseMessage'], 'Payment Type Update');
                            }
                        },
                        (error: any) => {

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
