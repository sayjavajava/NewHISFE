import {Component} from "@angular/core";
import {RequestsService} from "../../../services/requests.service";
import {ActivatedRoute, Router} from "@angular/router";
import {InvoicesList} from "../../../model/InvoicesList";
import {Title} from "@angular/platform-browser";

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

    constructor(private router: Router, private titleService: Title, private route: ActivatedRoute, private requestsService: RequestsService) {
        this.currency = "USD";
    }

    ngOnInit() {
        this.titleService.setTitle('HIS | Receipt Listing');
        this.cols = [
            {field: "serialNo", header: "Serial #"},
            {field: "paymentId", header: "Payment #"},
            {field: "patientName", header: "Patient Name"},
            {field: "discount", header: "Discount (" + (this.currency) + ")"},
            {field: "advUtil", header: "Advance Utilized (" + (this.currency) + ")"},
            {field: "paymentAmount", header: "Payment Amount (" + (this.currency) + ")"},
            {field: "paymentType", header: "Payment Type"},
        ];

    }


}