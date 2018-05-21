import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {MedicalService} from '../../../models/medical-service';
import {Branch} from "../../../models/branch";
import {ClinicalDepartment} from "../../../models/clinical-department";
import {MedicalServiceSearchModel} from "../../../models/MedicalServiceSearchModel";


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
    departments: ClinicalDepartment[] = [];

    searchMSModel: MedicalServiceSearchModel = new MedicalServiceSearchModel();


    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService) {
    }

    ngOnInit() {
        document.title = 'HIS | Medical Services';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getMedicalServicesFromServer(0);
        }

        this.getBranchesFromServer();
        this.getDepartmentsFromServer();
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

    deleteMedicalServices(msId: number, dptId: number, branchId: number) {
        if (msId > 0) {
            this.requestsService.deleteRequest(
                AppConstants.DELETE_MEDICAL_SERVICES_URL + 'msId=' + msId + '&dptId=' + dptId + '&branchId=' + branchId,
                {})
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MED_SER_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Medical Service');
                            this.getMedicalServicesFromServer(this.currPage);
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

    searchByMedicalServiceParams(page: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            this.searchMSModel.searchServiceId = this.searchMSModel.searchServiceId>0 ? this.searchMSModel.searchServiceId: 0;
            this.searchMSModel.searchServiceName = this.searchMSModel.searchServiceName.length>0 ? this.searchMSModel.searchServiceName: "";
            this.searchMSModel.searchBranchId = this.searchMSModel.searchBranchId>0 ? this.searchMSModel.searchBranchId: 0;
            this.searchMSModel.departmentId = this.searchMSModel.departmentId>0 ? this.searchMSModel.departmentId: 0;
            this.searchMSModel.searchServiceFee = this.searchMSModel.searchServiceFee>0 ? this.searchMSModel.searchServiceFee: 0;
            this.searchMSModel.searched = true;
            this.requestsService.getRequest(
                AppConstants.MEDICAL_SERVICE_SEARCH + page
                + '?serviceId=' + this.searchMSModel.searchServiceId
                + '&serviceName=' + this.searchMSModel.searchServiceName
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
                            this.notificationService.success(response['responseMessage'],'Medical Services')
                        } else {
                            this.nextPage = 0;
                            this.prePage = 0;
                            this.currPage = 0;
                            this.pages = [];
                            this.dataMD = [];
                            this.notificationService.error(response['responseMessage'],'Medical Services');
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

}
