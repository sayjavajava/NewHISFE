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
var user_type_enum_1 = require("../../../enums/user-type-enum");
var app_constants_1 = require("../../../utils/app.constants");
var ConformationDialogService_1 = require("../../../services/ConformationDialogService");
var material_1 = require("@angular/material");
var DataService_1 = require("../../../services/DataService");
var ReceptionistDashboardComponent = (function () {
    function ReceptionistDashboardComponent(requestService, router, confirmationDialogService, snackBar, dataService, titleService) {
        this.requestService = requestService;
        this.router = router;
        this.confirmationDialogService = confirmationDialogService;
        this.snackBar = snackBar;
        this.dataService = dataService;
        this.titleService = titleService;
        this.title = 'Receptionist Dashboard';
        this.dashboardList = [];
        this.branches = [];
        this.doctorsList = [];
        this.checkInTest = false;
        this.dashboardListModified = [];
        this.showDashboard();
    }
    ;
    ReceptionistDashboardComponent.prototype.ngOnInit = function () {
        this.getBranchesFromServer();
        this.getDoctorsFromServer();
    };
    ReceptionistDashboardComponent.prototype.showDashboard = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_DASHBOARD_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'DASHBOARD_SUC_01') {
                // this.dashboardList = response['responseData'];
                var dashboardListTemp = response['responseData'];
                _this.dashboardList = dashboardListTemp.filter(function (x) { return x.status == "CHECK_IN" || x.status == "CONFIRMED" || x.NOT_CONFIRMED == "NOT_CONFIRMED"; });
                _this.dashboardListModified = _this.dashboardList;
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    ReceptionistDashboardComponent.prototype.getBranchesFromServer = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_ALL_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branches = response['responseData'];
            }
        }, function (error) {
        });
    };
    ReceptionistDashboardComponent.prototype.getDoctorsFromServer = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + user_type_enum_1.UserTypeEnum.DOCTOR)
            .subscribe(function (response) {
            if (response['responseCode'] === 'USER_SUC_01') {
                _this.doctorsList = response['responseData'];
            }
        }, function (error) {
        });
    };
    ReceptionistDashboardComponent.prototype.getFilteredBranch = function (value) {
        this.dashboardListModified = this.dashboardList;
        if (value == 'All') {
            this.dashboardListModified = this.dashboardList;
        }
        else {
            var arr = this.dashboardListModified.filter(function (x) { return x.branch === value; });
            this.dashboardListModified = arr;
        }
    };
    ReceptionistDashboardComponent.prototype.getfilteredDoctor = function (value) {
        this.dashboardListModified = this.dashboardList;
        if (value == 'All') {
            this.dashboardListModified = this.dashboardList;
        }
        else {
            var arr = this.dashboardListModified.filter(function (x) { return x.doctorLastName == value; });
            this.dashboardListModified = arr;
        }
    };
    ReceptionistDashboardComponent.prototype.getfilteredStatus = function (value) {
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
    ReceptionistDashboardComponent.prototype.getUpdatedStatus = function (statusValue, apptId, pmID) {
        var _this = this;
        var that = this;
        this.confirmationDialogService
            .confirm("Update Status to " + statusValue, 'Are you sure ?')
            .subscribe(function (res) {
            if (res == true) {
                _this.requestService.putRequestWithParam(app_constants_1.AppConstants.CHANGE_APPT_STATUS + apptId, statusValue)
                    .subscribe(function (res) {
                    if (statusValue == "CHECK_IN") {
                        _this.checkInTest = true;
                    }
                    else
                        _this.checkInTest = false;
                    if (res['responseCode'] === "STATUS_SUC_01") {
                        _this.snackBar.open('Status Updated', 'Status has been Updated Successfully', { duration: 3000 });
                    }
                }, function (error) {
                    _this.error = error.error.error;
                });
            }
        });
        if (statusValue === 'CHECK_IN') {
            this.requestService.getRequest(app_constants_1.AppConstants.INVOICE_CHECK_IN + pmID)
                .subscribe(function (res) {
                if (res['responseCode'] === "INVOICE_ERR_01") {
                    _this.snackBar.open('Error', "Invoice Not Generated", { duration: 3000 });
                }
            }, function (error) {
                _this.error = error.error.error;
            });
        }
    };
    ReceptionistDashboardComponent.prototype.patientHistory = function (id) {
        this.dataService.getPatientId(id);
        this.router.navigate(['/dashboard/patient/', id, 'history']);
    };
    ReceptionistDashboardComponent.prototype.updateAppointmentData = function (id) {
        this.router.navigate(['/dashboard/patient/invoice', id]);
    };
    ReceptionistDashboardComponent = __decorate([
        core_1.Component({
            selector: 'receptionist-dashboard-component',
            templateUrl: '../../../templates/dashboard/receptionist/receptionist-dashboard.template.html',
            styleUrls: [],
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router,
            ConformationDialogService_1.ConformationDialogService,
            material_1.MatSnackBar,
            DataService_1.DataService,
            platform_browser_1.Title])
    ], ReceptionistDashboardComponent);
    return ReceptionistDashboardComponent;
}());
exports.ReceptionistDashboardComponent = ReceptionistDashboardComponent;
//# sourceMappingURL=receptionist-dashboard.component.js.map