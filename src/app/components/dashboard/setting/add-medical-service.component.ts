import {Component, OnInit} from "@angular/core";
import {RequestsService} from "../../../services/requests.service";
import {NotificationService} from "../../../services/notification.service";
import {HISUtilService} from "../../../services/his-util.service";
import {AppConstants} from "../../../utils/app.constants";
import {MedicalService} from "../../../model/medical-service";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Tax} from "../../../model/Tax";

@Component({
    selector: 'add-medical-services-component',
    templateUrl: '../../../templates/dashboard/setting/add-medical-services.template.html',
})
export class AddMedicalServiceComponent implements OnInit {

    ms: MedicalService = new MedicalService();
    taxes: Tax[] = [];

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {

    }

    ngOnInit() {
        this.ms.tax.id = -1;
        this.getBranchesFromServer();
        this.getDepartmentsFromServer();
        this.getTaxesFromServer();
    }

    getBranchesFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.ms.branches = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    getDepartmentsFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                        this.ms.departments = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    getTaxesFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_TAX_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SER_TAX_SUC_01') {
                        this.taxes = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    saveMedicalServices(msForm: NgForm) {
        if (msForm.valid) {
            this.requestsService.postRequest(
                AppConstants.SAVE_MEDICAL_SERVICES_URL,
                this.ms)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MED_SER_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Medical Service');
                            this.router.navigate(['/dashboard/setting/medicalServices']);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Medical Service');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.notificationService.error('Please provide required field data', 'Medical Service');
        }
    }

}
