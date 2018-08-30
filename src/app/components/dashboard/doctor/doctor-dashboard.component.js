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
var requests_service_1 = require("../../../services/requests.service");
var platform_browser_1 = require("@angular/platform-browser");
var app_constants_1 = require("../../../utils/app.constants");
var user_type_enum_1 = require("../../../enums/user-type-enum");
var notification_service_1 = require("../../../services/notification.service");
var material_1 = require("@angular/material");
var ConformationDialogService_1 = require("../../../services/ConformationDialogService");
var DoctorDashboardComponent = (function () {
    function DoctorDashboardComponent(requestService, router, snackBar, notificationService, confirmationDialogService, titleService) {
        this.requestService = requestService;
        this.router = router;
        this.snackBar = snackBar;
        this.notificationService = notificationService;
        this.confirmationDialogService = confirmationDialogService;
        this.titleService = titleService;
        this.title = 'Doctor Dashboard';
        this.dashboardList = [];
        this.branches = [];
        this.doctorsList = [];
        this.dashboardListModified = [];
        this.showDashboard();
    }
    ;
    DoctorDashboardComponent.prototype.ngOnInit = function () {
        this.getBranchesFromServer();
        this.getDoctorsFromServer();
    };
    DoctorDashboardComponent.prototype.showDashboard = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_DASHBOARD_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'DASHBOARD_SUC_01') {
                _this.dashboardList = response['responseData'];
                _this.dashboardListModified = _this.dashboardList;
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    DoctorDashboardComponent.prototype.getBranchesFromServer = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branches = response['responseData'];
            }
        }, function (error) {
        });
    };
    DoctorDashboardComponent.prototype.getDoctorsFromServer = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + user_type_enum_1.UserTypeEnum.DOCTOR)
            .subscribe(function (response) {
            if (response['responseCode'] === 'USER_SUC_01') {
                _this.doctorsList = response['responseData'];
            }
        }, function (error) {
        });
    };
    DoctorDashboardComponent.prototype.getFilteredBranch = function (value) {
        this.dashboardListModified = this.dashboardList;
        if (value == 'All') {
            this.dashboardListModified = this.dashboardList;
        }
        else {
            var arr = this.dashboardListModified.filter(function (x) { return x.branch === value; });
            this.dashboardListModified = arr;
        }
    };
    DoctorDashboardComponent.prototype.getfilteredDoctor = function (value) {
        this.dashboardListModified = this.dashboardList;
        console.log('val:' + value);
        if (value == 'All') {
            this.dashboardListModified = this.dashboardList;
        }
        else {
            var arr = this.dashboardListModified.filter(function (x) { return x.doctorLastName == value; });
            this.dashboardListModified = arr;
        }
    };
    DoctorDashboardComponent.prototype.getfilteredStatus = function (value) {
        this.dashboardListModified = this.dashboardList;
        console.log('val:' + value);
        if (value == 'All') {
            this.dashboardListModified = this.dashboardList;
        }
        else {
            var arr = this.dashboardListModified.filter(function (x) { return x.status == value; });
            this.dashboardListModified = arr;
        }
    };
    DoctorDashboardComponent.prototype.getUpdatedStatus = function (statusValue, apptId) {
        var _this = this;
        var that = this;
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(function (res) {
            if (res == true) {
                _this.requestService.putRequestWithParam(app_constants_1.AppConstants.CHANGE_APPT_STATUS + apptId, statusValue)
                    .subscribe(function (res) {
                    if (res['responseCode'] === "STATUS_SUC_01") {
                        _this.snackBar.open('Status Updated', 'Status has been Updated Successfully', { duration: 3000 });
                    }
                }, function (error) {
                    _this.error = error.error.error;
                });
            }
        });
    };
    DoctorDashboardComponent.prototype.patientHistory = function (id) {
        console.log('testing.. ');
        this.router.navigate(['/dashboard/patient/history', id]);
    };
    DoctorDashboardComponent = __decorate([
        core_1.Component({
            selector: 'doctor-dashboard-component',
            templateUrl: '../../../templates/dashboard/doctor/doctor-dashboard.template.html',
            styleUrls: [],
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router,
            material_1.MatSnackBar,
            notification_service_1.NotificationService,
            ConformationDialogService_1.ConformationDialogService,
            platform_browser_1.Title])
    ], DoctorDashboardComponent);
    return DoctorDashboardComponent;
}());
exports.DoctorDashboardComponent = DoctorDashboardComponent;
//# sourceMappingURL=doctor-dashboard.component.js.map