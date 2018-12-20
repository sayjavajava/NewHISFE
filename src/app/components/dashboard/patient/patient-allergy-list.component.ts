import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HISUtilService} from '../../../services/his-util.service';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {Appointment} from '../../../model/Appointment';
import {AppConstants} from '../../../utils/app.constants';
import {PatientAllergyModel} from '../../../model/patient.allergy.model';
import {Subscription} from 'rxjs/Subscription';
import {DataService} from '../../../services/DataService';
import {Patient} from '../../../model/patient';


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
    patient: Patient = new Patient();
    /*futureAppointments: Appointment [] = [];
    pastAppointments: Appointment [] = [];*/
    @ViewChild('closeBtnAllergy') closeBtnAllergy: ElementRef;
    private selectedPatientId: number;
    subscription: Subscription;
    allergyType :any;
    statusType:any;
    cols: any[];
    constructor(private notificationService: NotificationService,private route:ActivatedRoute,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private dataService: DataService) {

        this.route.params.subscribe(params => {
            this.selectedPatientId = params['id'];

        });
        this.getPaginatedAllergyFromServer(0);
        this.appointmentsByPatientFromServer(this.selectedPatientId);
    }

    ngOnInit(): void {
        this.allergyType = [
            {label: 'specificdrug',value:'specificdrug'},
            {label: 'drugclass',value:'drugclass'},
            {label: 'nondrug',value:'nondrug'},
            {label: 'No Known Drug Allergies (NKDA)',value:'nkda'},

        ];
        this.statusType = [
            {label: 'ACTIVE',value:'ACTIVE'},
            {label: 'IN-ACTIVE',value:'IN-ACTIVE'},
            {label: 'RESOLVED',value:'RESOLVED'}

        ];


        this.cols = [
            { field: 'name', header: 'Allergy' },
            { field: 'reaction', header: 'Reaction' },
            { field: 'status', header: 'Status' },
            { field: 'note', header: 'Notes' },
            { field: 'updatedOn', header: 'Updated On' },
            { field: 'origin', header: 'Action' }
        ];
    }

    getPaginatedAllergyFromServer(p: number) {
        this.requestsService.getRequest(
            AppConstants.ALLERGY_PAGINATED_URL + p + '?patientId=' + this.selectedPatientId)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ALLERGY_SUC_18') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.allergyData = response['responseData']['data'];
                    } else {
                        this.notificationService.error(response['responseMessage'])
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
                      /*  this.futureAppointments = [];
                        this.futureAppointments = response['responseData'].futureAppointments;
                        this.pastAppointments = [];
                        this.pastAppointments = response['responseData'].pastAppointments;*/
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

        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select proper patient from dashboard again');
            return;
        }

        /*if (this.pam.appointmentId <= 0) {
            this.notificationService.warn('Please select proper appoint ');
            document.getElementById('appointmentId').focus();
            return;
        }*/

        if (this.pam.allergyType === '-1') {
            this.notificationService.warn('Please select type of allergy.');
            document.getElementById('typeId').focus();
            return;
        }

        if (this.pam.name === '') {
            this.notificationService.warn('Please enter name of allergy.');
            document.getElementById('nameId').focus();
            return;
        }


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
                        if (error.error.responseMessage === 'Patient not found' ||
                            error.error.responseMessage === 'Appoint not found') {
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

        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select proper patient from dashboard again');
            return;
        }

        if (this.pam.appointmentId <= 0) {
            this.notificationService.warn('Please select proper appoint ');
            document.getElementById('appointmentId').focus();
            return;
        }

        if (this.pam.allergyType === '-1') {
            this.notificationService.warn('Please select type of allergy.');
            document.getElementById('typeId').focus();
            return;
        }

        if (this.pam.name === '') {
            this.notificationService.warn('Please enter name of allergy.');
            document.getElementById('nameId').focus();
            return;
        }

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
            if (!confirm('Are Your Source You Want To Delete')) return;
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