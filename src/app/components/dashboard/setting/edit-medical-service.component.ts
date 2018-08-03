import {Component, OnInit} from "@angular/core";
import {ServiceTax} from "../../../model/service-tax";
import {RequestsService} from "../../../services/requests.service";
import {NotificationService} from "../../../services/notification.service";
import {HISUtilService} from "../../../services/his-util.service";
import {AppConstants} from "../../../utils/app.constants";
import {MedicalService} from "../../../model/medical-service";
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Department} from "../../../model/department";
import {Branch} from "../../../model/branch";
import {Tax} from "../../../model/Tax";

@Component({
    selector: 'add-medical-services-component',
    templateUrl: '../../../templates/dashboard/setting/edit-medical-services.template.html',
})
export class EditMedicalServiceComponent implements OnInit {

    selectedMS: MedicalService = new MedicalService();
    taxes: Tax[] = [];

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.selectedMS.tax.id = -1;
        this.activatedRoute.params.subscribe(
            params => {
                this.requestsService.getRequest(
                    AppConstants.FETCH_MEDICAL_SERVICES_BY_ID_URL + Number(params['id'])
                ).subscribe(
                    response => {
                        if (response['responseCode'] === 'MED_SER_SUC_01') {
                            this.selectedMS = response['responseData'];
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Medical Service Policies');
                            this.router.navigate(['404-not-found'])
                        }
                    },
                    (error: any) => {

                    });
            });

        this.getTaxesFromServer();
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

    updateMedicalServices(form: NgForm) {
        if (form.valid) {
            this.requestsService.putRequest(AppConstants.UPDATE_MEDICAL_SERVICES_URL, this.selectedMS)
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
            this.notificationService.error("Please provide required values.", "Medical Service")
        }
    }

}
