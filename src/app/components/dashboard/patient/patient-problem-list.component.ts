import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {PatientProblemModel} from '../../../model/patient.problem.model';
import {ICDCodeModel} from '../../../model/ICDCodeModel';
import {ICDVersionModel} from '../../../model/ICDVersionModel';
import {AppConstants} from '../../../utils/app.constants';
import {Appointment} from '../../../model/Appointment';
import {Patient} from '../../../model/patient';
import {Subscription} from 'rxjs/Subscription';
import {DataService} from '../../../services/DataService';
import {DatePicker} from "angular2-datetimepicker";
import {SelectItem} from "primeng/api";
import {VitalSetupModel} from "../../../model/VitalSetupModel";


@Component({
    selector: 'patient-problem-list',
    templateUrl: '../../../templates/dashboard/patient/patient-problem-list.template.html',
})
export class PatientProblemListComponent implements OnInit {
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    problemData: any[] = [];
    ppm: PatientProblemModel = new PatientProblemModel();
    iCDVersions: ICDVersionModel [];
    associatedCodes: ICDCodeModel [];
    appointments: Appointment [] = [];
    isUpdate: boolean = false;
    patient: Patient = new Patient();
    futureAppointments: Appointment [] = [];
    pastAppointments: Appointment [] = [];
    private selectedPatientId: number;
    subscription: Subscription;
    statusType:any;
    private isRequestUnderProcess: boolean = false;
    cols: any[];
    problemList:any;
    date: Date = new Date();
    selectedCodeId : SelectItem[] = [];


    constructor(private notificationService: NotificationService,private route:ActivatedRoute,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private dataService: DataService) {


        this.route.params.subscribe(params => {
            this.selectedPatientId = params['id'];
        });
        this.appointmentsByServer();
        DatePicker.prototype.ngOnInit = function() {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }
            this.settings.timePicker =true;
            this.date = new Date();
        };
    }

    ngOnInit() {
        document.title = 'HIS | Problem list';
        this.getPaginatedProblemsFromServer(0);
        this.statusType = [
            {label: 'ACTIVE',value:'ACTIVE'},
            {label: 'IN-ACTIVE',value:'IN-ACTIVE'},
        ];


        this.cols = [
            { field: 'versionName', header: 'Version' },
            { field: 'codeName', header: 'Code' },
            { field: 'problemName', header: 'Name' },
            { field: 'dateDiagnosis', header: 'Diagnosis Date' },
            { field: 'note', header: 'Notes' },
            { field: 'status', header: 'Status' },
            { field: 'action', header: 'Action' }
        ];


       /* this.problemList = [
            {label: 'Fever ', value: '0 '},
            {label: 'General ', value: '1 '},
            {label: 'BackBone ', value: '2 '}
        ];*/
    }

    appointmentsByServer() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                AppConstants.PATIENT_FETCH_URL + this.selectedPatientId
            ).subscribe(
                response => {
                    if (response['responseCode'] === 'USER_SUC_01') {
                        this.patient = response['responseData'];
                        this.futureAppointments = [];
                        this.futureAppointments = response['responseData'].futureAppointments;
                        this.pastAppointments = [];
                        this.pastAppointments = response['responseData'].pastAppointments;
                        console.log(this.pastAppointments);
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

    appointmentsByPatientServer(selectedPatientId: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                AppConstants.PATIENT_FETCH_URL + selectedPatientId
            ).subscribe(
                response => {
                    if (response['responseCode'] === 'USER_SUC_01') {
                        this.patient = response['responseData'];
                        this.futureAppointments = response['responseData'].futureAppointments;
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

    versionsByServer() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                AppConstants.ICD_VERSIONS)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_VERSIONS_FOUND_03') {
                            this.iCDVersions = response['responseData'];
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

    addProblemPopupClick() {
        this.isUpdate = false;
        this.ppm = new PatientProblemModel();
        this.appointmentsByServer();
        this.versionsByServer();

    }

    changedVersion(associatedICDCVId: any) {
        this.ppm.selectedCodeId = -1;
        this.codesByVersionFromServer(associatedICDCVId);
    }

    private codesByVersionFromServer(associatedICDCVId: any) {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                AppConstants.ICD_CODES_ASSOCIATED_BY_VERSION_ID + associatedICDCVId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_ASSOCIATED_FOUND_SUC_02') {
                            this.associatedCodes = [];

                            this.associatedCodes = response['responseData'].code;
                            debugger;
                            for(var i=0; i<this.associatedCodes.length;i++){
                                var problems=this.associatedCodes[i];
                                var pair={label:problems.problem,value:problems.id}
                                this.selectedCodeId.push(pair);
                            }

                            console.log(this.associatedCodes);

                            debugger;
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        }
    }



    savePatientProblem() {

        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }

        if (this.ppm.appointmentId <= 0) {
            this.notificationService.warn('Please select appoint.');
          //  document.getElementById('selectedAppointmentId').focus();
            return;
        }

        if (this.ppm.selectedICDVersionId <= 0) {
            this.notificationService.warn('Please select Version.');
         //   document.getElementById('icdVersionId').focus();
            return;
        }

        if (this.ppm.selectedCodeId <= 0) {
            this.notificationService.warn('Please select Code.');
        //   document.getElementById('associatedCodesId').focus();
            return;
        }

        if (this.ppm.datePrescribedDate === null) {
            this.notificationService.warn('Please enter Diagnosis Date.');
        //    document.getElementById('dateDiagnosisId').focus();
            return;
        }
        this.ppm.datePrescribedDate=new Date(this.ppm.datePrescribedDate);
        console.log(this.ppm);
        if (!this.isRequestUnderProcess) {
            this.isRequestUnderProcess = true;

            if (localStorage.getItem(btoa('access_token'))) {
                this.ppm.patientId = this.selectedPatientId;
                this.requestsService.postRequest(
                    AppConstants.PATIENT_PROBLEM_SAVE_URL, this.ppm)
                    .subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_14') {

                                this.notificationService.success(response['responseMessage'], 'Problem of Patient');
                                this.getPaginatedProblemsFromServer(0);
                                this.closeBtn.nativeElement.click();
                            } else {
                                this.notificationService.error(response['responseMessage'], 'Problem of Patient');
                                this.getPaginatedProblemsFromServer(0);
                            }
                            this.isRequestUnderProcess = false;
                        },
                        (error: any) => {
                            this.HISUtilService.tokenExpired(error.error.error);
                            this.isRequestUnderProcess = false;
                        }
                    );
            }

        } else {
            this.notificationService.warn('Your first request is under process,Please wait...');
            return;
        }

    }

    getPaginatedProblemsFromServer(page: number) {
        this.requestsService.getRequest(
            AppConstants.PATIENT_PROBLEM_FETCH_URL + page + '?patientId=' + this.selectedPatientId)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_16') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.problemData = response['responseData']['data'];

                        console.log(this.problemData);
                    } else {
                        this.notificationService.error(response['responseMessage'])
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }


    deletePatientProblem(problemId: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.PATIENT_PROBLEM_DELETE_URI + problemId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PATIENT_SUC_06') {
                            this.notificationService.success(response['responseMessage'], 'Problem of Patient');
                            this.getPaginatedProblemsFromServer(0);
                        } else {
                            this.getPaginatedProblemsFromServer(0);
                            this.notificationService.error(response['responseMessage'], 'Problem of Patient');
                        }
                    },
                    (error: any) => {
                        //console.log(error.json())
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }

    editPatientProblem(problemId: number) {
        this.isUpdate = true;
        if (problemId > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(AppConstants.PATIENT_PROBLEM_GET_URL + 'problemId=' + problemId)
                    .subscribe(
                        response => {
                            if (response['responseCode'] === 'USER_SUC_01') {
                                this.ppm = response['responseData'];
                                this.appointmentsByPatientServer(this.ppm.patientId);
                                this.versionsByServer();
                                debugger;
                                this.codesByVersionFromServer(this.ppm.selectedICDVersionId);
                                this.ppm.datePrescribedDate=new Date(this.ppm.dateDiagnosis);
                               // this.selectedCodeId=this.ppm.codeName;
                                debugger;
                            } else {
                                this.notificationService.error(response['responseMessage'], 'Problem of Patient');
                            }
                        },
                        (error: any) => {
                            this.HISUtilService.tokenExpired(error.error.error);
                        });
            } else {
                this.router.navigate(['/login']);
            }
        } else {
            this.notificationService.error('Please select proper problem', 'Problem of Patient');
        }
    }

    @ViewChild('closeBtn') closeBtn: ElementRef;

    updatePatientProblem() {

        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }

        if (this.ppm.appointmentId <= 0) {
            this.notificationService.warn('Please select appoint.');
        //    document.getElementById('selectedAppointmentId').focus();
            return;
        }

        if (this.ppm.selectedICDVersionId <= 0) {
            this.notificationService.warn('Please select Version.');
       //     document.getElementById('icdVersionId').focus();
            return;
        }

        if (this.ppm.selectedCodeId <= 0) {
            this.notificationService.warn('Please select Code.');
        //    document.getElementById('associatedCodesId').focus();
            return;
        }

        if (this.ppm.datePrescribedDate === null) {
            this.notificationService.warn('Please enter Diagnosis Date.');
      //      document.getElementById('dateDiagnosisId').focus();
            return;
        }
        this.ppm.datePrescribedDate=new Date(this.ppm.datePrescribedDate);
        if (!this.isRequestUnderProcess) {
            this.isRequestUnderProcess = true;
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(AppConstants.PATIENT_PROBLEM_UPDATE_URL, this.ppm)
                    .subscribe(
                        response => {
                            if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_14') {
                                this.ppm = new PatientProblemModel();
                                this.notificationService.success(response['responseMessage'], 'Problem of Patient');
                                this.closeBtn.nativeElement.click();
                                this.getPaginatedProblemsFromServer(0);
                            } else {
                                this.notificationService.error(response['responseMessage'], 'Problem of Patient');
                                this.getPaginatedProblemsFromServer(0);
                            }
                            this.isRequestUnderProcess = false;
                        },
                        (error: any) => {
                            this.HISUtilService.tokenExpired(error.error.error);
                            this.isRequestUnderProcess = false;
                        });
            } else {
                this.router.navigate(['/login']);
            }


        } else {
            this.notificationService.warn('Your first request is under process,Please wait...');
            return;
        }

    }

    getPageWisePatientProblem(page: number) {
        this.getPaginatedProblemsFromServer(page);
    }

    openUrl(val :string){

        let url: string = '';
        if (!/^http[s]?:\/\//.test(val)) {
            url += 'http://';
        }

        url += val;
        window.open(url, '_blank');
        //   window.open("https://www.google.com", "_blank");
    }

}