import {Component, OnInit} from "@angular/core";
import {RequestsService} from '../../../services/requests.service';
import {AppConstants} from '../../../utils/app.constants';

import {ActivatedRoute, Router} from '@angular/router';
import {BulkReceitRequest} from "../../../model/BulkReceitRequest";
import {NotificationService} from "../../../services/notification.service";

@Component({
    selector: 'patient-invoice-list',
    templateUrl: '../../../templates/dashboard/patient/patient-invoice-list.template.html',
})
export class PatientInvoiceListComponent implements OnInit {

    error: string;

    selectedPatientId: any ;
    patientList: any[];
    patientInvoiceList: any[];
    paymentTypeList: any[];

    selectedPaymentType: any ;
    bulkReceitRequest: BulkReceitRequest = new BulkReceitRequest();

    invoicesAmountTotal = 0.00;
    paidAmountTotal = 0.00;
    refundAmountTotal = 0.00;
    discountTotalOnPayment = 0.00;
    useAdvanceTotal = 0.00;
    appliedAmountTottal = 0.00;
    dueAmountTotal = 0.00;
    dueAmountOnSelectedInvc = 0.00;
    appliedAmountOnSelectedInvc = 0.00;
    advancedAmountOnSelectedInvc = 0.00;
    discountAmountOnSelectedInvc = 0.00;
    dueAmountOnAllInvc = 0.00;
    cusAdvanceBalance = 0.00;
    isDataInvalid : boolean = false;

    constructor(private router: Router,private route: ActivatedRoute, private notificationService: NotificationService,private requestsService: RequestsService) {

        this.route.params.subscribe(params => {
           /* this.appointmentId = params['id'];
            console.log("ngOnInit --> Appointment Id :"+this.appointmentId);*/
        });
        this.getAllPaymentTypes();
        this.getAllPatient();
        this.getPaymentId();
    }
    ngOnInit(): void {

    }
    goToUserDashBoard(){
        this.router.navigate(['/dashboard/'+atob(localStorage.getItem(btoa('user_type')))+'/']);
    }

    getPaymentId(){
        this.requestsService.getRequest(AppConstants.GET_PAYMENT_ID )
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.bulkReceitRequest.paymentId = response['responseData'];
                    }
                }
            );
    }


    getAllPaymentTypes()
    {
        this.requestsService.getRequest(AppConstants.GET_ALL_PAYMENT_TYPE )
            .subscribe(
                (response: Response)=>{
                    if (response["responseCode"] === "PAYMENT_SUC_11")
                    {
                        this.paymentTypeList = response["responseData"].data;
                        console.log("------------"+this.paymentTypeList);
                    }
                }, function (error) {
            //        this.notificationService.error("ERROR", "States List is not available");
                });
    }

    getAllPatient()
    {
        this.requestsService.getRequest(AppConstants.FETCH_ALL_PATIENT_URL )
            .subscribe(
                (response: Response)=>{
                    if (response["responseCode"] === "PATIENT_SUC_11")
                    {
                        this.patientList = response["responseData"].data;
                    }
                }, function (error) {
        //            this.notificationService.error("ERROR", "States List is not available");
                });
    }

    getSelectedPaymentType(selectedPaymentTyp: any){
        console.log("------------"+selectedPaymentTyp);
        this.bulkReceitRequest.paymentTypeId=selectedPaymentTyp.id;
    }

    getPatientIvoices(selectedCustomer : any)
    {
        console.log("selected customer : " + selectedCustomer);
        this.bulkReceitRequest.patientId=selectedCustomer;

        this.requestsService.getRequest(AppConstants.GET_INVOICE_List_BY_PAT_ID + selectedCustomer )
            .subscribe(
                (response: Response)=>{
                    if (response["responseCode"] === "SUCCESS")
                    {
                        this.patientInvoiceList = response["responseData"].data;
                        this.cusAdvanceBalance = response["responseData"].cuAdvanceBalance;
                        this.getTotalOfAllInvice();
                    }
                }, function (error) {
             //       this.notificationService.error("ERROR", "Patient Invoices List is not available");
                });
    }

    savePayment(){

        this.bulkReceitRequest.useAdvanceTotal = this.useAdvanceTotal;

        if(this.isDataInvalid || this.useAdvanceTotal > this.cusAdvanceBalance){
            this.notificationService.error("ERROR", "Invalid Amount Enter");
        }else{
            console.log("save payment data : " + this.patientInvoiceList);
            this.bulkReceitRequest.invoiceListPaymentRequest = this.patientInvoiceList;
            this.requestsService.postRequest(AppConstants.SAVE_BULK_RECEIT, this.bulkReceitRequest)
                .subscribe(
                    (response: Response) => {
                        console.log(" Added : " + response);
                        if (response['responseCode'] === 'SUCCESS') {
                            this.router.navigate(['/dashboard/receipt-listing']);
                            /*  this.notificationService.success('Branch is Created Successfully');
                             this.router.navigate(['/dashboard/setting/branch']) */
                        }
                    }, function (error) {
                        //    this.error('ERROR', 'Branch is not Created');
                    });
        }
    }

    backPage(){
        this.router.navigate(['/dashboard/receipt-listing']);
    }


    getTotalOfAllInvice(){
        console.log(this.patientInvoiceList);
        this.resetValue();

        var invoiceAmt = 0.00;
        var paidAmt = 0.00;
        var refundedAmt = 0.00;  // refundAmountTotal
        var discountAmount = 0.00;
        var advance = 0.00;
        var appliedAmt = 0.00;
        var dueAmount = 0.00;

        var i = 0, len = this.patientInvoiceList.length;
        for(;i<len; i++)
        {
            invoiceAmt = this.patientInvoiceList[i].totalInvoiceAmount;
            this.invoicesAmountTotal += invoiceAmt ;

            paidAmt = this.patientInvoiceList[i].paidAmount;
            this.paidAmountTotal += paidAmt ;

            refundedAmt = this.patientInvoiceList[i].refundAmount;
            this.refundAmountTotal += refundedAmt ;

            dueAmount = this.patientInvoiceList[i].dueAmount - discountAmount - appliedAmt;
            this.dueAmountTotal += dueAmount ;

            this.dueAmountOnAllInvc += invoiceAmt - paidAmt;

            if(this.patientInvoiceList[i].selected)
            {
                discountAmount = this.patientInvoiceList[i].discountOnPayment;
                this.discountTotalOnPayment += discountAmount ;

                advance = this.patientInvoiceList[i].advanceBalance;
                this.useAdvanceTotal += advance ;

                appliedAmt = this.patientInvoiceList[i].appliedAmount;
                this.appliedAmountTottal += appliedAmt ;

                this.dueAmountOnSelectedInvc += invoiceAmt - paidAmt - discountAmount - appliedAmt;
                this.appliedAmountOnSelectedInvc += appliedAmt;

                this.advancedAmountOnSelectedInvc += advance;
                this.discountAmountOnSelectedInvc += discountAmount;

                this.bulkReceitRequest.paymentAmount = this.appliedAmountOnSelectedInvc + this.advancedAmountOnSelectedInvc;

                if((advance + appliedAmt - discountAmount) > this.patientInvoiceList[i].dueAmount){
                    this.notificationService.error("ERROR", "Invalid Amount Enter");
                    this.isDataInvalid = true;
                }

            }
        }
    }

    resetValue(){
        this.invoicesAmountTotal = 0.00;
        this.paidAmountTotal = 0.00;
        this.refundAmountTotal = 0.00;
        this.discountTotalOnPayment = 0.00;
        this.useAdvanceTotal = 0.00;
        this.appliedAmountTottal = 0.00;
        this.dueAmountTotal = 0.00;

        this.dueAmountOnSelectedInvc = 0.00;
        this.appliedAmountOnSelectedInvc = 0.00;
        this.dueAmountOnAllInvc = 0.00;

        this.advancedAmountOnSelectedInvc = 0.00;
        this.discountAmountOnSelectedInvc = 0.00;

        this.bulkReceitRequest.paymentAmount = 0.00;
        this.isDataInvalid = false;
    }

    getSelectedIndex(ind : any){
    //    alert("Selected Index : " + ind);
        if( (this.patientInvoiceList[ind].selected) && (this.bulkReceitRequest.useAdvance) ){
            this.patientInvoiceList[ind].useAdvancedBal = true;
        }else{
            this.patientInvoiceList[ind].useAdvancedBal = false;
        }
        this.getTotalOfAllInvice();
    }

    cancel(){
    }



}