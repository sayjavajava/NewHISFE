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
    private selectedPatientId: number;


    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {

        const queryParams = this.activatedRoute.snapshot.queryParams
        console.log(queryParams);
        const routeParams = this.activatedRoute.snapshot.params;
        console.log(routeParams);
        // do something with the parameters
        this.selectedPatientId = routeParams.id;// i think id will patient id according to current situation

        this.getPaginatedAllergyFromServer(0);
    }

    ngOnInit(): void {
    }

    getPaginatedAllergyFromServer(p: number) {
        this.requestsService.getRequest(
            AppConstants.ALLERGY_PAGINATED_URL + p)
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

    getPageWiseAllergies(p: number) {
        this.getPaginatedAllergyFromServer(p);
    }

    appointmentsByPatientFromServer(selectedPatientId: number) {
        if (localStorage.getItem(btoa('access_token'))) {
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

        } else {
            this.router.navigate(['/login']);
        }
    }

    addAllergy() {
        this.isUpdate = false;
        this.pam = new PatientAllergyModel();
        this.appointmentsByPatientFromServer(this.selectedPatientId);
    }

    saveAllergy() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.pam.patientId = this.selectedPatientId;
            this.requestsService.postRequest(
                AppConstants.ALLERGY_SAVE_URL, this.pam)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ALLERGY_SUC_17') {
                            this.notificationService.success(response['responseMessage'], 'Allergy of Patient');
                            this.getPaginatedAllergyFromServer(0);
                            this.closeBtnAllergy.nativeElement.click();
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Allergy of Patient');
                            this.getPaginatedAllergyFromServer(0);
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

    editAllergy(allergyId: number) {
        this.isUpdate = true;
        this.pam = new PatientAllergyModel();
        if (allergyId > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(AppConstants.ALLERGY_GET_URL + 'allergyId=' + allergyId)
                    .subscribe(
                        response => {
                            if (response['responseCode'] === 'ALLERGY_SUC_24') {
                                this.pam = response['responseData'];
                                this.appointmentsByPatientFromServer(this.pam.patientId);
                            } else {
                                this.notificationService.error(response['responseMessage'], 'Allergy of Patient');
                            }
                        },
                        (error: any) => {
                            this.HISUtilService.tokenExpired(error.error.error);
                        });
            } else {
                this.router.navigate(['/login']);
            }
        } else {
            this.notificationService.error('Please select proper Allergy', 'Allergy of Patient');
        }
    }

    updateAllergy() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.putRequest(AppConstants.ALLERGY_UPDATE_URL, this.pam)
                .subscribe(
                    response => {
                        if (response['responseCode'] === 'ALLERGY_SUC_20') {
                            this.notificationService.success(response['responseMessage'], 'Allergy of Patient');
                            this.getPaginatedAllergyFromServer(0);
                            this.closeBtnAllergy.nativeElement.click();
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Allergy of Patient');
                            this.getPaginatedAllergyFromServer(0);
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    });
        } else {
            this.router.navigate(['/login']);
        }
    }


    deleteAllergy(allergyId: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are Your Source You Want To Delete")) return;
            this.requestsService.deleteRequest(
                AppConstants.ALLERGY_DELETE_URI + allergyId)
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