import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Patient} from "../../../model/patient";
import {AppConstants} from "../../../utils/app.constants";
import {UserTypeEnum} from "../../../enums/user-type-enum";
import {HISUtilService} from "../../../services/his-util.service";
import {RequestsService} from "../../../services/requests.service";
import {Race} from "../../../model/race-model";
import {NotificationService} from "../../../services/notification.service";


@Component({
    selector: 'patient-history',
    templateUrl: '../../../templates/dashboard/patient/patient-history.template.html',
})
export class PatientHistoryComponent implements OnInit {
    id:Number;
    patient: Patient;// = new Patient();
    selectedPatientId: any;
    doctors: any = [];

    constructor(private requestsService: RequestsService, private router: Router,private route:ActivatedRoute, private HISUTilService: HISUtilService, private notificationService :NotificationService) {
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
        this.requestsService.getRequest(
            AppConstants.PATIENT_FETCH_URL + this.selectedPatientId
        ).subscribe(
            response => {
                if (response['responseCode'] === 'USER_SUC_01') {
                    this.patient = response['responseData'];
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
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
    }

    goToUserDashBoard(){
        this.router.navigate(['/dashboard/'+atob(localStorage.getItem(btoa('user_type')))+'/']);
    }
}