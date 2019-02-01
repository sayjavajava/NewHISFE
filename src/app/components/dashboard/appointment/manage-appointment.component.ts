import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {NotificationService} from "../../../services/notification.service";
import {MedicalService} from '../../../model/medical-service';
import {ConformationDialogService} from '../../../services/ConformationDialogService';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DatePicker} from "angular2-datetimepicker";
import {BranchDoctors} from "../../../model/branchdoctors";
import {Branch} from "../../../model/branch";
import {Appointment} from "../../../model/Appointment";
import {isNullOrUndefined} from "util";
import {MatSnackBar} from "@angular/material";

declare var $: any;

@Component({
    selector: 'manage-appointment-component',
    templateUrl: '../../../templates/dashboard/appointment/manage-appointment.template.html',
})

export class ManageAppointmentComponent implements OnInit {
    filteredServices: any[];
    branchDoctor: BranchDoctors[];
    disbaleDoctor: boolean = true;
    branches: any;
    statusesList: any;
    stateOfPatientBox: any;
    color: any;
    examRooms: any = [];
    filteredDoctor: BranchDoctors[];
    servicesListWithDoctors: any = [];
    selectedType: any;
    selectedRecurringDays: any;

    nextPage: any;
    updateBtnCheck:boolean;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: any;
    brFiltered: Branch[] = [];
    searchData: string;
    searchFlag: boolean = false;
    followUpDate: any;
    dateSchedule: any;
    cols: any;
    serviceDuration: any = 0;
    statusColor:any;
    appointmentForm: FormGroup;
    appointmentObj: ManageAppointment = new ManageAppointment();
    selectedMedicalService: MedicalService = new MedicalService();
    private patients: any = [];
    private error: string;

    constructor(private requestsService: RequestsService, private fb: FormBuilder,
                private router: Router,
                private titleService: Title,
                private snackBar: MatSnackBar,
                private hisUtilService: HISUtilService,
                private confirmationDialogService: ConformationDialogService,
                private notificationService: NotificationService) {


        DatePicker.prototype.ngOnInit = function () {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }
            this.settings.timePicker = true;
            this.date = new Date();

        };
    };

    ngOnInit() {
        this.getPatientFromServer();
        this.allStatusesOfOrganization();
        this.getBranchesAndDoctorFromServer();
        this.getBranchesFromServer();
        this.allServicesWithDoctors();
        this.titleService.setTitle('HIS | Manage Appointments');
        this.getAllPaginatedAppointmentsFromServer(0);
        this.cols = [
            {field: 'appointmentId', header: 'Appt#'},
            {field: 'patientFirstName', header: 'Patient'},
            {field: 'docFirstName', header: 'Doctor'},
            {field: 'serviceName', header: 'Service'},
            {field: 'examName', header: 'Room'},
            {field: 'branchName', header: 'Branch'},
            {field: 'apptType', header: 'Type'},
            {field: 'scheduleDate', header: 'Appt Time'},
            {field: 'checkIn', header: 'CheckIn'},
            {field: 'creatorName', header: 'Creator'},
            {field: 'status', header: 'status'},
            {field: 'status', header: 'Action'}
        ];

        /*        <th width="15%"> Patient</th>
                    <th width="15%"> Exam Room</th>
                <th width="10%"> Branch</th>
                    <th width="10%"> Type</th>
                    <th width="15%"> Started On</th>
                <th width="10%"> Ended On</th>
                <th width="10%"> Status</th>
                    <th width="10%"> Action</th>*/
    }

    allStatusesOfOrganization() {
        this.requestsService.getRequest(AppConstants.FETCH_ALL_STATUSES)
            .subscribe(
                (response: Response) => {
                    //console.log('i am branch call');
                    if (response['responseCode'] === 'STATUS_SUC_05') {
                        this.statusesList = response['responseData'];
                        //console.log(this.servicesList);
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })

    }

    getPatientFromServer() {
        this.requestsService.getRequest(
            AppConstants.GET_ALL_PATIENT_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATIENT_SUC_11') {
                        this.patients = response['responseData'];
                    }
                },
                (error: any) => {

                }
            );
    }


    selectServices(item: any) {
        this.filteredServices = [];
        let list = this.servicesListWithDoctors.filter((x: any) => x.doctorId == item.value);
        this.filteredServices = [...list];
    }

    allServicesWithDoctors() {
        this.requestsService.getRequest(AppConstants.FETCH_MEDICALSERVICES_WITH_DOCTORS)
            .subscribe(
                (response: Response) => {
                    //console.log('i am branch call');
                    if (response['responseCode'] === 'MED_SER_SUC_01') {
                        this.servicesListWithDoctors = response['responseData'];
                        //console.log(this.servicesList);
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })

    }

    updateAppointment(event: ManageAppointment) {
        var self = this;
        /*let obj = new Appointment(event.id, event.appointmentId, event.title, event.branchId, event.doctorId, event.scheduleDateAndTime, event.start, event.end, event.draggable, this.selectedRecurringDays, this.selectedType, event.notes, event.patientId,
            event.reason, event.statusId, event.duration, event.followUpDate, event.followUpReason, event.followUpReminder, event.recurringAppointment, event.recurseEvery,
            event.firstAppointment, event.lastAppointment, event.examRoom, event.age, event.cellPhone, event.gender, event.email, this.color, event.roomId, event.newPatient, event.dob, event.serviceId, this.stateOfPatientBox, event.start);
*/
        event.dateSchedule = new Date(event._dateSchedule);
        this.requestsService.putRequest(AppConstants.UPDATE_APPOINTMENT + event.id,
            event).subscribe(
            (response: Response) => {
                if (response['responseCode'] === 'APPT_SUC_03') {
                    self.notificationService.success('Updated successfully', 'Appointment');
                    self.router.navigate(['/dashboard/appointment/manage']);
                } else {
                    self.notificationService.warn(`Warning, ${response['responseMessage']}`);
                }
            },
            (error: any) => {

            });
    }

    getSelectedService(item: any) {
        let list = this.servicesListWithDoctors.filter((x: any) => x.mServiceId == item.value);
        list.forEach((x: any) => {
            console.log('services test' + x.doctorId + 'teta' + x.duration)
            if (!isNullOrUndefined(x))
                this.serviceDuration = x.duration ? x.duration : '';
        })
    }

    getBranchesAndDoctorFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_BRANCHES_WITH_DOCTOR_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchDoctor = response['responseData'];
                        let brObj;
                        let _brMap = new Map<any, String>();
                        this.branchDoctor.forEach(function (element) {
                            _brMap.set(element.id, element.branchName);

                        })
                        _brMap.forEach((key: string, value: number) => {
                            brObj = new Branch(value, key);
                            this.brFiltered.push(brObj);
                        })


                    }
                },
                (error: any) => {

                }
            );
    }

    getBranchesFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branches = response['responseData'];
                    }
                },
                (error: any) => {
                }
            );
    }

    getExamRoom(eventObj: any) {
        this.disbaleDoctor = false;
        this.disbaleDoctor = false;
        let roomId = eventObj.value;
        let filteredData2 = this.branchDoctor.filter(x => x.id == roomId);
        let filterDoctor = this.branchDoctor.filter(x => x.id == roomId);
        if (filteredData2.length != 0) {
            this.examRooms = filteredData2[0].examRooms;
        }
        let filteredDoctorsWithValue: any[] = [];
        let branchDocobj2 = null;
        filterDoctor.forEach(x => {
            branchDocobj2 = new DoctorService(x.firstName + x.lastName, x.doctorId);
            filteredDoctorsWithValue.push(branchDocobj2);
        })
        this.filteredDoctor = [...filteredDoctorsWithValue];
    }

    createAppointmentForm() {
        this.appointmentForm = this.fb.group({
            'title': [null],
            'statusDrp': [null],
            'email': [null],
            'cellPhone': [null],
            'start': [null],
            'appointmentType': [null],
            'age': [null],
            'notes': [null],
            'reason': [null],
            'exmDrp': [null],
            'patientDrp': [null],
            'recurring': [null],
            'recurringDays': [null],
            'recurseEvery': [null],
            'duration': [null],
            'patient': [null],
            'branchDrp': [null],
            'firstAppointment': [null],
            'lastAppointment': [null],
            'followUpReminder': [null],
            'followUpDate': [null],
        })
    }

    getPageWisePatients(page: number) {
        this.getAllPaginatedAppointmentsFromServer(page);
    }

    getAllPaginatedAppointmentsFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.FETCH_PAGINATED_APPOINTMENTS_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'APPT_SUC_01') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    //  this.hisUtilService.tokenExpired(error.error.error);
                }
            );
    }

    searchAppointment(page: any) {
        this.searchFlag = true;
        this.requestsService.getRequest(
            AppConstants.SEARCH_APPOINTMENTS_BY_PATIENT + page + '?patientName=' + this.searchData)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'APPT_SUC_01') {
                        /*     this.nextPage = response['responseData']['nextPage'];
                             this.prePage  = response['responseData']['prePage'];
                             this.currPage = response['responseData']['currPage'];
                             this.pages    = response['responseData']['pages'];
                             this.data     = response['responseData']['data'];
                         } else {
                             this.nextPage = 0;
                             this.prePage = 0;
                             this.currPage = 0;
                             this.pages = [];
                             this.data = null;
                         }*/
                        this.data = response['responseData'];
                    }
                },
                (error: any) => {
                }
            );
    }


    deleteAppointment(id: number) {
        var self = this;
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(res => {
                if (id) {
                    this.requestsService.deleteRequest(AppConstants.DELETE_APPOINTMENT_URI + id).subscribe((data: Response) => {
                        if (data['responseCode'] === 'APPT_SUC_05') {
                            self.notificationService.success('Appointment has been Deleted Successfully');
                            self.getAllPaginatedAppointmentsFromServer(0);
                        }
                    }, error => {
                        self.notificationService.error('ERROR', 'Appointment Unable to Delete ');

                    });
                    // this.router.navigate(['/home']);
                }
            });
    }

    public patchData(appt: ManageAppointment, id: number, msg?:boolean) {
        if(msg){
            this.updateBtnCheck = true
        }else this.updateBtnCheck =false
        this.createAppointmentForm();
        this.appointmentObj = appt;
        $('#appEditModal').modal('show');
    }

    getUpdatedStatus(statusValue: number, apptId: any ,stObj ?:any) {
        var that = this;
        console.log( 'status log:' + stObj );
        if(stObj){
            let stColor = this.statusesList.filter((x:any) => x.id == stObj);
            this.statusColor = stColor[0].colorHash;
            console.log(stColor);
        }
        this.confirmationDialogService
            .confirm('Update Status', 'Are you sure?')
            .subscribe(res => {
                if (res == true) {
                    this.requestsService.putRequestWithParam(AppConstants.CHANGE_APPT_STATUS + apptId, statusValue)
                        .subscribe((res: Response) => {
                            if (res['responseCode'] === "STATUS_SUC_01") {
                                this.snackBar.open('Status Updated', `Status has been Changed   Successfully`, {duration: 3000});
                            }
                        }, (error: any) => {
                            this.error = error.error.error;
                        });
                }
            });
        /*if(statusValue === 'CHECK_IN'){
            this.requestService.getRequest(AppConstants.INVOICE_CHECK_IN + pmID)
                .subscribe((res: Response) => {
                    if (res['responseCode'] === "INVOICE_ERR_01") {
                        this.snackBar.open('Error', `Invoice Not Generated`, {duration: 3000});
                    }
                }, (error: any) => {
                    this.error = error.error.error;
                });
        }*/
    }

}

class DoctorService {
    label: string;
    value: number;

    constructor(label: string, value: number) {
        this.label = label;
        this.value = value;
    }
}

class ManageAppointment {
    id: number;
    appointmentId: string;
    branchId: number;
    scheduleDate: string;
    appointmentStartedOn: string;
    end: string;
    draggable: boolean;
    appointmentType: any[];
    selectedRecurringDays: any[];
    notes: string;
    patientId: number;
    reason: string;
    status: string;
    statusId: number;
    duration: number;
    followUpDate: Date | string;
    followUpReason: string;
    followUpReminder: boolean;
    recurringAppointment: boolean;
    recurseEvery: string;
    firstAppointment: Date;
    lastAppointment: Date;
    examRoom: number;
    gender: string;
    cellPhone: string;
    age: string;
    email: string;
    color: string;
    startedOn: Date | number | string;
    roomId: number;
    doctorId: number;
    dob: Date;
    newPatient: string;
    serviceId: number;
    stateOfPatientBox: boolean;
    _dateSchedule: Date = new Date();
    get dateSchedule():Date {
        console.log('getting..')
        return this.dateSchedule;
    }
    set dateSchedule(date:Date) {
        console.log('setting..' + date)
        this._dateSchedule = date;
    }

}
