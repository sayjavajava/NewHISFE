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
var notification_service_1 = require("../../../services/notification.service");
var ManageAppointmentComponent = (function () {
    function ManageAppointmentComponent(requestsService, router, titleService, hisUtilService, notificationService) {
        this.requestsService = requestsService;
        this.router = router;
        this.titleService = titleService;
        this.hisUtilService = hisUtilService;
        this.notificationService = notificationService;
        this.pages = [];
    }
    ;
    ManageAppointmentComponent.prototype.ngOnInit = function () {
        this.titleService.setTitle('HIS | Manage Appointments');
        this.getAllPaginatedAppointmentsFromServer(0);
    };
    ManageAppointmentComponent.prototype.getPageWisePatients = function (page) {
        this.getAllPaginatedAppointmentsFromServer(page);
    };
    ManageAppointmentComponent.prototype.getAllPaginatedAppointmentsFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_PAGINATED_PATIENTS_URL + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'APPT_SUC_01') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.data = response['responseData']['data'];
            }
        }, function (error) {
            _this.hisUtilService.tokenExpired(error.error.error);
        });
    };
    ManageAppointmentComponent = __decorate([
        core_1.Component({
            selector: 'manage-appointment-component',
            templateUrl: '../../../templates/dashboard/appointment/manage-appointment.template.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router,
            platform_browser_1.Title,
            his_util_service_1.HISUtilService,
            notification_service_1.NotificationService])
    ], ManageAppointmentComponent);
    return ManageAppointmentComponent;
}());
exports.ManageAppointmentComponent = ManageAppointmentComponent;
//# sourceMappingURL=manage-appointment.component.js.map