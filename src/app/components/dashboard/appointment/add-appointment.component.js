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
var branch_1 = require("../../../model/branch");
var his_util_service_1 = require("../../../services/his-util.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var angular2_datetimepicker_1 = require("angular2-datetimepicker");
var util_1 = require("util");
var AddAppointmentComponent = (function () {
    function AddAppointmentComponent(modal, dialog, fb, hisCoreUtilService, notificationService, router, requestsService, renderer) {
        var _this = this;
        this.modal = modal;
        this.dialog = dialog;
        this.fb = fb;
        this.hisCoreUtilService = hisCoreUtilService;
        this.notificationService = notificationService;
        this.router = router;
        this.requestsService = requestsService;
        this.renderer = renderer;
        this.refresh = new ReplaySubject_1.ReplaySubject(1);
        this.events = [];
        this.eventsRequest = [];
        this.activeDayIsOpen = false;
        this.title = 'app';
        this.patientChecked = false;
        this.popup = false;
        this.page = 0;
        this.startDate = new Date(2018, 1, 1);
        this.dateSchedule = new Date();
        this.view = 'month';
        this.newPatient = false;
        this.viewDate = new Date();
        this.data = [];
        this.brFiltered = [];
        this.patients = [];
        this.selectedType = [];
        this.updateSelectedType = [];
        this.appointmentType = [];
        this.examRooms = [];
        this.test = 'lahore';
        this.servicesList = [];
        this.servicesListWithDoctors = [];
        this.disbaleDoctor = false;
        this.serviceDuration = 0;
        this.maxNo = false;
        this.amt = 0;
        this.statusesList = [];
        this.isRecurringFlag = false;
        this.lastAppointmentRecurring = new Date();
        this.fastAppointmentRecurring = new Date();
        this.stateOfPatientBox = false;
        this.status = [
            { id: 1, name: 'CONFIRMED' },
            { id: 2, name: 'CHECK_IN' },
            { id: 3, name: 'IN_SESSION' },
            { id: 4, name: 'RE_SCHEDULED' },
            { id: 5, name: 'COMPLETE' },
            { id: 9, name: 'CANCELLED' },
            { id: 7, name: 'IN_ROOM' },
            { id: 8, name: 'NOT_CONFIRMED' },
        ];
        this.Type = [
            { id: 1, name: 'Regular', checked: false },
            { id: 2, name: 'Walk-In', checked: false }
            /* {id: 4, name: 'NewPatient', checked: false},*/
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
        this.allServices();
        this.getPatientFromServer();
        this.allServicesWithDoctors();
        this.getBranchesAndDoctorFromServer();
        angular2_datetimepicker_1.DatePicker.prototype.ngOnInit = function () {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }
            this.settings.timePicker = true;
            // this.settings.format = 'dd-MM-yyyy'
            this.date = new Date();
        };
    }
    AddAppointmentComponent.prototype.ngAfterViewInit = function () {
        this.getAllAppointments();
    };
    AddAppointmentComponent.prototype.getAllAppointments = function () {
        var _this = this;
        this.events.length = 0;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_APPOINTMENTS_URL)
            .subscribe(function (response) {
            console.log('');
            if (response['responseCode'] === 'APPT_SUC_01') {
                for (var _i = 0, _a = response['responseData']; _i < _a.length; _i++) {
                    var apt = _a[_i];
                    _this.events.push({
                        id: apt.id,
                        /* title: `${apt.patient}  ' ' ${apt.scheduleDateAndTime}  ' '  ${apt.branchName}`,*/
                        title: /*'<div  class="popup-hiden">\n' +apt.branchName+*/ '<div class="headng-bck">\n' +
                            ' <div class="hadng-txt">\n' +
                            '<table width="236" border="0">\n' +
                            '\n' +
                            '<tr class="" width="236">\n' +
                            '    <td style="width:20%; padding: 6px !important; margin: 6px;"><img alt="" width="70" height="70" class="img-circle" src="/public/images/patient.jpg"></td>\n' +
                            '    <td style="width:80%; padding: 6px !important; margin: 6px;"><h2>Patient Name</h2></td>\n' +
                            '</tr>\n' +
                            '  </table>\n' +
                            '            </div>\n' +
                            /* '        </div> ' +*/
                            '<div class="bc-bg">\n' +
                            '                <table width="236" border="0">\n' +
                            '\n' +
                            '            <tr class="gry-bckgrnd inr-txt">\n' +
                            '                    <td style="width:30%">Branch</td>\n' +
                            '                    <td style="width:70%">\n' + apt.branchName + '</td>\n' +
                            '                </tr>\n' +
                            '            <tr class="whte-bckgrnd inr-txt">\n' +
                            '                    <td style="width:30%">Patient Name</td>\n' +
                            '                    <td style="width:70%">\n' + apt.patient + '</td>\n' +
                            '                </tr>\n' +
                            '            <tr class="whte-bckgrnd inr-txt">\n' +
                            '                    <td style="width:30%">Duration</td>\n' +
                            '                    <td style="width:70%">\n' + apt.duration + '</td>\n' +
                            '                </tr>\n' +
                            '            <tr class="whte-bckgrnd inr-txt">\n' +
                            '                    <td style="width:30%">Doctor</td>\n' +
                            '                    <td style="width:70%">\n' + apt.docFirstName + '</td>\n' +
                            '                </tr>\n' +
                            '            <tr class="whte-bckgrnd inr-txt">\n' +
                            '                    <td style="width:30%">Service</td>\n' +
                            '                    <td style="width:70%">\n' + apt.serviceName + '</td>\n' +
                            '                </tr>\n' +
                            '            <tr class="whte-bckgrnd inr-txt">\n' +
                            '                    <td style="width:30%">Service</td>\n' +
                            '                    <td style="width:70%">\n' + apt.serviceName + '</td>\n' +
                            '                </tr>\n' +
                            '            <tr class="whte-bckgrnd inr-txt">\n' +
                            '                    <td style="width:30%">Service</td>\n' +
                            '                    <td style="width:70%">\n' + apt.serviceName + '</td>\n' +
                            '                </tr>\n' +
                            '            <tr class="whte-bckgrnd inr-txt">\n' +
                            '                    <td style="width:30%">Room</td>\n' +
                            '                    <td style="width:70%">\n' + apt.examName + '</td>\n' +
                            '                </tr>\n' +
                            '            </table>\n' +
                            '                \n' +
                            '            </div>\n' +
                            '            </div>\n',
                        /*   '<br/>' + '' + apt.scheduleDateAndTime + '<br/>' + " " + apt.branchName,*/
                        start: date_fns_1.addMinutes(date_fns_1.startOfDay(new Date(apt.scheduleDate)), apt.appointmentConvertedTime),
                        end: date_fns_1.addMinutes(date_fns_1.startOfDay(new Date(apt.scheduleDate)), apt.appointmentEndedConvertedTime),
                        /*color: {
                            primary: apt.color,
                            secondary: apt.color
                        },*/
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
                        followUpDate: apt.followUpDateResponse,
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
                        serviceId: apt.serviceId,
                        patientId: apt.patientId,
                        appointmentId: apt.appointmentId,
                        statusId: apt.statusId
                    });
                    _this.refresh.next();
                }
            }
            //  this.renderer.setText(this.nameInputRef,'kamiii')
        }, function (error) {
            //  this.hisUtilService.tokenExpired(error.error.error);
        });
    };
    AddAppointmentComponent.prototype.ngOnInit = function () {
        this.allStatusesOfOrganization();
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
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    AddAppointmentComponent.prototype.closeAddModal = function () {
        this.eventsRequest.length = 0;
        this.selectedType.length = 0;
        this.refresh.next();
        this.maxNo = false;
        this.amt = 0;
        if (this.Type.length != 0)
            this.Type.map(function (x) { x.checked = false; });
        this.addModal.hide();
    };
    AddAppointmentComponent.prototype.selectType = function (form, checked) {
        this.selectedType.length = 0;
        if (checked)
            this.amt++;
        else
            this.amt--;
        this.amt === 2 ? this.maxNo = true : this.maxNo = false;
        console.log('amount' + this.amt);
        (_a = this.selectedType).push.apply(_a, this.selectedOptions);
        var _a;
    };
    AddAppointmentComponent.prototype.createNewPatient = function () {
        if (this.stateOfPatientBox) {
            this.patientChecked = true;
            this.newPatient = true;
        }
        else {
            this.patientChecked = false;
            this.newPatient = false;
        }
    };
    AddAppointmentComponent.prototype.moveMouse = function (action, event) {
        this.modalData = { event: event, action: action };
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
    AddAppointmentComponent.prototype.getBranchesAndDoctorFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_WITH_DOCTOR_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branchDoctor = response['responseData'];
                var brObj_1;
                var _brMap_1 = new Map();
                _this.branchDoctor.forEach(function (element) {
                    _brMap_1.set(element.id, element.branchName);
                });
                _brMap_1.forEach(function (key, value) {
                    brObj_1 = new branch_1.Branch(value, key);
                    _this.brFiltered.push(brObj_1);
                });
            }
        }, function (error) {
        });
    };
    AddAppointmentComponent.prototype.allServicesWithDoctors = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_MEDICALSERVICES_WITH_DOCTORS)
            .subscribe(function (response) {
            //console.log('i am branch call');
            if (response['responseCode'] === 'MED_SER_SUC_01') {
                _this.servicesListWithDoctors = response['responseData'];
                //console.log(this.servicesList);
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    AddAppointmentComponent.prototype.allStatusesOfOrganization = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_STATUSES)
            .subscribe(function (response) {
            //console.log('i am branch call');
            if (response['responseCode'] === 'STATUS_SUC_05') {
                _this.statusesList = response['responseData'];
                //console.log(this.servicesList);
            }
        }, function (error) {
            _this.error = error.error.error;
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
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    };
    AddAppointmentComponent.prototype.handleEvent = function (action, event) {
        this.modalData = { event: event, action: action };
        this.filteredDoctor = this.branchDoctor.slice();
        this.filteredServices = this.servicesListWithDoctors.slice();
        this.disbaleDoctor = true;
        this.Type.filter(function (e) { return event.appointmentType.includes(e.name); }).map(function (e) { return e.checked = true; });
        this.selectedType = event.appointmentType;
        var filteredData2 = this.branches.filter(function (x) { return x.id == event.branchId; });
        this.examRooms = filteredData2[0].examRooms;
        $('#exampleModalCenter2').modal('show');
    };
    AddAppointmentComponent.prototype.deleteEvent = function (action, event) {
        this.eventsRequest.splice(this.eventsRequest.indexOf(event), 1);
        //this.refresh.next();
    };
    AddAppointmentComponent.prototype.addEvent = function (date) {
        this.disbaleDoctor = true;
        this.eventsRequest.length = 0;
        this.serviceDuration = 0;
        this.addModal.show();
        //  $('#create-responsive').modal('show');
        /* $('#create-responsive').on('show', function() {
             alert('hello i am jquery');
         })*/
        this.eventsRequest.push({
            title: 'Name',
            start: date_fns_1.startOfDay(new Date(date)),
            end: date_fns_1.endOfDay(date),
            draggable: true,
            notes: '',
            email: '',
            patient: 0,
            reason: '',
            status: 'CONFIRMED',
            duration: this.serviceDuration,
            age: 'age',
            type: '',
            gender: 'Gender',
            cellPhone: '',
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
    AddAppointmentComponent.prototype.getSearchedBranch = function (brObj) {
        this.searchedBranch = brObj.value;
    };
    AddAppointmentComponent.prototype.getSearchedDoctor = function (docObj) {
        this.searchedDoctor = docObj.value;
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
    AddAppointmentComponent.prototype.getExamRoom = function (eventObj) {
        this.disbaleDoctor = false;
        console.log('br objj' + eventObj.value);
        /*  var sp = event.split(': ');
          if (sp.length > 1)
              roomId = sp[1];
          else
              roomId = sp[0];*/
        var roomId = eventObj.value;
        var filteredData2 = this.branchDoctor.filter(function (x) { return x.id == roomId; });
        var filterDoctor = this.branchDoctor.filter(function (x) { return x.id == roomId; });
        if (filteredData2.length != 0) {
            this.examRooms = filteredData2[0].examRooms;
        }
        var filteredDoctorsWithValue = [];
        var branchDocobj2 = null;
        filterDoctor.forEach(function (x) {
            branchDocobj2 = new DoctorService(x.firstName + x.lastName, x.doctorId);
            filteredDoctorsWithValue.push(branchDocobj2);
        });
        //  filteredDoctorsWithValue.forEach(x=>{console.log('xv' , x.label , x.value)})
        this.filteredDoctor = filteredDoctorsWithValue.slice();
    };
    AddAppointmentComponent.prototype.selectServices = function (item) {
        var list = this.servicesListWithDoctors.filter(function (x) { return x.doctorId == item.value; });
        this.filteredServices = list.slice();
    };
    AddAppointmentComponent.prototype.isRecurring = function () {
        this.isRecurringFlag = !this.isRecurringFlag;
    };
    AddAppointmentComponent.prototype.saveAppointment = function (event, form) {
        var _this = this;
        var self = this;
        var dateTes = convert(this.dateSchedule);
        console.log('appt schedulae date ' + event.firstAppointment);
        this.Type.map(function (x) { return x.checked = false; });
        if (form.valid) {
            if (this.selectedType.length == 0) {
                this.eventsRequest.length = 0;
                self.notificationService.error('Select At leat One Type', 'Invalid Form');
            }
            if (this.newPatient == false && event.patientId == null) {
                this.eventsRequest.length = 0;
                self.notificationService.error('Patient is required', 'Invalid Form');
            }
            if (this.newPatient == true && event.newPatient == undefined) {
                this.eventsRequest.length = 0;
                this.newPatient = false;
                self.notificationService.error('Patient Name and Cell Phone are mandatory', 'Invalid Form');
            }
            if (this.eventsRequest.length != 0) {
                var obj = new Appointment_1.Appointment(event.id, event.appointmentId, event.title, event.branchId, event.doctorId, event.scheduleDateAndTime, event.start, event.end, event.draggable, this.selectedRecurringDays, this.selectedType, event.notes, event.patientId, event.reason, event.statusId, this.serviceDuration, event.followUpDate, event.followUpReason, event.followUpReminder, event.recurringAppointment, event.recurseEvery, event.firstAppointment, event.lastAppointment, event.examRoom, event.age, event.cellPhone, event.gender, event.email, this.color, event.roomId, event.newPatient, event.dob, event.serviceId, this.stateOfPatientBox, this.dateSchedule);
                this.requestsService.postRequest(app_constants_1.AppConstants.CREATE_APPOINTMENT_URL, obj)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'APPT_SUC_02') {
                        self.notificationService.success('created successfully', 'Appointment');
                        self.router.navigate(['/dashboard/appointment/manage']);
                        _this.eventsRequest.length = 0;
                        _this.selectedType.length = 0;
                        _this.hisCoreUtilService.hidePopupWithCloseButtonId('closeAppt');
                        /*  $('#exampleModalCenter2').modal('close');*/
                    }
                    else if (response['responseCode'] === 'APPT_ERR_06') {
                        _this.eventsRequest.length = 0;
                        _this.selectedType.length = 0;
                        self.notificationService.error('Appointment on this Schedule is Already Exists', 'Appointment');
                        _this.hisCoreUtilService.hidePopupWithCloseButtonId('closeAppt');
                    }
                    else {
                        _this.eventsRequest.length = 0;
                        self.notificationService.error('Appointment is not created', 'Appointment');
                    }
                    _this.newPatient = false;
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
        var obj = new Appointment_1.Appointment(event.id, event.appointmentId, event.title, event.branchId, event.doctorId, event.scheduleDateAndTime, event.start, event.end, event.draggable, this.selectedRecurringDays, this.selectedType, event.notes, event.patientId, event.reason, event.statusId, event.duration, event.followUpDate, event.followUpReason, event.followUpReminder, event.recurringAppointment, event.recurseEvery, event.firstAppointment, event.lastAppointment, event.examRoom, event.age, event.cellPhone, event.gender, event.email, this.color, event.roomId, event.newPatient, event.dob, event.serviceId);
        this.requestsService.putRequest(app_constants_1.AppConstants.UPDATE_APPOINTMENT + event.id, obj).subscribe(function (response) {
            console.log('event idd appt:' + event.appointmentId);
            if (response['responseCode'] === 'APPT_SUC_03') {
                self.notificationService.success('Updated successfully', 'Appointment');
                self.router.navigate(['/dashboard/appointment/manage']);
            }
            else {
                self.notificationService.warn("Warning, " + response['responseMessage']);
            }
        }, function (error) {
        });
    };
    AddAppointmentComponent.prototype.getSelectedService = function (item) {
        var _this = this;
        var list = this.servicesListWithDoctors.filter(function (x) { return x.mServiceId == item.value; });
        list.forEach(function (x) {
            console.log('services test' + x.doctorId + 'teta' + x.duration);
            if (!util_1.isNullOrUndefined(x))
                _this.serviceDuration = x.duration ? x.duration : '';
        });
    };
    AddAppointmentComponent.prototype.refreshAllAppointments = function () {
        this.getAllAppointments();
    };
    __decorate([
        core_2.ViewChild('modalContent'),
        __metadata("design:type", core_2.TemplateRef)
    ], AddAppointmentComponent.prototype, "modalContent", void 0);
    __decorate([
        core_2.ViewChild('addModal'),
        __metadata("design:type", ngx_bootstrap_1.ModalDirective)
    ], AddAppointmentComponent.prototype, "addModal", void 0);
    AddAppointmentComponent = __decorate([
        core_1.Component({
            selector: 'add-appointment-component',
            templateUrl: '../../../templates/dashboard/appointment/add-appointment-template.html',
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal, material_1.MatDialog, forms_1.FormBuilder, his_util_service_1.HISUtilService,
            notification_service_1.NotificationService, router_1.Router, requests_service_1.RequestsService, core_1.Renderer2])
    ], AddAppointmentComponent);
    return AddAppointmentComponent;
}());
exports.AddAppointmentComponent = AddAppointmentComponent;
var DoctorService = (function () {
    function DoctorService(label, value) {
        this.label = label;
        this.value = value;
    }
    return DoctorService;
}());
function convert(str) {
    var date = new Date(str), mnth = ("0" + (date.getMonth() + 1)).slice(-2), day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}
//# sourceMappingURL=add-appointment.component.js.map