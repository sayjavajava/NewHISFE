import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../../services/requests.service';
import {AppConstants} from '../../../utils/app.constants';
import {ActivatedRoute, Router} from '@angular/router';
import {PaymentRequest} from "../../../model/PaymentRequest";
import {NotificationService} from "../../../services/notification.service";
import {isNullOrUndefined} from "util";
import {PaymentInvoiceMode} from "../../../model/PaymentInvoiceMode";


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
    useReceieveBal:boolean=false;
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
    imgBarcode:object;
    img:any[];
    invoiceNo:string;
    completed : boolean = true;
    showDiv:boolean=false;
    paymentList : any = [];
    selectedRecored : PaymentInvoiceMode=new PaymentInvoiceMode;
    totalPaidAmount:any=[];
    total:number;
    addExcedingRecord:boolean;
    receiveDue:number;
    usedReceiveDeposit : number = 0.00;

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
                debugger;
                console.log(this.appointment);
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
                this.imgBarcode=this.appointment.imgBarcode;
                this.img=this.appointment.img;
                this.receiveDue   =res.responseData.receive_Patient;
                console.log(this.receiveDue);
                var link = document.getElementById("ItemPreview");
                link.setAttribute("src","data:image/png;base64," + this.img);
                var myString = this.invoicePrefix;
            //    this.invoiceNo=myString;
                this.invoiceNo = myString.substr(3);
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
        this.paymentRequest.id = this.id ;
        this.paymentRequest.invoiceId = "0" ;
    //    this.paymentRequest.paidAmount = this.totalPaidAmount;
        this.paymentRequest.invoiceAmount = this.grandTotalWithTax ;

        this.paymentRequest.useAdvancedBal = this.useAdvancedBal;
        this.paymentRequest.usedAdvanceDeposit = this.usedAdvanceDeposit;
        this.paymentRequest.discountAmount = this.discountAmount;
        this.paymentRequest.patientAdvanceDeposit = this.patientAdvanceDeposit;
        this.paymentRequest.patientInvoiceModeWrapperList=this.paymentList;
        this.paymentRequest.usedReceiveDeposit=this.usedReceiveDeposit;
        console.log("save invoice data : " + this.paymentRequest);
        debugger;
        console.log(this.paymentList);

        if(this.paymentList.length>0){
            for (var _i = 0; _i < this.paymentList.length; _i++) {
                debugger;
                this.paymentRequest.patientInvoiceModeWrapperList[_i].paymentAmount=parseInt(this.paymentList[_i].paymentAmount);
               // console.log(total);
                this.total=this.totalCountsList(this.totalPaidAmount);
            }
        }

    //    alert("Use advance deposit : " + this.useAdvancedBal + "Patient Bal :" + this.patientAdvanceDeposit);
        var paymentAmount = this.paidAmount + this.usedAdvanceDeposit + this.discountAmount;
        debugger;
        var pendingAmount = this.grandTotalWithTax ;
        this.paymentRequest.paidAmount = this.total ;
        if(this.total > pendingAmount){
            this.notificationService.error("ERROR", "Invalid Amount Entered");
        }else{
            this.requestsService.postRequest(AppConstants.SAVE_PAYMENT, this.paymentRequest)
                .subscribe(
                    (response: Response) => {
                        console.log(" Added : " + response);
                        if (response['responseCode'] === 'SUCCESS') {
                            this.router.navigate(['/dashboard/cashier']);

                        }
                    }, function (error) {
                        //    this.error('ERROR', 'Branch is not Created');
                    });
        }
    }

    backPage(){
        this.router.navigate(['/dashboard/cashier']);
    }

    checkPaidAmountCashier(value: any){
        if (!isNullOrUndefined(value)) {
            debugger;
            if(this.useAdvancedBal){

                if ((this.paidAmount - this.discountAmount + this.usedAdvanceDeposit) > (this.grandTotalWithTax)) {
                    this.notificationService.warn('Payment amount is exceeding the total due amount');
                    this.isPaymentOK = false;
                    this.showDiv=true;
                } else {
                    this.isPaymentOK = true;
                    this. completed  = false;
                }
            } else {

                if ((this.paidAmount - this.discountAmount) > (this.grandTotalWithTax)) {
                    this.notificationService.warn('Payment amount is exceeding the total due amount');
                    this.isPaymentOK = false;
                    this.showDiv=true;
                } else {
                    this.isPaymentOK = true;
                    this. completed  = false;
                }

            }

        }
    }

    checkDiscount(value: any){
        if (!isNullOrUndefined(value)) {
            if(this.useAdvancedBal){
                if ((this.paidAmount - this.discountAmount + this.usedAdvanceDeposit) > (this.grandTotalWithTax  - this.refundAmount)) {
                    this.notificationService.warn('Payment amount is exceeding the total due amount');
                    this.isPaymentOK = false;
                } else {
                    this.isPaymentOK = true;
                }
            } else {
                if ((this.paidAmount - this.discountAmount)> (this.grandTotalWithTax  - this.refundAmount)) {
                    this.notificationService.warn('Payment amount is exceeding the total due amount');
                    this.isPaymentOK = false;
                } else {
                    this.isPaymentOK = true;
                }
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



    checkExistingReceiveBal(){
        if (isNullOrUndefined(this.receiveDue) || this.receiveDue == 0) {
            this.notificationService.warn('This person has no receive Due amount');
            this.useReceieveBal = false;
        } else {
            this.useReceieveBal = true;
        }
    }



    useAdvanceBalance(value: any){
        if (isNullOrUndefined(this.patientAdvanceDeposit) || this.patientAdvanceDeposit == 0) {
            if (!isNullOrUndefined(value) && value != 0) {
                this.notificationService.warn('This person has no advance amount');
                this.useAdvancedBal = false;
            }
        } else {
            if ((this.total - this.discountAmount + this.usedAdvanceDeposit) > (this.grandTotalWithTax - this.refundAmount)) {
                this.notificationService.warn('Payment amount is exceeding the total due amount');
                this.isPaymentOK = false;
            } else {
                this.isPaymentOK = true;
            }
        }
    }

    useReceiveBalance(value: any){
        if (isNullOrUndefined(this.receiveDue) || this.receiveDue == 0) {
            if (!isNullOrUndefined(value) && value != 0) {
                this.notificationService.warn('This person has no Receive Due amount');
                this.useReceieveBal = false;
            }
        } else if(this.usedReceiveDeposit>this.receiveDue){
             this.notificationService.warn('Please provide receive amount less than total receive due amount');
              this.isPaymentOK = false;
        }else {
            debugger;
            if ((this.total - this.discountAmount + this.usedReceiveDeposit) > (this.grandTotalWithTax - this.refundAmount)) {
                this.notificationService.warn('Payment amount is exceeding the total due amount');
                this.isPaymentOK = false;
            } else {
                this.isPaymentOK = true;
            }
        }
    }



    addtoGrid(event : any) {

        this.showDiv=true;
        this.addExcedingRecord=false;
        debugger;
        let paymentModel= this.paymentTypeList.filter((listing: any) => listing.id === this.paymentRequest.paymentTypeId);
        debugger;
        console.log(paymentModel);
        if(paymentModel.length>0){

            if(this.totalPaidAmount.length>0){

                  this.total=this.totalCounts(this.totalPaidAmount,this.paidAmount);
                if((this.total-this.discountAmount+this.usedAdvanceDeposit) > (this.grandTotalWithTax-this.refundAmount))
                {
                    this.notificationService.warn('Payment amount is exceeding the total due amount');
                    this.isPaymentOK = false;
                    this.addExcedingRecord=true;
                }else {
                    this.isPaymentOK = true;
                }
            }
            if(this.addExcedingRecord!=true){
            this.selectedRecored=new PaymentInvoiceMode();
            console.log(this.paymentRequest);
            this.selectedRecored.paymentMode=paymentModel[0].paymentMode;
            this.selectedRecored.paymentAmount=this.paidAmount;
            debugger;
            this.selectedRecored.paymentId=this.paymentRequest.paymentTypeId;
            this.totalPaidAmount.push(this.selectedRecored.paymentAmount);

            }
        }
        console.log(this.selectedRecored);
        this.paymentList.push(this.selectedRecored);

    }

    removeRecordfromGrid(value : any)
    {


        let arr = this.paymentList.filter((listing: any) => listing.id === value);
        if(arr.length >= 0)
        {
            this.paymentList.splice(arr,1);
        }

    }

    totalCounts(data:any,amount:number) {
        let total = 0;


        for (var _i = 0; _i < data.length; _i++) {
            total += parseInt(data[_i]);
            console.log(total);
        }
        if(amount ==null  || amount ==0){
            total=total+amount;
        }else{
            total=total+amount;
        }

      /*  data.forEach((d) => {
            total += parseInt(d);
        });*/

        return total;
    }





    totalCountsList(data:any) {
        let total = 0;


        for (var _i = 0; _i < data.length; _i++) {
            total += parseInt(data[_i]);
            console.log(total);
        }


        /*  data.forEach((d) => {
              total += parseInt(d);
          });*/

        return total;
    }


    completedPayment(){


        this.paymentRequest.id = this.id ;
        this.paymentRequest.invoiceId = "0" ;
        this.paymentRequest.invoiceAmount = this.grandTotalWithTax ;
        this.paymentRequest.useAdvancedBal = this.useAdvancedBal;
        this.paymentRequest.usedAdvanceDeposit = this.usedAdvanceDeposit;
        this.paymentRequest.discountAmount = this.discountAmount;
        this.paymentRequest.patientAdvanceDeposit = this.patientAdvanceDeposit;
        this.paymentRequest.patientInvoiceModeWrapperList=this.paymentList;
        this.paymentRequest.usedReceiveDeposit=this.usedReceiveDeposit;
        this.paymentRequest.completed=true;
        console.log("save invoice data : " + this.paymentRequest.completed);
        debugger;

        if(this.paymentList.length>0){
            for (var _i = 0; _i < this.paymentList.length; _i++) {
                debugger;
                this.paymentRequest.patientInvoiceModeWrapperList[_i].paymentAmount=parseInt(this.paymentList[_i].paymentAmount);
                // console.log(total);
                this.total=this.totalCountsList(this.totalPaidAmount);
            }
        }

        //    alert("Use advance deposit : " + this.useAdvancedBal + "Patient Bal :" + this.patientAdvanceDeposit);
        var paymentAmount = this.paidAmount + this.usedAdvanceDeposit + this.discountAmount;
        debugger;
        var pendingAmount = this.grandTotalWithTax ;
        this.paymentRequest.paidAmount = this.total ;
        if(this.total > pendingAmount){
            this.notificationService.error("ERROR", "Invalid Amount Entered");
        }else{
            this.requestsService.postRequest(AppConstants.SAVE_PAYMENT, this.paymentRequest)
                .subscribe(
                    (response: Response) => {
                        console.log(" Added : " + response);
                        if (response['responseCode'] === 'SUCCESS') {
                            this.router.navigate(['/dashboard/cashier']);

                        }
                    }, function (error) {
                        //    this.error('ERROR', 'Branch is not Created');
                    });
        }
    }




}
