
import {Component, Inject} from "@angular/core";
import {NotificationService} from "../../../services/notification.service";
import {RequestsService} from "../../../services/requests.service";
import {HISUtilService} from "../../../services/his-util.service";
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";
import {ConformationDialogService} from "../../../services/ConformationDialogService";
import {AppConstants} from "../../../utils/app.constants";
import {Patient} from "../../../model/patient";

@Component({
    selector: "patient-payment-template-component",
    templateUrl: "../../../templates/dashboard/patient/patient-payment.template.html",
})
export class PatientPaymentsComponent {

    patient: Patient = new Patient;
    // payments: Payment[];
    code: any;
    paymentMode: any[];

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                /*private route: ActivatedRoute,*/
                private router: Router,
                @Inject(DOCUMENT) document: any,
                private confirmationDialogService: ConformationDialogService) {
        this.paymentMode = [
            {label: 'Cash', value: 'CASH'},
            {label: 'Visa', value: 'VISA'},
            {label: 'MasterCard', value: 'MASTERCARD'},
        ];
    }

    ngOnInit() {
        document.title = "HIS | Receive Advance Payment";

        if (localStorage.getItem(btoa("access_token"))) {

        }
    }
}
