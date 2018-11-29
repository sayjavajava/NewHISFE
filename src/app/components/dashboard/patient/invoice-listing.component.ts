import {Component} from "@angular/core";
import {RequestsService} from "../../../services/requests.service";
import {ActivatedRoute, Router} from "@angular/router";
import {InvoicesList} from "../../../model/InvoicesList";
import {Title} from "@angular/platform-browser";
import {AppConstants} from "../../../utils/app.constants";

@Component({
    selector: 'invoice-listing-template',
    templateUrl: '../../../templates/dashboard/patient/invoice-listing.template.html',
})
export class InvoiceListingComponent {
    invoiceList : InvoicesList[];
    //invoiceList: any[];
    selectedInvoiceId: any;
    cols: any[];
    currency: string = "";

    constructor(private router: Router, private titleService: Title, private route: ActivatedRoute, private requestsService: RequestsService) {
        this.currency = "USD";
    }

    ngOnInit() {
        this.titleService.setTitle('HIS | Invoice Listing');
        this.cols = [
            {field: "serialNo", header: "Serial No."},
            {field: "invoiceId", header: "Invoice No."},
            {field: "patientName", header: "Patient Name"},
            {field: "invoiceAmount", header: "Invoice Amount (" + (this.currency) + ")"},
            {field: "discountAmount", header: "Discount (" + (this.currency) + ")"},
            {field: "taxAmount", header: "Tax (" + (this.currency) + ")"},
            {field: "totalAmount", header: "Total Amount (" + (this.currency) + ")"},
            {field: "status", header: "Status"},
            {field: "action", header: "Action"},
        ];
        this.getAllInvoicesList();
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


}