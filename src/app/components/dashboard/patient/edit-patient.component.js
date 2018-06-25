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
var EditPatientComponent = (function () {
    function EditPatientComponent(requestsService, router, titleService, HISUTilService, notificationService, activatedRoute) {
        var _this = this;
        this.requestsService = requestsService;
        this.router = router;
        this.titleService = titleService;
        this.HISUTilService = HISUTilService;
        this.notificationService = notificationService;
        this.activatedRoute = activatedRoute;
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
        this.activatedRoute.params.subscribe(function (params) {
            _this.selectedPatientId = Number(params['id']);
            _this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + _this.selectedPatientId).subscribe(function (response) {
                if (response['responseCode'] === 'USER_SUC_01') {
                    _this.patient = response['responseData'];
                    _this.patient.races = JSON.parse(response['responseData'].racesString);
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Patient');
                    // this.router.navigate(['404-not-found'])
                }
            }, function (error) {
                _this.HISUTilService.tokenExpired(error.error.error);
            });
        });
    }
    ;
    EditPatientComponent.prototype.ngOnInit = function () {
        this.titleService.setTitle('HIS | Update Patient');
    };
    EditPatientComponent.prototype.updatePatient = function (form) {
        var _this = this;
        if (!form.valid ||
            this.patient.titlePrefix === "-1" ||
            this.patient.selectedDoctor <= 0 ||
            this.patient.firstName.length <= 0 ||
            this.patient.cellPhone.length <= 0 ||
            this.patient.userName.length <= 0 ||
            this.patient.email.length <= 0) {
            this.notificationService.error('Please provide required Values', 'Patient');
            return;
        }
        else {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(app_constants_1.AppConstants.PATIENT_UPDATE_URL, this.patient).subscribe(function (response) {
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
    EditPatientComponent = __decorate([
        core_1.Component({
            selector: 'add-patient',
            templateUrl: '../../../templates/dashboard/patient/edit-patient.html',
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