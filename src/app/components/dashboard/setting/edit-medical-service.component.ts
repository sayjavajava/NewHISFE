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
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
    selector: 'add-medical-services-component',
    templateUrl: '../../../templates/dashboard/setting/edit-medical-services.template.html',
})
export class EditMedicalServiceComponent implements OnInit {

    branches: Branch[] = [];
    departments: ClinicalDepartment[] = [];
    taxes: ServiceTax[] = [];
    selectedMS: MedicalService = new MedicalService();
    selectedMedicalServiceId: number;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.getBranchesFromServer();
        this.getDepartmentsFromServer();
        this.getTaxesFromServer();

        this.activatedRoute.params.subscribe(
            params => {
                this.selectedMedicalServiceId = Number(params['id']);
                this.requestsService.getRequest(
                    AppConstants.FETCH_MEDICAL_SERVICES_BY_ID_URL + this.selectedMedicalServiceId
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

    updateMedicalServices(form: NgForm) {
        _.each(form.form.controls, function (control) {
            control['_touched'] = true
        });
        if (form.valid) {
            this.requestsService.putRequest(AppConstants.UPDATE_MEDICAL_SERVICES_URL,this.selectedMS)
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
        }else {
            this.notificationService.error("Please provide required values.","Medical Service")
        }
    }

}
