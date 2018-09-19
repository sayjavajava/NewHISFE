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
var router_1 = require("@angular/router");
var medication_model_1 = require("../../../model/medication.model");
var notification_service_1 = require("../../../services/notification.service");
var requests_service_1 = require("../../../services/requests.service");
var his_util_service_1 = require("../../../services/his-util.service");
var app_constants_1 = require("../../../utils/app.constants");
var DataService_1 = require("../../../services/DataService");
var patient_1 = require("../../../model/patient");
var PatientMedicationListComponent = (function () {
    function PatientMedicationListComponent(notificationService, requestsService, HISUtilService, router, activatedRoute, dataService) {
        var _this = this;
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataService = dataService;
        this.pages = [];
        this.medicationData = [];
        this.medicationModel = new medication_model_1.MedicationModel();
        this.appointments = [];
        this.isUpdate = false;
        this.patient = new patient_1.Patient();
        this.futureAppointments = [];
        this.pastAppointments = [];
        this.subscription = this.dataService.currentPatientId.subscribe(function (id) {
            _this.selectedPatientId = id;
        });
        this.getPaginatedMedicationFromServer(0);
        this.appointmentsByPatientFromServer(this.selectedPatientId);
    }
    PatientMedicationListComponent.prototype.ngOnInit = function () {
        console.log(this.selectedPatientId);
    };
    PatientMedicationListComponent.prototype.appointmentsByPatientFromServer = function (selectedPatientId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + selectedPatientId).subscribe(function (response) {
                if (response['responseCode'] === 'USER_SUC_01') {
                    _this.patient = response['responseData'];
                    _this.futureAppointments = [];
                    _this.futureAppointments = response['responseData'].futureAppointments;
                    _this.pastAppointments = [];
                    _this.pastAppointments = response['responseData'].pastAppointments;
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Patient');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientMedicationListComponent.prototype.addMedication = function () {
        console.log('test' + this.selectedPatientId);
        this.isUpdate = false;
        this.medicationModel = new medication_model_1.MedicationModel();
        this.appointmentsByPatientFromServer(this.selectedPatientId);
    };
    PatientMedicationListComponent.prototype.saveMedication = function (mdForm) {
        var _this = this;
        if (this.selectedPatientId <= 0) {
            this.notificationService.warn("Please select patient from dashboard again ");
            return;
        }
        if (this.medicationModel.appointmentId <= 0) {
            this.notificationService.warn("Please select appoint.");
            document.getElementById('appointmentId').focus();
            return;
        }
        if (this.medicationModel.drugName === "") {
            this.notificationService.warn("Please provide drug name.");
            document.getElementById('drugNameId').focus();
            return;
        }
        if (this.medicationModel.datePrescribedString === "") {
            this.notificationService.warn("Please provide proper prescribed date and time.");
            document.getElementById('datePrescribedId').focus();
            return;
        }
        if (this.medicationModel.dateStartedTakingString === "") {
            this.notificationService.warn("Please provide proper start taking date and time.");
            document.getElementById('dateStartedTakingId').focus();
            return;
        }
        if (this.medicationModel.dateStoppedTakingString === "") {
            this.notificationService.warn("Please provide proper stoop taking date and time.");
            document.getElementById('dateStoppedTakingId').focus();
            return;
        }
        if (localStorage.getItem(btoa('access_token'))) {
            this.medicationModel.patientId = this.selectedPatientId;
            this.requestsService.postRequest(app_constants_1.AppConstants.MEDICATION_SAVE_URL, this.medicationModel)
                .subscribe(function (response) {
                if (response['responseCode'] === 'MEDICATION_SUC_28') {
                    _this.notificationService.success(response['responseMessage'], 'Medication');
                    _this.getPaginatedMedicationFromServer(0);
                    _this.closeBtnMedication.nativeElement.click();
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Medication');
                    _this.getPaginatedMedicationFromServer(0);
                }
            }, function (error) {
                if (error.error.responseMessage === "Patient not found" ||
                    error.error.responseMessage === "Appoint not found") {
                    _this.notificationService.error(error.error.responseMessage, 'Medication');
                }
                else {
                    _this.HISUtilService.tokenExpired(error.error.error);
                }
            });
        }
    };
    PatientMedicationListComponent.prototype.getPaginatedMedicationFromServer = function (page) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.MEDICATION_PAGINATED_URL + page + "?selectedPatientId=" + this.selectedPatientId)
            .subscribe(function (response) {
            if (response['responseCode'] === 'MEDICATION_SUC_32') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.medicationData = response['responseData']['data'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    PatientMedicationListComponent.prototype.getPageWiseMedications = function (p) {
        this.getPaginatedMedicationFromServer(p);
    };
    PatientMedicationListComponent.prototype.deleteMedication = function (medicationId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are Your Source You Want To Delete"))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.MEDICATION_DELETE_URI + medicationId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'MEDICATION_SUC_33') {
                    _this.notificationService.success(response['responseMessage'], 'Medication');
                    _this.getPaginatedMedicationFromServer(0);
                }
                else {
                    _this.getPaginatedMedicationFromServer(0);
                    _this.notificationService.error(response['responseMessage'], 'Medication');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientMedicationListComponent.prototype.editMedication = function (medicationId) {
        var _this = this;
        this.isUpdate = true;
        this.medicationModel = new medication_model_1.MedicationModel();
        if (medicationId > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(app_constants_1.AppConstants.MEDICATION_GET_URL + 'medicationId=' + medicationId)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'MEDICATION_SUC_34') {
                        _this.medicationModel = response['responseData'];
                        _this.appointmentsByPatientFromServer(_this.medicationModel.patientId);
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Medication');
                    }
                }, function (error) {
                    _this.HISUtilService.tokenExpired(error.error.error);
                });
            }
            else {
                this.router.navigate(['/login']);
            }
        }
        else {
            this.notificationService.error('Please select proper Medication', 'Medication');
        }
    };
    PatientMedicationListComponent.prototype.updateMedication = function (mdForm) {
        var _this = this;
        if (this.selectedPatientId <= 0) {
            this.notificationService.warn("Please select patient from dashboard again ");
            return;
        }
        if (this.medicationModel.appointmentId <= 0) {
            this.notificationService.warn("Please select appoint.");
            document.getElementById('appointmentId').focus();
            return;
        }
        if (this.medicationModel.drugName === "") {
            this.notificationService.warn("Please provide drug name.");
            document.getElementById('drugNameId').focus();
            return;
        }
        if (this.medicationModel.datePrescribedString === "") {
            this.notificationService.warn("Please provide proper prescribed date and time.");
            document.getElementById('datePrescribedId').focus();
            return;
        }
        if (this.medicationModel.dateStartedTakingString === "") {
            this.notificationService.warn("Please provide proper start taking date and time.");
            document.getElementById('dateStartedTakingId').focus();
            return;
        }
        if (this.medicationModel.dateStoppedTakingString === "") {
            this.notificationService.warn("Please provide proper stoop taking date and time.");
            document.getElementById('dateStoppedTakingId').focus();
            return;
        }
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.putRequest(app_constants_1.AppConstants.MEDICATION_UPDATE_URL, this.medicationModel)
                .subscribe(function (response) {
                if (response['responseCode'] === 'MEDICATION_SUC_35') {
                    _this.notificationService.success(response['responseMessage'], 'Medication');
                    _this.getPaginatedMedicationFromServer(0);
                    _this.closeBtnMedication.nativeElement.click();
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Medication');
                    _this.getPaginatedMedicationFromServer(0);
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientMedicationListComponent.prototype.getPaginatedDataFromServer = function (page) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.PAGINATED_URL + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'MEDICATION_SUC_32') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.medicationData = response['responseData']['data'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    __decorate([
        core_1.ViewChild('closeBtnMedication'),
        __metadata("design:type", core_1.ElementRef)
    ], PatientMedicationListComponent.prototype, "closeBtnMedication", void 0);
    PatientMedicationListComponent = __decorate([
        core_1.Component({
            selector: 'patient-medical-list',
            templateUrl: '../../../templates/dashboard/patient/patient-medication-list.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router,
            router_1.ActivatedRoute,
            DataService_1.DataService])
    ], PatientMedicationListComponent);
    return PatientMedicationListComponent;
}());
exports.PatientMedicationListComponent = PatientMedicationListComponent;
//# sourceMappingURL=patient-medication-list.component.js.map