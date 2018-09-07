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
var patient_1 = require("../../../model/patient");
var app_constants_1 = require("../../../utils/app.constants");
var user_type_enum_1 = require("../../../enums/user-type-enum");
var his_util_service_1 = require("../../../services/his-util.service");
var requests_service_1 = require("../../../services/requests.service");
var notification_service_1 = require("../../../services/notification.service");
var PatientHistoryComponent = (function () {
    function PatientHistoryComponent(requestsService, router, route, HISUTilService, notificationService) {
        var _this = this;
        this.requestsService = requestsService;
        this.router = router;
        this.route = route;
        this.HISUTilService = HISUTilService;
        this.notificationService = notificationService;
        this.doctors = [];
        this.requestsService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + user_type_enum_1.UserTypeEnum.DOCTOR)
            .subscribe(function (response) {
            if (response['responseStatus'] === 'SUCCESS') {
                _this.doctors = response['responseData'];
            }
        }, function (error) {
            _this.HISUTilService.tokenExpired(error.error.error);
        });
        this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + this.selectedPatientId).subscribe(function (response) {
            if (response['responseCode'] === 'USER_SUC_01') {
                _this.patient = response['responseData'];
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
    }
    PatientHistoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        //throw new Error("Method not implemented.");
        this.route.params.subscribe(function (params) {
            _this.id = params['id'];
        });
    };
    PatientHistoryComponent.prototype.goToUserDashBoard = function () {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    };
    PatientHistoryComponent = __decorate([
        core_1.Component({
            selector: 'patient-history',
            templateUrl: '../../../templates/dashboard/patient/patient-history.template.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService, router_1.Router, router_1.ActivatedRoute, his_util_service_1.HISUtilService, notification_service_1.NotificationService])
    ], PatientHistoryComponent);
    return PatientHistoryComponent;
}());
exports.PatientHistoryComponent = PatientHistoryComponent;
//# sourceMappingURL=patient-history.component.js.map