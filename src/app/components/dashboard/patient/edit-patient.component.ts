import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {Patient} from "../../../model/patient";
import {NotificationService} from "../../../services/notification.service";
import {NgForm} from "@angular/forms";
import {UserTypeEnum} from "../../../enums/user-type-enum";

@Component({
    selector: 'add-patient',
    templateUrl: '../../../templates/dashboard/patient/edit-patient.template.html',
})
export class EditPatientComponent implements OnInit {
    patient: Patient = new Patient();
    selectedPatientId:any;
    doctors: any = [];

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title,
                private HISUTilService: HISUtilService,
                private notificationService: NotificationService,
                private activatedRoute: ActivatedRoute) {

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

        this.activatedRoute.params.subscribe(
            params => {
                this.selectedPatientId = Number(params['id']);
                this.requestsService.getRequest(
                    AppConstants.PATIENT_FETCH_URL + this.selectedPatientId
                ).subscribe(
                    response => {
                        if (response['responseCode'] === 'USER_SUC_01') {
                            this.patient = response['responseData'];
                            this.patient.races = JSON.parse(response['responseData'].racesString);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Patient');
                            // this.router.navigate(['404-not-found'])
                        }
                    },
                    (error: any) => {
                        this.HISUTilService.tokenExpired(error.error.error);
                    });
            });
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Update Patient');
    }

    updatePatient(insuranceForm: NgForm, demographicForm: NgForm, patientForm: NgForm, contactForm: NgForm) {
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
            } /*else if (this.patient.dob.length<=0) {
                this.notificationService.error('Please provide user name', 'Patient');
                // document.getElementById("dob").style.color = "red";
                document.getElementById("dob").focus();
                return;
            }*/
            this.notificationService.error('Please provide required Values', 'Patient');
            return;
        } else {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(
                    AppConstants.PATIENT_UPDATE_URL,
                    this.patient
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PATIENT_SUC_08') {
                            this.patient = new Patient();
                            this.notificationService.success(response['responseMessage'], 'Patient');
                            this.router.navigate(['/dashboard/patient/manage']);
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
}
