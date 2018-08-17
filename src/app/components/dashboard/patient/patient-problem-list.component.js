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
var notification_service_1 = require("../../../services/notification.service");
var requests_service_1 = require("../../../services/requests.service");
var his_util_service_1 = require("../../../services/his-util.service");
var patient_problem_model_1 = require("../../../model/patient.problem.model");
var app_constants_1 = require("../../../utils/app.constants");
var PatientProblemListComponent = (function () {
    function PatientProblemListComponent(notificationService, requestsService, HISUtilService, router) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.pages = [];
        this.problemData = [];
        this.ppm = new patient_problem_model_1.PatientProblemModel();
        this.appointments = [];
        this.isUpdate = false;
    }
    PatientProblemListComponent.prototype.ngOnInit = function () {
        document.title = 'HIS | Problem list';
        this.getPaginatedProblemsFromServer(0);
    };
    PatientProblemListComponent.prototype.appointsByServer = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(app_constants_1.AppConstants.ICD_VERSIONS)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_VERSIONS_FOUND_03') {
                    _this.iCDVersions = [];
                    _this.iCDVersions = response['responseData'];
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientProblemListComponent.prototype.versionsByServer = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(app_constants_1.AppConstants.ICD_VERSIONS)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_VERSIONS_FOUND_03') {
                    _this.iCDVersions = [];
                    _this.iCDVersions = response['responseData'];
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientProblemListComponent.prototype.addProblemPopupClick = function () {
        this.isUpdate = false;
        this.ppm.selectedCodeId = -1;
        this.ppm.selectedICDVersionId = -1;
        this.ppm.appointmentWrapper.id = -1;
        this.versionsByServer();
        this.versionChanged(this.ppm.selectedICDVersionId);
    };
    PatientProblemListComponent.prototype.versionChanged = function (associatedICDCVId) {
        var _this = this;
        this.ppm.selectedCodeId = -1;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(app_constants_1.AppConstants.ICD_CODES_ASSOCIATED_BY_VERSION_ID + associatedICDCVId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_ASSOCIATED_FOUND_SUC_02') {
                    _this.associatedCodes = [];
                    _this.associatedCodes = response['responseData'].code;
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
    };
    PatientProblemListComponent.prototype.savePatientProblem = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(app_constants_1.AppConstants.PATIENT_PROBLEM_SAVE_URL, this.ppm)
                .subscribe(function (response) {
                if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_14') {
                    _this.notificationService.success(response['responseMessage'], 'Problem of Patient');
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Problem of Patient');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
    };
    PatientProblemListComponent.prototype.getPaginatedProblemsFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_PROBLEM_FETCH_URL + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_16') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.problemData = response['responseData']['data'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    PatientProblemListComponent.prototype.deletePatientProblem = function (problemId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are Your Source You Want To Delete"))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.PATIENT_PROBLEM_DELETE_URI + problemId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'PATIENT_SUC_06') {
                    _this.notificationService.success(response['responseMessage'], 'Problem of Patient');
                    _this.getPaginatedProblemsFromServer(0);
                }
                else {
                    _this.getPaginatedProblemsFromServer(0);
                    _this.notificationService.error(response['responseMessage'], 'Problem of Patient');
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
    PatientProblemListComponent.prototype.editPatientProblem = function (problemId) {
        var _this = this;
        this.isUpdate = true;
        if (problemId > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_PROBLEM_GET_URL + 'problemId=' + problemId)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'USER_SUC_01') {
                        _this.ppm = response['responseData'];
                        // this.appointsByServer();
                        _this.versionsByServer();
                        var selectCodeId = _this.ppm.selectedCodeId;
                        _this.versionChanged(_this.ppm.selectedICDVersionId);
                        _this.ppm.selectedCodeId = selectCodeId;
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Problem of Patient');
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
            this.notificationService.error('Please select proper problem', 'Problem of Patient');
        }
    };
    PatientProblemListComponent.prototype.updatePatientProblem = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.putRequest(app_constants_1.AppConstants.PATIENT_PROBLEM_UPDATE_URL, this.ppm)
                .subscribe(function (response) {
                if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_14') {
                    _this.ppm = response['responseData'];
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Problem of Patient');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientProblemListComponent = __decorate([
        core_1.Component({
            selector: 'patient-problem-list',
            templateUrl: '../../../templates/dashboard/patient/patient-problem-list.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router])
    ], PatientProblemListComponent);
    return PatientProblemListComponent;
}());
exports.PatientProblemListComponent = PatientProblemListComponent;
//# sourceMappingURL=patient-problem-list.component.js.map