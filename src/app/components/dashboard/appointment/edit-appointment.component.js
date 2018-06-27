"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var date_fns_1 = require("date-fns");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var colors = {
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
var material_1 = require("@angular/material");
var app_constants_1 = require("../../../utils/app.constants");
var forms_1 = require("@angular/forms");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
var requests_service_1 = require("../../../services/requests.service");
var notification_service_1 = require("../../../services/notification.service");
var router_1 = require("@angular/router");
var Appointment_1 = require("../../../model/Appointment");
var EditAppointmentComponent = (function () {
    function EditAppointmentComponent(modal, dialog, fb, route, requestService, notificationService, router, requestsService) {
        this.modal = modal;
        this.dialog = dialog;
        this.fb = fb;
        this.route = route;
        this.requestService = requestService;
        this.notificationService = notificationService;
        this.router = router;
        this.requestsService = requestsService;
        this.newPatient = false;
        this.title = 'app';
        this.view = 'month';
        this.event = new Appointment_1.Appointment();
        this.viewDate = new Date();
        this.data = [];
        this.selectedType = [];
        this.examRooms = [];
        this.status = [
            { id: 1, name: 'CONFIRMED' },
            { id: 2, name: 'CHECK_IN' },
            { id: 3, name: 'IN_SESSION' },
            { id: 4, name: 'RE_SCHEDULED' },
            { id: 5, name: 'COMPLETE' },
            { id: 6, name: 'REGULAR' },
            { id: 7, name: 'IN_ROOM' },
            { id: 8, name: 'NOT_CONFIRMED' },
            { id: 9, name: 'CANCELLED' }
        ];
        this.Patient = [
            { id: 1, name: 'noumi' },
            { id: 2, name: 'tariq24' },
            { id: 3, name: 'usman23' },
            { id: 4, name: 'test45' },
        ];
        this.Type = [
            { id: 1, name: 'Regular' },
            { id: 2, name: 'Walk-In' },
            { id: 3, name: 'TransitionOfCare' },
            { id: 4, name: 'NewPatient' },
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
        this.recurringDays = [
            { name: 'Monday' },
            { name: 'Tuesday' },
            { name: 'Wednesday' },
            { name: 'Thursday' },
            { name: 'Friday' },
            { name: 'Saturday' },
            { name: 'Sunday' },
        ];
        this.selectedRecurringDays = [];
        this.refresh = new ReplaySubject_1.ReplaySubject(1);
        this.events = [];
        this.activeDayIsOpen = true;
        this.getBranchesFromServer();
    }
    EditAppointmentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.id = params['id'];
            console.log(_this.id);
        });
        this.createAppointmentForm();
        this.appointmentForm.controls['patient'].disable();
        this.appointmentForm.controls['email'].disable();
        this.patchData();
    };
    EditAppointmentComponent.prototype.createAppointmentForm = function () {
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
            'neverEnds': [null],
            'followUpReminder': [null],
            'followUpDate': [null],
            'gender': [null],
        });
    };
    EditAppointmentComponent.prototype.patchData = function () {
        var _this = this;
        if (this.id) {
            this.requestService.findById(app_constants_1.AppConstants.FETCH_APPOINTMENTS_BY_ID + this.id).subscribe(function (item) {
                //  this.id = user.id;
                _this.appointmentForm.patchValue({
                    'title': item.name,
                    'email': item.patient.email,
                    'cellPhone': item.patient.profile.cellPhone,
                    'start': item.startedOn,
                    'notes': item.notes,
                    'reason': item.reason,
                    'exmDrp': item.room.examName,
                    'recurring': item.recurring,
                    'age': item.age,
                    'duration': item.duration,
                    'branchDrp': item.branch.name,
                    'patient': item.patient.username,
                    'neverEnds': item.neverEnds,
                    'firstAppointment': item.firstAppointmentOn,
                    'lastAppointment': item.lastAppointmentOn,
                    'followUpReminder': item.followUpReminder,
                    'followUpDate': item.followUpDate,
                    'statusDrp': item.status,
                    'gender': item.patient.profile.gender,
                });
                _this.appointmentForm.controls['branchDrp'].setValue(item.branch.name);
            }, function (error) {
                //console.log(error.json());
            });
        }
    };
    EditAppointmentComponent.prototype.getBranchesFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branches = response['responseData'];
            }
        }, function (error) {
        });
    };
    EditAppointmentComponent.prototype.dayClicked = function (_a) {
        var date = _a.date, events = _a.events;
        if (date_fns_1.isSameMonth(date, this.viewDate)) {
            if ((date_fns_1.isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0) {
                this.activeDayIsOpen = false;
            }
            else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    };
    EditAppointmentComponent.prototype.selectTypes = function (event, item) {
        if (event.target.checked) {
            this.selectedType.push(item.name);
            this.changePosition();
        }
        else {
            var updateItem = this.selectedType.find(this.findIndexToUpdate, item.name);
            var index = this.selectedType.indexOf(updateItem);
            this.selectedType.splice(index, 1);
            this.changePosition();
        }
    };
    EditAppointmentComponent.prototype.changePosition = function () {
        if (this.selectedType.indexOf('NewPatient') > -1) {
            this.newPatient = true;
        }
        else {
            this.newPatient = false;
        }
    };
    EditAppointmentComponent.prototype.addEvent = function () {
        this.events.push({
            title: 'Title',
            start: date_fns_1.startOfDay(new Date()),
            end: date_fns_1.endOfDay(new Date()),
            color: colors.red,
            draggable: true,
            notes: 'any',
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
    };
    EditAppointmentComponent.prototype.selectRecurringDays = function (event, item) {
        console.log(this.filteredData);
        if (event.target.checked) {
            this.selectedRecurringDays.push(item.name);
        }
        else {
            var updateItem = this.selectedRecurringDays.find(this.findIndexToUpdate, item.name);
            var index = this.selectedRecurringDays.indexOf(updateItem);
            this.selectedRecurringDays.splice(index, 1);
        }
        console.log(this.selectedRecurringDays);
    };
    EditAppointmentComponent.prototype.findIndexToUpdate = function (type) {
        return type.name === this;
    };
    EditAppointmentComponent.prototype.getExamRoom = function (event) {
        this.appointmentForm.controls['branchDrp'].setValue(event);
        this.filteredData = this.branches.filter(function (x) { return x.id == event; });
        this.examRooms = this.filteredData[0].examRooms;
    };
    EditAppointmentComponent.prototype.selectPatient = function (event) {
        this.appointmentForm.controls['patientDrp'].setValue(event);
    };
    EditAppointmentComponent.prototype.selectGender = function () {
        this.appointmentForm.controls['gender'].setValue(event);
    };
    EditAppointmentComponent.prototype.cancel = function () {
        this.router.navigate(['/dashboard/appointment/manage']);
    };
    EditAppointmentComponent.prototype.saveAppointment = function (formData) {
        console.log('event :' + JSON.stringify(event));
        var self = this;
        var obj = new Appointment_1.Appointment(formData.title, this.appointmentForm.controls['branchDrp'].value, formData.start, formData.end, formData.draggable, this.selectedRecurringDays, this.selectedType, formData.notes, this.appointmentForm.controls['patient'].value, formData.reason, formData.statusDrp, formData.duration, formData.followUpDate, formData.followUpReason, formData.followUpReminder, formData.recurringAppointment, formData.recurseEvery, formData.firstAppointment, formData.lastAppointment, formData.examRoom, formData.age, formData.cellPhone, this.appointmentForm.controls['branchDrp'].value, this.appointmentForm.controls['email'].value);
        this.requestsService.putRequest(app_constants_1.AppConstants.UPDATE_APPOINTMENT + this.id, obj)
            .subscribe(function (response) {
            if (response['responseCode'] === 'APPT_SUC_03') {
                self.notificationService.success('Updated successfully', 'Appointment');
                self.router.navigate(['/dashboard/appointment/manage']);
            }
            else {
                self.notificationService.error('Appointment is not created', 'Appointment');
            }
        }, function (error) {
        });
    };
    __decorate([
        core_2.ViewChild('modalContent'),
        __metadata("design:type", core_2.TemplateRef)
    ], EditAppointmentComponent.prototype, "modalContent", void 0);
    EditAppointmentComponent = __decorate([
        core_1.Component({
            selector: 'add-appointment-component',
            templateUrl: '../../../templates/dashboard/appointment/edit-appointment.template.html',
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal, material_1.MatDialog, forms_1.FormBuilder, router_1.ActivatedRoute, requests_service_1.RequestsService,
            notification_service_1.NotificationService, router_1.Router, requests_service_1.RequestsService])
    ], EditAppointmentComponent);
    return EditAppointmentComponent;
}());
exports.EditAppointmentComponent = EditAppointmentComponent;
//# sourceMappingURL=edit-appointment.component.js.map