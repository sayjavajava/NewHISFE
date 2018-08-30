import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MedicationModel} from "../../../model/medication.model";
import {Appointment} from "../../../model/Appointment";
import {NotificationService} from "../../../services/notification.service";
import {RequestsService} from "../../../services/requests.service";
import {HISUtilService} from "../../../services/his-util.service";
import {AppConstants} from "../../../utils/app.constants";


@Component({
    selector: 'patient-medical-list',
    templateUrl: '../../../templates/dashboard/patient/patient-medication-list.template.html',
})
export class PatientMedicationListComponent implements OnInit {
    id: any;

    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    medicationData: MedicationModel[] = [];
    medicationModel: MedicationModel = new MedicationModel();
    appointments: Appointment [] = [];
    isUpdate: boolean = false;
    private patient: any;
    futureAppointments: Appointment [] = [];
    pastAppointments: Appointment [] = [];
    private selectedPatientId: number;
    @ViewChild('closeBtnMedication') closeBtnMedication: ElementRef;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {

        /* const queryParams = this.activatedRoute.snapshot.queryParams
         console.log(queryParams);
         const routeParams = this.activatedRoute.snapshot.params;
         console.log(routeParams);*/
        // do something with the parameters
        // this.selectedPatientId = routeParams.id;// i think id will patient id according to current situation

        this.activatedRoute.params.subscribe(params => {
            console.log(params['id']);
            this.selectedPatientId = params['id'];
        });
        this.getPaginatedMedicationFromServer(0);
    }

    ngOnInit(): void {
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

    addMedication() {
        this.isUpdate = false;
        this.medicationModel = new MedicationModel();
        this.appointmentsByPatientFromServer(this.selectedPatientId);
    }

    saveMedication() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.medicationModel.patientId = this.selectedPatientId;
            this.requestsService.postRequest(
                AppConstants.MEDICATION_SAVE_URL, this.medicationModel)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MEDICATION_SUC_28') {
                            this.notificationService.success(response['responseMessage'], 'Medication');
                            this.getPaginatedMedicationFromServer(0);
                            // this.closeBtnMedication.nativeElement.click();
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Medication');
                            this.getPaginatedMedicationFromServer(0);
                        }
                    },
                    (error: any) => {
                        if (error.error.responseMessage === "Patient not found" ||
                            error.error.responseMessage === "Appoint not found") {
                            this.notificationService.error(error.error.responseMessage, 'Medication');
                        } else {
                            this.HISUtilService.tokenExpired(error.error.error);
                        }
                    }
                );
        }
    }

    getPaginatedMedicationFromServer(page: number) {
        this.requestsService.getRequest(
            AppConstants.MEDICATION_PAGINATED_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'MEDICATION_SUC_32') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.medicationData = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    getPageWiseMedications(p: number) {
        this.getPaginatedMedicationFromServer(p);
    }

    deleteMedication(medicationId: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are Your Source You Want To Delete")) return;
            this.requestsService.deleteRequest(
                AppConstants.MEDICATION_DELETE_URI + medicationId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MEDICATION_SUC_33') {
                            this.notificationService.success(response['responseMessage'], 'Medication');
                            this.getPaginatedMedicationFromServer(0);
                        } else {
                            this.getPaginatedMedicationFromServer(0);
                            this.notificationService.error(response['responseMessage'], 'Medication');
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

    editMedication(medicationId: number) {
        this.isUpdate = true;
        this.medicationModel = new MedicationModel();
        if (medicationId > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(AppConstants.MEDICATION_GET_URL + 'medicationId=' + medicationId)
                    .subscribe(
                        response => {
                            if (response['responseCode'] === 'MEDICATION_SUC_34') {
                                this.medicationModel = response['responseData'];
                                this.appointmentsByPatientFromServer(this.medicationModel.patientId);
                            } else {
                                this.notificationService.error(response['responseMessage'], 'Medication');
                            }
                        },
                        (error: any) => {
                            this.HISUtilService.tokenExpired(error.error.error);
                        });
            } else {
                this.router.navigate(['/login']);
            }
        } else {
            this.notificationService.error('Please select proper Medication', 'Medication');
        }
    }

    updateMedication() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.putRequest(AppConstants.MEDICATION_UPDATE_URL, this.medicationModel)
                .subscribe(
                    response => {
                        if (response['responseCode'] === 'MEDICATION_SUC_35') {
                            this.notificationService.success(response['responseMessage'], 'Medication');
                            this.getPaginatedMedicationFromServer(0);
                            this.closeBtnMedication.nativeElement.click();
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Medication');
                            this.getPaginatedMedicationFromServer(0);
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    });
        } else {
            this.router.navigate(['/login']);
        }
    }

}