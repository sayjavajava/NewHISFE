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
var router_1 = require("@angular/router");
var requests_service_1 = require("../../../services/requests.service");
var platform_browser_1 = require("@angular/platform-browser");
var user_type_enum_1 = require("../../../enums/user-type-enum");
var app_constants_1 = require("../../../utils/app.constants");
var ConformationDialogService_1 = require("../../../services/ConformationDialogService");
var material_1 = require("@angular/material");
var core_1 = require("@angular/core");
var NurseDashboardComponent = (function () {
    function NurseDashboardComponent(requestService, router, confirmationDialogService, snackBar, titleService) {
        this.requestService = requestService;
        this.router = router;
        this.confirmationDialogService = confirmationDialogService;
        this.snackBar = snackBar;
        this.titleService = titleService;
        this.title = 'Doctor Dashboard';
        this.dashboardList = [];
        this.branches = [];
        this.doctorsList = [];
        this.dashboardListModified = [];
        this.showDashboard();
    }
    ;
    NurseDashboardComponent.prototype.ngOnInit = function () {
        this.getBranchesFromServer();
        this.getDoctorsFromServer();
    };
    NurseDashboardComponent.prototype.showDashboard = function () {
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
    NurseDashboardComponent.prototype.getBranchesFromServer = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branches = response['responseData'];
            }
        }, function (error) {
        });
    };
    NurseDashboardComponent.prototype.getDoctorsFromServer = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + user_type_enum_1.UserTypeEnum.DOCTOR)
            .subscribe(function (response) {
            if (response['responseCode'] === 'USER_SUC_01') {
                _this.doctorsList = response['responseData'];
            }
        }, function (error) {
        });
    };
    NurseDashboardComponent.prototype.getFilteredBranch = function (value) {
        this.dashboardListModified = this.dashboardList;
        if (value == 'All') {
            this.dashboardListModified = this.dashboardList;
        }
        else {
            var arr = this.dashboardListModified.filter(function (x) { return x.branch === value; });
            this.dashboardListModified = arr;
        }
    };
    NurseDashboardComponent.prototype.getfilteredDoctor = function (value) {
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
    NurseDashboardComponent.prototype.getfilteredStatus = function (value) {
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
    NurseDashboardComponent.prototype.getUpdatedStatus = function (statusValue, apptId) {
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
    NurseDashboardComponent = __decorate([
        core_1.Component({
            selector: 'nurse-dashboard-component',
            templateUrl: '../../../templates/dashboard/nurse/nurse-dashboard.template.html',
            styleUrls: [],
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router,
            ConformationDialogService_1.ConformationDialogService,
            material_1.MatSnackBar,
            platform_browser_1.Title])
    ], NurseDashboardComponent);
    return NurseDashboardComponent;
}());
exports.NurseDashboardComponent = NurseDashboardComponent;
//# sourceMappingURL=nurse-dashboard.component.js.map