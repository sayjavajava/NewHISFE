import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConstants} from '../../../utils/app.constants';
import {RequestsService} from '../../../services/requests.service';
import {Patient} from '../../../model/patient';
import {NotificationService} from '../../../services/notification.service';
import {HISUtilService} from '../../../services/his-util.service';
import {Race} from '../../../model/race-model';
import {NgForm} from '@angular/forms';
import {UserTypeEnum} from '../../../enums/user-type-enum';
import {PatientSmokeStatus} from '../../../model/PatientSmokeStatus';
import {ConformationDialogService} from '../../../services/ConformationDialogService';
import {Invoice} from '../../../model/Invoice';

@Component({
    selector: 'patient-history',
    templateUrl: '../../../templates/dashboard/patient/patient-demographic.template.html',
})
export class PatientDemographicComponent implements OnInit {
    date = new Date();
    id: Number;
    patient: Patient = new Patient();
    file: File;
    profileImg: File = null;
    photoFront: File = null;
    photoBack: File = null;
    doctors: any = [];
    titleList:any = [];
    rLanguage:any =[];
    pCommunication:any=[];
    smokeStatus: PatientSmokeStatus = new PatientSmokeStatus();
    smokeStatusList: any = [];
    patientInvBal: Invoice = new Invoice();
    updateBtn :boolean =false;
    martialStatus = [
        {label: 'SINGLE', value: 'SINGLE',selected:false},
        {label: 'MARRIED', value: 'MARRIED',selected:false},
        {label: 'WIDOWED', value: 'WIDOWED',selected:false},
        {label: 'DIVORCED', value: 'DIVORCED',selected:false},
        {label: 'SEPARATED', value: 'SEPARATED',selected:false},

    ];

    constructor(private router: Router, private route: ActivatedRoute, private HISUTilService: HISUtilService,
                private confirmationDialogService: ConformationDialogService, private  requestService: RequestsService,
                private notificationService: NotificationService) {

    }

    ngOnInit(): void {
        //throw new Error("Method not implemented.");
        this.route.params.subscribe(params => {
            this.id = params['id'];
            if (this.id <= 0) {
                this.notificationService.warn('Please select patient from dashboard again ');
                return;
            }
            this.loadRecord();
            this.titleList = [
                {label: 'Mr', value: 'Mr'},
                {label: 'Mrs', value: 'Mrs'},
                {label: 'Ms', value: 'Ms'},
                {label: 'Dr', value: 'dr'},
            ];
            this.rLanguage = [
                {label: 'ENGLISH', value: 'ENGLISH'},
                {label: 'URDU', value: 'URDU'},
                {label: 'ARABIC', value: 'ARABIC'},
                {label: 'CHINESE', value: 'CHINESE'},
            ];
            this.pCommunication =[
                {label: 'ENGLISH', value: 'ENGLISH'},
                {label: 'URDU', value: 'URDU'},
                {label: 'ARABIC', value: 'ARABIC'},
                {label: 'CHINESE', value: 'CHINESE'},
            ];
        });
       /* <option value="SINGLE">Single</option>
            <option value="MARRIED">Married</option>
            <option value="WIDOWED">Widowed</option>
            <option value="DIVORCED">Divorced</option>
            <option value="SEPERATED">Seperated</option>*/
    }

    isValidPatientId() {
        if (this.id <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
    }

    loadRecord() {
        if (this.id <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
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
                            if(race.value === dbRaces.nameRace){
                    //        if(race.nameRace === dbRaces.nameRace){
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
        this.requestService.getRequest(AppConstants.PATIENT_ALLINVOICE_BALANCE + this.id).subscribe(
            (response: Response) => {
                if (response['responseStatus'] === 'SUCCESS') {
                    this.patientInvBal = response['responseData'];
                    console.log('Patient Invoices Bal:' + this.patientInvBal.advanceBalance);
                }

            }
        );
    }

    updatePatient(insuranceForm: NgForm, demographicForm: NgForm, patientForm: NgForm) {
        if (insuranceForm.invalid || demographicForm.invalid || patientForm.invalid) {
            if (this.patient.selectedDoctor <= 0) {
                this.notificationService.error('Please select primary doctor', 'Patient');
                document.getElementById('selectedDoctor').focus();
                return;
            } else if (this.patient.titlePrefix === '-1') {
                this.notificationService.error('Please select title', 'Patient');
                document.getElementById('titlePrefix').focus();
                return;
            } else if (this.patient.cellPhone.length <= 0) {
                this.notificationService.error('Please provide cell phone number', 'Patient');
                document.getElementById('cellPhone').focus();
                return;
            } else if (this.patient.email.length <= 0) {
                this.notificationService.error('Please provide email', 'Patient');
                document.getElementById('email').focus();
                return;
            } else if (this.patient.userName.length <= 0) {
                this.notificationService.error('Please provide user name', 'Patient');
                document.getElementById('userName').focus();
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
                this.requestService.postRequestMultipartFormAndData(
                    AppConstants.PATIENT_UPDATE_URL,
                    this.patient, this.profileImg,this.photoFront,this.photoBack
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PATIENT_SUC_08') {
                            this.patient = new Patient();
                            this.notificationService.success(response['responseMessage'], 'Patient');
                            this.loadRecord();
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Patient');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Error', 'Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
            } else {
                this.router.navigate(['/login']);
            }
        }
    }

    addSmokingStatusPopup() {
        this.smokeStatus = new PatientSmokeStatus();
    }


    updateBtnShow(flag: boolean) {
        this.updateBtn = flag;
    }

    addUpdateSmokeStatus(smokeStatusId: Number) {
        //console.log("Event Data Id:"+event.data.id);

        if (this.id <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }

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
                        this.loadRecord();
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Smoke Status');
                    }
                },
                (error: any) => {
                    this.notificationService.error('Error', 'Smoke Status');
                    this.HISUTilService.tokenExpired(error.error.error);
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }

    deleteSmokeStatus(smokingId: any) {
        if (this.id <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
        var that = this;
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(res => {
                if (res == true) {
                    this.requestService.deleteRequest(
                        AppConstants.SMOKE_STATUS_DEL_URL + smokingId
                    ).subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'SMOKE_STATUS_SUC_06') {
                                this.patient = new Patient();
                                this.notificationService.success(response['responseMessage'], 'Smoke Status');
                                //this.router.navigate(['/dashboard/patient/demographic/', that.id]);
                                this.loadRecord();
                            } else {
                                this.notificationService.error(response['responseMessage'], 'Smoke Status');
                            }
                        },
                        (error: any) => {
                            this.notificationService.error('Error', 'Smoke Status');
                            this.HISUTilService.tokenExpired(error.error.error);
                        }
                    );
                }
            });

    }

    uploadImgOnChange(event: any) {
        /*let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.file = fileList[0];
        }*/
        let fileList: FileList = event.target.files;

        if (fileList != null && fileList.length > 0) {
            if (event.target.name === "profileImgURL") {
                this.profileImg = fileList[0];
            } else if (event.target.name === "photoFrontURL") {
                this.photoFront = fileList[0];
            } else if (event.target.name === "photoBackURL") {
                this.photoBack = fileList[0];
            }
        }
    }

    uploadProfileImg() {
        if (this.profileImg && this.profileImg.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_IMAGE_URL + this.patient.id
                , this.profileImg)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.profileImg = null;
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
        if (this.photoFront && this.photoFront.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_FRONT_IMAGE_URL + this.patient.id, this.photoFront)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.photoFront = null;
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Update Patient');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Patient insurance front photo uploading failed', 'Update Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }

    uploadBackImg() {
        if (this.photoBack && this.photoBack.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_BACK_IMAGE_URL + this.patient.id, this.photoBack)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.photoBack = null;
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Update Patient');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Patient insurance back photo uploading failed', 'Update Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }

    goToUserDashBoard() {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    }
}