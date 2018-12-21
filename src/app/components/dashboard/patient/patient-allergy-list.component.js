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
var DataService_1 = require("../../../services/DataService");
var patient_1 = require("../../../model/patient");
var PatientAllergyListComponent = (function () {
    function PatientAllergyListComponent(notificationService, route, requestsService, HISUtilService, router, activatedRoute, dataService) {
        var _this = this;
        this.notificationService = notificationService;
        this.route = route;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataService = dataService;
        this.pages = [];
        this.allergyData = [];
        this.pam = new patient_allergy_model_1.PatientAllergyModel(); //Patient Allergy model, it mean wrapper
        this.appointments = [];
        this.isUpdate = false;
        this.patient = new patient_1.Patient();
        this.route.params.subscribe(function (params) {
            _this.selectedPatientId = params['id'];
        });
        this.getPaginatedAllergyFromServer(0);
        this.appointmentsByPatientFromServer(this.selectedPatientId);
    }
    PatientAllergyListComponent.prototype.ngOnInit = function () {
        this.allergyType = [
            { label: 'specificdrug', value: 'specificdrug' },
            { label: 'drugclass', value: 'drugclass' },
            { label: 'nondrug', value: 'nondrug' },
            { label: 'No Known Drug Allergies (NKDA)', value: 'nkda' },
        ];
        this.statusType = [
            { label: 'ACTIVE', value: 'ACTIVE' },
            { label: 'IN-ACTIVE', value: 'IN-ACTIVE' },
            { label: 'RESOLVED', value: 'RESOLVED' }
        ];
        this.cols = [
            { field: 'name', header: 'Allergy' },
            { field: 'reaction', header: 'Reaction' },
            { field: 'status', header: 'Status' },
            { field: 'note', header: 'Notes' },
            { field: 'updatedOn', header: 'Updated On' },
            { field: 'origin', header: 'Action' }
        ];
    };
    PatientAllergyListComponent.prototype.getPaginatedAllergyFromServer = function (p) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.ALLERGY_PAGINATED_URL + p + '?patientId=' + this.selectedPatientId)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ALLERGY_SUC_18') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.allergyData = response['responseData']['data'];
            }
            else {
                //    this.notificationService.error(response['responseMessage'])
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    PatientAllergyListComponent.prototype.getPageWiseAllergies = function (p) {
        this.getPaginatedAllergyFromServer(p);
    };
    PatientAllergyListComponent.prototype.appointmentsByPatientFromServer = function (selectedPatientId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + selectedPatientId).subscribe(function (response) {
                if (response['responseCode'] === 'USER_SUC_01') {
                    _this.patient = response['responseData'];
                    /*  this.futureAppointments = [];
                      this.futureAppointments = response['responseData'].futureAppointments;
                      this.pastAppointments = [];
                      this.pastAppointments = response['responseData'].pastAppointments;*/
                }
                else {
                    //    this.notificationService.error(response['responseMessage'], 'Patient');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientAllergyListComponent.prototype.addAllergy = function () {
        this.isUpdate = false;
        this.pam = new patient_allergy_model_1.PatientAllergyModel();
        this.appointmentsByPatientFromServer(this.selectedPatientId);
    };
    PatientAllergyListComponent.prototype.saveAllergy = function () {
        var _this = this;
        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select proper patient from dashboard again');
            return;
        }
        /*if (this.pam.appointmentId <= 0) {
            this.notificationService.warn('Please select proper appoint ');
            document.getElementById('appointmentId').focus();
            return;
        }*/
        if (this.pam.allergyType === '-1') {
            this.notificationService.warn('Please select type of allergy.');
            document.getElementById('typeId').focus();
            return;
        }
        if (this.pam.name === '') {
            this.notificationService.warn('Please enter name of allergy.');
            document.getElementById('nameId').focus();
            return;
        }
        if (localStorage.getItem(btoa('access_token'))) {
            this.pam.patientId = this.selectedPatientId;
            this.requestsService.postRequest(app_constants_1.AppConstants.ALLERGY_SAVE_URL, this.pam)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ALLERGY_SUC_17') {
                    _this.notificationService.success(response['responseMessage'], 'Allergy of Patient');
                    _this.getPaginatedAllergyFromServer(0);
                    _this.closeBtnAllergy.nativeElement.click();
                }
                else {
                    //        this.notificationService.error(response['responseMessage'], 'Allergy of Patient');
                    _this.getPaginatedAllergyFromServer(0);
                }
            }, function (error) {
                if (error.error.responseMessage === 'Patient not found' ||
                    error.error.responseMessage === 'Appoint not found') {
                    _this.notificationService.error(error.error.responseMessage, 'Allergy of Patient');
                }
                else {
                    _this.HISUtilService.tokenExpired(error.error.error);
                }
            });
        }
    };
    PatientAllergyListComponent.prototype.editAllergy = function (allergyId) {
        var _this = this;
        this.isUpdate = true;
        this.pam = new patient_allergy_model_1.PatientAllergyModel();
        if (allergyId > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(app_constants_1.AppConstants.ALLERGY_GET_URL + 'allergyId=' + allergyId)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'ALLERGY_SUC_24') {
                        _this.pam = response['responseData'];
                        _this.appointmentsByPatientFromServer(_this.pam.patientId);
                    }
                    else {
                        //         this.notificationService.error(response['responseMessage'], 'Allergy of Patient');
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
            this.notificationService.error('Please select proper Allergy', 'Allergy of Patient');
        }
    };
    PatientAllergyListComponent.prototype.updateAllergy = function () {
        var _this = this;
        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select proper patient from dashboard again');
            return;
        }
        if (this.pam.appointmentId <= 0) {
            this.notificationService.warn('Please select proper appoint ');
            document.getElementById('appointmentId').focus();
            return;
        }
        if (this.pam.allergyType === '-1') {
            this.notificationService.warn('Please select type of allergy.');
            document.getElementById('typeId').focus();
            return;
        }
        if (this.pam.name === '') {
            this.notificationService.warn('Please enter name of allergy.');
            document.getElementById('nameId').focus();
            return;
        }
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.putRequest(app_constants_1.AppConstants.ALLERGY_UPDATE_URL, this.pam)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ALLERGY_SUC_20') {
                    _this.notificationService.success(response['responseMessage'], 'Allergy of Patient');
                    _this.getPaginatedAllergyFromServer(0);
                    _this.closeBtnAllergy.nativeElement.click();
                }
                else {
                    //      this.notificationService.error(response['responseMessage'], 'Allergy of Patient');
                    _this.getPaginatedAllergyFromServer(0);
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientAllergyListComponent.prototype.deleteAllergy = function (allergyId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete'))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.ALLERGY_DELETE_URI + allergyId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ALLERGY_SUC_22') {
                    _this.notificationService.success(response['responseMessage'], 'Allergy of Patient');
                    _this.getPaginatedAllergyFromServer(0);
                }
                else {
                    _this.getPaginatedAllergyFromServer(0);
                    //        this.notificationService.error(response['responseMessage'], 'Allergy of Patient');
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
        __metadata("design:paramtypes", [notification_service_1.NotificationService, router_1.ActivatedRoute,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router,
            router_1.ActivatedRoute,
            DataService_1.DataService])
    ], PatientAllergyListComponent);
    return PatientAllergyListComponent;
}());
exports.PatientAllergyListComponent = PatientAllergyListComponent;
//# sourceMappingURL=patient-allergy-list.component.js.map