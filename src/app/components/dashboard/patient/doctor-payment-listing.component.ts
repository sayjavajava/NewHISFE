import {Component} from "@angular/core";
import {RequestsService} from "../../../services/requests.service";
import {ActivatedRoute, Router} from "@angular/router";
import {InvoicesList} from "../../../model/InvoicesList";
import {Title} from "@angular/platform-browser";
import {AdvanceReceived} from "../../../model/AdvanceReceived";
import {AppConstants} from "../../../utils/app.constants";
import {NotificationService} from "../../../services/notification.service";
import {HISUtilService} from "../../../services/his-util.service";
import {UserTypeEnum} from "../../../enums/user-type-enum";
import {DoctorPaymentRequest} from "../../../model/DoctorPaymentRequest";

@Component({
    selector: 'receipt-listing-template',
    templateUrl: '../../../templates/dashboard/patient/doctor-payment-listing.template.html',
})
export class DoctorPaymentListingComponent {

    cols: any[];
    currency: string = "";
    error: string;

    doctorPayment: DoctorPaymentRequest = new DoctorPaymentRequest();
    selectedPaymentType: any ;

    paymentTypeList: any[];
    receiptList: any[];

    paymentList: any[];
    doctorId : any;
    selectedDoctor : any;
    selectedDoctorBalance: any = 0.00;
    doctorsList: any = [];

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
       this.getAllPaymentListing();
       this.getDoctorsList();
    }

    ngOnInit() {
        this.titleService.setTitle('HIS | Receipt Listing')

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
                        {field: "paymentId", header: "Voucher #"},
                        {field: "createdOn", header: "Voucher Date"},
                        {field: "doctorName", header: "Doctor Name"},
                        {field: "paymentTypeTitle", header: "Payment Method"},
                        {field: "amount", header: "Payment (" + (this.currency) + ")"},
                        /*  {field: "paymentType", header: "Action"},*/
                    ];
                },
                (error: any) => {
                    //    this.notificationService.error(error.error.error);
                })
    }


    getDoctorsList() {
        this.requestsService.getRequest(
            AppConstants.GET_DOCTOR_List)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'USER_SUC_01') {
                        this.doctorsList = response['responseData'];
                    }
                }
            );
    }

    getPaymentId(){
        this.requestsService.getRequest(AppConstants.GET_PAYMENT_ID )
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.doctorPayment.paymentId = response['responseData'];
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
                        if(this.paymentTypeList.length > 0){
                            this.doctorPayment.paymentTypeId = this.paymentTypeList[0].id;
                        }
                    }
                }/*, function (error) {
                    this.notificationService.error("ERROR", "Payment Type List is not available");
                }*/
            );
    }

    saveDoctorPayment(formData: any) {
        console.log("---------" + this.doctorPayment);

        if (this.doctorPayment.date == undefined || this.doctorPayment.date == null || this.doctorPayment.date.toString().trim() == "") {
            this.doctorPayment.date = new Date().toDateString();
        }

        this.doctorPayment.date = this.doctorPayment.date.substring(0,24);        // Wed Mar 17 1993 17:03:21 GMT+0500 (Pakistan Standard Time)
        console.log(this.doctorPayment.date);
    //    console.log("---------" + this.formData);
        this.requestsService.postRequest(AppConstants.SAVE_DOCTOR_PAYMENT , this.doctorPayment)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS')
                    {
                        this.getAllPaymentListing();
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

    getAllPaymentListing(){
        this.requestsService.getRequest(AppConstants.GET_DOCTOR_PAYMENT_List).subscribe(
            (response : Response)=> {
                if(response["responseCode"] === "SUCCESS")
                {
                    this.paymentList = response["responseData"];
                }
            }
          /*  ,function (error) {
            this.notificationService.error("ERROR", "Receipt List is not available");
        }*/
        );
    }

    getSelectedPaymentType(selectedPaymentTyp: any){
        console.log("------------"+selectedPaymentTyp);
        this.doctorPayment.paymentTypeId=selectedPaymentTyp.id;
    }

    getSelectedDoctor(selectedDoctr: any){
        console.log("------------"+selectedDoctr);
        this.doctorPayment.doctorId = selectedDoctr.pId;
        this.selectedDoctorBalance = selectedDoctr.advanceBalance;
    }





}