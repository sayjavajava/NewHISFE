import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";
import {RequestsService} from "../../../services/requests.service";
import {HISUtilService} from "../../../services/his-util.service";
import {PatientProblemModel} from "../../../model/patient.problem.model";
import {ICDCodeModel} from "../../../model/ICDCodeModel";
import {ICDVersionModel} from "../../../model/ICDVersionModel";
import {AppConstants} from "../../../utils/app.constants";
import {error} from "selenium-webdriver";


@Component({
    selector: 'patient-problem-list',
    templateUrl: '../../../templates/dashboard/patient/patient-problem-list.template.html',
})
export class PatientProblemListComponent implements OnInit {
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    problemData: PatientProblemModel[] = [];
    ppm: PatientProblemModel = new PatientProblemModel();
    private iCDVersions: ICDVersionModel [];
    private associatedCodes: ICDCodeModel [];
    private appointments: any [];

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Problem list';
        this.getPaginatedProblemsFromServer(0);
    }

    versionsByServer() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                AppConstants.ICD_VERSIONS)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_VERSIONS_FOUND_03') {
                            this.iCDVersions = [];
                            this.iCDVersions = response['responseData'];
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }

    addProblemPopupClick() {
        this.versionsByServer();
        this.versionChanged(this.ppm.selectedICDVersionId);
    }

    versionChanged(associatedICDCVId: any) {
        this.ppm.selectedCodeId = -1;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                AppConstants.ICD_CODES_ASSOCIATED_BY_VERSION_ID + associatedICDCVId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_ASSOCIATED_FOUND_SUC_02') {
                            this.associatedCodes = [];
                            this.associatedCodes = response['responseData'].code;
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        }
    }

    savePatientProblem() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(
                AppConstants.PATIENT_PROBLEM_SAVE_URL, this.ppm)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_14') {
                            this.notificationService.success(response['responseMessage'], 'Problem of Patient');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Problem of Patient');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        }
    }

    getPaginatedProblemsFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.PATIENT_PROBLEM_FETCH_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_16') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.problemData = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    goToUserDashBoard() {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    }


}