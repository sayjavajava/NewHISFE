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
var notification_service_1 = require("../../../services/notification.service");
var requests_service_1 = require("../../../services/requests.service");
var his_util_service_1 = require("../../../services/his-util.service");
var app_constants_1 = require("../../../utils/app.constants");
var ServiceTaxComponent = (function () {
    function ServiceTaxComponent(notificationService, requestsService, HISUtilService) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.pages = [];
        this.data = [];
    }
    ServiceTaxComponent.prototype.ngOnInit = function () {
        document.title = 'HIS | Service Tax';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getCodeVersionsFromServer(0);
        }
    };
    ServiceTaxComponent.prototype.getCodeVersionsFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_TAX_URL + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'SER_TAX_SUC_01') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.data = response['responseData']['data'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    ServiceTaxComponent = __decorate([
        core_1.Component({
            selector: 'service-tax-component',
            templateUrl: '../../../templates/dashboard/setting/service-tax.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService])
    ], ServiceTaxComponent);
    return ServiceTaxComponent;
}());
exports.ServiceTaxComponent = ServiceTaxComponent;
//# sourceMappingURL=service-tax.component.js.map