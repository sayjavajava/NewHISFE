import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Family} from "../../../model/Family";
import {NgForm} from "@angular/forms";
import {RequestsService} from "../../../services/requests.service";
import {AppConstants} from "../../../utils/app.constants";
import {NotificationService} from "../../../services/notification.service";
import {HISUtilService} from "../../../services/his-util.service";
import {Subscription} from "rxjs/Subscription";
import {DataService} from "../../../services/DataService";
import {ConformationDialogService} from "../../../services/ConformationDialogService";
import {Patient} from "../../../model/patient";


@Component({
    selector: 'patient-family-history',
    templateUrl: '../../../templates/dashboard/patient/patient-family-history.template.html',
})
export class PatientFamilyHistoryComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    nextPage: number;
    prePage: number;
    currPage: number;
    pages: number[] = [];
    data : Family[];
    selectedFamily = new Family();
    patientId: number;
    subscription: Subscription;
    error: any;
    patient :Patient =new Patient();
    constructor(private router: Router, private requestsService: RequestsService, private hISUtilService: HISUtilService, private dataService: DataService,
                private notificationService: NotificationService, private confirmationDialogService: ConformationDialogService) {
        this.subscription = this.dataService.currentPatientId.subscribe(id => {
            this.patientId = id
        })
    }

    ngOnInit(): void {
        this.loadRecord();
        this.getFamilyHistoryFromServer(0);

    }
    loadRecord() {
        if (this.patientId == null || this.patientId == 0 || this.patientId == undefined) {
            this.notificationService.error('Please Select Patient Again From Dashboard')
        } else {
            this.requestsService.getRequest(
                AppConstants.PATIENT_FETCH_URL + this.patientId
            ).subscribe(
                response => {
                    if (response['responseCode'] === 'USER_SUC_01') {
                        this.patient = response['responseData'];
                        //this.patient.races = JSON.parse(response['responseData'].racesString);
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Patient');
                        // this.router.navigate(['404-not-found'])
                    }
                },
                (error: any) => {

                });
        }
    }

    getFamilyHistoryFromServer(page: number) {
        if (page > 0) {
            page = page;

        }
        this.requestsService.getRequestWithParam(
            AppConstants.FETCH_ALL_FAMILY_HISTORY_BY_PATIENT_URL + page,this.patientId)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'FAM_HISTORY_SUC_02') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data= response['responseData']['data'];

                    }
                   /* if(response['responseCode'] =='FAM_HISTORY_ERR_02'){
                        this.notificationService.error(`Error ${response['responseMessage']}`)
                    }*/
                },
                (error: any) => {
                    this.error = error.error.error;
                }
            );
    }

    goToUserDashBoard() {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    }

    saveFamilyHistory(data: NgForm) {
        if (data.valid) {
            this.selectedFamily.patientId = this.patientId;
            if(this.patientId == null || this.patientId ==0 || this.patientId==undefined){
                this.notificationService.error('Please Select Patient Again From Dashboard')
            }else {
            this.requestsService.postRequest(
                AppConstants.FAMILY_HISTORY_CREATE,
                this.selectedFamily)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'FAM_HISTORY_SUC_01') {
                            this.notificationService.success(response['responseMessage'], 'Family History');
                            this.getFamilyHistoryFromServer(0);
                            this.hISUtilService.hidePopupWithCloseButtonId('closeButton');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Family History');
                        }
                    },
                    (error: any) => {
                        //console.log(error.json())
                        this.hISUtilService.tokenExpired(error.error.error);
                    }
                );}
        } else {
            this.notificationService.error('Form Invalid', '');
        }
    }

    onUpdatePopupLoad(family: Family) {
        this.selectedFamily = family;
    }

    updateFamilyHistory(form: NgForm) {
        if (form.valid) {
            this.requestsService.putRequest(
                AppConstants.UPDATE_FAMILY_HISTORY_URL + this.selectedFamily.id,
                this.selectedFamily)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'FAM_HISTORY_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'Family History');
                            this.getFamilyHistoryFromServer(0);
                            this.hISUtilService.hidePopupWithCloseButtonId('closeButton');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Family History');
                        }
                    },
                    (error: any) => {
                        //console.log(error.json())
                        this.hISUtilService.tokenExpired(error.error.error);

                    }
                );
        } else {
            this.notificationService.error('Required fields missing', 'Clinical Department');
        }
    }

    onAddPopupLoad() {
        this.selectedFamily = new Family();
    }

    deletePatientFamilyHistory(id: number) {
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(res => {
                if (res ==true) {
                    this.requestsService.deleteRequest(AppConstants.FAMILY_HISTORY_DELETE + id).subscribe((data: Response) => {
                        if (data['responseCode'] === 'FAM_HISTORY_SUC_04') {
                            this.notificationService.success('Patient Family History has been Deleted Successfully');
                            this.getFamilyHistoryFromServer(this.currPage);

                        }

                    }, error => {
                        this.notificationService.error('ERROR', 'Family History is not deleted ');

                    });
                }
            });
    }
}