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
var router_1 = require("@angular/router");
var EmailTemplateComponent = (function () {
    function EmailTemplateComponent(notificationService, requestsService, HISUtilService, router) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.pages = [];
        this.dataEmailTemplate = [];
        this.searchTitle = "";
        this.searched = false;
    }
    EmailTemplateComponent.prototype.ngOnInit = function () {
        document.title = 'HIS | Email Template';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getEmailTemplateFromServer(0);
        }
    };
    EmailTemplateComponent.prototype.getEmailTemplateFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(app_constants_1.AppConstants.EMAIL_TEMPLATE_FETCH_ALL_URL + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'EMAIL_TEMP_SUC_02') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.dataEmailTemplate = response['responseData']['data'];
                // this.notificationService.success(response['responseData'],'Email Template');
            }
            else {
                _this.nextPage = "";
                _this.prePage = "";
                _this.currPage = '';
                _this.pages = [];
                // this.dataEmailTemplate = response['responseData']['data'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    EmailTemplateComponent.prototype.deleteEmailTemplate = function (id) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are you source."))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.EMAIL_TEMPLATE_DELETE_URL + id, {})
                .subscribe(function (response) {
                if (response['responseCode'] === 'EMAIL_TEMP_SUC_06') {
                    _this.notificationService.success(response['responseMessage'], 'Email Template');
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Email Template');
                }
                _this.getPageWiseEmailTemplate(_this.currPage);
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    EmailTemplateComponent.prototype.refreshEmailTemplate = function () {
        this.dataEmailTemplate = [];
        this.searched = false;
        this.getEmailTemplateFromServer(0);
    };
    EmailTemplateComponent.prototype.getPageWiseEmailTemplate = function (page) {
        this.dataEmailTemplate = [];
        if (this.searched) {
            this.searchByTitle(page);
        }
        else {
            this.getEmailTemplateFromServer(page);
        }
    };
    EmailTemplateComponent.prototype.searchByTitle = function (page) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.searched = true;
            this.requestsService.getRequest(app_constants_1.AppConstants.EMAIL_TEMPLATE_SEARCH_URL + page + '?title=' + this.searchTitle)
                .subscribe(function (response) {
                if (response['responseCode'] === 'EMAIL_TEMP_SUC_10') {
                    _this.nextPage = response['responseData']['nextPage'];
                    _this.prePage = response['responseData']['prePage'];
                    _this.currPage = response['responseData']['currPage'];
                    _this.pages = response['responseData']['pages'];
                    _this.dataEmailTemplate = response['responseData']['data'];
                    _this.notificationService.success(response['responseMessage'], 'Email Template');
                }
                else {
                    _this.nextPage = 0;
                    _this.prePage = 0;
                    _this.currPage = 0;
                    _this.pages = [];
                    _this.dataEmailTemplate = [];
                    _this.notificationService.error(response['responseMessage'], 'Email Template');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
    };
    EmailTemplateComponent = __decorate([
        core_1.Component({
            selector: 'service-tax-component',
            templateUrl: '../../../templates/dashboard/setting/email-template.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router])
    ], EmailTemplateComponent);
    return EmailTemplateComponent;
}());
exports.EmailTemplateComponent = EmailTemplateComponent;
//# sourceMappingURL=email-template-component.js.map