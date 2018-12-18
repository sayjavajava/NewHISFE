import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MedicationModel} from '../../../model/medication.model';
import {Appointment} from '../../../model/Appointment';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {DataService} from '../../../services/DataService';
import {Subscription} from 'rxjs/Subscription';
import {NgForm} from '@angular/forms';
import {Patient} from '../../../model/patient';
import any = jasmine.any;
import {DrugModel} from '../../../model/drug.model';
import {DatePicker} from "angular2-datetimepicker";
import { DatePipe } from '@angular/common'
import {SelectItem} from "primeng/api";
import {StrengthModel} from "../../../model/StrengthModel";


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
    patient: Patient = new Patient();
    futureAppointments: Appointment [] = [];
    pastAppointments: Appointment [] = [];
    private selectedPatientId: number;
    @ViewChild('closeBtnMedication') closeBtnMedication: ElementRef;
    private subscription: Subscription;
    text: any = '';
    drugs: DrugModel[] = [];
    searchedDrugNames: any[] = [];
    strengthLst:any;
    statusType:any;
    orderStatusList:any;
    date: Date = new Date();
    dateStarted: Date = new Date();
    dateEnded: Date = new Date();
    durationList :any;
    DateStr : string;
    drug: DrugModel = new DrugModel();
    routeDrug:string;
    searchedDrugNamesLst:any =[];
    searchedDrugStrengths: DrugModel = new DrugModel();
    DrugStrengths: any[];
    cols:any=[];
    selectedstrength: StrengthModel[];
    StrengthListModified: SelectItem[] = [];
    isUpdateAppoint: boolean = false;
  //  strengthsListModified
    // new Scheme
    searchedDrugStrengthsAny: any[];
    searchedDrugStrengthsAnyListModified: SelectItem[] = [];
    selectedstr: SelectItem[] = [];
    constructor(private notificationService: NotificationService,private route:ActivatedRoute,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private dataService: DataService,public datepipe: DatePipe) {

       /* this.subscription = this.dataService.currentPatientId.subscribe(id => {
            this.selectedPatientId = id;
        });*/
        this.route.params.subscribe(params => {
            this.selectedPatientId = params['id'];

        });
        this.getPaginatedMedicationFromServer(0);
        this.appointmentsByPatientFromServer(this.selectedPatientId);
        DatePicker.prototype.ngOnInit = function() {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }
            this.settings.timePicker =true;
            this.date = new Date();
        };
    }

    ngOnInit(): void {
        this.statusType = [
            {label: 'ACTIVE',value:'ACTIVE'},
            {label: 'IN-ACTIVE',value:'IN-ACTIVE'},
        ];
        this.orderStatusList = [
            {label: 'administered during visit',value:'administered during visit'},
            {label: 'Electronic eRx Sent',value:'Electronic eRx Sent'},
            {label: 'Phoned into Pharmacy"',value:'Phoned into Pharmacy"'},
            {label: 'Faxed to Pharmacy',value:'Faxed to Pharmacy'},
            {label: 'Paper Rx',value:'Paper Rx'},
            {label: 'Prescription Printed',value:'Prescription Printed'},
            {label: 'Discontinued',value:'Discontinued'},
            {label: 'Prescribed by other Dr',value:'Prescribed by other Dr'},
            {label: 'Over the Counter',value:'Over the Counter'},
        ];


        this.durationList = [
            {label: 'Days ', value: 'Days '},
            {label: 'Week ', value: 'Week '},
            {label: 'Month ', value: 'Month '},

        ];


        /*<th> Appointment Date/Time</th>
        <th> Medication</th>
        <th>Strengths</th>
        <th>Frequency</th>
        <th> Duration</th>
        <th> SIG </th>
        <th> Start Date</th>
        <th>Action</th>*/
        this.cols = [
            { field: 'appointmentDate', header: 'Appointment Date/Time' },
            { field: 'drugName', header: 'Medication' },
            { field: 'strengths', header: 'Strengths' },
            { field: 'frequency', header: 'Frequency' },
            { field: 'duration', header: 'Duration' },
            { field: 'pharmacyNote', header: 'SIG' },
            { field: 'datePrescribedString', header: 'Start Date' },
            { field: 'status', header: 'Action' },
        ];
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
        this.isUpdateAppoint=false;
        this.medicationModel = new MedicationModel();
        this.appointmentsByPatientFromServer(this.selectedPatientId);
        this.getAllDrugsFromServer()
    }


   getRouteDrug(txt: string) {

        this.requestsService.getRequest(AppConstants.FETCH_NAME_ROUTE + txt)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DRUG_SUC_10') {
                        this.routeDrug = response['responseData'];
                     //   let drug = new DrugModel();
                        console.log(this.routeDrug);
                        this.medicationModel.route =this.routeDrug;
                    //    this.medicationModel.strengths=this.routeDrug.strengths;


                    } else {
                        this.notificationService.error(response['responseMessage']);
                    }
                }
            ),
            (error: any) => {
                this.notificationService.error(error.error.error);
            }
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

    getStrengthsDrug(txt: string) {

        this.requestsService.getRequest(AppConstants.FETCH_NAME_STRENGTHS + txt)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DRUG_SUC_10') {
                        this.searchedDrugStrengths = response['responseData'];
                        this.searchedDrugStrengthsAny=this.searchedDrugStrengths.strengths;

                        for (let strenths of this.searchedDrugStrengthsAny) {
                            let pair: any = {label: strenths, value: strenths};
                            this.searchedDrugStrengthsAnyListModified.push(pair);

                        }

                        this.selectedstr=this.searchedDrugStrengthsAnyListModified[0].value;



                        this.strengthLst=this.searchedDrugStrengths.strengths;
                        this.medicationModel.strengths=this.searchedDrugStrengths.strengths[0];
                        this.medicationModel.strengths=this.searchedDrugStrengths.strengths;

                        console.log(this.medicationModel.strengths);



                    } else {
                        this.notificationService.error(response['responseMessage']);
                    }
                }
            ),
            (error: any) => {
                this.notificationService.error(error.error.error);
            }
    }


    saveMedication(mdForm: NgForm) {

        this.medicationModel.drugName=this.text;
        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }

        if (this.medicationModel.appointmentId <= 0) {
            this.notificationService.warn('Please select appoint.');
            document.getElementById('appointmentId').focus();
            return;
        }

        if (this.medicationModel.drugName === '') {
            this.notificationService.warn('Please provide drug name.');
            document.getElementById('drugNameId').focus();
            return;
        }

        if (this.medicationModel.datePrescribedDate === null) {
            this.notificationService.warn('Please provide proper prescribed date and time.');
            document.getElementById('datePrescribedId').focus();
            return;
        }
        if (this.medicationModel.dateStartedTakingDate === null) {
            this.notificationService.warn('Please provide proper start taking date and time.');
            document.getElementById('dateStartedTakingId').focus();
            return;
        }
        if (this.medicationModel.dateStoppedTakingDate === null) {
            this.notificationService.warn('Please provide proper stoop taking date and time.');
            document.getElementById('dateStoppedTakingId').focus();
            return;
        }
        this.medicationModel.datePrescribedDate=new Date(this.medicationModel.datePrescribedDate);
        this.medicationModel.dateStartedTakingDate=new Date(this.medicationModel.dateStartedTakingDate);
        this.medicationModel.dateStoppedTakingDate=new Date(this.medicationModel.dateStoppedTakingDate);
        this.medicationModel.strengths=this.selectedstr;


        if (localStorage.getItem(btoa('access_token'))) {
            this.medicationModel.patientId = this.selectedPatientId;
            console.log(this.medicationModel);

            this.requestsService.postRequest(
                AppConstants.MEDICATION_SAVE_URL, this.medicationModel)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MEDICATION_SUC_28') {
                            this.notificationService.success(response['responseMessage'], 'Medication');
                            this.getPaginatedMedicationFromServer(0);
                            this.closeBtnMedication.nativeElement.click();
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Medication');
                            this.getPaginatedMedicationFromServer(0);
                        }
                    },
                    (error: any) => {
                        if (error.error.responseMessage === 'Patient not found' ||
                            error.error.responseMessage === 'Appoint not found') {
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
            AppConstants.MEDICATION_PAGINATED_URL + page + '?selectedPatientId=' + this.selectedPatientId)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'MEDICATION_SUC_32') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.medicationData = response['responseData']['data'];
                        console.log(this.medicationData);

                    } else {
                        this.notificationService.error(response['responseMessage'])
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
            if (!confirm('Are Your Source You Want To Delete')) return;
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
        this.isUpdateAppoint=false;
        this.medicationModel = new MedicationModel();
        this.getAllDrugsFromServer();
        if (medicationId > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(AppConstants.MEDICATION_GET_URL + 'medicationId=' + medicationId)
                    .subscribe(
                        response => {
                            if (response['responseCode'] === 'MEDICATION_SUC_34') {
                                this.medicationModel = response['responseData'];

                                this.text=this.medicationModel.drugName;
                                this.medicationModel.datePrescribedDate=new Date(this.medicationModel.datePrescribedString);
                                this.medicationModel.dateStartedTakingDate=new Date(this.medicationModel.dateStartedTakingString);
                                this.medicationModel.dateStoppedTakingDate=new Date(this.medicationModel.dateStoppedTakingString);
                                this.medicationModel.status=this.medicationModel.status;

                                this.isUpdateAppoint=true;
                                this.selectedstr=this.medicationModel.strengths;
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

    updateMedication(mdForm: NgForm) {
        this.medicationModel.drugName=this.text;
        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }

        if (this.medicationModel.appointmentId <= 0) {
            this.notificationService.warn('Please select appoint.');
            document.getElementById('appointmentId').focus();
            return;
        }

        if (this.medicationModel.drugName === '') {
            this.notificationService.warn('Please provide drug name.');
            document.getElementById('drugNameId').focus();
            return;
        }

        if (this.medicationModel.datePrescribedDate === null) {
            this.notificationService.warn('Please provide proper prescribed date and time.');
            document.getElementById('datePrescribedId').focus();
            return;
        }
        if (this.medicationModel.dateStartedTakingDate === null) {
            this.notificationService.warn('Please provide proper start taking date and time.');
            document.getElementById('dateStartedTakingId').focus();
            return;
        }
        if (this.medicationModel.dateStoppedTakingDate === null) {
            this.notificationService.warn('Please provide proper stoop taking date and time.');
            document.getElementById('dateStoppedTakingId').focus();
            return;
        }
        this.medicationModel.datePrescribedDate=new Date(this.medicationModel.datePrescribedDate);
        this.medicationModel.dateStartedTakingDate=new Date(this.medicationModel.dateStartedTakingDate);
        this.medicationModel.dateStoppedTakingDate=new Date(this.medicationModel.dateStoppedTakingDate);


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

    private  getPaginatedDataFromServer(page: number) {
        this.requestsService.getRequest(
            AppConstants.PAGINATED_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'MEDICATION_SUC_32') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.medicationData = response['responseData']['data'];

                        console.log("All"+this.medicationData);
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

     isEmpty(val:string){
        return (val === undefined || val == null || val.length <= 0) ? true : false;
    }

    search(event: any) {

       if(this.isEmpty(this.text)==false){

       this.getRouteDrug(this.text);
       this.getStrengthsDrug(this.text);
       }

        this.requestsService.getRequest(AppConstants.DRUG_SEARCH_BY_NAME_URL + this.text)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DRUG_SUC_10') {
                        this.searchedDrugNames = response['responseData'];



                    } else {
                        this.notificationService.error(response['responseMessage']);
                    }
                }
            ),
            (error: any) => {
                this.notificationService.error(error.error.error);
            }
    }

    getAllDrugsFromServer() {
        this.requestsService.getRequest(AppConstants.DRUG_GET_ALL_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DRUG_SUC_10') {
                        this.drugs = response['responseData'];
                    } else {
                        this.notificationService.error(response['responseMessage']);
                    }
                }
            ),
            (error: any) => {
                this.notificationService.error(error.error.error);
            }

    }


}