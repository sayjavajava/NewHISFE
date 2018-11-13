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
var patient_1 = require("../../../model/patient");
var notification_service_1 = require("../../../services/notification.service");
var user_type_enum_1 = require("../../../enums/user-type-enum");
var image_model_1 = require("../../../model/image-model");
var EditPatientComponent = (function () {
    function EditPatientComponent(requestsService, router, titleService, HISUTilService, notificationService, activatedRoute) {
        this.requestsService = requestsService;
        this.router = router;
        this.titleService = titleService;
        this.HISUTilService = HISUTilService;
        this.notificationService = notificationService;
        this.activatedRoute = activatedRoute;
        this.patient = new patient_1.Patient();
        this.imageModel = new image_model_1.ImageModel();
        this.doctors = [];
        this.profileImg = null;
        this.photoFront = null;
        this.photoBack = null;
        this.show = false;
        this.populatePatient();
    }
    ;
    EditPatientComponent.prototype.populatePatient = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + user_type_enum_1.UserTypeEnum.DOCTOR)
            .subscribe(function (response) {
            if (response['responseStatus'] === 'SUCCESS') {
                _this.doctors = response['responseData'];
            }
        }, function (error) {
            _this.HISUTilService.tokenExpired(error.error.error);
        });
        this.activatedRoute.params.subscribe(function (params) {
            _this.selectedPatientId = Number(params['id']);
            _this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + _this.selectedPatientId).subscribe(function (response) {
                if (response['responseCode'] === 'USER_SUC_01') {
                    _this.patient = response['responseData'];
                    var savedRace_1 = response['responseData'].races;
                    _this.patient.races = new patient_1.Patient().races;
                    _this.patient.races.forEach(function (race) {
                        savedRace_1.forEach(function (dbRaces) {
                            //if(race.nameRace === dbRaces.nameRace){
                            if (race.value === dbRaces.nameRace) {
                                race.selected = true;
                            }
                        });
                    });
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Patient');
                    // this.router.navigate(['404-not-found'])
                }
            }, function (error) {
                _this.HISUTilService.tokenExpired(error.error.error);
            });
        });
    };
    ;
    EditPatientComponent.prototype.ngOnInit = function () {
        this.titleService.setTitle('HIS | Update Patient');
    };
    EditPatientComponent.prototype.updatePatient = function (insuranceForm, demographicForm, patientForm, contactForm) {
        var _this = this;
        if (insuranceForm.invalid || demographicForm.invalid || patientForm.invalid || contactForm.invalid) {
            if (this.patient.selectedDoctor <= 0) {
                this.notificationService.error('Please select primary doctor', 'Patient');
                document.getElementById('selectedDoctor').focus();
                return;
            }
            else if (this.patient.titlePrefix === "-1") {
                this.notificationService.error('Please select title', 'Patient');
                document.getElementById("titlePrefix").focus();
                return;
            }
            else if (this.patient.cellPhone.length <= 0) {
                this.notificationService.error('Please provide cell phone number', 'Patient');
                document.getElementById("cellPhone").focus();
                return;
            }
            else if (this.patient.userName.length <= 0) {
                this.notificationService.error('Please provide user name', 'Patient');
                document.getElementById("userName").focus();
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
                /***
                 * going to check , if any one value available of insurance then company name must be presented
                 * **/
                if (this.patient.insuranceId > 0 && this.patient.company === '') {
                    this.notificationService.warn('Please enter insurance company name.');
                    document.getElementById('company').focus();
                    return;
                }
                this.requestsService.postRequestMultipartFormAndData(app_constants_1.AppConstants.PATIENT_UPDATE_URL, this.patient, this.profileImg, this.photoFront, this.photoBack).subscribe(function (response) {
                    if (response['responseCode'] === 'PATIENT_SUC_08') {
                        _this.patient = new patient_1.Patient();
                        _this.notificationService.success(response['responseMessage'], 'Patient');
                        _this.router.navigate(['/dashboard/patient/manage']);
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Patient');
                    }
                }, function (error) {
                    _this.notificationService.error("Error", 'Patient');
                    _this.HISUTilService.tokenExpired(error.error.error);
                });
            }
            else {
                this.router.navigate(['/login']);
            }
        }
    };
    EditPatientComponent.prototype.uploadImgOnChange = function (event) {
        /*let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.file = fileList[0];
        }
*/
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
    EditPatientComponent.prototype.uploadProfileImg = function () {
        var _this = this;
        if (this.profileImg && this.profileImg.size <= 1048000) {
            this.show = true;
            this.requestsService.postRequestMultipartFormData(app_constants_1.AppConstants.UPLOAD_PATIENT_IMAGE_URL + this.patient.id, this.profileImg)
                .subscribe(function (response) {
                if (response['responseCode'] === 'USR_SUC_02') {
                    _this.patient.profileImgURL = "/public/images/processing.gif";
                    _this.notificationService.success(response['responseMessage'], 'Update Patient');
                    _this.profileImg = null;
                    _this.show = false;
                    _this.populatePatient();
                }
                else {
                    _this.show = false;
                    _this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                }
            }, function (error) {
                _this.show = false;
                _this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                //this.HISUTilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.show = false;
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    };
    EditPatientComponent.prototype.uploadFrontImg = function () {
        var _this = this;
        this.show = true;
        if (this.photoFront && this.photoFront.size <= 1048000) {
            this.requestsService.postRequestMultipartFormData(app_constants_1.AppConstants.UPLOAD_PATIENT_FRONT_IMAGE_URL + this.patient.id + "/" + this.patient.insuranceId, this.photoFront)
                .subscribe(function (response) {
                if (response['responseCode'] === 'INS_IMG_SUC_03') {
                    _this.notificationService.success(response['responseMessage'], 'Update Patient');
                    _this.photoFront = null;
                    _this.show = false;
                    _this.populatePatient();
                }
                else {
                    _this.show = false;
                    _this.notificationService.error(response['responseMessage'], 'Update Patient');
                }
            }, function (error) {
                _this.show = false;
                _this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                _this.HISUTilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.show = false;
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    };
    EditPatientComponent.prototype.uploadBackImg = function () {
        var _this = this;
        this.show = true;
        if (this.photoBack && this.photoBack.size <= 1048000) {
            this.requestsService.postRequestMultipartFormData(app_constants_1.AppConstants.UPLOAD_PATIENT_BACK_IMAGE_URL + this.patient.id + "/" + this.patient.insuranceId, this.photoBack)
                .subscribe(function (response) {
                if (response['responseCode'] === 'INS_IMG_SUC_03') {
                    _this.notificationService.success(response['responseMessage'], 'Update Patient');
                    _this.file = null;
                    _this.populatePatient();
                    _this.show = false;
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Update Patient');
                }
            }, function (error) {
                _this.show = false;
                _this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                //this.HISUTilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.show = false;
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    };
    EditPatientComponent = __decorate([
        core_1.Component({
            selector: 'add-patient',
            templateUrl: '../../../templates/dashboard/patient/edit-patient.template.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router,
            platform_browser_1.Title,
            his_util_service_1.HISUtilService,
            notification_service_1.NotificationService,
            router_1.ActivatedRoute])
    ], EditPatientComponent);
    return EditPatientComponent;
}());
exports.EditPatientComponent = EditPatientComponent;
//# sourceMappingURL=edit-patient.component.js.map