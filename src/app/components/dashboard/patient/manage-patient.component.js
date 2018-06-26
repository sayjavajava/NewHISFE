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
var user_type_enum_1 = require("../../../enums/user-type-enum");
var patient_1 = require("../../../model/patient");
var ManagePatientComponent = (function () {
    function ManagePatientComponent(requestsService, router, titleService, HISUtilService, notificationService) {
        this.requestsService = requestsService;
        this.router = router;
        this.titleService = titleService;
        this.HISUtilService = HISUtilService;
        this.notificationService = notificationService;
        this.patient = new patient_1.Patient();
        this.pages = [];
        this.searchUserName = "";
        this.searched = false;
    }
    ;
    ManagePatientComponent.prototype.ngOnInit = function () {
        this.titleService.setTitle('HIS | Patient');
        this.getAllPaginatedPatientFromServer(0, user_type_enum_1.UserTypeEnum.PATIENT);
    };
    ManagePatientComponent.prototype.getPageWisePatients = function (page) {
        if (this.searched) {
            this.searchByUserName(page, user_type_enum_1.UserTypeEnum.PATIENT);
        }
        else {
            this.getAllPaginatedPatientFromServer(page, user_type_enum_1.UserTypeEnum.PATIENT);
        }
    };
    ManagePatientComponent.prototype.getAllPaginatedPatientFromServer = function (page, userType) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_PATIENT_URL + page + '?userType=' + userType)
            .subscribe(function (response) {
            if (response['responseCode'] === 'PATIENT_SUC_11') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.data = response['responseData']['data'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    ManagePatientComponent.prototype.deletePatient = function (patientId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are Your Source You Want To Delete"))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.PATIENT_DELETE_URI + patientId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'PATIENT_SUC_06') {
                    _this.notificationService.success(response['responseMessage'], 'Patient');
                    _this.getAllPaginatedPatientFromServer(0, user_type_enum_1.UserTypeEnum.PATIENT);
                }
                else {
                    _this.getAllPaginatedPatientFromServer(0, user_type_enum_1.UserTypeEnum.PATIENT);
                    _this.notificationService.error(response['responseMessage'], 'Patient');
                }
            }, function (error) {
                //console.log(error.json())
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    ManagePatientComponent.prototype.searchByUserName = function (page, userType) {
        var _this = this;
        this.searched = true;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(app_constants_1.AppConstants.SEARCH_ALL_PATIENT_URL + page + '?userType=' + userType + '&userName=' + this.searchUserName)
            .subscribe(function (response) {
            if (response['responseCode'] === 'PATIENT_SUC_11') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.data = response['responseData']['data'];
                _this.notificationService.success(response['responseMessage'], 'Patient');
            }
            else {
                _this.notificationService.success(response['responseMessage'], 'Patient');
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    ManagePatientComponent.prototype.refreshPatient = function () {
        this.searched = false;
        this.searchUserName = "";
        this.getAllPaginatedPatientFromServer(0, user_type_enum_1.UserTypeEnum.PATIENT.valueOf());
    };
    ManagePatientComponent = __decorate([
        core_1.Component({
            selector: 'manage-patient',
            templateUrl: '../../../templates/dashboard/patient/manage-patient.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router,
            platform_browser_1.Title,
            his_util_service_1.HISUtilService,
            notification_service_1.NotificationService])
    ], ManagePatientComponent);
    return ManagePatientComponent;
}());
exports.ManagePatientComponent = ManagePatientComponent;
//# sourceMappingURL=manage-patient.component.js.map