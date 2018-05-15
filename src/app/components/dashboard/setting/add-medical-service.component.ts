import {Component, OnInit} from '@angular/core';
import {Branch} from '../../../models/branch';
import {ServiceTax} from '../../../models/service-tax';
import {ClinicalDepartment} from '../../../models/clinical-department';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {MedicalService} from '../../../models/medical-service';
import {NgForm} from '@angular/forms';
import * as _ from 'lodash'
import {Router} from '@angular/router';

@Component({
    selector: 'add-medical-services-component',
    templateUrl: '../../../templates/dashboard/setting/add-medical-services.template.html',
})
export class AddMedicalServiceComponent implements OnInit {

    branches: Branch[] = [];
    departments: ClinicalDepartment[] = [];
    taxes: ServiceTax[] = [];
    selectedMedicalService: MedicalService = new MedicalService();

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
    }

    ngOnInit() {
        this.getBranchesFromServer();
        this.getDepartmentsFromServer();
        this.getTaxesFromServer();
    }

    getBranchesFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_BRANCHES_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branches = response['responseData'];
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
                        this.departments = response['responseData'];
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

    saveMedicalServices(form: NgForm) {
        _.each(form.form.controls, function (control) {
            control['_touched'] = true
        });
        if (form.valid) {
            this.requestsService.postRequest(
                AppConstants.SAVE_MEDICAL_SERVICES_URL,
                this.selectedMedicalService)
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
        }
    }

}
