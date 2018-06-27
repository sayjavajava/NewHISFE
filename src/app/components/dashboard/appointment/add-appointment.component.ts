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
    addHours
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

@Component({
    selector: 'add-appointment-component',
    templateUrl: '../../../templates/dashboard/appointment/add-appointment-template.html',
})
export class AddAppointmentComponent implements OnInit {

    constructor(private modal: NgbModal, private dialog: MatDialog, private fb: FormBuilder,
                private notificationService: NotificationService, private router: Router, private requestsService: RequestsService) {
        this.getBranchesFromServer();
    }

    refresh: Subject<any> = new ReplaySubject<any>(1);
    events: CalendarEvent[] = [];
    eventsRequest: CalendarEvent[] = [];
    activeDayIsOpen: boolean = true;
    title = 'app';
    page: number = 0;
    color:string;
    @ViewChild('modalContent') modalContent: TemplateRef<any>;

    view: string = 'month';
    newPatient: boolean = false;

    viewDate: Date = new Date();
    data: any = [];
    branches: any[];
    selectedType: any = [];
    //selectedMedicalService: MedicalService = new MedicalService();
    appointmentType: any = [];
    examRooms: any = [];
    filteredData: any[];

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
        {id: 3, name: 'TransitionOfCare', checked: false},
        {id: 4, name: 'NewPatient', checked: false},

    ];

    Patient = [
        {id: 1, name: 'noumi'},
        {id: 2, name: 'tariq24'},
        {id: 3, name: 'usman23'},
        {id: 4, name: 'test45'},

    ];

    ngOnInit() {
        this.requestsService.getRequest(
            AppConstants.FETCH_PAGINATED_APPOINTMENTS_URL + this.page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'APPT_SUC_01') {
                        for (let apt of response['responseData'].data) {
                            this.events.push({
                                title: apt.patient,
                                start: startOfDay(apt.startedOn),
                                end: startOfDay(apt.startedOn),
                                color: {
                                    primary: apt.color,
                                    secondary: apt.color
                                },
                                draggable: true,
                                notes: apt.notes,
                                email: apt.patient.email,
                                patient: apt.patient.username,
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
        // this.selectedOptions;
        //console.log('type:' + JSON.stringify(this.selectedOptions));
        this.selectedType.length = 0;
        if (this.selectedOptions.indexOf('NewPatient') > -1) {
            this.newPatient = true;
        } else {
            this.newPatient = false;
        }
        this.selectedType.push(...this.selectedOptions);
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

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    eventTimesChanged({
                          event, newStart, newEnd
                      }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = {event, action};
        this.modal.open(this.modalContent, {size: 'sm'});
    }

    deleteEvent(action: string, event: CalendarEvent): void {

        console.log('del:' + event.title);
        this.eventsRequest.splice(this.eventsRequest.indexOf(event), 1);
        this.refresh.next();
    }

    addEvent(): void {

        this.eventsRequest.push({
            title: 'Title',
            start: startOfDay(new Date()),
            end: endOfDay(new Date()),
            draggable: true,
            notes: '',
            email: 'email',
            patient: 'waqas',
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
            examRoom: 'select',
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        });

        this.refresh.next();

    }

    selectRecurringDays(event: any, item: any) {
        console.log(this.selectedType);

        if (event.target.checked) {
            this.selectedRecurringDays.push(item.name);
        }
        else {
            let updateItem = this.selectedRecurringDays.find(this.findIndexToUpdate, item.name);

            let index = this.selectedRecurringDays.indexOf(updateItem);

            this.selectedRecurringDays.splice(index, 1);
        }
        console.log(this.selectedRecurringDays);

    }

    findIndexToUpdate(type: any) {
        return type.name === this;
    }

    getExamRoom(event: any) {
        console.log('i am called' + event + '' + this.examRooms.length);
        this.filteredData = this.branches.filter(x => x.id == event);
        this.examRooms = this.filteredData[0].examRooms;

    }

    saveAppointment(event: any) {
        console.log('event :' + this.color);
        var self = this;
        if (this.eventsRequest.length != 0) {
            let obj = new Appointment(event.title, event.branch, event.start, event.end, event.draggable, this.selectedRecurringDays, this.selectedType, event.notes, event.patient,
                event.reason, event.status, event.duration, event.followUpDate, event.followUpReason, event.followUpReminder, event.recurringAppointment, event.recurseEvery,
                event.firstAppointment, event.lastAppointment, event.examRoom, event.age, event.cellPhone, event.gender, event.email,this.color);
            this.requestsService.postRequest(AppConstants.CREATE_APPOINTMENT_URL,
                obj)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'APPT_SUC_02') {
                            self.notificationService.success('created successfully', 'Appointment');
                            self.router.navigate(['/dashboard/appointment/manage']);
                            this.eventsRequest.length=0;
                        } else {
                            self.notificationService.error('Appointment is not created', 'Appointment');
                        }
                    },
                    (error: any) => {

                    });
        } else {
        }
    }

}
