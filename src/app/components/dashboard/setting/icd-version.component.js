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
var router_1 = require("@angular/router");
var ICDVersionModel_1 = require("../../../models/ICDVersionModel");
var IcdVersionComponent = (function () {
    function IcdVersionComponent(notificationService, requestsService, HISUtilService, router) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.iCDVersionModel = new ICDVersionModel_1.ICDVersionModel();
        this.pages = [];
        this.searchVersion = "";
    }
    IcdVersionComponent.prototype.ngOnInit = function () {
        document.title = 'HIS | Manage ICD';
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.getICDsVersionFromServer(0);
        }
    };
    IcdVersionComponent.prototype.getPageWiseICDsVersion = function (page) {
        this.data = [];
        if (this.searched) {
            this.searchByVersion(page);
        }
        else {
            this.getICDsVersionFromServer(page);
        }
    };
    IcdVersionComponent.prototype.refreshVersionsTable = function () {
        this.searched = false;
        this.getICDsVersionFromServer(0);
    };
    IcdVersionComponent.prototype.getICDsVersionFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest('/setting/icd/versions/' + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ICD_SUC_02') {
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
    IcdVersionComponent.prototype.editICDVersion = function (iCDVersion) {
        this.iCDVersionModel = iCDVersion;
    };
    IcdVersionComponent.prototype.updateICDVersion = function () {
        var _this = this;
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.putRequest('/setting/icd/version/update', JSON.parse(JSON.stringify(this.iCDVersionModel))).subscribe(function (response) {
                if (response['responseCode'] === 'ICD_CODE_UPDATE_SUC_07') {
                    _this.iCDVersionModel = new ICDVersionModel_1.ICDVersionModel();
                    _this.notificationService.success(response['responseMessage'], 'ICD');
                    document.getElementById('close-btn-update').click();
                    _this.getPageWiseICDsVersion(_this.currPage);
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'ICD');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    IcdVersionComponent.prototype.onAddICDVersionPopupLoad = function () {
        this.iCDVersionModel = new ICDVersionModel_1.ICDVersionModel();
    };
    IcdVersionComponent.prototype.searchByVersion = function (page) {
        var _this = this;
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.searched = true;
            this.requestsService.getRequest('/setting/icd/version/search/' + page + '?searchVersion=' + this.searchVersion)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_SUC_02') {
                    _this.nextPage = response['responseData']['nextPage'];
                    _this.prePage = response['responseData']['prePage'];
                    _this.currPage = response['responseData']['currPage'];
                    _this.pages = response['responseData']['pages'];
                    _this.data = response['responseData']['data'];
                }
                else {
                    _this.nextPage = 0;
                    _this.prePage = 0;
                    _this.currPage = 0;
                    _this.pages = [];
                    _this.data = [];
                    _this.notificationService.warn('ICD not found');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
    };
    IcdVersionComponent.prototype.saveICDVersion = function () {
        var _this = this;
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest('/setting/icd/version/save', JSON.parse(JSON.stringify(this.iCDVersionModel))).subscribe(function (response) {
                if (response['responseCode'] === 'ICD_VERSION_SUC_08') {
                    _this.iCDVersionModel = new ICDVersionModel_1.ICDVersionModel();
                    _this.notificationService.success(response['responseMessage'], 'ICD');
                    document.getElementById('close-btn-ICDVersion').click();
                    _this.refreshICDsVersionTable(0);
                }
                else {
                    _this.notificationService.error('ICD', response['responseMessage']);
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    IcdVersionComponent.prototype.deleteICDVersion = function (iCDVersionId) {
        var _this = this;
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.deleteRequest('/setting/icd/version/delete?iCDVersionId=' + iCDVersionId, {})
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_SUC_03') {
                    _this.notificationService.success(response['responseMessage'], 'ICD Version');
                    _this.getPageWiseICDsVersion(_this.currPage);
                }
                else {
                    _this.getPageWiseICDsVersion(_this.currPage);
                    _this.notificationService.error(response['responseMessage'], 'ICD Version');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    IcdVersionComponent.prototype.refreshICDsVersionTable = function (page) {
        this.getICDsVersionFromServer(page);
    };
    IcdVersionComponent = __decorate([
        core_1.Component({
            selector: 'icd-version-component',
            templateUrl: '../../../templates/dashboard/setting/icd-version.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router])
    ], IcdVersionComponent);
    return IcdVersionComponent;
}());
exports.IcdVersionComponent = IcdVersionComponent;
//# sourceMappingURL=icd-version.component.js.map