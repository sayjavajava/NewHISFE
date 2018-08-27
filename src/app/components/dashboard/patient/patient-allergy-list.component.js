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
var his_util_service_1 = require("../../../services/his-util.service");
var requests_service_1 = require("../../../services/requests.service");
var notification_service_1 = require("../../../services/notification.service");
var app_constants_1 = require("../../../utils/app.constants");
var patient_allergy_model_1 = require("../../../model/patient.allergy.model");
var PatientAllergyListComponent = (function () {
    function PatientAllergyListComponent(notificationService, requestsService, HISUtilService, router, activatedRoute) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.pages = [];
        this.allergyData = [];
        this.pam = new patient_allergy_model_1.PatientAllergyModel(); //Patient Allergy model, it mean wrapper
        this.appointments = [];
        this.isUpdate = false;
        this.futureAppointments = [];
        this.pastAppointments = [];
        this.getPaginatedAllergyFromServer(0);
    }
    PatientAllergyListComponent.prototype.ngOnInit = function () {
    };
    PatientAllergyListComponent.prototype.appointmentsByServer = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.activatedRoute.params.subscribe(function (params) {
                var selectedPatientId = 1;
                /*Number(params['id']);*/
                _this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + selectedPatientId).subscribe(function (response) {
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
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientAllergyListComponent.prototype.getPaginatedAllergyFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_ALLERGY_PAGINATED_URL + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ALLERGY_SUC_18') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.allergyData = response['responseData']['data'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    PatientAllergyListComponent.prototype.addAllergy = function () {
        this.isUpdate = false;
        this.pam = new patient_allergy_model_1.PatientAllergyModel();
        this.appointmentsByServer();
    };
    PatientAllergyListComponent.prototype.saveAllergy = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.pam.patientId = 1;
            this.requestsService.postRequest(app_constants_1.AppConstants.PATIENT_ALLERGY_SAVE_URL, this.pam)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ALLERGY_SUC_17') {
                    _this.notificationService.success(response['responseMessage'], 'Allergy of Patient');
                    _this.getPaginatedAllergyFromServer(0);
                    //this.closeBtnAllergy.nativeElement.click();
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Allergy of Patient');
                    // this.getPaginatedProblemsFromServer(0);
                }
            }, function (error) {
                if (error.error.responseMessage === "Patient not found" ||
                    error.error.responseMessage === "Appoint not found") {
                    _this.notificationService.error(error.error.responseMessage, 'Allergy of Patient');
                }
                else {
                    _this.HISUtilService.tokenExpired(error.error.error);
                }
            });
        }
    };
    PatientAllergyListComponent.prototype.editAllergy = function () {
    };
    PatientAllergyListComponent.prototype.updateAllergy = function () {
    };
    PatientAllergyListComponent.prototype.deleteAllergy = function (allergyId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are Your Source You Want To Delete"))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.PATIENT_ALLERGY_DELETE_URI + allergyId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ALLERGY_SUC_22') {
                    _this.notificationService.success(response['responseMessage'], 'Allergy of Patient');
                    _this.getPaginatedAllergyFromServer(0);
                }
                else {
                    _this.getPaginatedAllergyFromServer(0);
                    _this.notificationService.error(response['responseMessage'], 'Allergy of Patient');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    __decorate([
        core_1.ViewChild('closeBtnAllergy'),
        __metadata("design:type", core_1.ElementRef)
    ], PatientAllergyListComponent.prototype, "closeBtnAllergy", void 0);
    PatientAllergyListComponent = __decorate([
        core_1.Component({
            selector: 'patient-alergy-list',
            templateUrl: '../../../templates/dashboard/patient/patient-allergy-list.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router,
            router_1.ActivatedRoute])
    ], PatientAllergyListComponent);
    return PatientAllergyListComponent;
}());
exports.PatientAllergyListComponent = PatientAllergyListComponent;
//# sourceMappingURL=patient-allergy-list.component.js.map