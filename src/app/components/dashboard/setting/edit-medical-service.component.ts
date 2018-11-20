import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {MedicalService} from '../../../model/medical-service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Tax} from '../../../model/Tax';

@Component({
    selector: 'add-medical-services-component',
    templateUrl: '../../../templates/dashboard/setting/edit-medical-services.template.html',
})
export class EditMedicalServiceComponent implements OnInit {

    ms: MedicalService = new MedicalService();
    taxes: Tax[] = [];
    selectedBranches: any[] = [];
    selectedDepartments: any[] = [];
    organizationDataList: any;
    currency:string;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.ms.tax.id = -1;
        this.activatedRoute.params.subscribe(
            params => {
                this.requestsService.getRequest(
                    AppConstants.FETCH_MEDICAL_SERVICES_BY_ID_URL + Number(params['id'])
                ).subscribe(
                    response => {
                        if (response['responseCode'] === 'MED_SER_SUC_01') {
                            this.ms = response['responseData'];
                            console.log('total branchs:' + JSON.stringify(this.ms.branches));
                            this.selectedBranches = [];
                            this.selectedDepartments = [];
                            for (let checked of this.ms.checkedBranches) {
                                this.selectedBranches.push(checked.id);
                            }
                            console.log(this.selectedBranches)

                            for (let checked of this.ms.checkedDepartments) {
                                this.selectedDepartments.push(checked.id);
                            }
                            console.log(this.selectedDepartments);

                        } else {
                            this.notificationService.error(response['responseMessage'], 'Medical Service Policies');
                            this.router.navigate(['404-not-found'])
                        }
                    },
                    (error: any) => {

                    });
            });
        this.allorganizationData();
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

    isUnderprocess: boolean = false;

    allorganizationData() {

        this.requestsService.getRequest(AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_01') {

                        this.organizationDataList = response['responseData'];
                        this.currency=this.organizationDataList.currency;
                        console.log(this.organizationDataList);
                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
    }

    updateMedicalServices(form: NgForm) {

        if (!this.isUnderprocess) {
            this.isUnderprocess = true;

            if (this.ms.name === '') {
                this.notificationService.warn('Please enter name.');
                document.getElementById('msTitle').focus();
                this.isUnderprocess = false;
                return;
            }
            if (this.ms.code === '') {
                this.notificationService.warn('Please enter code.');
                document.getElementById('code').focus();
                this.isUnderprocess = false;
                return;
            }
            let foundBranch = 0;
            for (let branch of this.ms.branches) {
                if (branch.checkedBranch) {
                    foundBranch++;
                }
            }

            if (foundBranch <= 0) {
                this.notificationService.warn('Please select at least one branch.');
                document.getElementById('branchId').focus();
                this.isUnderprocess = false;
                return;
            }

            let foundDepartment = 0;
            for (let department of this.ms.departments) {
                if (department.checkedDepartment) {
                    foundDepartment++;
                }
            }

            if (foundDepartment <= 0) {
                this.notificationService.warn('Please select at least one Department.');
                document.getElementById('departmentId').focus();
                this.isUnderprocess = false;
                return;
            }

            if (this.ms.tax.id <= 0) {
                this.notificationService.warn('Please select tax.');
                document.getElementById('taxId').focus();
                this.isUnderprocess = false;
                return;
            }

            this.requestsService.putRequest(AppConstants.UPDATE_MEDICAL_SERVICES_URL, this.ms)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MED_SER_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Medical Service');
                            this.router.navigate(['/dashboard/setting/medicalServices']);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Medical Service');
                        }
                        this.isUnderprocess = false;
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                        this.isUnderprocess = false;
                    }
                );


        } else {
            this.notificationService.warn('Your first request is under process. Please wait..')
        }


    }

    onBranchSelection() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_BY_BRANCHES_IDs_URI + '?branchIds=' + this.selectedBranches)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                        this.selectedDepartments = [];
                        this.ms.departments = [];
                        this.ms.departments = response['responseData'];
                        this.notificationService.success(response['responseMessage']);
                    } else {
                        this.ms.selectedDepartments = [];
                        this.ms.departments = [];
                        this.notificationService.error(response['responseMessage']);
                    }

                    this.changeSelectedCheckedBranch();
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    changeSelectedCheckedBranch() {
        for (let selectedBranch of this.ms.branches) {
            selectedBranch.checkedBranch = false;
        }
        for (let checked of this.selectedBranches) {
            for (let selected of this.ms.branches) {
                if (checked === selected.id) {
                    selected.checkedBranch = true;
                }
            }
        }
    }

    changeSelectedCheckedDepartment() {
        for (let selectedDepartment of this.ms.departments) {
            selectedDepartment.checkedDepartment = false;
        }
        for (let checked of this.selectedDepartments) {
            for (let selected of this.ms.departments) {
                if (checked === selected.id) {
                    selected.checkedDepartment = true;
                }
            }
        }
    }

}
