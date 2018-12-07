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
var angular2_datetimepicker_1 = require("angular2-datetimepicker");
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
        this.profileImg = null;
        this.photoFront = null;
        this.photoBack = null;
        this.doctors = [];
        this.titleList = [];
        this.pCommunication = [];
        this.genders = [];
        this.smokeStatus = new PatientSmokeStatus_1.PatientSmokeStatus();
        this.smokeStatusList = [];
        this.patientInvBal = new Invoice_1.Invoice();
        this.updateBtn = false;
        this.martialStatus = [];
        this.emergencyContactRelations = [];
        this.countryListModified = [];
        this.selectedCountry = '';
        this.statesListModified = [];
        this.selectedState = '';
        this.citiesListModified = [];
        this.selectedCity = '';
        this.patientGroupListModified = [];
        angular2_datetimepicker_1.DatePicker.prototype.ngOnInit = function () {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }
            this.settings.timePicker = false;
            this.settings.format = "E MMM dd yyyy";
            this.date = new Date();
        };
        if (this.patient.dob == undefined || this.patient.dob == null || this.patient.dob.toString().trim() == "") {
            this.patient.dob = new Date().toDateString();
        }
        if (this.patient.cardIssuedDate == undefined || this.patient.cardIssuedDate == null || this.patient.cardIssuedDate.toString().trim() == "") {
            this.patient.cardIssuedDate = new Date().toDateString();
        }
        if (this.patient.cardExpiryDate == undefined || this.patient.cardExpiryDate == null || this.patient.cardExpiryDate.toString().trim() == "") {
            this.patient.cardExpiryDate = new Date().toDateString();
        }
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
            _this.smokeStatusType = [
                { label: 'Every Day ', value: 'Every Day ' },
                { label: 'Every Week ', value: 'Every Week ' },
                { label: 'Every Month ', value: 'Every Month ' },
                { label: 'Every Year  ', value: 'Every Year' }
            ];
            _this.titleList = [
                { label: 'Mr', value: 'Mr' },
                { label: 'Mrs', value: 'Mrs' },
                { label: 'Ms', value: 'Ms' },
                { label: 'Dr', value: 'dr' },
            ];
            _this.pCommunication = [
                { label: 'CELL PHONE', value: 'CELL PHONE' },
                { label: 'HOME PHONE', value: 'HOME PHONE' },
                { label: 'OFFICE PHONE', value: 'OFFICE PHONE' },
                { label: 'EMAIL', value: 'EMAIL' },
            ];
            _this.martialStatus = [
                { label: 'SINGLE', value: 'SINGLE' },
                { label: 'MARRIED', value: 'MARRIED' },
                { label: 'WIDOWED', value: 'WIDOWED' },
                { label: 'DIVORCED', value: 'DIVORCED' },
                { label: 'SEPARATED', value: 'SEPARATED' },
            ];
            _this.genders = [
                { label: 'MALE', value: 'MALE' },
                { label: 'FEMALE', value: 'FEMALE' },
                { label: 'OTHER', value: 'OTHER' },
            ];
            _this.emergencyContactRelations = [
                { label: 'FATHER', value: 'FATHER' },
                { label: 'MOTHER', value: 'MOTHER' },
                { label: 'HUSBAND', value: 'HUSBAND' },
                { label: 'WIFE', value: 'WIFE' },
                { label: 'BROTHER', value: 'BROTHER' },
                { label: 'SON', value: 'SON' },
                { label: 'OTHER', value: 'OTHER' },
            ];
        });
        this.createCountriesList();
        this.createPatientGroupList();
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
                _this.selectedCountry = _this.patient.country;
                _this.selectedState = _this.patient.state;
                _this.selectedCity = _this.patient.city;
                if (_this.patient.dob == undefined || _this.patient.dob == null || _this.patient.dob.toString().trim() == "") {
                    _this.patient.dob = new Date().toDateString();
                }
                if (_this.patient.cardIssuedDate == undefined || _this.patient.cardIssuedDate == null || _this.patient.cardIssuedDate.toString().trim() == "") {
                    _this.patient.cardIssuedDate = new Date().toDateString();
                }
                if (_this.patient.cardExpiryDate == undefined || _this.patient.cardExpiryDate == null || _this.patient.cardExpiryDate.toString().trim() == "") {
                    _this.patient.cardExpiryDate = new Date().toDateString();
                }
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
            /*if (this.patient.selectedDoctor <= 0) {
                this.notificationService.error('Please select primary doctor', 'Patient');
                document.getElementById('selectedDoctor').focus();
                return;
            } else if (this.patient.titlePrefix === '-1') {
                this.notificationService.error('Please select title', 'Patient');
                document.getElementById('titlePrefix').focus();
                return;
            } else*/
            if (this.patient.firstName == null || this.patient.firstName.toString().trim().length <= 0) {
                this.notificationService.error('Please enter first name.', 'Patient');
                document.getElementById('firstName').focus();
                return;
            }
            else if (this.patient.lastName == null || this.patient.lastName.toString().trim().length <= 0) {
                this.notificationService.error('Please enter last name.', 'Patient');
                document.getElementById('lastName').focus();
                return;
            }
            else if (this.patient.cellPhone == null || this.patient.cellPhone.toString().trim().length <= 0) {
                this.notificationService.error('Please provide cell phone number', 'Patient');
                document.getElementById('cellPhone').focus();
                return;
            }
            /*else if (this.patient.email.length <= 0) {
                this.notificationService.error('Please provide email', 'Patient');
                document.getElementById('email').focus();
                return;
            } else if (this.patient.userName.length <= 0) {
                this.notificationService.error('Please provide user name', 'Patient');
                document.getElementById('userName').focus();
                return;
            } else if (this.patient.dob.length<=0) {
             this.notificationService.error('Please provide user name', 'Patient');
             // document.getElementById("dob").style.color = "red";
             document.getElementById("dob").focus();
             return;
             }*/
            this.notificationService.error('Please provide required Values', 'Patient');
            return;
        }
        else {
            if (this.patient.dob.toString().length > 0) {
                this.patient.dob = this.patient.dob.toString().substring(0, 24); // Wed Mar 17 1993 17:03:21 GMT+0500 (Pakistan Standard Time) -> Wed Mar 17 1993 17:03:21
            }
            if (this.patient.cardIssuedDate.toString().length > 0) {
                this.patient.cardIssuedDate = this.patient.cardIssuedDate.toString().substring(0, 24);
            }
            if (this.patient.cardExpiryDate.toString().length > 0) {
                this.patient.cardExpiryDate = this.patient.cardExpiryDate.toString().substring(0, 24);
            }
            if (localStorage.getItem(btoa('access_token'))) {
                this.patient.smokingStatus = null;
                this.requestService.postRequestMultipartFormAndData(app_constants_1.AppConstants.PATIENT_UPDATE_URL, this.patient, this.profileImg, this.photoFront, this.photoBack).subscribe(function (response) {
                    if (response['responseCode'] === 'PATIENT_SUC_08') {
                        _this.patient = new patient_1.Patient();
                        _this.notificationService.success(response['responseMessage'], 'Patient');
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
        /*let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.file = fileList[0];
        }*/
        var fileList = event.target.files;
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === "profileImgURL") {
                this.profileImg = fileList[0];
            }
            else if (event.target.name === "photoFrontURL") {
                this.photoFront = fileList[0];
            }
            else if (event.target.name === "photoBackURL") {
                this.photoBack = fileList[0];
            }
        }
    };
    PatientDemographicComponent.prototype.uploadProfileImg = function () {
        var _this = this;
        if (this.profileImg && this.profileImg.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(app_constants_1.AppConstants.UPLOAD_PATIENT_IMAGE_URL + this.patient.id, this.profileImg)
                .subscribe(function (response) {
                if (response['responseCode'] === 'USR_SUC_02') {
                    _this.notificationService.success(response['responseMessage'], 'Update Patient');
                    _this.profileImg = null;
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
        if (this.photoFront && this.photoFront.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(app_constants_1.AppConstants.UPLOAD_PATIENT_FRONT_IMAGE_URL + this.patient.id, this.photoFront)
                .subscribe(function (response) {
                if (response['responseCode'] === 'USR_SUC_03') {
                    _this.notificationService.success(response['responseMessage'], 'Update Patient');
                    _this.photoFront = null;
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Update Patient');
                }
            }, function (error) {
                _this.notificationService.error('Patient insurance front photo uploading failed', 'Update Patient');
                _this.HISUTilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    };
    PatientDemographicComponent.prototype.uploadBackImg = function () {
        var _this = this;
        if (this.photoBack && this.photoBack.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(app_constants_1.AppConstants.UPLOAD_PATIENT_BACK_IMAGE_URL + this.patient.id, this.photoBack)
                .subscribe(function (response) {
                if (response['responseCode'] === 'USR_SUC_03') {
                    _this.notificationService.success(response['responseMessage'], 'Update Patient');
                    _this.photoBack = null;
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Update Patient');
                }
            }, function (error) {
                _this.notificationService.error('Patient insurance back photo uploading failed', 'Update Patient');
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
    PatientDemographicComponent.prototype.createCountriesList = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_LIST_OF_COUNTRIES)
            .subscribe(function (response) {
            if (response["responseCode"] === "BRANCH_SUC_01") {
                _this.countryList = response["responseData"].data;
                for (var _i = 0, _a = _this.countryList; _i < _a.length; _i++) {
                    var country = _a[_i];
                    var pair = { label: country.name, value: country.id };
                    _this.countryListModified.push(pair);
                }
            }
        }, function (error) {
            this.notificationService.error("ERROR", "Countries List is not available");
        });
    };
    PatientDemographicComponent.prototype.getStatesByCountryId = function (countryId) {
        var _this = this;
        this.statesList = this.citiesList = this.statesListModified = this.citiesListModified = [];
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_LIST_OF_STATES_BY_CNTRY_ID + countryId)
            .subscribe(function (response) {
            if (response["responseCode"] === "BRANCH_SUC_01") {
                _this.statesList = response["responseData"].data;
                for (var _i = 0, _a = _this.statesList; _i < _a.length; _i++) {
                    var state = _a[_i];
                    var pair = { label: state.name, value: state.id };
                    _this.statesListModified.push(pair);
                }
            }
        }, function (error) {
            this.notificationService.error("ERROR", "States List is not available");
        });
    };
    PatientDemographicComponent.prototype.getCitiesByStateId = function (stateId) {
        var _this = this;
        this.citiesList = this.citiesListModified = [];
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_LIST_OF_CITIES_BY_STATE_ID + stateId)
            .subscribe(function (response) {
            if (response["responseCode"] === "BRANCH_SUC_01") {
                _this.citiesList = response["responseData"].data;
                for (var _i = 0, _a = _this.citiesList; _i < _a.length; _i++) {
                    var city = _a[_i];
                    var pair = { label: city.name, value: city.id };
                    _this.citiesListModified.push(pair);
                }
            }
        }, function (error) {
            this.notificationService.error("ERROR", "Cities List is not available");
        });
    };
    PatientDemographicComponent.prototype.createPatientGroupList = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.PATIENT_GROUP_GET_ALL)
            .subscribe(function (response) {
            if (response["responseCode"] === "PATGRP_SUC_6") {
                _this.patientGroupList = response["responseData"].data;
                for (var _i = 0, _a = _this.patientGroupList; _i < _a.length; _i++) {
                    var patientGroup = _a[_i];
                    var pair = { label: patientGroup.name, value: patientGroup.id };
                    _this.patientGroupListModified.push(pair);
                }
            }
        }, function (error) {
            this.notificationService.error("ERROR", "Patient Groups List is not available");
        });
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