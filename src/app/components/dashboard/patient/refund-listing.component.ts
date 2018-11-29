import {Component} from "@angular/core";
import {RequestsService} from "../../../services/requests.service";
import {ActivatedRoute, Router} from "@angular/router";
import {InvoicesList} from "../../../model/InvoicesList";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'refund-listing-template',
    templateUrl: '../../../templates/dashboard/patient/refund-listing.template.html',
})
export class RefundListingComponent {
    invoiceList : InvoicesList[];
    //invoiceList: any[];
    selectedInvoiceId: any;
    cols: any[];
    currency: string = "";

    constructor(private router: Router, private titleService: Title, private route: ActivatedRoute, private requestsService: RequestsService) {
        this.currency = "USD";
    }

    ngOnInit() {
        this.titleService.setTitle('HIS | Refunds Listing');
        this.cols = [
            {field: "serialNo", header: "Serial #"},
            {field: "refundDate", header: "Date"},
            {field: "refundVoucher", header: "Voucher #"},
            {field: "patientName", header: "Patient Name"},
            {field: "payment", header: "Payment)"},
            {field: "refundType", header: "Refund Type"},
            {field: "refundAmount", header: "Refund Amount (" + this.currency + ")"},
        ];
    }
}
