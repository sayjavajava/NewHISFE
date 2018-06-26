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
var AddPatientComponent = (function () {
    function AddPatientComponent(requestsService, router, titleService, HISUTilService, notificationService) {
        var _this = this;
        this.requestsService = requestsService;
        this.router = router;
        this.titleService = titleService;
        this.HISUTilService = HISUTilService;
        this.notificationService = notificationService;
        this.patient = new patient_1.Patient();
        this.doctors = [];
        this.requestsService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + user_type_enum_1.UserTypeEnum.DOCTOR)
            .subscribe(function (response) {
            if (response['responseStatus'] === 'SUCCESS') {
                _this.doctors = response['responseData'];
            }
        }, function (error) {
            _this.HISUTilService.tokenExpired(error.error.error);
        });
        /*this.requestsService.getRequest(AppConstants.RACE_FETCH_URL)
         .subscribe(
         (response:Response) =>{
         if (response['responseStatus'] === 'SUCCESS'){
         this.patient.races = response['responseData'];
         }
         },
         (error:any) =>{
         this.HISUTilService.tokenExpired(error.error.error);
         }
         );*/
    }
    ;
    AddPatientComponent.prototype.ngOnInit = function () {
        this.titleService.setTitle('HIS | Add Patient');
    };
    AddPatientComponent.prototype.savePatient = function (insuranceForm, demographicForm, patientForm, contactForm) {
        var _this = this;
        if (insuranceForm.invalid || demographicForm.invalid || patientForm.invalid || contactForm.invalid) {
            if (this.patient.selectedDoctor <= 0) {
                this.notificationService.error('Please select primary doctor', 'Patient');
                document.getElementById("selectedDoctor").focus();
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
            else if (this.patient.email.length <= 0) {
                this.notificationService.error('Please provide email', 'Patient');
                document.getElementById("email").focus();
                return;
            }
            else if (this.patient.userName.length <= 0) {
                this.notificationService.error('Please provide user name', 'Patient');
                document.getElementById("userName").focus();
                return;
            }
            else if (this.patient.dob.length <= 0) {
                this.notificationService.error('Please provide user name', 'Patient');
                // document.getElementById("dob").style.color = "red";
                document.getElementById("dob").focus();
                return;
            }
            this.notificationService.error('Please provide required Values', 'Patient');
            return;
        }
        else {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(app_constants_1.AppConstants.PATIENT_SAVE_URL, this.patient).subscribe(function (response) {
                    if (response['responseCode'] === 'PATIENT_SUC_04') {
                        _this.patient = new patient_1.Patient();
                        _this.notificationService.success(response['responseMessage'], 'Patient');
                        _this.router.navigate(['/dashboard/patient/manage']);
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Patient');
                    }
                }, function (error) {
                    _this.notificationService.success(Response['responseMessage'], 'Patient');
                    _this.HISUTilService.tokenExpired(error.error.error);
                });
            }
            else {
                this.router.navigate(['/login']);
            }
        }
    };
    AddPatientComponent = __decorate([
        core_1.Component({
            selector: 'add-patient',
            templateUrl: '../../../templates/dashboard/patient/add-patient.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router,
            platform_browser_1.Title,
            his_util_service_1.HISUtilService,
            notification_service_1.NotificationService])
    ], AddPatientComponent);
    return AddPatientComponent;
}());
exports.AddPatientComponent = AddPatientComponent;
//# sourceMappingURL=add-patient.component.js.map