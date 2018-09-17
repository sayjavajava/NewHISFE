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
var material_1 = require("@angular/material");
var app_constants_1 = require("../../../utils/app.constants");
var forms_1 = require("@angular/forms");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
var requests_service_1 = require("../../../services/requests.service");
var notification_service_1 = require("../../../services/notification.service");
var router_1 = require("@angular/router");
var Appointment_1 = require("../../../model/Appointment");
var user_type_enum_1 = require("../../../enums/user-type-enum");
var AddAppointmentComponent = (function () {
    function AddAppointmentComponent(modal, dialog, fb, notificationService, router, requestsService) {
        var _this = this;
        this.modal = modal;
        this.dialog = dialog;
        this.fb = fb;
        this.notificationService = notificationService;
        this.router = router;
        this.requestsService = requestsService;
        this.refresh = new ReplaySubject_1.ReplaySubject(1);
        this.events = [];
        this.eventsRequest = [];
        this.activeDayIsOpen = false;
        this.title = 'app';
        this.patientChecked = false;
        this.popup = false;
        this.page = 0;
        this.startDate = new Date(2018, 1, 1);
        this.view = 'month';
        this.newPatient = false;
        this.viewDate = new Date();
        this.data = [];
        this.patients = [];
        this.selectedType = [];
        this.updateSelectedType = [];
        this.appointmentType = [];
        this.examRooms = [];
        this.test = 'lahore';
        this.servicesList = [];
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
        this.Type = [
            { id: 1, name: 'Regular', checked: false },
            { id: 2, name: 'Walk-In', checked: false },
            { id: 4, name: 'NewPatient', checked: false },
        ];
        this.Patient = [
            { id: 1, name: 'noumi' },
            { id: 2, name: 'tariq24' },
            { id: 3, name: 'usman23' },
            { id: 4, name: 'test45' },
        ];
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
        this.actions = [
            {
                label: '<i class="fa fa-fw fa-pencil"></i>',
                onClick: function (_a) {
                    var event = _a.event;
                    _this.handleEvent('Edited', event);
                }
            },
            {
                label: '<i class="fa fa-fw fa-times"></i>',
                onClick: function (_a) {
                    var event = _a.event;
                    _this.eventsRequest = _this.eventsRequest.filter(function (iEvent) { return iEvent !== event; });
                    _this.handleEvent('Deleted', event);
                }
            }
        ];
        this.getBranchesFromServer();
        this.getDoctorsFromServer();
        this.getPatientFromServer();
        this.allServices();
    }
    AddAppointmentComponent.prototype.ngOnInit = function () {
        var _this = this;
        var startTime = new Date('August 8 2018 08:20');
        var endTime = new Date('August 8 2018 08:25');
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_APPOINTMENTS_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'APPT_SUC_01') {
                for (var _i = 0, _a = response['responseData']; _i < _a.length; _i++) {
                    var apt = _a[_i];
                    _this.events.push({
                        id: apt.id,
                        title: apt.patient + '  ' + apt.scheduleDateAndTime + ' ' + apt.branchName,
                        start: date_fns_1.addMinutes(date_fns_1.startOfDay(new Date(apt.scheduleDate)), apt.appointmentConvertedTime),
                        end: date_fns_1.addMinutes(date_fns_1.startOfDay(new Date(apt.scheduleDate)), apt.appointmentEndedConvertedTime),
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
                        // patientId: apt.patientId,
                        reason: apt.reason,
                        status: apt.status,
                        duration: apt.duration,
                        age: apt.age,
                        type: apt.appointmentType,
                        //cellPhone:apt.patient.profile.cellPhone,
                        //selectWorkingDays:this.selectedRecurringDays,
                        appointmentType: apt.appointmentType,
                        followUpDate: new Date(apt.followUpDate),
                        followUpReason: apt.followUpReason,
                        recurseEvery: apt.recurseEvery,
                        neverEnds: false,
                        followUpReminder: apt.followUpReminder,
                        arrangeFollowUpReminder: false,
                        firstAppointment: apt.firstAppointmentOn,
                        lastAppointment: apt.lastAppointmentOn,
                        recurringAppointment: false,
                        branch: apt.branchName,
                        examRoom: apt.examName,
                        branchId: apt.branchId,
                        roomId: apt.roomId,
                        doctorId: apt.doctorId,
                    });
                    _this.refresh.next();
                }
            }
        }, function (error) {
            //  this.hisUtilService.tokenExpired(error.error.error);
        });
    };
    Object.defineProperty(AddAppointmentComponent.prototype, "selectedOptions", {
        get: function () {
            return this.Type
                .filter(function (opt) { return opt.checked; })
                .map(function (opt) { return opt.name; });
        },
        enumerable: true,
        configurable: true
    });
    AddAppointmentComponent.prototype.allServices = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL)
            .subscribe(function (response) {
            //console.log('i am branch call');
            if (response['responseCode'] === 'MED_SER_SUC_01') {
                _this.servicesList = response['responseData'];
                //console.log(this.servicesList);
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    AddAppointmentComponent.prototype.selectType = function (form) {
        this.selectedType.length = 0;
        if (this.selectedOptions.indexOf('NewPatient') > -1) {
            this.patientChecked = true;
            this.newPatient = true;
            /*Object.keys((<FormGroup>form.form.get('branchDrp')).controls).forEach(element => {
                console.log('ele testing...'+element);
            });*/
        }
        else {
            this.patientChecked = false;
            this.newPatient = false;
        }
        (_a = this.selectedType).push.apply(_a, this.selectedOptions);
        var _a;
    };
    AddAppointmentComponent.prototype.moveMouse = function (action, event) {
        this.modalData = { event: event, action: action };
        console.log("test:" + event.title);
        this.popup = true;
    };
    AddAppointmentComponent.prototype.mouseEnter = function (div) {
        //  console.log("mouse enter : " + div);
    };
    AddAppointmentComponent.prototype.mouseLeave = function (action, event) {
        this.popup = false;
    };
    AddAppointmentComponent.prototype.getBranchesFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branches = response['responseData'];
            }
        }, function (error) {
        });
    };
    AddAppointmentComponent.prototype.getDoctorsFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + user_type_enum_1.UserTypeEnum.DOCTOR)
            .subscribe(function (response) {
            if (response['responseCode'] === 'USER_SUC_01') {
                _this.doctorsList = response['responseData'];
            }
        }, function (error) {
        });
    };
    AddAppointmentComponent.prototype.getPatientFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.GET_ALL_PATIENT_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'PATIENT_SUC_11') {
                _this.patients = response['responseData'];
            }
        }, function (error) {
        });
    };
    AddAppointmentComponent.prototype.dayClicked = function (_a) {
        var date = _a.date, events = _a.events;
        console.log("day cliked in months");
        if (date_fns_1.isSameMonth(date, this.viewDate)) {
            if ((date_fns_1.isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0) {
                this.activeDayIsOpen = false;
            }
            else {
                // this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
        this.addEvent(date);
    };
    AddAppointmentComponent.prototype.eventTimesChanged = function (_a) {
        var event = _a.event, newStart = _a.newStart, newEnd = _a.newEnd;
        event.start = newStart;
        event.end = newEnd;
        console.log("time changing ....");
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    };
    AddAppointmentComponent.prototype.handleEvent = function (action, event) {
        this.modalData = { event: event, action: action };
        console.log('testing day ' + event);
        this.Type.filter(function (e) { return event.appointmentType.includes(e.name); }).map(function (e) { return e.checked = true; });
        this.selectedType = event.appointmentType;
        var filteredData2 = this.branches.filter(function (x) { return x.id == event.branchId; });
        this.examRooms = filteredData2[0].examRooms;
        // this.modal.open(this.modalContent, {size: 'lg'});
        //  document.getElementById("exampleModalCenter2").click();
        // this.refresh.next();
        $('#exampleModalCenter2').modal('show');
    };
    AddAppointmentComponent.prototype.deleteEvent = function (action, event) {
        this.eventsRequest.splice(this.eventsRequest.indexOf(event), 1);
        //this.refresh.next();
    };
    AddAppointmentComponent.prototype.addEvent = function (date) {
        $('#create-responsive').modal('show');
        this.eventsRequest.push({
            title: 'Name',
            start: date_fns_1.startOfDay(new Date(date)),
            end: date_fns_1.endOfDay(date),
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
            followUpReason: '',
            recurseEvery: 'rescurse',
            neverEnds: false,
            followUpReminder: false,
            arrangeFollowUpReminder: false,
            firstAppointment: new Date(),
            lastAppointment: new Date(),
            recurringAppointment: false,
            branch: 'select',
            //  doctorId: 0,
            examRoom: 'select',
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        });
        this.refresh.next();
    };
    AddAppointmentComponent.prototype.getSearchedBranch = function (value) {
        console.log('value' + value);
        this.searchedBranch = value;
    };
    AddAppointmentComponent.prototype.getSearchedDoctor = function (value) {
        console.log('value' + value);
        this.searchedDoctor = value;
    };
    AddAppointmentComponent.prototype.searchAppointment = function () {
        var _this = this;
        var self = this;
        this.requestsService.searchWithParam(app_constants_1.AppConstants.SEARCH_APPOINTMENT_URL, this.searchedDoctor, this.searchedBranch)
            .subscribe(function (response) {
            if (response['responseCode'] === 'APPT_SUC_01') {
                _this.events.length = 0;
                self.notificationService.success('Success', "Appointment Founded ");
                for (var _i = 0, _a = response['responseData']; _i < _a.length; _i++) {
                    var apt = _a[_i];
                    _this.events.push({
                        id: apt.id,
                        title: apt.patient,
                        start: date_fns_1.startOfDay(new Date(apt.scheduleDate)),
                        end: date_fns_1.endOfDay(new Date(apt.scheduleDate)),
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
                        //service id
                    });
                    _this.refresh.next();
                }
            }
            if (response['responseCode'] === 'APPT_ERR_03') {
                _this.events = [];
                self.notificationService.warn("No Appointment Founded");
            }
        }, function (error) {
            console.log('user defined Erro ' + error);
        });
    };
    AddAppointmentComponent.prototype.selectRecurringDays = function (event, item) {
        console.log(this.examRooms.lenght);
        if (event.target.checked) {
            this.selectedRecurringDays.push(item.name);
        }
        else {
            var updateItem = this.selectedRecurringDays.find(this.findIndexToUpdate, item.name);
            var index = this.selectedRecurringDays.indexOf(updateItem);
            this.selectedRecurringDays.splice(index, 1);
        }
    };
    AddAppointmentComponent.prototype.findIndexToUpdate = function (type) {
        return type.name === this;
    };
    AddAppointmentComponent.prototype.getExamRoom = function (event) {
        console.log('getExam');
        var roomId;
        var sp = event.split(': ');
        if (sp.length > 1)
            roomId = sp[1];
        else
            roomId = sp[0];
        var filteredData2 = this.branches.filter(function (x) { return x.id == roomId; });
        this.examRooms = filteredData2[0].examRooms;
    };
    AddAppointmentComponent.prototype.saveAppointment = function (event, form) {
        var _this = this;
        var self = this;
        this.Type.map(function (x) { return x.checked = false; });
        if (form.valid) {
            if (this.eventsRequest.length != 0) {
                var obj = new Appointment_1.Appointment(event.id, event.appointmentId, event.title, event.branchId, event.doctorId, event.scheduleDateAndTime, event.start, event.end, event.draggable, this.selectedRecurringDays, this.selectedType, event.notes, event.patientId, event.reason, event.status, event.duration, event.followUpDate, event.followUpReason, event.followUpReminder, event.recurringAppointment, event.recurseEvery, event.firstAppointment, event.lastAppointment, event.examRoom, event.age, event.cellPhone, event.gender, event.email, this.color, event.roomId, event.newPatient, event.dob, event.serviceId);
                this.requestsService.postRequest(app_constants_1.AppConstants.CREATE_APPOINTMENT_URL, obj)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'APPT_SUC_02') {
                        self.notificationService.success('created successfully', 'Appointment');
                        self.router.navigate(['/dashboard/appointment/manage']);
                        _this.eventsRequest.length = 0;
                        $('#exampleModalCenter2').modal('close');
                    }
                    if (response['responseCode'] === 'APPT_ERR_06') {
                        _this.eventsRequest.length = 0;
                        self.notificationService.error('Appointment on this Schedule is Already Exists', 'Appointment');
                    }
                    else {
                        _this.eventsRequest.length = 0;
                        self.notificationService.error('Appointment is not created', 'Appointment');
                    }
                }, function (error) {
                });
            }
        }
        else {
            this.eventsRequest.length = 0;
            //   $('#exampleModalCenter2').modal('close');
            //   this.validateAllFormFields(form);
            self.notificationService.error('Error', 'Invalid Form');
        }
    };
    AddAppointmentComponent.prototype.updateAppointment = function (event) {
        var self = this;
        var obj = new Appointment_1.Appointment(event.id, event.appointmentId, event.title, event.branchId, event.doctorId, event.scheduleDateAndTime, event.start, event.end, event.draggable, this.selectedRecurringDays, this.selectedType, event.notes, event.patientId, event.reason, event.status, event.duration, event.followUpDate, event.followUpReason, event.followUpReminder, event.recurringAppointment, event.recurseEvery, event.firstAppointment, event.lastAppointment, event.examRoom, event.age, event.cellPhone, event.gender, event.email, this.color, event.roomId, event.newPatient, event.dob, event.serviceId);
        this.requestsService.putRequest(app_constants_1.AppConstants.UPDATE_APPOINTMENT + event.id, obj).subscribe(function (response) {
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
    ], AddAppointmentComponent.prototype, "modalContent", void 0);
    AddAppointmentComponent = __decorate([
        core_1.Component({
            selector: 'add-appointment-component',
            templateUrl: '../../../templates/dashboard/appointment/add-appointment-template.html',
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal, material_1.MatDialog, forms_1.FormBuilder,
            notification_service_1.NotificationService, router_1.Router, requests_service_1.RequestsService])
    ], AddAppointmentComponent);
    return AddAppointmentComponent;
}());
exports.AddAppointmentComponent = AddAppointmentComponent;
//# sourceMappingURL=add-appointment.component.js.map