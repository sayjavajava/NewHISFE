import {Component, OnDestroy, OnInit} from '@angular/core';


import {
    ChangeDetectionStrategy,
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


const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};
import {MatDialog} from '@angular/material';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent} from 'angular-calendar';
import {AppConstants} from '../../../utils/app.constants';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Rx';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Appointment} from '../../../model/Appointment';

@Component({
    selector: 'add-appointment-component',
    templateUrl: '../../../templates/dashboard/appointment/edit-appointment.template.html',
})
export class EditAppointmentComponent implements OnInit {

    id: number;
    newPatient:boolean=false;

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            console.log(this.id);
        });
        this.createAppointmentForm();
        this.appointmentForm.controls['patient'].disable();
        this.appointmentForm.controls['email'].disable();

        this.patchData();
    }

    createAppointmentForm() {
        this.appointmentForm = this.fb.group({
            'title': [null],
            'statusDrp': [null],
            'email': [null],
            'cellPhone': [null],
            'start': [null],
            'appointmentType':[null],
            'age': [null],
            'notes': [null],
            'reason': [null],
            'exmDrp': [null],
            'patientDrp':[null],
            'recurring': [null],
            'recurringDays': [null],
            'recurseEvery': [null],
            'duration': [null],
            'patient': [null],
            'branchDrp': [null],
            'firstAppointment': [null],
            'lastAppointment': [null],
            'neverEnds': [null],
            'followUpReminder': [null],
            'followUpDate': [null],
            'gender':[null],

        })
    }

    public patchData() {
        if (this.id) {
            this.requestService.findById(AppConstants.FETCH_APPOINTMENTS_BY_ID + this.id).subscribe(
                item => {
                    //  this.id = user.id;
                    this.appointmentForm.patchValue({
                        'title': item.name,
                        'email': item.patient.email,
                        'cellPhone': item.patient.profile.cellPhone,
                        'start': item.startedOn,
                        'notes': item.notes,
                        'reason': item.reason,
                        'exmDrp':item.room.examName,
                        'recurring':item.recurring,
                        'age': item.age,
                        'duration' :item.duration,
                        'branchDrp':item.branch.name,
                        'patient':item.patient.username,
                        'neverEnds':item.neverEnds,
                        'firstAppointment' :item.firstAppointmentOn,
                        'lastAppointment' :item.lastAppointmentOn,
                        'followUpReminder':item.followUpReminder,
                        'followUpDate':item.followUpDate,
                        'statusDrp':item.status,
                        'gender':item.patient.profile.gender,

                    });
                    this.appointmentForm.controls['branchDrp'].setValue(item.branch.name);
                }, (error: any) => {
                    //console.log(error.json());


                });
        }

    }


    title = 'app';
    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    view: string = 'month';
    event: Appointment = new Appointment();
    viewDate: Date = new Date();
    data: any = [];
    branches: any[];
    selectedType: any = [];
    examRooms: any = [];
    filteredData: any[];
    appointmentForm: FormGroup;

    status = [
        {id: 1, name: 'CONFIRMED'},
        {id: 2, name: 'CHECK_IN'},
        {id: 3, name: 'IN_SESSION'},
        {id: 4, name: 'RE_SCHEDULED'},
        {id: 5, name: 'COMPLETE'},
        {id:6,name:'REGULAR'},
        {id: 7, name: 'IN_ROOM'},
        {id: 8, name: 'NOT_CONFIRMED'},
        {id: 9, name: 'CANCELLED'}

    ];
    Patient = [
        {id: 1, name: 'noumi'},
        {id: 2, name: 'tariq24'},
        {id: 3, name: 'usman23'},
        {id: 4, name: 'test45'},

    ];
    Type = [
        {id: 1, name: 'Regular'},
        {id: 2, name: 'Walk-In'},
        {id: 3, name: 'TransitionOfCare'},
        {id: 4, name: 'NewPatient'},

    ];

/*    get selectedOptions() {
        return this.Type
            .filter(opt => opt.checked)
            .map(opt => opt.name);
    }

    selectType() {
        // this.selectedOptions;
        console.log('type:' + JSON.stringify(this.selectedOptions));
        this.selectedType.length = 0;
        this.selectedType.push(...this.selectedOptions);
    }*/

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

    refresh: Subject<any> = new ReplaySubject<any>(1);
    events: CalendarEvent[] = [];
    activeDayIsOpen: boolean = true;

    constructor(private modal: NgbModal, private dialog: MatDialog, private fb: FormBuilder, private route: ActivatedRoute, private requestService: RequestsService,
                private notificationService: NotificationService, private router: Router, private requestsService: RequestsService) {
        this.getBranchesFromServer();
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
    selectTypes(event:any,item:any){
        if (event.target.checked) {
            this.selectedType.push(item.name);
            this.changePosition();
        }
        else {
            let updateItem = this.selectedType.find(this.findIndexToUpdate, item.name);
            let index = this.selectedType.indexOf(updateItem);
            this.selectedType.splice(index, 1);
            this.changePosition();
    }
    }
    changePosition() {
        if (this.selectedType.indexOf('NewPatient') > -1) {
            this.newPatient = true;
        } else {
            this.newPatient = false;
        }
    }

    addEvent(): void {

        this.events.push({
            title: 'Title',
            start: startOfDay(new Date()),
            end: endOfDay(new Date()),
            color: colors.red,
            draggable: true,
            notes: 'any',
            email: 'email',
            patient: 'waqas',
            reason: 'malairia',
            status:'confiremed',
            duration: 0,
            age: 'age',
            type: '',
            gender: 'Gender',
            cellPhone: 'Phone #',
            selectWorkingDays: this.selectedRecurringDays,
            appointmentType: this.selectedType,
            followUpDate: new Date(),
            followUpReason: 'reason',
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
        console.log(this.filteredData);

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
        this.appointmentForm.controls['branchDrp'].setValue(event);
        this.filteredData = this.branches.filter(x => x.id == event);
        this.examRooms = this.filteredData[0].examRooms;

    }
    selectPatient(event :any){
         this.appointmentForm.controls['patientDrp'].setValue(event);

    }
    selectGender(){
        this.appointmentForm.controls['gender'].setValue(event);
    }
    cancel(){
        this.router.navigate(['/dashboard/appointment/manage']);
    }

    saveAppointment(formData:any) {
        console.log('event :' + JSON.stringify(event));
        var self = this;
        let obj = new Appointment(formData.title,this.appointmentForm.controls['branchDrp'].value, formData.start, formData.end, formData.draggable, this.selectedRecurringDays, this.selectedType, formData.notes,  this.appointmentForm.controls['patient'].value,
                formData.reason, formData.statusDrp, formData.duration, formData.followUpDate, formData.followUpReason, formData.followUpReminder, formData.recurringAppointment, formData.recurseEvery,
                formData.firstAppointment, formData.lastAppointment, formData.examRoom, formData.age, formData.cellPhone, this.appointmentForm.controls['branchDrp'].value,  this.appointmentForm.controls['email'].value);
                this.requestsService.putRequest(AppConstants.UPDATE_APPOINTMENT + this.id,
                obj)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] ==='APPT_SUC_03') {
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
