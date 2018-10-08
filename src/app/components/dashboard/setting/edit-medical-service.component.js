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
var requests_service_1 = require("../../../services/requests.service");
var notification_service_1 = require("../../../services/notification.service");
var his_util_service_1 = require("../../../services/his-util.service");
var app_constants_1 = require("../../../utils/app.constants");
var medical_service_1 = require("../../../model/medical-service");
var router_1 = require("@angular/router");
var EditMedicalServiceComponent = (function () {
    function EditMedicalServiceComponent(notificationService, requestsService, HISUtilService, router, activatedRoute) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.selectedMS = new medical_service_1.MedicalService();
        this.taxes = [];
        this.isUnderprocess = false;
    }
    EditMedicalServiceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.selectedMS.tax.id = -1;
        this.activatedRoute.params.subscribe(function (params) {
            _this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_MEDICAL_SERVICES_BY_ID_URL + Number(params['id'])).subscribe(function (response) {
                if (response['responseCode'] === 'MED_SER_SUC_01') {
                    _this.selectedMS = response['responseData'];
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Medical Service Policies');
                    _this.router.navigate(['404-not-found']);
                }
            }, function (error) {
            });
        });
        this.getTaxesFromServer();
    };
    EditMedicalServiceComponent.prototype.getTaxesFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_TAX_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'SER_TAX_SUC_01') {
                _this.taxes = response['responseData'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    EditMedicalServiceComponent.prototype.updateMedicalServices = function (form) {
        var _this = this;
        if (!this.isUnderprocess) {
            this.isUnderprocess = true;
            if (this.selectedMS.name === '') {
                this.notificationService.warn('Please enter name.');
                document.getElementById('msTitle').focus();
                this.isUnderprocess = false;
                return;
            }
            if (this.selectedMS.code === '') {
                this.notificationService.warn('Please enter code.');
                document.getElementById('code').focus();
                this.isUnderprocess = false;
                return;
            }
            var foundBranch = 0;
            for (var _i = 0, _a = this.selectedMS.branches; _i < _a.length; _i++) {
                var branch = _a[_i];
                if (branch.checkedBranch) {
                    foundBranch++;
                }
            }
            if (foundBranch <= 0) {
                this.notificationService.warn('Please select at least one branch.');
                document.getElementById('branchId').focus();
                this.isUnderprocess = false;
                return;
            }
            var foundDepartment = 0;
            for (var _b = 0, _c = this.selectedMS.departments; _b < _c.length; _b++) {
                var department = _c[_b];
                if (department.checkedDepartment) {
                    foundDepartment++;
                }
            }
            if (foundDepartment <= 0) {
                this.notificationService.warn('Please select at least one Department.');
                document.getElementById('departmentId').focus();
                this.isUnderprocess = false;
                return;
            }
            if (this.selectedMS.tax.id <= 0) {
                this.notificationService.warn('Please select tax.');
                document.getElementById('taxId').focus();
                this.isUnderprocess = false;
                return;
            }
            this.requestsService.putRequest(app_constants_1.AppConstants.UPDATE_MEDICAL_SERVICES_URL, this.selectedMS)
                .subscribe(function (response) {
                if (response['responseCode'] === 'MED_SER_SUC_02') {
                    _this.notificationService.success(response['responseMessage'], 'Medical Service');
                    _this.router.navigate(['/dashboard/setting/medicalServices']);
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Medical Service');
                }
                _this.isUnderprocess = false;
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
                _this.isUnderprocess = false;
            });
        }
        else {
            this.notificationService.warn('Your first request is under process. Please wait..');
        }
    };
    EditMedicalServiceComponent = __decorate([
        core_1.Component({
            selector: 'add-medical-services-component',
            templateUrl: '../../../templates/dashboard/setting/edit-medical-services.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router,
            router_1.ActivatedRoute])
    ], EditMedicalServiceComponent);
    return EditMedicalServiceComponent;
}());
exports.EditMedicalServiceComponent = EditMedicalServiceComponent;
//# sourceMappingURL=edit-medical-service.component.js.map