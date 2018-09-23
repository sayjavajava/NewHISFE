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
var medical_service_1 = require("../../../models/medical-service");
//import * as _ from 'lodash';
var router_1 = require("@angular/router");
var EditMedicalServiceComponent = /** @class */ (function () {
    function EditMedicalServiceComponent(notificationService, requestsService, HISUtilService, router, activatedRoute) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.branches = [];
        this.departments = [];
        this.taxes = [];
        this.selectedMS = new medical_service_1.MedicalService();
    }
    EditMedicalServiceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getBranchesFromServer();
        this.getDepartmentsFromServer();
        this.getTaxesFromServer();
        this.activatedRoute.params.subscribe(function (params) {
            _this.selectedMedicalServiceId = Number(params['id']);
            _this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_MEDICAL_SERVICES_BY_ID_URL + _this.selectedMedicalServiceId).subscribe(function (response) {
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
    };
    EditMedicalServiceComponent.prototype.getBranchesFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branches = response['responseData'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    EditMedicalServiceComponent.prototype.getDepartmentsFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI)
            .subscribe(function (response) {
            if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                _this.departments = response['responseData'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
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