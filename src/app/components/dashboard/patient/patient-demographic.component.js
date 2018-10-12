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
var requests_service_1 = require("../../../services/requests.service");
var patient_1 = require("../../../model/patient");
var notification_service_1 = require("../../../services/notification.service");
var his_util_service_1 = require("../../../services/his-util.service");
var user_type_enum_1 = require("../../../enums/user-type-enum");
var PatientSmokeStatus_1 = require("../../../model/PatientSmokeStatus");
var ConformationDialogService_1 = require("../../../services/ConformationDialogService");
var Invoice_1 = require("../../../model/Invoice");
var PatientDemographicComponent = (function () {
    function PatientDemographicComponent(router, route, HISUTilService, confirmationDialogService, requestService, notificationService) {
        this.router = router;
        this.route = route;
        this.HISUTilService = HISUTilService;
        this.confirmationDialogService = confirmationDialogService;
        this.requestService = requestService;
        this.notificationService = notificationService;
        this.date = new Date();
        this.patient = new patient_1.Patient();
        this.doctors = [];
        this.smokeStatus = new PatientSmokeStatus_1.PatientSmokeStatus();
        this.smokeStatusList = [];
        this.patientInvBal = new Invoice_1.Invoice();
        this.updateBtn = true;
    }
    PatientDemographicComponent.prototype.ngOnInit = function () {
        var _this = this;
        //throw new Error("Method not implemented.");
        this.route.params.subscribe(function (params) {
            _this.id = params['id'];
            if (_this.id <= 0) {
                _this.notificationService.warn('Please select patient from dashboard again ');
                return;
            }
            _this.loadRecord();
        });
    };
    PatientDemographicComponent.prototype.isValidPatientId = function () {
        if (this.id <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
    };
    PatientDemographicComponent.prototype.loadRecord = function () {
        var _this = this;
        if (this.id <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
        this.requestService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + this.id).subscribe(function (response) {
            if (response['responseCode'] === 'USER_SUC_01') {
                _this.patient = response['responseData'];
                _this.smokeStatusList = response['responseData'].smokingStatus;
                var savedRace_1 = response['responseData'].races;
                _this.patient.races = new patient_1.Patient().races;
                _this.patient.races.forEach(function (race) {
                    savedRace_1.forEach(function (dbRaces) {
                        if (race.nameRace === dbRaces.nameRace) {
                            race.selected = true;
                        }
                    });
                });
            }
            else {
                _this.notificationService.error(response['responseMessage'], 'Patient');
            }
        }, function (error) {
            _this.HISUTilService.tokenExpired(error.error.error);
        });
        this.requestService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + user_type_enum_1.UserTypeEnum.DOCTOR)
            .subscribe(function (response) {
            if (response['responseStatus'] === 'SUCCESS') {
                _this.doctors = response['responseData'];
            }
        }, function (error) {
            _this.HISUTilService.tokenExpired(error.error.error);
        });
        this.requestService.getRequest(app_constants_1.AppConstants.PATIENT_ALLINVOICE_BALANCE + this.id).subscribe(function (response) {
            if (response['responseStatus'] === 'SUCCESS') {
                _this.patientInvBal = response['responseData'];
                console.log('Patient Invoices Bal:' + _this.patientInvBal.advanceBalance);
            }
        });
    };
    PatientDemographicComponent.prototype.updatePatient = function (insuranceForm, demographicForm, patientForm) {
        var _this = this;
        if (insuranceForm.invalid || demographicForm.invalid || patientForm.invalid) {
            if (this.patient.selectedDoctor <= 0) {
                this.notificationService.error('Please select primary doctor', 'Patient');
                document.getElementById('selectedDoctor').focus();
                return;
            }
            else if (this.patient.titlePrefix === '-1') {
                this.notificationService.error('Please select title', 'Patient');
                document.getElementById('titlePrefix').focus();
                return;
            }
            else if (this.patient.cellPhone.length <= 0) {
                this.notificationService.error('Please provide cell phone number', 'Patient');
                document.getElementById('cellPhone').focus();
                return;
            }
            else if (this.patient.email.length <= 0) {
                this.notificationService.error('Please provide email', 'Patient');
                document.getElementById('email').focus();
                return;
            }
            else if (this.patient.userName.length <= 0) {
                this.notificationService.error('Please provide user name', 'Patient');
                document.getElementById('userName').focus();
                return;
            }
            /*else if (this.patient.dob.length<=0) {
             this.notificationService.error('Please provide user name', 'Patient');
             // document.getElementById("dob").style.color = "red";
             document.getElementById("dob").focus();
             return;
             }*/
            this.notificationService.error('Please provide required Values', 'Patient');
            return;
        }
        else {
            if (localStorage.getItem(btoa('access_token'))) {
                this.patient.smokingStatus = null;
                this.requestService.putRequest(app_constants_1.AppConstants.PATIENT_UPDATE_URL, this.patient).subscribe(function (response) {
                    if (response['responseCode'] === 'PATIENT_SUC_08') {
                        _this.patient = new patient_1.Patient();
                        _this.notificationService.success(response['responseMessage'], 'Patient');
                        //this.router.navigate(['/dashboard/patient/demographic/'+this.id]);
                        _this.loadRecord();
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Patient');
                    }
                }, function (error) {
                    _this.notificationService.error('Error', 'Patient');
                    _this.HISUTilService.tokenExpired(error.error.error);
                });
            }
            else {
                this.router.navigate(['/login']);
            }
        }
    };
    PatientDemographicComponent.prototype.addSmokingStatusPopup = function () {
        this.smokeStatus = new PatientSmokeStatus_1.PatientSmokeStatus();
    };
    PatientDemographicComponent.prototype.updateBtnShow = function (flag) {
        this.updateBtn = flag;
    };
    PatientDemographicComponent.prototype.addUpdateSmokeStatus = function (smokeStatusId) {
        //console.log("Event Data Id:"+event.data.id);
        var _this = this;
        if (this.id <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
        this.smokeStatus.patientId = this.id;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestService.postRequest(app_constants_1.AppConstants.SMOKE_STATUS_URL, this.smokeStatus).subscribe(function (response) {
                if (response['responseCode'] === 'SMOKE_STATUS_SUC_04') {
                    _this.patient = new patient_1.Patient();
                    _this.notificationService.success(response['responseMessage'], 'Smoke Status');
                    //this.router.navigate(['/dashboard/patient/demographic/'+this.id]);
                    _this.loadRecord();
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Smoke Status');
                }
            }, function (error) {
                _this.notificationService.error('Error', 'Smoke Status');
                _this.HISUTilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientDemographicComponent.prototype.deleteSmokeStatus = function (smokingId) {
        var _this = this;
        if (this.id <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
        var that = this;
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(function (res) {
            if (res == true) {
                _this.requestService.deleteRequest(app_constants_1.AppConstants.SMOKE_STATUS_DEL_URL + smokingId).subscribe(function (response) {
                    if (response['responseCode'] === 'SMOKE_STATUS_SUC_06') {
                        _this.patient = new patient_1.Patient();
                        _this.notificationService.success(response['responseMessage'], 'Smoke Status');
                        //this.router.navigate(['/dashboard/patient/demographic/', that.id]);
                        _this.loadRecord();
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Smoke Status');
                    }
                }, function (error) {
                    _this.notificationService.error('Error', 'Smoke Status');
                    _this.HISUTilService.tokenExpired(error.error.error);
                });
            }
        });
    };
    PatientDemographicComponent.prototype.uploadImgOnChange = function (event) {
        var fileList = event.target.files;
        if (fileList.length > 0) {
            this.file = fileList[0];
        }
    };
    PatientDemographicComponent.prototype.uploadProfileImg = function () {
        var _this = this;
        if (this.file.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(app_constants_1.AppConstants.UPLOAD_PATIENT_IMAGE_URL + this.patient.id, this.file)
                .subscribe(function (response) {
                if (response['responseCode'] === 'USR_SUC_02') {
                    _this.notificationService.success(response['responseMessage'], 'Update Patient');
                    _this.file = null;
                }
            }, function (error) {
                _this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                _this.HISUTilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    };
    PatientDemographicComponent.prototype.uploadFrontImg = function () {
        var _this = this;
        if (this.file.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(app_constants_1.AppConstants.UPLOAD_PATIENT_FRONT_IMAGE_URL + this.patient.id, this.file)
                .subscribe(function (response) {
                if (response['responseCode'] === 'USR_SUC_03') {
                    _this.notificationService.success(response['responseMessage'], 'Update Patient');
                    _this.file = null;
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Update Patient');
                }
            }, function (error) {
                _this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                _this.HISUTilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    };
    PatientDemographicComponent.prototype.uploadBackImg = function () {
        var _this = this;
        if (this.file.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(app_constants_1.AppConstants.UPLOAD_PATIENT_BACK_IMAGE_URL + this.patient.id, this.file)
                .subscribe(function (response) {
                if (response['responseCode'] === 'USR_SUC_03') {
                    _this.notificationService.success(response['responseMessage'], 'Update Patient');
                    _this.file = null;
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Update Patient');
                }
            }, function (error) {
                _this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                _this.HISUTilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    };
    PatientDemographicComponent.prototype.goToUserDashBoard = function () {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    };
    PatientDemographicComponent = __decorate([
        core_1.Component({
            selector: 'patient-history',
            templateUrl: '../../../templates/dashboard/patient/patient-demographic.template.html',
        }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, his_util_service_1.HISUtilService,
            ConformationDialogService_1.ConformationDialogService, requests_service_1.RequestsService,
            notification_service_1.NotificationService])
    ], PatientDemographicComponent);
    return PatientDemographicComponent;
}());
exports.PatientDemographicComponent = PatientDemographicComponent;
//# sourceMappingURL=patient-demographic.component.js.map