import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {MedicalService} from '../../../model/medical-service';
import {Branch} from "../../../model/branch";
import {Department} from "../../../model/department";
import {MedicalServiceSearchModel} from "../../../model/MedicalServiceSearchModel";


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

    searchMSModel: MedicalServiceSearchModel = new MedicalServiceSearchModel();


    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService) {
    }

    ngOnInit() {
        this.getBranchesFromServer();
        this.getDepartmentsFromServer();

        document.title = 'HIS | Medical Services';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getMedicalServicesFromServer(0);
        }
    }

    refreshMedicalServices() {
        this.searchMSModel = new MedicalServiceSearchModel();
        this.getMedicalServicesFromServer(0);
    }

    getPageWiseMedicalServicesFromServer(page: number) {
        this.dataMD = [];
        if (this.searchMSModel.searched) {
            this.searchByMedicalServiceParams(page);
        } else {
            this.getMedicalServicesFromServer(page);
        }
    }

    getMedicalServicesFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'MED_SER_SUC_01') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.dataMD = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    deleteMedicalServices(ms: any) {
        if (ms.id > 0) {
            if (!confirm("Are Your Source You Want To Delete")) return;
            this.requestsService.deleteRequest(
                AppConstants.DELETE_MEDICAL_SERVICES_URL + 'msId=' + ms.id)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MED_SER_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Medical Service');
                            this.getMedicalServicesFromServer(0);
                        } else {
                            this.getMedicalServicesFromServer(0);
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

    searchByMedicalServiceParams(page: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            this.searchMSModel.searchServiceName = this.searchMSModel.searchServiceName.length > 0 ? this.searchMSModel.searchServiceName : "";
            this.searchMSModel.searchCode = this.searchMSModel.searchCode.length > 0 ? this.searchMSModel.searchCode : "";
            this.searchMSModel.searchBranchId = this.searchMSModel.searchBranchId > 0 ? this.searchMSModel.searchBranchId : 0;
            this.searchMSModel.departmentId = this.searchMSModel.departmentId > 0 ? this.searchMSModel.departmentId : 0;
            this.searchMSModel.searchServiceFee = this.searchMSModel.searchServiceFee > 0 ? this.searchMSModel.searchServiceFee : 0;
            this.searchMSModel.searched = true;
            /**
             * if all not selected then we are going to refresh the page, it means default condition
             *
             * **/
            if (this.searchMSModel.searchServiceId === 0 &&
                this.searchMSModel.searchServiceName.length === 0 &&
                this.searchMSModel.searchCode.length === 0 &&
                this.searchMSModel.searchBranchId === 0 &&
                this.searchMSModel.departmentId === 0 &&
                this.searchMSModel.searchServiceFee === 0) {

                this.refreshMedicalServices();
                return;
            }

            this.requestsService.getRequest(
                AppConstants.MEDICAL_SERVICE_SEARCH + page
                + '?serviceName=' + this.searchMSModel.searchServiceName
                + '&searchCode=' + this.searchMSModel.searchCode
                + '&branchId=' + this.searchMSModel.searchBranchId
                + '&departmentId=' + this.searchMSModel.departmentId
                + '&serviceFee=' + this.searchMSModel.searchServiceFee)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MED_SER_SUC_05') {
                            this.nextPage = response['responseData']['nextPage'];
                            this.prePage = response['responseData']['prePage'];
                            this.currPage = response['responseData']['currPage'];
                            this.pages = response['responseData']['pages'];
                            this.dataMD = response['responseData']['data'];
                            this.notificationService.success(response['responseMessage'], 'Medical Services')
                        } else {
                            this.nextPage = 0;
                            this.prePage = 0;
                            this.currPage = 0;
                            this.pages = [];
                            this.dataMD = [];
                            this.notificationService.error(response['responseMessage'], 'Medical Services');
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

}
