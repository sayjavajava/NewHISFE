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
var app_constants_1 = require("../../../utils/app.constants");
var his_util_service_1 = require("../../../services/his-util.service");
var requests_service_1 = require("../../../services/requests.service");
var notification_service_1 = require("../../../services/notification.service");
var DataService_1 = require("../../../services/DataService");
var patient_1 = require("../../../model/patient");
var PatientHistoryComponent = (function () {
    function PatientHistoryComponent(requestsService, router, route, HISUTilService, notificationService, dataService) {
        var _this = this;
        this.requestsService = requestsService;
        this.router = router;
        this.route = route;
        this.HISUTilService = HISUTilService;
        this.notificationService = notificationService;
        this.dataService = dataService;
        this.problemPages = [];
        this.problemActiveData = [];
        this.allergiesPages = [];
        this.allergiesActiveData = [];
        this.medicationsPages = [];
        this.medicationsActiveData = [];
        this.patient = new patient_1.Patient();
        this.subscription = this.dataService.currentPatientId.subscribe(function (id) {
            _this.selectedPatientId = id;
        });
        this.getPaginatedProblemsByActiveAndPatientIdFromServer(0, 5, 'ACTIVE');
        this.getPaginatedAllergiesByActiveAndPatientIdFromServer(0, 5, 'ACTIVE');
        this.getPaginatedMedicationsByActiveAndPatientIdFromServer(0, 5, 'ACTIVE');
        this.getPatientByIdFromServer(this.selectedPatientId);
    }
    PatientHistoryComponent.prototype.ngOnInit = function () {
    };
    PatientHistoryComponent.prototype.getPatientByIdFromServer = function (patientId) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + patientId).subscribe(function (response) {
            if (response['responseCode'] === 'USER_SUC_01') {
                _this.patient = response['responseData'];
                var apptId = response['responseData']['pastAppointments'];
            }
            else {
                _this.notificationService.error(response['responseMessage'], 'Patient');
                // this.router.navigate(['404-not-found'])
            }
        }, function (error) {
            _this.HISUTilService.tokenExpired(error.error.error);
        });
    };
    PatientHistoryComponent.prototype.getPaginatedProblemsByActiveAndPatientIdFromServer = function (page, pageSize, problemStatus) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_PROBLEM_FETCH_STATUS_URL + page +
            "?selectedPatientId=" + this.selectedPatientId +
            "&status=" + problemStatus +
            "&pageSize=" + pageSize)
            .subscribe(function (response) {
            if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_16') {
                _this.problemNextPage = response['responseData']['nextPage'];
                _this.problemPrePage = response['responseData']['prePage'];
                _this.problemCurrPage = response['responseData']['currPage'];
                _this.problemPages = response['responseData']['pages'];
                _this.problemActiveData = [];
                _this.problemActiveData = response['responseData']['data'];
            }
        }, function (error) {
            _this.HISUTilService.tokenExpired(error.error.error);
        });
    };
    PatientHistoryComponent.prototype.getPageWiseProblemActive = function (page) {
        this.getPaginatedProblemsByActiveAndPatientIdFromServer(page, 5, 'ACTIVE');
    };
    PatientHistoryComponent.prototype.getPaginatedAllergiesByActiveAndPatientIdFromServer = function (page, pageSize, allergyStatus) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.ALLERGY_PAGINATED_STATUS_URL + page +
            "?selectedPatientId=" + this.selectedPatientId +
            "&status=" + allergyStatus +
            "&pageSize=" + pageSize)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ALLERGY_SUC_28') {
                _this.allergiesNextPage = response['responseData']['nextPage'];
                _this.allergiesPrePage = response['responseData']['prePage'];
                _this.allergiesCurrPage = response['responseData']['currPage'];
                _this.allergiesPages = response['responseData']['pages'];
                _this.allergiesActiveData = [];
                _this.allergiesActiveData = response['responseData']['data'];
            }
        }, function (error) {
            _this.HISUTilService.tokenExpired(error.error.error);
        });
    };
    PatientHistoryComponent.prototype.getPageWiseAllergiesByActive = function (page) {
        this.getPaginatedAllergiesByActiveAndPatientIdFromServer(page, 5, 'ACTIVE');
    };
    PatientHistoryComponent.prototype.goToUserDashBoard = function () {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    };
    PatientHistoryComponent.prototype.getPaginatedMedicationsByActiveAndPatientIdFromServer = function (page, pageSize, medicationStatus) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.MEDICATION_PAGINATED_STATUS_URL + page +
            "?selectedPatientId=" + this.selectedPatientId +
            "&status=" + medicationStatus +
            "&pageSize=" + pageSize)
            .subscribe(function (response) {
            if (response['responseCode'] === 'MEDICATION_SUC_36') {
                _this.medicationsNextPage = response['responseData']['nextPage'];
                _this.medicationsPrePage = response['responseData']['prePage'];
                _this.medicationsCurrPage = response['responseData']['currPage'];
                _this.medicationsPages = response['responseData']['pages'];
                _this.medicationsActiveData = [];
                _this.medicationsActiveData = response['responseData']['data'];
            }
        }, function (error) {
            _this.HISUTilService.tokenExpired(error.error.error);
        });
    };
    PatientHistoryComponent.prototype.getPageWiseMedicationsByActive = function (page) {
        this.getPaginatedMedicationsByActiveAndPatientIdFromServer(page, 5, 'ACTIVE');
    };
    PatientHistoryComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    PatientHistoryComponent.prototype.patientHistory = function () {
        // this.dataService.getPatientId(id);//
        var url = '/dashboard/patient/' + this.selectedPatientId + '/history';
        this.router.navigate([url]);
    };
    PatientHistoryComponent = __decorate([
        core_1.Component({
            selector: 'patient-history',
            templateUrl: '../../../templates/dashboard/patient/patient-history.template.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router,
            router_1.ActivatedRoute,
            his_util_service_1.HISUtilService,
            notification_service_1.NotificationService,
            DataService_1.DataService])
    ], PatientHistoryComponent);
    return PatientHistoryComponent;
}());
exports.PatientHistoryComponent = PatientHistoryComponent;
//# sourceMappingURL=patient-history.component.js.map