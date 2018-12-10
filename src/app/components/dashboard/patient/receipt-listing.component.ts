import {Component} from "@angular/core";
import {RequestsService} from "../../../services/requests.service";
import {ActivatedRoute, Router} from "@angular/router";
import {InvoicesList} from "../../../model/InvoicesList";
import {Title} from "@angular/platform-browser";
import {AdvanceReceived} from "../../../model/AdvanceReceived";
import {AppConstants} from "../../../utils/app.constants";
import {NotificationService} from "../../../services/notification.service";
import {HISUtilService} from "../../../services/his-util.service";

@Component({
    selector: 'receipt-listing-template',
    templateUrl: '../../../templates/dashboard/patient/receipt-listing.template.html',
})
export class ReceiptListingComponent {
    invoiceList : InvoicesList[];
    //invoiceList: any[];
    selectedInvoiceId: any;
    cols: any[];
    currency: string = "";
    error: string;

    addAdvance: AdvanceReceived = new AdvanceReceived();
    selectedPaymentType: any ;
    patientList: any[];
    paymentTypeList: any[];
    receiptList: any[];

    constructor(private router: Router,
                private titleService: Title,
                private route: ActivatedRoute,
                private requestsService: RequestsService,
                private notificationService: NotificationService,
                private HISUtilService: HISUtilService)
    {
    //    this.currency = "USD";
       this.getDefaultCurrency();

       this.getAllPatient();
       this.getAllPaymentTypes();
       this.getAllReceiptListing();
    }

    ngOnInit() {
        this.titleService.setTitle('HIS | Receipt Listing');

    }


    getDefaultCurrency() {

        this.requestsService.getRequest(AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_01') {

                        this.currency=response['responseData'].currency;
                    }
                    this.cols = [
                        /*   {field: "serialNo", header: "Serial #"},*/
                        {field: "paymentId", header: "Payment #"},
                        {field: "patientName", header: "Patient Name"},
                        {field: "discountAmount", header: "Discount (" + (this.currency) + ")"},
                        {field: "advanceUsedAmount", header: "Advance Utilized (" + (this.currency) + ")"},
                        {field: "paymontAmount", header: "Payment Amount (" + (this.currency) + ")"},
                        {field: "transactionType", header: "Transaction Type"},
                        {field: "paymentType", header: "Payment Type"},
                    ];
                },
                (error: any) => {
                    //    this.notificationService.error(error.error.error);
                })
    }


    getPaymentId(){
        this.requestsService.getRequest(AppConstants.GET_PAYMENT_ID )
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.addAdvance.paymentId = response['responseData'];
                    }
                }
            );
    }


    saveAdvance(formData: any) {
        console.log("---------" + this.addAdvance);

        if (this.addAdvance.date == undefined || this.addAdvance.date == null || this.addAdvance.date.toString().trim() == "") {
            this.addAdvance.date = new Date().toDateString();
        }

        this.addAdvance.date = this.addAdvance.date.substring(0,24);        // Wed Mar 17 1993 17:03:21 GMT+0500 (Pakistan Standard Time)
        console.log(this.addAdvance.date);
    //    console.log("---------" + this.formData);
        this.requestsService.postRequest(AppConstants.SAVE_ADVANCE_PAYMENT , this.addAdvance)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS')
                    {
                        this.getAllReceiptListing();
                        this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                    } else {
                        this.notificationService.error(response['responseMessage']);
                    }
                }
            ),
            (error: any) => {
                this.notificationService.error(error.error.error);
            }
    }

    getAllReceiptListing(){
        this.requestsService.getRequest(AppConstants.GET_RECEIPT_List).subscribe(
            (response : Response)=> {
                if(response["responseCode"] === "SUCCESS")
                {
                    this.receiptList = response["responseData"];
                }
            }
          /*  ,function (error) {
            this.notificationService.error("ERROR", "Receipt List is not available");
        }*/
        );
    }

    getSelectedPaymentType(selectedPaymentTyp: any){
        console.log("------------"+selectedPaymentTyp);
        this.addAdvance.paymentTypeId=selectedPaymentTyp.id;
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
             }
          /*   , function (error) {
                 this.notificationService.error("ERROR", "Patient List is not available");
             }*/
             );
    }

    getAllPaymentTypes()
    {
        this.requestsService.getRequest(AppConstants.GET_ALL_PAYMENT_TYPE)
            .subscribe(
                (response: Response)=>{
                    if (response["responseCode"] === "PAYMENT_SUC_11")
                    {
                        this.paymentTypeList = response["responseData"].data;

                        if(this.paymentTypeList.length > 0){
                            this.addAdvance.paymentTypeId= this.paymentTypeList[0].id;
                        }
                    }
                }/*, function (error) {
                    this.notificationService.error("ERROR", "Payment Type List is not available");
                }*/
                );
    }

    patientInvoiceList(id: any) {
        this.router.navigate(['/dashboard/patient/invoice-list', 1]);

    }


}