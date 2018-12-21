import {Component, OnInit} from "@angular/core";
import {RequestsService} from "../../../services/requests.service";
import {ActivatedRoute, Router} from "@angular/router";
import {InvoicesList} from "../../../model/InvoicesList";
import {Title} from "@angular/platform-browser";
import {AppConstants} from "../../../utils/app.constants";
import {NotificationService} from "../../../services/notification.service";
import {HISUtilService} from "../../../services/his-util.service";

@Component({
    selector: 'invoice-listing-template',
    templateUrl: '../../../templates/dashboard/patient/invoice-listing.template.html',
})
export class InvoiceListingComponent implements OnInit{
    invoiceList : InvoicesList[];
    //invoiceList: any[];
    selectedInvoiceId: any;
    cols: any[];
    currency: string = "";
    totalAmount: number;
    // href: string = "";



    constructor(private router: Router, private titleService: Title, private route: ActivatedRoute,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private notificationService: NotificationService) {
        //    this.currency = "USD";

    }

    ngOnInit() {
        this.getDefaultCurrency();

        this.titleService.setTitle('HIS | Invoice Listing');

        this.getAllInvoicesList();
    }


    getDefaultCurrency() {

        this.requestsService.getRequest(AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_01') {

                        this.currency=response['responseData'].currency;
                    }

                    this.cols = [
                        {field: "serialNo", header: "Serial No."},
                        {field: "invoiceId", header: "Invoice No"},
                        {field: "patientName", header: "Patient Name"},
                        {field: "invoiceAmount", header: "Invoice Amount ("+(this.currency)+")"},
                        {field: "paidAmount", header: "Paid Amount ("+(this.currency)+")"},
                        {field: "balanceAmount", header: "Balance("+(this.currency)+")"},
                        {field: "status", header: "Status"},
                        {field: "action", header: "Action"},
                    ];
                },
                (error: any) => {
                    //    this.notificationService.error(error.error.error);
                })
    }

    getAllInvoicesList()
    {
        this.requestsService.getRequest(AppConstants.GET_All_INVOICES)
            .subscribe((res :any) =>{
                    this.invoiceList = res['responseData'];
                    console.log("get All Invoice_Items Data : " + this.invoiceList );
                },
                (error: any) => {
                    console.log("Error in getting All Invoice_Items Data : " + error );
                    // this.error = error;
                })
    }

    printReport(invoiceId: any) {
        console.log(invoiceId);
        this.requestsService.getRequest(AppConstants.PRINT_PATIENT_INVOICE_DETAILS + "/" + invoiceId)
            .subscribe(
                (response: Response) => {
                    console.log(" Added : " + response);
                    if (response['responseCode'] === 'SUCCESS') {
                        let pdfFilePath = response["responseData"];
                        this.notificationService.success('Invoice Downloaded Successfully: ');
                    } else {
                        this.notificationService.error('ERROR', 'Failed to generate Invoice ');
                    }
                }, function () {
                    this.notificationService.error('ERROR', 'Error occurred while getting invoice data' );
                });
    }

}