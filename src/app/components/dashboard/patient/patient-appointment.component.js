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
var patient_1 = require("../../../model/patient");
var requests_service_1 = require("../../../services/requests.service");
var notification_service_1 = require("../../../services/notification.service");
var his_util_service_1 = require("../../../services/his-util.service");
var PatientAppointmentComponent = (function () {
    function PatientAppointmentComponent(router, route, HISUTilService, requestService, notificationService) {
        this.router = router;
        this.route = route;
        this.HISUTilService = HISUTilService;
        this.requestService = requestService;
        this.notificationService = notificationService;
        this.patient = new patient_1.Patient();
    }
    PatientAppointmentComponent.prototype.ngOnInit = function () {
        //throw new Error("Method not implemented.");
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.id = params['id'];
        });
        console.log(this.id);
        this.loadRecord();
    };
    PatientAppointmentComponent.prototype.goToUserDashBoard = function () {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    };
    PatientAppointmentComponent.prototype.loadRecord = function () {
        var _this = this;
        if (this.id == null || this.id == 0 || this.id == undefined) {
            this.notificationService.error('Please Select Patient Again From Dashboard');
        }
        else {
            this.requestService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + this.id).subscribe(function (response) {
                if (response['responseCode'] === 'USER_SUC_01') {
                    _this.patient = response['responseData'];
                    //this.patient.races = JSON.parse(response['responseData'].racesString);
                }
            }, function (error) {
                _this.HISUTilService.tokenExpired(error.error.error);
            });
        }
    };
    PatientAppointmentComponent = __decorate([
        core_1.Component({
            selector: 'patient-appointment',
            templateUrl: '../../../templates/dashboard/patient/patient-appointment.template.html',
        }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, his_util_service_1.HISUtilService, requests_service_1.RequestsService, notification_service_1.NotificationService])
    ], PatientAppointmentComponent);
    return PatientAppointmentComponent;
}());
exports.PatientAppointmentComponent = PatientAppointmentComponent;
//# sourceMappingURL=patient-appointment.component.js.map