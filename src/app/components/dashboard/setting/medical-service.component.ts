import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {MedicalService} from '../../../model/medical-service';
import {Branch} from '../../../model/branch';
import {Department} from '../../../model/department';
import {MedicalServiceSearchModel} from '../../../model/MedicalServiceSearchModel';


@Component({
    selector: 'medical-services-component',
    templateUrl: '../../../templates/dashboard/setting/medical-services.template.html',
})
export class MedicalServiceComponent implements OnInit {

    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    dataMD: MedicalService[] = [];
    branches: Branch[] = [];
    departments: Department[] = [];
    checkedBranches: Branch[] = [];
    checkedDepartments: Department[] = [];
    cols:any;
    searchMSModel: MedicalServiceSearchModel = new MedicalServiceSearchModel();
    loading: boolean = false;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService) {
    }

    ngOnInit() {
        this.getBranchesFromServer();
        this.getDepartmentsFromServer();

        document.title = 'HIS | Medical Services';
        if (localStorage.getItem(btoa('access_token'))) {
            this.cols = [
                { field: 'name', header: 'Name' },
                { field: 'code', header: 'Code' },
                { field: 'branch', header: 'Branch' },
                { field: 'department', header: 'Department' },
                { field: 'fee', header: 'Fee' },
                { field: 'tax', header: 'Tax' },
                { field: 'cost', header: 'Cost' },
                { field: 'status', header: 'Status' },
                { field: 'action', header: 'Action' }
            ];

            this.getAllMedicalServicesFromServer();

        }
    }



    deleteMedicalServices(ms: any) {
        if (ms.id > 0) {
            if (!confirm('Are Your Source You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.DELETE_MEDICAL_SERVICES_URL + 'msId=' + ms.id)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MED_SER_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Medical Service');
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

    getCheckedDepartmentsByMedicalServiceId(ms: MedicalService) {
        if (ms.id > 0) {
            this.requestsService.getRequest(
                AppConstants.FETCH_DEPARTMENTS_BY_MEDICAL_SERVICE_ID_URL + ms.id)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MED_SER_SUC_01') {
                            this.checkedDepartments = response['responseData'];
                        } else {
                            //this.notificationService.success('Service has no departments', 'Medical Services');
                            //document.getElementById('close-btn-depart').click();
                            this.checkedDepartments = [];
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        }
    }

    clearList(event: any) {
        if (event.target.name === 'close-btn-branch') {
            this.checkedBranches = [];
        } else if (event.target.name === 'close-btn-depart') {
            this.checkedDepartments = [];
        }
    }

    getCheckedBranchesByMedicalServiceId(ms: MedicalService) {
        if (ms.id > 0) {
            this.requestsService.getRequest(
                AppConstants.FETCH_BRANCHES_BY_MEDICAL_SERVICE_ID_URL + ms.id)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MED_SER_SUC_01') {
                            this.checkedBranches = response['responseData'];
                        } else {
                            this.checkedBranches = [];
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        }
    }

    getBranchesFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_BRANCHES_ALL_URL)
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

    getAllMedicalServicesFromServer() {
        this.loading = true;
        this.requestsService.getRequest(AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] == 'MED_SER_SUC_01') {
                        this.dataMD = response['responseData'];
                        this.loading = false;
                    } else {
                        this.notificationService.error(response['responseMessage']);
                        this.loading = false;
                    }

                }
            )
    }


}
