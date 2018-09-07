import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {RequestsService} from '../../../services/requests.service';
import {Patient} from "../../../model/patient";
import {NotificationService} from '../../../services/notification.service';
import {HISUtilService} from '../../../services/his-util.service';
import {Race} from "../../../model/race-model";
import {NgForm} from "@angular/forms";
import {UserTypeEnum} from "../../../enums/user-type-enum";
import {PatientSmokeStatus} from "../../../model/PatientSmokeStatus";
import {ConformationDialogService} from "../../../services/ConformationDialogService";

@Component({
    selector: 'patient-history',
    templateUrl: '../../../templates/dashboard/patient/patient-demographic.template.html',
})
export class PatientDemographicComponent implements OnInit {
    id:Number;
    patient: Patient = new Patient();
    file: File;
    doctors: any = [];
    smokeStatus: PatientSmokeStatus = new PatientSmokeStatus();
    smokeStatusList: any = [];
    constructor(private router: Router,private route: ActivatedRoute,private HISUTilService: HISUtilService,
                private confirmationDialogService: ConformationDialogService,private  requestService: RequestsService,
                private notificationService :NotificationService) {
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.loadRecord();
    }

    loadRecord(){
        this.requestService.getRequest(
            AppConstants.PATIENT_FETCH_URL + this.id
        ).subscribe(
            response => {
                if (response['responseCode'] === 'USER_SUC_01') {
                    this.patient = response['responseData'];
                    this.smokeStatusList = response['responseData'].smokingStatus;
                    let savedRace = response['responseData'].races;
                    this.patient.races = new Patient().races;
                    this.patient.races.forEach(function (race) {
                        savedRace.forEach(function (dbRaces:Race) {
                            if(race.nameRace === dbRaces.nameRace){
                                race.selected = true;
                            }
                        })
                    });
                } else {
                    this.notificationService.error(response['responseMessage'], 'Patient');
                }
            },
            (error: any) => {
                this.HISUTilService.tokenExpired(error.error.error);
            });

        this.requestService.getRequest(AppConstants.USER_BY_ROLE + '?name=' + UserTypeEnum.DOCTOR)
            .subscribe(
                (response: Response) => {
                    if (response['responseStatus'] === 'SUCCESS') {
                        this.doctors = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                });
    }

    updatePatient(insuranceForm: NgForm, demographicForm: NgForm, patientForm: NgForm) {
        if (insuranceForm.invalid || demographicForm.invalid || patientForm.invalid) {
            if (this.patient.selectedDoctor <= 0) {
                this.notificationService.error('Please select primary doctor', 'Patient');
                document.getElementById("selectedDoctor").focus();
                return;
            } else if (this.patient.titlePrefix === "-1") {
                this.notificationService.error('Please select title', 'Patient');
                document.getElementById("titlePrefix").focus();
                return;
            } else if (this.patient.cellPhone.length <= 0) {
                this.notificationService.error('Please provide cell phone number', 'Patient');
                document.getElementById("cellPhone").focus();
                return;
            } else if (this.patient.email.length <= 0) {
                this.notificationService.error('Please provide email', 'Patient');
                document.getElementById("email").focus();
                return;
            } else if (this.patient.userName.length <= 0) {
                this.notificationService.error('Please provide user name', 'Patient');
                document.getElementById("userName").focus();
                return;
            }
            /*else if (this.patient.dob.length<=0) {
             this.notificationService.error('Please provide user name', 'Patient');
             // document.getElementById("dob").style.color = "red";
             document.getElementById("dob").focus();
             return;
             }*/
            this.notificationService.error('Please provide required Values', 'Patient');
            return;
        } else {
            if (localStorage.getItem(btoa('access_token'))) {
                this.patient.smokingStatus = null;
                this.requestService.putRequest(
                    AppConstants.PATIENT_UPDATE_URL,
                    this.patient
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PATIENT_SUC_08') {
                            this.patient = new Patient();
                            this.notificationService.success(response['responseMessage'], 'Patient');
                            this.router.navigate(['/dashboard/patient/demographic/', this.id]);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Patient');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error("Error", 'Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
            } else {
                this.router.navigate(['/login']);
            }
        }
    }

    addUpdateSmokeStatus(smokeStatusId: Number){
        this.smokeStatus.patientId = this.id;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestService.postRequest(
                AppConstants.SMOKE_STATUS_URL,
                this.smokeStatus
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SMOKE_STATUS_SUC_04') {
                        this.patient = new Patient();
                        this.notificationService.success(response['responseMessage'], 'Smoke Status');
                        this.router.navigate(['/dashboard/patient/demographic/', this.id]);
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Smoke Status');
                    }
                },
                (error: any) => {
                    this.notificationService.error("Error", 'Smoke Status');
                    this.HISUTilService.tokenExpired(error.error.error);
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }

    deleteSmokeStatus(smokingId: any){
        var that = this;
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(res => {
                if (res == true) {
                    this.requestService.deleteRequest(
                        AppConstants.SMOKE_STATUS_DEL_URL+smokingId
                    ).subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'SMOKE_STATUS_SUC_06') {
                                this.patient = new Patient();
                                this.notificationService.success(response['responseMessage'], 'Smoke Status');
                                this.router.navigate(['/dashboard/patient/demographic/', this.id]);
                            } else {
                                this.notificationService.error(response['responseMessage'], 'Smoke Status');
                            }
                        },
                        (error: any) => {
                            this.notificationService.error("Error", 'Smoke Status');
                            this.HISUTilService.tokenExpired(error.error.error);
                        }
                    );
                }
            });

    }

    uploadImgOnChange(event: any) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.file = fileList[0];
        }
    }

    uploadProfileImg() {
        if (this.file.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_IMAGE_URL + this.patient.id
                , this.file,)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.file = null;
                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }

    uploadFrontImg() {
        if (this.file.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_FRONT_IMAGE_URL + this.patient.id, this.file)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.file = null;
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Update Patient');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }

    uploadBackImg() {
        if (this.file.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_BACK_IMAGE_URL + this.patient.id, this.file)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.file = null;
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Update Patient');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }

    goToUserDashBoard(){
        this.router.navigate(['/dashboard/'+atob(localStorage.getItem(btoa('user_type')))+'/']);
    }
}