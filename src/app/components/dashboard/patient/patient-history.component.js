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
var PatientVitalModel_1 = require("../../../model/PatientVitalModel");
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
        this.isUpdate = false;
        this.vitalSetupTemplate = new PatientVitalModel_1.PatientVitalModel();
        this.searchedVitalAnyListModified = [];
        this.selectedstr = [];
        this.subscription = this.dataService.currentPatientId.subscribe(function (id) {
            _this.selectedPatientId = id;
        });
        this.getPaginatedProblemsByActiveAndPatientIdFromServer(0, 5, 'ACTIVE');
        this.getPaginatedAllergiesByActiveAndPatientIdFromServer(0, 5, 'ACTIVE');
        this.getPaginatedMedicationsByActiveAndPatientIdFromServer(0, 5, 'ACTIVE');
        this.getPatientByIdFromServer(this.selectedPatientId);
        this.getVitalSetupList();
        this.getPatientVitalList();
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
    PatientHistoryComponent.prototype.addVitalPopupClick = function () {
        this.isUpdate = false;
        this.vitalSetupTemplate = new PatientVitalModel_1.PatientVitalModel();
        this.getVitalSetupList();
    };
    PatientHistoryComponent.prototype.getVitalSetupList = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_VITALS_CONFIGURATIONS).subscribe(function (response) {
                if (response['responseCode'] === 'SUCCESS') {
                    _this.data = response['responseData'];
                    console.log(_this.data);
                    _this.vitalList = _this.data;
                    _this.allVitalsNamesAny = _this.data;
                    for (var _i = 0, _a = _this.allVitalsNamesAny; _i < _a.length; _i++) {
                        var vital = _a[_i];
                        var pair = { label: vital.name, value: vital.name };
                        _this.searchedVitalAnyListModified.push(pair);
                    }
                    _this.selectedstr = _this.searchedVitalAnyListModified[0].value;
                    // console.log("Length : " + this.prefixTemplateList.length);
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Vital Setup Configurations');
                }
            }, function (error) {
                _this.notificationService.error(Response['responseMessage'], 'Vital Setup Configurations');
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientHistoryComponent.prototype.getPatientVitalList = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_VITALS_PATIENT).subscribe(function (response) {
                if (response['responseCode'] === 'SUCCESS') {
                    _this.vitalListData = response['responseData'];
                    console.log(_this.vitalListData);
                    //   this.allVitalsNamesAny=this.data;
                    /*for (let vital of this.allVitalsNamesAny) {
                        let pair: any = {label: vital.name, value: vital.name};
                        this.searchedVitalAnyListModified.push(pair);

                    }*/
                    //      this.selectedstr = this.searchedVitalAnyListModified[0].value;
                    // console.log("Length : " + this.prefixTemplateList.length);
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Vital Setup Configurations');
                }
            }, function (error) {
                _this.notificationService.error(Response['responseMessage'], 'Vital Setup Configurations');
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientHistoryComponent.prototype.getSelectedVital = function (name) {
        var _this = this;
        var vitalSelectedObj = this.vitalList.filter(function (x) { return x.name == _this.selectedstr.toString(); });
        this.vitalSetupTemplate.unit = vitalSelectedObj[0].unit;
        this.vitalSetupTemplate.standardValue = vitalSelectedObj[0].standardValue;
        this.vitalSetupTemplate.status = vitalSelectedObj[0].status;
    };
    PatientHistoryComponent.prototype.savePatientVital = function () {
        var _this = this;
        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
        if (this.selectedstr.toString() == '') {
            this.notificationService.warn('Please select Vital');
            document.getElementById('name').focus();
            return;
        }
        if (this.vitalSetupTemplate.currentValue == '') {
            this.notificationService.warn('Please Enter Current Value');
            document.getElementById('currentValueId').focus();
            return;
        }
        this.vitalSetupTemplate.name = this.selectedstr.toString();
        if (localStorage.getItem(btoa('access_token'))) {
            this.vitalSetupTemplate.patientId = this.selectedPatientId;
            this.requestsService.postRequest(app_constants_1.AppConstants.VITALS_PATIENT_SAVE, this.vitalSetupTemplate)
                .subscribe(function (response) {
                if (response['responseCode'] === 'SUCCESS') {
                    _this.notificationService.success(response['responseMessage'], 'Patient Vital Sucessfully Saved');
                    _this.getPatientVitalList();
                    // this.closeBtn.nativeElement.click();
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Problem of Patient');
                    //  this.getPaginatedProblemsFromServer(0);
                }
            }, function (error) {
                _this.HISUTilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.notificationService.warn('Your first request is under process,Please wait...');
            return;
        }
    };
    PatientHistoryComponent.prototype.editVital = function (Id) {
        var _this = this;
        this.isUpdate = true;
        //  this.vitalSetupTemplate = new PatientVitalModel();
        if (Id > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(app_constants_1.AppConstants.VITAL_GET_URL + Id)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'SUCCESS') {
                        _this.vitalSetupTemplate = response['responseData'];
                        _this.selectedPatientId = _this.vitalSetupTemplate.patientId;
                        debugger;
                    }
                }, function (error) {
                    _this.HISUTilService.tokenExpired(error.error.error);
                });
            }
            else {
                this.router.navigate(['/login']);
            }
        }
    };
    PatientHistoryComponent.prototype.delete = function (Id) {
        var _this = this;
        if (window.localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Sure You Want To Delete'))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.DELETE_VITAL + Id)
                .subscribe(function (response) {
                if (response['responseCode'] === 'SUCCESS') {
                    _this.notificationService.success(response['responseMessage'], 'Patient Vital Delete');
                    _this.getPatientVitalList();
                    _this.HISUTilService.hidePopupWithCloseButtonId('closeButton');
                }
                else {
                    _this.getPatientVitalList();
                    _this.notificationService.error(response['responseMessage'], 'Patient Vital Delete');
                }
            }, function (error) {
                _this.notificationService.error(error.error, 'Patient Vital  Delete');
                _this.HISUTilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientHistoryComponent.prototype.updateVital = function () {
        var _this = this;
        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
        if (this.selectedstr.toString() == '') {
            this.notificationService.warn('Please select Vital');
            document.getElementById('name').focus();
            return;
        }
        this.vitalSetupTemplate.name = this.selectedstr.toString();
        if (localStorage.getItem(btoa('access_token'))) {
            this.vitalSetupTemplate.patientId = this.selectedPatientId;
            this.requestsService.putRequest(app_constants_1.AppConstants.VITALS_PATIENT_UPDATE, this.vitalSetupTemplate)
                .subscribe(function (response) {
                if (response['responseCode'] === 'SUCCESS') {
                    _this.notificationService.success(response['responseMessage'], 'Patient Vital Sucessfully Updated');
                    // this.getPaginatedProblemsFromServer(0);
                    //  this.closeBtn.nativeElement.click();
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Problem of Patient');
                    //  this.getPaginatedProblemsFromServer(0);
                }
            }, function (error) {
                _this.HISUTilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.notificationService.warn('Your first request is under process,Please wait...');
            return;
        }
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