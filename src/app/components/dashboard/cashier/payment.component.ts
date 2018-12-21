import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../../services/requests.service';
import {AppConstants} from '../../../utils/app.constants';
import {ActivatedRoute, Router} from '@angular/router';
import {PaymentRequest} from "../../../model/PaymentRequest";
import {NotificationService} from "../../../services/notification.service";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'payment-component',
  templateUrl: '../../../templates/dashboard/cashier/payment-dashboard.template.html',
})
export class PaymentComponent implements OnInit {

    id: number ;
    invoiceId : string;
    appointmentId : number;
    appointment : any;
    invoicePrefix : string;
    patientName : string;
    scheduleDateAndTime : any;
    appointmentStartedOn: any;
    docFirstName: any;
    docLastName: any;
    invoiceList : any = [];
    error: string;
    show:boolean = false;

    useAdvancedBal:boolean = false;

    receivedAmount : number;
    refundAmount : number = 0.00;
    paidAmount : number = 0.00;
    patientAdvanceDeposit : number = 0.00;
    usedAdvanceDeposit : number = 0.00;
    discountAmount: number = 0.00;
    paymentRequest : PaymentRequest= new PaymentRequest();
    selectedPaymentType: any ;

    grandTotal : number = 0.00;
    grandTotalDiscount  : number= 0.00;
    grandTotalTax : number= 0.00;
    grandTotalWithTax : number= 0.00;

    paymentTypeList: any[];
    isPaymentOK = false;

    constructor(private router: Router,private route: ActivatedRoute, private requestsService: RequestsService , private notificationService: NotificationService) {

    }

    ngOnInit(): void {
      
        this.route.params.subscribe(params => {
            this.invoiceId = params['id'];
            this.id = params['id'];
            console.log("ngOnInit --> invoice Id :"+this.invoiceId);
        });
        this.getAppointmentDataById();
        this.getAllPaymentTypes();
    }

    public getAppointmentDataById() 
    {
        if (this.invoiceId) {
            this.requestsService.getRequest(AppConstants.FETCH_APPOINTMENTS_BY_INOVICE_ID + this.invoiceId)
            .subscribe((res :any) =>{
                this.appointment = res.responseData;
                this.patientAdvanceDeposit = res.responseData.patientAdvanceDeposit;
                this.invoicePrefix = res.responseData.invoicePrefix;
                this.patientName = res.responseData.patient;
                this.scheduleDateAndTime = this.appointment.scheduleDateAndTime;
                this.appointmentStartedOn= this.appointment.appointmentStartedOn;
                this.docFirstName= this.appointment.docFirstName;
                this.docLastName= this.appointment.docLastName;
                this.appointmentId = res.responseData.id;
                this.receivedAmount = res.responseData.receivedAmount;
                this.refundAmount = res.responseData.refundAmount;
                console.log("Appointment ID : " + this.appointmentId );

                this.getInvoiceItemsById();
            },
                (error: any) => {
                    this.error = error;
                })
        }
    }

    public getInvoiceItemsById() 
    {
        if (this.appointmentId) 
        {
            this.requestsService.getRequest(AppConstants.GET_INVOICE_ITEMS + this.appointmentId)
            .subscribe((res :any) =>{
                this.invoiceList = res.responseData ;
                console.log("get Invoice Items By Id Data : " + this.invoiceList );

                this.getTotalOfAllInviceItems();
                 },
                (error: any) => {
                    this.error = error;
                })
        }
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
                        if(this.paymentTypeList.length>0){
                            this.paymentRequest.paymentTypeId=this.paymentTypeList[0].id;
                        }
                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "Payment Types List is not available");
                });
    }

    getSelectedPaymentType(selectedPaymentTyp: any){
        console.log("------------"+selectedPaymentTyp);
        this.paymentRequest.paymentTypeId=selectedPaymentTyp.id;
    }

    getTotalOfAllInviceItems(){
        var itemAmt = 0.00;
        var taxAmt = 0.00;
        var discAmount = 0.00;
        var amtAfterDisc=0.00;

        var i = 0, len = this.invoiceList.length;
        for(;i<len; i++){
            itemAmt = this.invoiceList[i].quantity * this.invoiceList[i].unitFee ;
            this.grandTotal += itemAmt ;

            discAmount = (this.invoiceList[i].quantity * this.invoiceList[i].unitFee) * this.invoiceList[i].discountRate/100  ;
            this.grandTotalDiscount += discAmount;

            amtAfterDisc = itemAmt-discAmount;

            taxAmt = amtAfterDisc * this.invoiceList[i].taxRate/100  ;
            this.grandTotalTax += taxAmt;
            this.grandTotalWithTax += (amtAfterDisc+ taxAmt);
        }
        console.log("----grandTotal : " + this.grandTotal);
    }

    savePayment(){
        // this.paymentRequest = new PaymentRequest();
        this.paymentRequest.id = this.id ;
        this.paymentRequest.invoiceId = "0" ;
        this.paymentRequest.paidAmount = this.paidAmount ;
        this.paymentRequest.invoiceAmount = this.grandTotalWithTax ;
    //    this.paymentRequest.paymentTypeId = this.id ;
        this.paymentRequest.paidAmount = this.paidAmount ;
        this.paymentRequest.useAdvancedBal = this.useAdvancedBal;
        this.paymentRequest.usedAdvanceDeposit = this.usedAdvanceDeposit;
        this.paymentRequest.discountAmount = this.discountAmount;
        this.paymentRequest.patientAdvanceDeposit = this.patientAdvanceDeposit;
        console.log("save invoice data : " + this.paymentRequest);

    //    alert("Use advance deposit : " + this.useAdvancedBal + "Patient Bal :" + this.patientAdvanceDeposit);
        var paymentAmount = this.paidAmount + this.usedAdvanceDeposit + this.discountAmount;
        var pendingAmount = this.grandTotalWithTax - this.receivedAmount ;

        if(paymentAmount > pendingAmount){
            this.notificationService.error("ERROR", "Invalid Amount Entered");
        }else{
            this.requestsService.postRequest(AppConstants.SAVE_PAYMENT, this.paymentRequest)
                .subscribe(
                    (response: Response) => {
                        console.log(" Added : " + response);
                        if (response['responseCode'] === 'SUCCESS') {
                            this.router.navigate(['/dashboard/cashier']);
                            /*  this.notificationService.success('Branch is Created Successfully'); */
                        }
                    }, function (error) {
                        //    this.error('ERROR', 'Branch is not Created');
                    });
        }
    }

    backPage(){
        this.router.navigate(['/dashboard/cashier']);
    }

    checkPaidAmount(value: any){
        if (!isNullOrUndefined(value)) {
            if(this.useAdvancedBal){
                if ((this.paidAmount - this.discountAmount + this.usedAdvanceDeposit) > (this.grandTotalWithTax - this.receivedAmount - this.refundAmount)) {
                    this.notificationService.warn('Payment amount is exceeding the total due amount');
                    this.isPaymentOK = false;
                    // document.getElementById("usedAdvanceDeposit").focus();
                } else {
                    this.isPaymentOK = true;
                }
            } else {
                if ((this.paidAmount - this.discountAmount)> (this.grandTotalWithTax - this.receivedAmount - this.refundAmount)) {
                    this.notificationService.warn('Payment amount is exceeding the total due amount');
                    this.isPaymentOK = false;
                    // document.getElementById("usedAdvanceDeposit").focus();
                } else {
                    this.isPaymentOK = true;
                }
            }

        }
    }

    checkDiscount(value: any){
        if (!isNullOrUndefined(value)) {
            if(this.useAdvancedBal){
                if ((this.paidAmount - this.discountAmount + this.usedAdvanceDeposit) > (this.grandTotalWithTax - this.receivedAmount - this.refundAmount)) {
                    this.notificationService.warn('Payment amount is exceeding the total due amount');
                    this.isPaymentOK = false;
                    // document.getElementById("usedAdvanceDeposit").focus();
                } else {
                    this.isPaymentOK = true;
                }
            } else {
                if ((this.paidAmount - this.discountAmount)> (this.grandTotalWithTax - this.receivedAmount - this.refundAmount)) {
                    this.notificationService.warn('Payment amount is exceeding the total due amount');
                    this.isPaymentOK = false;
                    // document.getElementById("usedAdvanceDeposit").focus();
                } else {
                    this.isPaymentOK = true;
                }
            }

        }
    }

    useAdvanceBalance(value: any){
        if (isNullOrUndefined(this.patientAdvanceDeposit) || this.patientAdvanceDeposit == 0) {
            if (!isNullOrUndefined(value) && value != 0) {
                this.notificationService.warn('This person has no advance amount');
                this.useAdvancedBal = false;
            }
            // document.getElementById("amount").focus();
        } else {
            if ((this.paidAmount - this.discountAmount + this.usedAdvanceDeposit) > (this.grandTotalWithTax - this.receivedAmount - this.refundAmount)) {
                this.notificationService.warn('Payment amount is exceeding the total due amount');
                // document.getElementById("usedAdvanceDeposit").focus();
                this.isPaymentOK = false;
            } else {
                this.isPaymentOK = true;
            }
        }
    }

    checkExistingAdvanceBal(){
        if (isNullOrUndefined(this.patientAdvanceDeposit) || this.patientAdvanceDeposit == 0) {
                this.notificationService.warn('This person has no advance amount');
                this.useAdvancedBal = false;
        } else {
            this.useAdvancedBal = true;
        }
    }

    /*checkAmountEntered(value: any) {
        if (isNullOrUndefined(this.selectedDoctorBalance)) {
            if (!isNullOrUndefined(value) && value == 0) {
                this.notificationService.warn('This Doctor has no balance amount');
            }
            // document.getElementById("amount").focus();
        } else if (value > this.selectedDoctorBalance) {
            this.notificationService.warn('Refund amount cannot be greater than Balance amount');
            document.getElementById("amount").focus();
        } else if (value < 0) {
            this.notificationService.warn('Refund amount cannot be negative');
            document.getElementById("amount").focus();
        }
    }*/

}
