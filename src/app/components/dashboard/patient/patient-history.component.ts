import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {RequestsService} from "../../../services/requests.service";
import {NotificationService} from "../../../services/notification.service";
import {PatientProblemModel} from "../../../model/patient.problem.model";
import {PatientAllergyModel} from "../../../model/patient.allergy.model";
import {MedicationModel} from "../../../model/medication.model";
import {DataService} from "../../../services/DataService";
import {Subscription} from "rxjs/Subscription";


@Component({
    selector: 'patient-history',
    templateUrl: '../../../templates/dashboard/patient/patient-history.template.html',
})
export class PatientHistoryComponent implements OnInit,OnDestroy {

    problemPages: number[] = [];
    problemNextPage: any;
    problemPrePage: any;
    problemCurrPage: any;
    problemActiveData: PatientProblemModel[] = [];

    allergiesPages: number[] = [];
    allergiesNextPage: any;
    allergiesPrePage: any;
    allergiesCurrPage: any;
    allergiesActiveData: PatientAllergyModel[] = [];

    medicationsPages: number[] = [];
    medicationsNextPage: any;
    medicationsPrePage: any;
    medicationsCurrPage: any;
    medicationsActiveData: MedicationModel[] = [];

    selectedPatientId: any;
    subscription: Subscription;

    constructor(private requestsService: RequestsService,
                private router: Router,
                private route: ActivatedRoute,
                private HISUTilService: HISUtilService,
                private notificationService: NotificationService,
                private dataService: DataService) {


        this.subscription = this.dataService.currentPatientId.subscribe(id => {
            this.selectedPatientId = id;
        });

        this.getPaginatedProblemsByActiveAndPatientIdFromServer(0, 5, 'ACTIVE');
        this.getPaginatedAllergiesByActiveAndPatientIdFromServer(0, 5, 'ACTIVE');
        this.getPaginatedMedicationsByActiveAndPatientIdFromServer(0, 5, 'ACTIVE');
    }

    ngOnInit(): void {
    }

    getPaginatedProblemsByActiveAndPatientIdFromServer(page: number, pageSize: number, problemStatus: any) {

        this.requestsService.getRequest(
            AppConstants.PATIENT_PROBLEM_FETCH_STATUS_URL + page +
            "?selectedPatientId=" + this.selectedPatientId +
            "&status=" + problemStatus +
            "&pageSize=" + pageSize)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_16') {
                        this.problemNextPage = response['responseData']['nextPage'];
                        this.problemPrePage = response['responseData']['prePage'];
                        this.problemCurrPage = response['responseData']['currPage'];
                        this.problemPages = response['responseData']['pages'];
                        this.problemActiveData = [];
                        this.problemActiveData = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                }
            );
    }

    getPageWiseProblemActive(page: number) {
        this.getPaginatedProblemsByActiveAndPatientIdFromServer(page, 5, 'ACTIVE');
    }

    getPaginatedAllergiesByActiveAndPatientIdFromServer(page: number, pageSize: number, allergyStatus: any) {

        this.requestsService.getRequest(
            AppConstants.ALLERGY_PAGINATED_STATUS_URL + page +
            "?selectedPatientId=" + this.selectedPatientId +
            "&status=" + allergyStatus +
            "&pageSize=" + pageSize)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ALLERGY_SUC_28') {
                        this.allergiesNextPage = response['responseData']['nextPage'];
                        this.allergiesPrePage = response['responseData']['prePage'];
                        this.allergiesCurrPage = response['responseData']['currPage'];
                        this.allergiesPages = response['responseData']['pages'];
                        this.allergiesActiveData = [];
                        this.allergiesActiveData = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                }
            );
    }

    getPageWiseAllergiesByActive(page: number) {
        this.getPaginatedAllergiesByActiveAndPatientIdFromServer(page, 5, 'ACTIVE');
    }

    goToUserDashBoard() {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    }

    getPaginatedMedicationsByActiveAndPatientIdFromServer(page: number, pageSize: number, medicationStatus: any) {
        this.requestsService.getRequest(
            AppConstants.MEDICATION_PAGINATED_STATUS_URL + page +
            "?selectedPatientId=" + this.selectedPatientId +
            "&status=" + medicationStatus +
            "&pageSize=" + pageSize)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'MEDICATION_SUC_36') {
                        this.medicationsNextPage = response['responseData']['nextPage'];
                        this.medicationsPrePage = response['responseData']['prePage'];
                        this.medicationsCurrPage = response['responseData']['currPage'];
                        this.medicationsPages = response['responseData']['pages'];
                        this.medicationsActiveData = [];
                        this.medicationsActiveData = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                }
            );
    }

    getPageWiseMedicationsByActive(page: number) {
        this.getPaginatedMedicationsByActiveAndPatientIdFromServer(page, 5, 'ACTIVE');
    }
    ngOnDestroy(): void {
       this.subscription.unsubscribe();
    }

    patientHistory() {
        // this.dataService.getPatientId(id);//
        var url = '/dashboard/patient/' + this.selectedPatientId + '/history';
        console.log("url" + url);
        this.router.navigate([url]);
    }

}