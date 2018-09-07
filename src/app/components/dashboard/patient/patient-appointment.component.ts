import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {Patient} from "../../../model/patient";
import {RequestsService} from "../../../services/requests.service";
import {NotificationService} from "../../../services/notification.service";
import {HISUtilService} from "../../../services/his-util.service";


@Component({
    selector: 'patient-appointment',
    templateUrl: '../../../templates/dashboard/patient/patient-appointment.template.html',
})
export class PatientAppointmentComponent implements OnInit {
    private id:number;
    patient: Patient = new Patient();
    constructor(private router: Router,private route: ActivatedRoute,private HISUTilService: HISUtilService,private  requestService: RequestsService,private notificationService :NotificationService) {
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        console.log(this.id);
        this.loadRecord();
    }

    goToUserDashBoard(){
        this.router.navigate(['/dashboard/'+atob(localStorage.getItem(btoa('user_type')))+'/']);
    }
    loadRecord(){
        this.requestService.getRequest(
            AppConstants.PATIENT_FETCH_URL + this.id
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
                this.HISUTilService.tokenExpired(error.error.error);
            });
    }
}