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
    templateUrl: '../../../templates/dashboard/patient/add-patient.html',
})
export class AddPatientComponent implements OnInit {
    patient: Patient = new Patient();

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

        /*this.requestsService.getRequest(AppConstants.RACE_FETCH_URL)
            .subscribe(
                (response:Response) =>{
                    if (response['responseStatus'] === 'SUCCESS'){
                        this.patient.races = response['responseData'];
                    }
                },
                (error:any) =>{
                    this.HISUTilService.tokenExpired(error.error.error);
                }
            );*/
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Add Patient');
    }

    savePatient(form: NgForm) {
        if (!form.valid ||
            this.patient.titlePrefix === "-1" ||
            this.patient.selectedDoctor <= 0 ||
            this.patient.firstName.length <= 0 ||
            this.patient.cellPhone.length <= 0 ||
            this.patient.userName.length <= 0 ||
            this.patient.email.length <= 0) {
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
                            this.notificationService.success(response['responseMessage'], 'Patient');
                            this.router.navigate(['/dashboard/patient/manage']);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Patient')
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
}
