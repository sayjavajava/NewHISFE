import {Component} from "@angular/core";
import {RequestsService} from "../../../services/requests.service";
import {ActivatedRoute, Router} from "@angular/router";
import {InvoicesList} from "../../../model/InvoicesList";
import {Title} from "@angular/platform-browser";
import {AppConstants} from "../../../utils/app.constants";
import {RefundRequest} from "../../../model/RefundRequest";
import {HISUtilService} from "../../../services/his-util.service";
import {NotificationService} from "../../../services/notification.service";

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
                        {field: "paymentType", header: "Payment)"},
                        {field: "refundType", header: "Refund Type"},
                        {field: "refundAmount", header: "Refund Amount (" + this.currency + ")"},
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
                        this.patientList = response["responseData"].data;
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
        this.refundRequest.refundType = selectedRefundTyp.name;
        if(selectedRefundTyp.name == "Advance"){
            this.refundRequest.selectedBalance = this.cusAdvanceBalance;
        }else{
            if(this.allInvoiceList.length > 0){
                this.refundRequest.invoiceId=this.allInvoiceList[0].id;
                this.refundRequest.selectedBalance=this.allInvoiceList[0].invoiceAmount;
            }
        }
    }

    getSelectedInvoice(selectedInvoice: any){
        console.log("------------"+selectedInvoice);

        this.refundRequest.invoiceId=selectedInvoice.invoiceId;
        this.refundRequest.selectedBalance=selectedInvoice.dueAmount;
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
}
