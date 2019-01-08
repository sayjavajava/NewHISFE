import {Component} from "@angular/core";
import {RequestsService} from "../../../services/requests.service";
import {ActivatedRoute, Router} from "@angular/router";
import {InvoicesList} from "../../../model/InvoicesList";
import {Title} from "@angular/platform-browser";
import {AppConstants} from "../../../utils/app.constants";
import {RefundRequest} from "../../../model/RefundRequest";
import {HISUtilService} from "../../../services/his-util.service";
import {NotificationService} from "../../../services/notification.service";
import {isNullOrUndefined} from "util";

@Component({
    selector: 'refund-listing-template',
    templateUrl: '../../../templates/dashboard/patient/refund-listing.template.html',
})
export class RefundListingComponent {
    invoiceList : InvoicesList[];
    selectedInvoiceId: any;
    cols: any[];
    currency: string = "";
    error: string;

    refundList: any[];

    patientList: any[];
    selectedPatientId: any ;

    paymentTypeList: any[];
    selectedPaymentType: any ;

    refundRequest: RefundRequest= new RefundRequest();
    allInvoiceList : InvoicesList[];
    selectedInvoice: any ;
    cusAdvanceBalance : any =0.0;
    refundTypes: any = [  {name:'Advance'}, {name:'Invoice'} ];
    selectedRefundType : any;
    isInvoice:boolean = false;


    constructor(private router: Router,
                private titleService: Title,
                private route: ActivatedRoute,
                private requestsService: RequestsService,
                private notificationService: NotificationService,
                private HISUtilService: HISUtilService)
    {
    //    this.currency = "USD";

        this.getDefaultCurrency();

        this.getAllPaymentTypes();
        this.getAllPatient();
        this.getAllRefundData();
    }

    ngOnInit() {
        this.titleService.setTitle('HIS | Refunds Listing');
    }



    getDefaultCurrency() {

        this.requestsService.getRequest(AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_01') {

                        this.currency=response['responseData'].currency;
                    }
                    this.cols = [
                        {field: "serialNo", header: "Serial #"},
                        {field: "date", header: "Date"},
                        {field: "refundId", header: "Voucher #"},
                        {field: "patientName", header: "Patient Name"},
                        {field: "paymentType", header: "Payment (" + this.currency + ")"},
                        {field: "refundType", header: "Refund Type"},
                        {field: "refundAmount", header: "Refund Amount (" + this.currency + ")"},
                        {field: "action", header: "Action"},
                    ];
                },
                (error: any) => {
                    //    this.notificationService.error(error.error.error);
                })
    }


    getAllRefundData()
    {
        this.requestsService.getRequest(AppConstants.REFUND_LIST_DATA )
            .subscribe(
                (response: Response)=>{
                    if (response["responseCode"] === "SUCCESS")
                    {
                        this.refundList = response["responseData"];
                    }
                }, function (error) {
        //            this.notificationService.error("ERROR", "Refund List is not available");
                });
    }


    getRefundId(){
        this.requestsService.getRequest(AppConstants.GET_REFUND_ID )
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.refundRequest.refundId = response['responseData'];
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

                        if(this.paymentTypeList.length > 0){
                            this.refundRequest.paymentTypeId=this.paymentTypeList[0].id;
                        }
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
                        this.patientList = response["responseData"];
                    }
                }, function (error) {
             //       this.notificationService.error("ERROR", "States List is not available");
                });
    }


/*
    public getAllInvoicesList()
    {
        this.requestsService.getRequest(AppConstants.GET_All_INVOICES)
            .subscribe((res :any) =>{
                    this.allInvoiceList = res['responseData'];
                    console.log("get All Invoice_Items Data : " + this.allInvoiceList );
                },
                (error: any) => {
                    this.error = error;
                })
    }
    */

    getSelectedCustomer(selectedPatId: any){
        console.log("------------"+selectedPatId);
        this.refundRequest.patientId=selectedPatId;
        this.getSelectedPatientIvoices(selectedPatId);
    //    this.refundRequest.paymentTypeId=selectedPaymentTyp.id;
    }

    getSelectedPatientIvoices(selectedPatId : any)
    {
        console.log("selected customer : " + selectedPatId);

        this.requestsService.getRequest(AppConstants.GET_INVOICE_List_BY_PAT_ID + selectedPatId )
            .subscribe(
                (response: Response)=>{
                    if (response["responseCode"] === "SUCCESS")
                    {
                        this.allInvoiceList = response["responseData"].data;
                        this.cusAdvanceBalance = response["responseData"].cuAdvanceBalance;

                        if(this.allInvoiceList.length > 0){
                            this.refundRequest.invoiceId=this.allInvoiceList[0].id;
                        }
                        this.refundRequest.refundType= "Advance";
                        this.refundRequest.selectedBalance= this.cusAdvanceBalance;
                    }
                }, function (error) {
        //            this.notificationService.error("ERROR", "Invoice List is not available");
                });
    }

    getSelectedRefundType(selectedRefundTyp : any){
        // console.log(this.refundRequest.patientId);
        this.refundRequest.refundType = selectedRefundTyp.name;
        if (!isNullOrUndefined(this.refundRequest.patientId)) {
            if (this.refundRequest.refundType == "Advance") {
                this.refundRequest.selectedBalance = this.cusAdvanceBalance;
                this.isInvoice = false;
            } else {
                if (this.allInvoiceList != null && this.allInvoiceList.length > 0) {
                    this.refundRequest.invoiceId = this.allInvoiceList[0].id;
                    this.refundRequest.selectedBalance = this.allInvoiceList[0].invoiceAmount;
                } else {
                    this.refundRequest.invoiceId = null;
                    this.refundRequest.selectedBalance = null;
                }
                this.isInvoice = true;
            }
        }
    }

    getSelectedInvoice(selectedInvoice: any){
        console.log("------------"+selectedInvoice);

        this.refundRequest.invoiceId=selectedInvoice.invoiceId;
        this.refundRequest.selectedBalance=selectedInvoice.paidAmount;
    }

    getSelectedPaymentType(selectedPaymentTyp: any){
        console.log("------------"+selectedPaymentTyp);
        this.refundRequest.paymentTypeId=selectedPaymentTyp.id;
    }


    refundPayment(){
        this.requestsService.postRequest(AppConstants.REFUND_PAYMENT, this.refundRequest)
            .subscribe(
                (response: Response) => {
                    console.log(" Added : " + response);
                    if (response['responseCode'] === 'SUCCESS') {
                        this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                        this.notificationService.success('Refund amount Successfully');

                        this.refundList = response["responseData"];

                    //    this.router.navigate(['/dashboard/refund']);
                        /*  this.notificationService.success('Refund amount Successfully'); */
                    }
                }, function (error) {
                    //    this.error('ERROR', 'Refund amount failed');
                });
    }

    printReport(refundId: any) {
        console.log(refundId);
        this.requestsService.getRequest(AppConstants.PRINT_REFUND_RECEIPT + "/" + refundId)
            .subscribe(
                (response: Response) => {
                    console.log(" Added : " + response);
                    if (response['responseCode'] === 'SUCCESS') {
                        this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                        this.notificationService.success('Refund Receipt Downloaded Successfully' + response["responseData"]);
                        // this.refundList = response["responseData"];
                    }
                }, function (error) {
                    //    this.error('ERROR', 'Refund amount failed');
                });
    }

    saveAndPrintReceipt() {
        this.refundPayment();
        this.printReport(this.refundRequest.refundId);
    }

    checkAmountEntered(value: any) {
        if (isNullOrUndefined(this.refundRequest.selectedBalance)) {
            if (this.refundRequest.refundType == "Advance") {
                this.notificationService.warn('This patient has not deposited any advance balance');
            } else {
                this.notificationService.warn('This patient has no balance amount');
            }
            // document.getElementById("refundAmount").focus();
        } else if (value > this.refundRequest.selectedBalance) {
            this.notificationService.warn('Refund amount cannot be greater than Balance amount');
            document.getElementById("refundAmount").focus();
        } else if (value < 0) {
            this.notificationService.warn('Refund amount cannot be negative');
            document.getElementById("refundAmount").focus();
        }
    }
}
