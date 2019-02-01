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
var platform_browser_1 = require("@angular/platform-browser");
var requests_service_1 = require("../../../services/requests.service");
var router_1 = require("@angular/router");
var app_constants_1 = require("../../../utils/app.constants");
var his_util_service_1 = require("../../../services/his-util.service");
var notification_service_1 = require("../../../services/notification.service");
var medical_service_1 = require("../../../model/medical-service");
var ConformationDialogService_1 = require("../../../services/ConformationDialogService");
var forms_1 = require("@angular/forms");
var angular2_datetimepicker_1 = require("angular2-datetimepicker");
var branch_1 = require("../../../model/branch");
var util_1 = require("util");
var material_1 = require("@angular/material");
var ManageAppointmentComponent = (function () {
    function ManageAppointmentComponent(requestsService, fb, router, titleService, snackBar, hisUtilService, confirmationDialogService, notificationService) {
        this.requestsService = requestsService;
        this.fb = fb;
        this.router = router;
        this.titleService = titleService;
        this.snackBar = snackBar;
        this.hisUtilService = hisUtilService;
        this.confirmationDialogService = confirmationDialogService;
        this.notificationService = notificationService;
        this.disbaleDoctor = true;
        this.examRooms = [];
        this.servicesListWithDoctors = [];
        this.pages = [];
        this.brFiltered = [];
        this.searchFlag = false;
        this.serviceDuration = 0;
        this.appointmentObj = new ManageAppointment();
        this.selectedMedicalService = new medical_service_1.MedicalService();
        this.patients = [];
        angular2_datetimepicker_1.DatePicker.prototype.ngOnInit = function () {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }
            this.settings.timePicker = true;
            this.date = new Date();
        };
    }
    ;
    ManageAppointmentComponent.prototype.ngOnInit = function () {
        this.getPatientFromServer();
        this.allStatusesOfOrganization();
        this.getBranchesAndDoctorFromServer();
        this.getBranchesFromServer();
        this.allServicesWithDoctors();
        this.titleService.setTitle('HIS | Manage Appointments');
        this.getAllPaginatedAppointmentsFromServer(0);
        this.cols = [
            { field: 'appointmentId', header: 'Appt#' },
            { field: 'patientFirstName', header: 'Patient' },
            { field: 'docFirstName', header: 'Doctor' },
            { field: 'serviceName', header: 'Service' },
            { field: 'examName', header: 'Room' },
            { field: 'branchName', header: 'Branch' },
            { field: 'apptType', header: 'Type' },
            { field: 'scheduleDate', header: 'Appt Time' },
            { field: 'checkIn', header: 'CheckIn' },
            { field: 'creatorName', header: 'Creator' },
            { field: 'status', header: 'status' },
            { field: 'status', header: 'Action' }
        ];
        /*        <th width="15%"> Patient</th>
                    <th width="15%"> Exam Room</th>
                <th width="10%"> Branch</th>
                    <th width="10%"> Type</th>
                    <th width="15%"> Started On</th>
                <th width="10%"> Ended On</th>
                <th width="10%"> Status</th>
                    <th width="10%"> Action</th>*/
    };
    ManageAppointmentComponent.prototype.allStatusesOfOrganization = function () {
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
    ManageAppointmentComponent.prototype.getPatientFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.GET_ALL_PATIENT_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'PATIENT_SUC_11') {
                _this.patients = response['responseData'];
            }
        }, function (error) {
        });
    };
    ManageAppointmentComponent.prototype.selectServices = function (item) {
        this.filteredServices = [];
        var list = this.servicesListWithDoctors.filter(function (x) { return x.doctorId == item.value; });
        this.filteredServices = list.slice();
    };
    ManageAppointmentComponent.prototype.allServicesWithDoctors = function () {
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
    ManageAppointmentComponent.prototype.updateAppointment = function (event) {
        var self = this;
        /*let obj = new Appointment(event.id, event.appointmentId, event.title, event.branchId, event.doctorId, event.scheduleDateAndTime, event.start, event.end, event.draggable, this.selectedRecurringDays, this.selectedType, event.notes, event.patientId,
            event.reason, event.statusId, event.duration, event.followUpDate, event.followUpReason, event.followUpReminder, event.recurringAppointment, event.recurseEvery,
            event.firstAppointment, event.lastAppointment, event.examRoom, event.age, event.cellPhone, event.gender, event.email, this.color, event.roomId, event.newPatient, event.dob, event.serviceId, this.stateOfPatientBox, event.start);
*/
        event.dateSchedule = new Date(event._dateSchedule);
        this.requestsService.putRequest(app_constants_1.AppConstants.UPDATE_APPOINTMENT + event.id, event).subscribe(function (response) {
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
    ManageAppointmentComponent.prototype.getSelectedService = function (item) {
        var _this = this;
        var list = this.servicesListWithDoctors.filter(function (x) { return x.mServiceId == item.value; });
        list.forEach(function (x) {
            console.log('services test' + x.doctorId + 'teta' + x.duration);
            if (!util_1.isNullOrUndefined(x))
                _this.serviceDuration = x.duration ? x.duration : '';
        });
    };
    ManageAppointmentComponent.prototype.getBranchesAndDoctorFromServer = function () {
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
    ManageAppointmentComponent.prototype.getBranchesFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branches = response['responseData'];
            }
        }, function (error) {
        });
    };
    ManageAppointmentComponent.prototype.getExamRoom = function (eventObj) {
        this.disbaleDoctor = false;
        this.disbaleDoctor = false;
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
        this.filteredDoctor = filteredDoctorsWithValue.slice();
    };
    ManageAppointmentComponent.prototype.createAppointmentForm = function () {
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
        });
    };
    ManageAppointmentComponent.prototype.getPageWisePatients = function (page) {
        this.getAllPaginatedAppointmentsFromServer(page);
    };
    ManageAppointmentComponent.prototype.getAllPaginatedAppointmentsFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_PAGINATED_APPOINTMENTS_URL + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'APPT_SUC_01') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.data = response['responseData']['data'];
            }
        }, function (error) {
            //  this.hisUtilService.tokenExpired(error.error.error);
        });
    };
    ManageAppointmentComponent.prototype.searchAppointment = function (page) {
        var _this = this;
        this.searchFlag = true;
        this.requestsService.getRequest(app_constants_1.AppConstants.SEARCH_APPOINTMENTS_BY_PATIENT + page + '?patientName=' + this.searchData)
            .subscribe(function (response) {
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
                _this.data = response['responseData'];
            }
        }, function (error) {
        });
    };
    ManageAppointmentComponent.prototype.deleteAppointment = function (id) {
        var _this = this;
        var self = this;
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(function (res) {
            if (id) {
                _this.requestsService.deleteRequest(app_constants_1.AppConstants.DELETE_APPOINTMENT_URI + id).subscribe(function (data) {
                    if (data['responseCode'] === 'APPT_SUC_05') {
                        self.notificationService.success('Appointment has been Deleted Successfully');
                        self.getAllPaginatedAppointmentsFromServer(0);
                    }
                }, function (error) {
                    self.notificationService.error('ERROR', 'Appointment Unable to Delete ');
                });
                // this.router.navigate(['/home']);
            }
        });
    };
    ManageAppointmentComponent.prototype.patchData = function (appt, id, msg) {
        if (msg) {
            this.updateBtnCheck = true;
        }
        else
            this.updateBtnCheck = false;
        this.createAppointmentForm();
        this.appointmentObj = appt;
        $('#appEditModal').modal('show');
    };
    ManageAppointmentComponent.prototype.getUpdatedStatus = function (statusValue, apptId, stObj) {
        var _this = this;
        var that = this;
        console.log('status log:' + stObj);
        if (stObj) {
            var stColor = this.statusesList.filter(function (x) { return x.id == stObj; });
            this.statusColor = stColor[0].colorHash;
            console.log(stColor);
        }
        this.confirmationDialogService
            .confirm('Update Status', 'Are you sure?')
            .subscribe(function (res) {
            if (res == true) {
                _this.requestsService.putRequestWithParam(app_constants_1.AppConstants.CHANGE_APPT_STATUS + apptId, statusValue)
                    .subscribe(function (res) {
                    if (res['responseCode'] === "STATUS_SUC_01") {
                        _this.snackBar.open('Status Updated', "Status has been Changed   Successfully", { duration: 3000 });
                    }
                }, function (error) {
                    _this.error = error.error.error;
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
    };
    ManageAppointmentComponent = __decorate([
        core_1.Component({
            selector: 'manage-appointment-component',
            templateUrl: '../../../templates/dashboard/appointment/manage-appointment.template.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService, forms_1.FormBuilder,
            router_1.Router,
            platform_browser_1.Title,
            material_1.MatSnackBar,
            his_util_service_1.HISUtilService,
            ConformationDialogService_1.ConformationDialogService,
            notification_service_1.NotificationService])
    ], ManageAppointmentComponent);
    return ManageAppointmentComponent;
}());
exports.ManageAppointmentComponent = ManageAppointmentComponent;
var DoctorService = (function () {
    function DoctorService(label, value) {
        this.label = label;
        this.value = value;
    }
    return DoctorService;
}());
var ManageAppointment = (function () {
    function ManageAppointment() {
        this._dateSchedule = new Date();
    }
    Object.defineProperty(ManageAppointment.prototype, "dateSchedule", {
        get: function () {
            console.log('getting..');
            return this.dateSchedule;
        },
        set: function (date) {
            console.log('setting..' + date);
            this._dateSchedule = date;
        },
        enumerable: true,
        configurable: true
    });
    return ManageAppointment;
}());
//# sourceMappingURL=manage-appointment.component.js.map