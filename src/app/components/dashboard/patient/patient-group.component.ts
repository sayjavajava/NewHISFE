/**
 * Created by jamal on 10/24/2018.
 */
import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {RequestsService} from "../../../services/requests.service";
import {HISUtilService} from "../../../services/his-util.service";
import {ConformationDialogService} from "../../../services/ConformationDialogService";
import {DataService} from "../../../services/DataService";
import {NotificationService} from "../../../services/notification.service";
import {PatientGroupModel} from "../../../model/patient-group.model";
import {AppConstants} from "../../../utils/app.constants";


@Component({
    selector: 'patient-group',
    templateUrl: '../../../templates/dashboard/setting/patient-group.template.html',
})

export class PatientGroupComponent implements OnInit, OnDestroy {

    patientGroup: PatientGroupModel = new PatientGroupModel();
    nextPage: number;
    prePage: number;
    currPage: number;
    pages: number[] = [];
    data: PatientGroupModel[] = [];
    patientId: number;
    error: any;
    searchPatientGroup: string = '';
    cols: any[];

    constructor(private router: Router, private requestsService: RequestsService, private HISUtilService: HISUtilService, private dataService: DataService,
                private notificationService: NotificationService, private confirmationDialogService: ConformationDialogService) {
        this.cols = [
            {field: "name", header: "Name"},
            {field: "description", header: "Description"},
            {field: "patientCount", header: "Patient Count"},
            {field: "status", header: "Status"},
            {field: "action", header: "Action"}
        ];
    }

    ngOnInit(): void {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.getPageWisePatientGroupFromServer(0);
        } else {
            this.router.navigate(['/login']);
        }
    }

    ngOnDestroy(): void {
    }

    onAddPatientGroup() {
        this.patientGroup = new PatientGroupModel();
    }

    savePatientGroup() {

        if (this.patientGroup.name == '') {
            this.notificationService.error('Patient Group', 'Please enter name.');
            document.getElementById('patientGroupName').focus();
            return;
        }
        this.requestsService.postRequest(
            AppConstants.PATIENT_GROUP_SAVE_URL,
            this.patientGroup)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATGRP_SUC_1') {
                        this.notificationService.success(response['responseMessage'], 'Patient Group');
                        this.getPageWisePatientGroupFromServer(0);
                        this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Patient Group');
                    }
                },
                (error: any) => {
                    //console.log(error.json())
                    this.notificationService.error(error.error.error);
                }
            );
    }

    editPopupPatientGroupLoad(pg: PatientGroupModel) {

        this.requestsService.getRequest(AppConstants.PATIENT_GROUP_GET_URL + pg.id)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATGRP_SUC_6') {
                        this.patientGroup = response['responseData'];
                    } else {
                        this.notificationService.error(response['responseMessage']);
                    }
                }
            ),
            (error: any) => {
                this.notificationService.error(error.error.error);
            }
    }

    updatePatientGroup() {

        if (this.patientGroup.name == '') {
            this.notificationService.error('Please enter name.', 'Patient Group');
            document.getElementById('patientGroupName').focus();
            return;
        }

        if (this.patientGroup.id <= 0) {
            this.notificationService.error('Please select proper record again.', 'Patient Group');
            this.getPageWisePatientGroupFromServer(0);
            return;
        }

        this.requestsService.putRequest(
            AppConstants.PATIENT_GROUP_UPDATE_URL,
            this.patientGroup)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATGRP_SUC_7') {
                        this.notificationService.success(response['responseMessage'], 'Patient Group');
                        this.getPageWisePatientGroupFromServer(0);
                        this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Patient Group');
                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                }
            );
    }

    getPageWisePatientGroupFromServer(page: number) {
        this.searchPatientGroup = '';
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.PATIENT_GROUP_FETCH_ALL_PAGINATED_URI + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATGRP_SUC_5') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    console.log(error.error.error);
                    this.notificationService.error(error.error.error);
                }
            );
    }

    getPageWisePatientGroup(page: any) {

        this.getPageWisePatientGroupFromServer(page);
    }

    deletePatientGroup(id: any) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.PATIENT_GROUP_DELETE_URI + id)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PATGRP_SUC_10') {
                            this.notificationService.success(response['responseMessage'], 'Patient Group');
                            this.getPageWisePatientGroupFromServer(0);
                        } else {
                            this.getPageWisePatientGroupFromServer(0);
                            this.notificationService.error(response['responseMessage'], 'Patient Group');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error(Response['responseMessage'], 'Patient Group');
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }


}
