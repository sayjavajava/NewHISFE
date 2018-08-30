import {Component, OnDestroy, OnInit} from '@angular/core';
import {
    ViewChild,
    TemplateRef
} from '@angular/core';
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours,
    addMinutes
} from 'date-fns';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog} from '@angular/material';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent} from 'angular-calendar';
import {AppConstants} from '../../../utils/app.constants';
import {FormBuilder} from '@angular/forms';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Rx';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {Router} from '@angular/router';
import {Appointment} from '../../../model/Appointment';
import {UserTypeEnum} from '../../../enums/user-type-enum';
import DateTimeFormat = Intl.DateTimeFormat;

declare var $: any;

@Component({
    selector: 'add-appointment-component',
    templateUrl: '../../../templates/dashboard/appointment/add-appointment-template.html',
})
export class AddAppointmentComponent implements OnInit {

    constructor(private modal: NgbModal, private dialog: MatDialog, private fb: FormBuilder,
                private notificationService: NotificationService, private router: Router, private requestsService: RequestsService) {
        this.getBranchesFromServer();
        this.getDoctorsFromServer();
        this.getPatientFromServer();
    }

    refresh: Subject<any> = new ReplaySubject<any>(1);
    events: CalendarEvent[] = [];
    eventsRequest: CalendarEvent[] = [];
    activeDayIsOpen: boolean = false;
    title = 'app';
    popup: boolean = false;
    page: number = 0;
    color: string;
    startDate = new Date(2018,1,1);
    @ViewChild('modalContent') modalContent: TemplateRef<any>;

    view: string = 'month';
    newPatient: boolean = false;

    viewDate: Date = new Date();
    data: any = [];
    branches: any[];
    doctorsList: any[];
    patients: any=[];
    selectedType: any = [];
    updateSelectedType: any = [];
    appointmentType: any = [];
    examRooms: any = [];
    filteredData: any[];
    test: string = 'lahore';
    selectedPatientId: number;
    searchedDoctor: number;
    searchedBranch: number;


    modalData: {
        action: string;
        event: CalendarEvent;
    };
    status = [
        {id: 1, name: 'CONFIRMED'},
        {id: 2, name: 'CHECK_IN'},
        {id: 3, name: 'IN_SESSION'},
        {id: 4, name: 'RE_SCHEDULED'},
        {id: 5, name: 'COMPLETE'},
        {id: 6, name: 'REGULAR'},
        {id: 7, name: 'IN_ROOM'},
        {id: 8, name: 'NOT_CONFIRMED'},
        {id: 9, name: 'CANCELLED'}

    ];

    Type = [
        {id: 1, name: 'Regular', checked: false},
        {id: 2, name: 'Walk-In', checked: false},
        {id: 4, name: 'NewPatient', checked: false},

    ];

    Patient = [
        {id: 1, name: 'noumi'},
        {id: 2, name: 'tariq24'},
        {id: 3, name: 'usman23'},
        {id: 4, name: 'test45'},

    ];

    ngOnInit() {
        var startTime =new Date('August 8 2018 08:20');
        var endTime =new Date('August 8 2018 08:25');
        this.requestsService.getRequest(
            AppConstants.FETCH_APPOINTMENTS_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'APPT_SUC_01') {
                        for (let apt of response['responseData']) {
                            this.events.push({
                                id: apt.id,
                                title: apt.patient + '  '+apt.scheduleDateAndTime + ' ' + apt.branchName,
                                start : addMinutes(startOfDay(new Date(apt.scheduleDate)),apt.appointmentConvertedTime),
                                end :  addMinutes(startOfDay(new Date(apt.scheduleDate)),apt.appointmentEndedConvertedTime),
                                // start: addHours(startOfDay(new Date(apt.scheduleDate)),126),
                                //end : new Date(apt.scheduleDate).getMinutes()+34),
                              //  end:addHours(startOfDay(new Date(apt.scheduleDate)),apt.appointmentEndedOn),
                                // start: startOfDay(new Date(apt.scheduleDate)),
                               // end: endOfDay(new Date((apt.scheduleDate),apt.appointmentEndedOn)),
                                color: {
                                    primary: apt.color,
                                    secondary: apt.color
                                },
                                colorHash: apt.color,
                                draggable: true,
                                notes: apt.notes,
                                patientId: apt.patientId,
                                reason: apt.reason,
                                status: apt.status,
                                duration: apt.duration,
                                age: apt.age,
                                type: apt.appointmentType,
                                //cellPhone:apt.patient.profile.cellPhone,
                                //selectWorkingDays:this.selectedRecurringDays,
                                appointmentType: apt.appointmentType,
                                followUpDate: new Date(),
                                followUpReason: apt.followUpReason,
                                recurseEvery: apt.recurseEvery,
                                neverEnds: false,
                                followUpReminder: false,
                                arrangeFollowUpReminder: false,
                                firstAppointment: apt.firstAppointmentOn,
                                lastAppointment: apt.lastAppointmentOn,
                                recurringAppointment: false,
                                branch: apt.branchName,
                                examRoom: apt.examName,
                                branchId: apt.branchId,
                                roomId: apt.roomId,
                                doctorId: apt.doctorId

                            });
                            this.refresh.next();
                        }

                    }

                },
                (error: any) => {
                    //  this.hisUtilService.tokenExpired(error.error.error);
                }
            );
    }

    get selectedOptions() {
        return this.Type
            .filter(opt => opt.checked)
            .map(opt => opt.name);
    }

    selectType() {
        this.selectedType.length = 0;
        if (this.selectedOptions.indexOf('NewPatient') > -1) {
            this.newPatient = true;
        } else {
            this.newPatient = false;
        }
        this.selectedType.push(...this.selectedOptions);
    }

    moveMouse(action: string, event: CalendarEvent) {
        this.modalData = {event, action};
        console.log("test:" + event.title);
        this.popup = true;
    }

    mouseEnter(div: string) {
        //  console.log("mouse enter : " + div);
    }

    mouseLeave(action: string, event: CalendarEvent) {
        this.popup = false;
    }

    recurringDays = [
        {name: 'Monday'},
        {name: 'Tuesday'},
        {name: 'Wednesday'},
        {name: 'Thursday'},
        {name: 'Friday'},
        {name: 'Saturday'},
        {name: 'Sunday'},

    ];
    selectedRecurringDays: any = [];

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.eventsRequest = this.eventsRequest.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
            }
        }
    ];

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

    getDoctorsFromServer() {
        this.requestsService.getRequest(
            AppConstants.USER_BY_ROLE + '?name=' + UserTypeEnum.DOCTOR)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'USER_SUC_01') {
                        this.doctorsList = response['responseData'];
                    }
                },
                (error: any) => {

                }
            );
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

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        console.log("day cliked in months");
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
               // this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
        this.addEvent(date);
    }

    eventTimesChanged({
                          event, newStart, newEnd
                      }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        console.log("time changing ....")
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = {event, action};
        console.log('testing day ' +event);
        this.Type.filter(e => event.appointmentType.includes(e.name)).map(e => e.checked = true);
        this.selectedType = event.appointmentType;
        var filteredData2 = this.branches.filter(x => x.id == event.branchId);
        this.examRooms = filteredData2[0].examRooms;
        // this.modal.open(this.modalContent, {size: 'lg'});
        //  document.getElementById("exampleModalCenter2").click();
        // this.refresh.next();
        $('#exampleModalCenter2').modal('show');

    }

    deleteEvent(action: string, event: CalendarEvent): void {

        this.eventsRequest.splice(this.eventsRequest.indexOf(event), 1);
        //this.refresh.next();
    }

    addEvent(date: any): void {
        $('#create-responsive').modal('show');
        this.eventsRequest.push({
            title: 'Name',
            start: startOfDay(new Date(date)),
            end: endOfDay(date),
            draggable: true,
            notes: '',
            email: 'email',
            patient: 0,
            reason: 'malairia',
            status: 'confiremed',
            duration: 0,
            age: 'age',
            type: '',
            gender: 'Gender',
            cellPhone: 'Phone #',
            selectWorkingDays: this.selectedRecurringDays,
            appointmentType: this.selectedType,
            followUpDate: new Date(),
            followUpReason: 'reason',
            recurseEvery: 'rescurse',
            neverEnds: false,
            followUpReminder: false,
            arrangeFollowUpReminder: false,
            firstAppointment: new Date(),
            lastAppointment: new Date(),
            recurringAppointment: false,
            branch: 'select',
            doctorId: 0,
            examRoom: 'select',
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        });

        this.refresh.next();

    }

    getSearchedBranch(value: any) {
        console.log( 'value'+value);
        this.searchedBranch = value;
    }

    getSearchedDoctor(value: any) {
        console.log( 'value'+value);
        this.searchedDoctor = value;
    }

    searchAppointment() {
        var self = this;

        this.requestsService.searchWithParam(AppConstants.SEARCH_APPOINTMENT_URL, this.searchedDoctor, this.searchedBranch)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'APPT_SUC_01') {
                        this.events.length = 0;
                        self.notificationService.success('Success',"Appointment Founded ");
                        for (let apt of response['responseData']) {

                            this.events.push({
                                id: apt.id,
                                title: apt.patient,
                                start: startOfDay(new Date(apt.scheduleDate)),
                                end: endOfDay(new Date(apt.scheduleDate)),
                                color: {
                                    primary: apt.color,
                                    secondary: apt.color
                                },
                                colorHash: apt.color,
                                draggable: true,
                                notes: apt.notes,
                                reason: apt.reason,
                                status: apt.status,
                                duration: apt.duration,
                                age: apt.age,
                                type: apt.appointmentType,
                                //cellPhone:apt.patient.profile.cellPhone,
                                //selectWorkingDays:this.selectedRecurringDays,
                                appointmentType: apt.appointmentType,
                                followUpDate: new Date(),
                                followUpReason: apt.followUpReason,
                                recurseEvery: apt.recurseEvery,
                                neverEnds: false,
                                followUpReminder: false,
                                arrangeFollowUpReminder: false,
                                firstAppointment: apt.firstAppointmentOn,
                                lastAppointment: apt.lastAppointmentOn,
                                recurringAppointment: false,
                                branch: apt.branchName,
                                examRoom: apt.examName,
                                branchId: apt.branchId,
                                roomId: apt.roomId,
                                doctorId: apt.doctorId

                            });
                            this.refresh.next();
                        }

                    }
                    if (response['responseCode'] === 'APPT_ERR_03') {
                        this.events = [];
                        self.notificationService.warn("No Appointment Founded");
                    }

                }, (error: any) => {
                console.log('user defined Erro ' + error);
                });
    }

    selectRecurringDays(event: any, item: any) {
        console.log(this.examRooms.lenght);
        if (event.target.checked) {
            this.selectedRecurringDays.push(item.name);
        }
        else {
            let updateItem = this.selectedRecurringDays.find(this.findIndexToUpdate, item.name);

            let index = this.selectedRecurringDays.indexOf(updateItem);

            this.selectedRecurringDays.splice(index, 1);
        }
    }

    findIndexToUpdate(type: any) {
        return type.name === this;
    }

    getExamRoom(event: any) {
        console.log('getExam');
        let roomId: number;
        var sp = event.split(': ');
        if (sp.length > 1)
            roomId = sp[1];
        else
            roomId = sp[0];
        var filteredData2 = this.branches.filter(x => x.id == roomId);
        this.examRooms = filteredData2[0].examRooms;

    }

    saveAppointment(event: any) {
        var self = this;
        this.Type.map(x => x.checked = false);
        if (this.eventsRequest.length != 0) {
            let obj = new Appointment(event.title, event.branchId, event.doctorId, event.scheduleDateAndTime, event.start, event.end, event.draggable, this.selectedRecurringDays, this.selectedType, event.notes, event.patientId,
                event.reason, event.status, event.duration, event.followUpDate, event.followUpReason, event.followUpReminder, event.recurringAppointment, event.recurseEvery,
                event.firstAppointment, event.lastAppointment, event.examRoom, event.age, event.cellPhone, event.gender, event.email, this.color, event.roomId,event.newPatient,event.dob);
            this.requestsService.postRequest(AppConstants.CREATE_APPOINTMENT_URL,
                obj)
                .subscribe(
                    (response: Response) => {
                        this.refresh.next();
                        if (response['responseCode'] === 'APPT_SUC_02') {
                            self.notificationService.success('created successfully', 'Appointment');
                            self.router.navigate(['/dashboard/appointment/manage']);
                            this.eventsRequest.length = 0;
                            $('#exampleModalCenter2').modal('close');
                        } else {
                            self.notificationService.error('Appointment is not created', 'Appointment');
                        }
                    },
                    (error: any) => {

                    });
        }
    }

    updateAppointment(event: any) {
        var self = this;
        let obj = new Appointment(event.title, event.branchId, event.doctorId, event.scheduleDateAndTime, event.start, event.end, event.draggable, this.selectedRecurringDays, this.selectedType, event.notes, event.patientId,
            event.reason, event.status, event.duration, event.followUpDate, event.followUpReason, event.followUpReminder, event.recurringAppointment, event.recurseEvery,
            event.firstAppointment, event.lastAppointment, event.examRoom, event.age, event.cellPhone, event.gender, event.email, this.color, event.roomId,event.newPatient,event.dob);
        this.requestsService.putRequest(AppConstants.UPDATE_APPOINTMENT + event.id,
            obj).subscribe(
            (response: Response) => {
                if (response['responseCode'] === 'APPT_SUC_03') {
                    self.notificationService.success('Updated successfully', 'Appointment');
                    self.router.navigate(['/dashboard/appointment/manage']);
                } else {
                    self.notificationService.error('Appointment is not created', 'Appointment');
                }
            },
            (error: any) => {

            });
    }

}
