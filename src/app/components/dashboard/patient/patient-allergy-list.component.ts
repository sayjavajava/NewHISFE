import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HISUtilService} from "../../../services/his-util.service";
import {RequestsService} from "../../../services/requests.service";
import {NotificationService} from "../../../services/notification.service";
import {Appointment} from "../../../model/Appointment";
import {AppConstants} from "../../../utils/app.constants";
import {PatientAllergyModel} from "../../../model/patient.allergy.model";


@Component({
    selector: 'patient-alergy-list',
    templateUrl: '../../../templates/dashboard/patient/patient-allergy-list.template.html',
})
export class PatientAllergyListComponent implements OnInit {


    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    allergyData: PatientAllergyModel[] = [];
    pam: PatientAllergyModel = new PatientAllergyModel();//Patient Allergy model, it mean wrapper

    appointments: Appointment [] = [];
    isUpdate: boolean = false;
    private patient: any;
    futureAppointments: Appointment [] = [];
    pastAppointments: Appointment [] = [];
    @ViewChild('closeBtnAllergy') closeBtnAllergy: ElementRef;


    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {

        this.getPaginatedAllergyFromServer(0);
    }

    ngOnInit(): void {
    }

    appointmentsByServer() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.activatedRoute.params.subscribe(
                params => {
                    let selectedPatientId = 1;
                    /*Number(params['id']);*/
                    this.requestsService.getRequest(
                        AppConstants.PATIENT_FETCH_URL + selectedPatientId
                    ).subscribe(
                        response => {
                            if (response['responseCode'] === 'USER_SUC_01') {
                                this.patient = response['responseData'];
                                this.futureAppointments = [];
                                this.futureAppointments = response['responseData'].futureAppointments;
                                this.pastAppointments = [];
                                this.pastAppointments = response['responseData'].pastAppointments;
                            } else {
                                this.notificationService.error(response['responseMessage'], 'Patient');
                            }
                        },
                        (error: any) => {
                            this.HISUtilService.tokenExpired(error.error.error);
                        });
                });
        } else {
            this.router.navigate(['/login']);
        }
    }

    getPaginatedAllergyFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.PATIENT_ALLERGY_PAGINATED_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ALLERGY_SUC_18') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.allergyData = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    addAllergy() {
        this.isUpdate = false;
        this.pam = new PatientAllergyModel();
        this.appointmentsByServer();
    }

    saveAllergy() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.pam.patientId = 1;
            this.requestsService.postRequest(
                AppConstants.PATIENT_ALLERGY_SAVE_URL, this.pam)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ALLERGY_SUC_17') {
                            this.notificationService.success(response['responseMessage'], 'Allergy of Patient');
                            this.getPaginatedAllergyFromServer(0);
                            //this.closeBtnAllergy.nativeElement.click();
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Allergy of Patient');
                            // this.getPaginatedProblemsFromServer(0);
                        }
                    },
                    (error: any) => {
                        if (error.error.responseMessage === "Patient not found" ||
                            error.error.responseMessage === "Appoint not found") {
                            this.notificationService.error(error.error.responseMessage, 'Allergy of Patient');
                        } else {
                            this.HISUtilService.tokenExpired(error.error.error);
                        }
                    }
                );
        }
    }

    editAllergy() {

    }

    updateAllergy() {

    }


    deleteAllergy(allergyId: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are Your Source You Want To Delete")) return;
            this.requestsService.deleteRequest(
                AppConstants.PATIENT_ALLERGY_DELETE_URI + allergyId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ALLERGY_SUC_22') {
                            this.notificationService.success(response['responseMessage'], 'Allergy of Patient');
                            this.getPaginatedAllergyFromServer(0);
                        } else {
                            this.getPaginatedAllergyFromServer(0);
                            this.notificationService.error(response['responseMessage'], 'Allergy of Patient');
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

}