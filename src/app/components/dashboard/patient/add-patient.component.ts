import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {Patient} from "../../../model/patient";
import {NotificationService} from "../../../services/notification.service";
import {NgForm} from "@angular/forms";
import {UserTypeEnum} from "../../../enums/user-type-enum";

@Component({
    selector: 'add-patient',
    templateUrl: '../../../templates/dashboard/patient/add-patient.template.html',
})
export class AddPatientComponent implements OnInit {
    patient: Patient = new Patient();
    profileImg: File = null;
    photoFront: File = null;
    photoBack: File = null;

    doctors: any = [];

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title,
                private HISUTilService: HISUtilService,
                private notificationService: NotificationService) {

        this.requestsService.getRequest(AppConstants.USER_BY_ROLE + '?name=' + UserTypeEnum.DOCTOR)
            .subscribe(
                (response: Response) => {
                    if (response['responseStatus'] === 'SUCCESS') {
                        this.doctors = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                });
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Add Patient');
    }

    uploadImgOnChange(event: any) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            if ( event.target.name === "profileImg") {
                this.profileImg = fileList[0];
            } else if (event.target.name === "photoFront") {
                this.photoFront = fileList[0];
            } else if (event.target.name === "photoBack") {
                this.photoBack = fileList[0];
            }
        }
    }

    savePatient(insuranceForm: NgForm, demographicForm: NgForm, patientForm: NgForm, contactForm: NgForm) {
        if (insuranceForm.invalid || demographicForm.invalid || patientForm.invalid || contactForm.invalid) {
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
            this.notificationService.error('Please provide required Values', 'Patient');
            return;
        } else {

            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(
                    AppConstants.PATIENT_SAVE_URL,
                    this.patient
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PATIENT_SUC_04') {
                            this.patient = new Patient();
                            this.patient.userId = response['responseData'];
                            this.uploadProfileImg();
                            this.uploadFrontImg();
                            this.uploadBackImg();
                            this.notificationService.success(response['responseMessage'], 'Patient');
                            this.router.navigate(['/dashboard/patient/manage']);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Patient');
                        }
                    },
                    (error: any) => {
                        this.notificationService.success(Response['responseMessage'], 'Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
            } else {
                this.router.navigate(['/login']);
            }
        }
    }

    uploadProfileImg() {
        if (this.profileImg.size <= 1048000) {
            this.requestsService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_IMAGE_URL + this.patient.userId
                , this.profileImg)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_SUC_02') {
                            //this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.profileImg = null;
                        }
                    },
                    (error: any) => {
                        //this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            //this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }

    uploadFrontImg() {
        if (this.photoFront.size <= 1048000) {
            this.requestsService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_FRONT_IMAGE_URL + this.patient.userId, this.photoFront)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_SUC_03') {
                           // /this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.photoFront = null;
                        } else {
                            //this.notificationService.error(response['responseMessage'], 'Update Patient');
                        }
                    },
                    (error: any) => {
                       // this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            //this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }

    uploadBackImg() {
        if (this.photoBack.size <= 1048000) {
            this.requestsService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_BACK_IMAGE_URL + this.patient.userId, this.photoBack)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_SUC_03') {
                            //this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.photoBack = null;
                        } else {
                           // this.notificationService.error(response['responseMessage'], 'Update Patient');
                        }
                    },
                    (error: any) => {
                        //this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            //this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }
}
