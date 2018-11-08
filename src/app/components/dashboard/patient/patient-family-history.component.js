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
var Family_1 = require("../../../model/Family");
var requests_service_1 = require("../../../services/requests.service");
var app_constants_1 = require("../../../utils/app.constants");
var notification_service_1 = require("../../../services/notification.service");
var his_util_service_1 = require("../../../services/his-util.service");
var DataService_1 = require("../../../services/DataService");
var ConformationDialogService_1 = require("../../../services/ConformationDialogService");
var patient_1 = require("../../../model/patient");
var PatientFamilyHistoryComponent = (function () {
    function PatientFamilyHistoryComponent(router, requestsService, hISUtilService, dataService, notificationService, confirmationDialogService) {
        var _this = this;
        this.router = router;
        this.requestsService = requestsService;
        this.hISUtilService = hISUtilService;
        this.dataService = dataService;
        this.notificationService = notificationService;
        this.confirmationDialogService = confirmationDialogService;
        this.pages = [];
        this.selectedFamily = new Family_1.Family();
        this.patient = new patient_1.Patient();
        this.subscription = this.dataService.currentPatientId.subscribe(function (id) {
            _this.patientId = id;
        });
    }
    PatientFamilyHistoryComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    PatientFamilyHistoryComponent.prototype.ngOnInit = function () {
        this.loadRecord();
        this.getFamilyHistoryFromServer(0);
    };
    PatientFamilyHistoryComponent.prototype.loadRecord = function () {
        var _this = this;
        if (this.patientId == null || this.patientId == 0 || this.patientId == undefined) {
            this.notificationService.error('Please Select Patient Again From Dashboard');
        }
        else {
            this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + this.patientId).subscribe(function (response) {
                if (response['responseCode'] === 'USER_SUC_01') {
                    _this.patient = response['responseData'];
                    //this.patient.races = JSON.parse(response['responseData'].racesString);
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Patient');
                    // this.router.navigate(['404-not-found'])
                }
            }, function (error) {
            });
        }
    };
    PatientFamilyHistoryComponent.prototype.getFamilyHistoryFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequestWithParam(app_constants_1.AppConstants.FETCH_ALL_FAMILY_HISTORY_BY_PATIENT_URL + page, this.patientId)
            .subscribe(function (response) {
            if (response['responseCode'] === 'FAM_HISTORY_SUC_02') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.data = response['responseData']['data'];
            }
            /* if(response['responseCode'] =='FAM_HISTORY_ERR_02'){
                 this.notificationService.error(`Error ${response['responseMessage']}`)
             }*/
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    PatientFamilyHistoryComponent.prototype.goToUserDashBoard = function () {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    };
    PatientFamilyHistoryComponent.prototype.saveFamilyHistory = function (data) {
        var _this = this;
        if (data.valid) {
            this.selectedFamily.patientId = this.patientId;
            if (this.patientId == null || this.patientId == 0 || this.patientId == undefined) {
                this.notificationService.error('Please Select Patient Again From Dashboard');
            }
            else {
                this.requestsService.postRequest(app_constants_1.AppConstants.FAMILY_HISTORY_CREATE, this.selectedFamily)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'FAM_HISTORY_SUC_01') {
                        _this.notificationService.success(response['responseMessage'], 'Family History');
                        _this.getFamilyHistoryFromServer(0);
                        _this.hISUtilService.hidePopupWithCloseButtonId('closeButton');
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Family History');
                    }
                }, function (error) {
                    //console.log(error.json())
                    _this.hISUtilService.tokenExpired(error.error.error);
                });
            }
        }
        else {
            this.notificationService.error('Form Invalid', '');
        }
    };
    PatientFamilyHistoryComponent.prototype.onUpdatePopupLoad = function (family) {
        this.selectedFamily = family;
    };
    PatientFamilyHistoryComponent.prototype.updateFamilyHistory = function (form) {
        var _this = this;
        if (form.valid) {
            this.requestsService.putRequest(app_constants_1.AppConstants.UPDATE_FAMILY_HISTORY_URL + this.selectedFamily.id, this.selectedFamily)
                .subscribe(function (response) {
                if (response['responseCode'] === 'FAM_HISTORY_SUC_03') {
                    _this.notificationService.success(response['responseMessage'], 'Family History');
                    _this.getFamilyHistoryFromServer(0);
                    _this.hISUtilService.hidePopupWithCloseButtonId('closeButton');
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Family History');
                }
            }, function (error) {
                //console.log(error.json())
                _this.hISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.notificationService.error('Required fields missing', 'Clinical Department');
        }
    };
    PatientFamilyHistoryComponent.prototype.onAddPopupLoad = function () {
        this.selectedFamily = new Family_1.Family();
    };
    PatientFamilyHistoryComponent.prototype.deletePatientFamilyHistory = function (id) {
        var _this = this;
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(function (res) {
            if (res == true) {
                _this.requestsService.deleteRequest(app_constants_1.AppConstants.FAMILY_HISTORY_DELETE + id).subscribe(function (data) {
                    if (data['responseCode'] === 'FAM_HISTORY_SUC_04') {
                        _this.notificationService.success('Patient Family History has been Deleted Successfully');
                        _this.getFamilyHistoryFromServer(_this.currPage);
                    }
                }, function (error) {
                    _this.notificationService.error('ERROR', 'Family History is not deleted ');
                });
            }
        });
    };
    PatientFamilyHistoryComponent = __decorate([
        core_1.Component({
            selector: 'patient-family-history',
            templateUrl: '../../../templates/dashboard/patient/patient-family-history.template.html',
        }),
        __metadata("design:paramtypes", [router_1.Router, requests_service_1.RequestsService, his_util_service_1.HISUtilService, DataService_1.DataService,
            notification_service_1.NotificationService, ConformationDialogService_1.ConformationDialogService])
    ], PatientFamilyHistoryComponent);
    return PatientFamilyHistoryComponent;
}());
exports.PatientFamilyHistoryComponent = PatientFamilyHistoryComponent;
//# sourceMappingURL=patient-family-history.component.js.map