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
var app_constants_1 = require("../../../utils/app.constants");
var VersionComponent = (function () {
    function VersionComponent(notificationService, requestsService, HISUtilService, router) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.iCDVersionModel = new ICDVersionModel_1.ICDVersionModel();
        this.pages = [];
        this.searchVersion = "";
    }
    VersionComponent.prototype.ngOnInit = function () {
        document.title = 'HIS | Manage ICD';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getVersionsFromServer(0);
        }
    };
    VersionComponent.prototype.getPageWiseICDsVersion = function (page) {
        this.data = [];
        if (this.searched) {
            this.searchByVersion(page);
        }
        else {
            this.getVersionsFromServer(page);
        }
    };
    VersionComponent.prototype.refreshVersionsTable = function () {
        this.searchVersion = "";
        this.searched = false;
        this.getVersionsFromServer(0);
    };
    VersionComponent.prototype.getVersionsFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(app_constants_1.AppConstants.ICD_VERSIONS + page)
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
    VersionComponent.prototype.editICDVersion = function (iCDVersion) {
        this.isVersionUpdate = true;
        this.iCDVersionModel = iCDVersion;
    };
    VersionComponent.prototype.updateICDVersion = function (versionForm) {
        var _this = this;
        if (versionForm.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(app_constants_1.AppConstants.ICD_VERSION, JSON.parse(JSON.stringify(this.iCDVersionModel))).subscribe(function (response) {
                    if (response['responseCode'] === 'ICD_VERSION_UPDATE_SUC_07') {
                        _this.iCDVersionModel = new ICDVersionModel_1.ICDVersionModel();
                        _this.notificationService.success(response['responseMessage'], 'ICD');
                        document.getElementById('close-btn-ICDVersion').click();
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
        }
        else {
            this.notificationService.error('Required Fields are missing', 'ICD Version');
        }
    };
    VersionComponent.prototype.onAddICDVersionPopupLoad = function () {
        this.isVersionUpdate = false;
        this.iCDVersionModel = new ICDVersionModel_1.ICDVersionModel();
    };
    VersionComponent.prototype.searchByVersion = function (page) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.searched = true;
            this.requestsService.getRequest(app_constants_1.AppConstants.ICD_VERSION_SEARCH + page + '?searchVersion=' + this.searchVersion)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_VERSIONS_FOUND_SUC_13') {
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
    VersionComponent.prototype.saveICDVersion = function (form) {
        var _this = this;
        if (form.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(app_constants_1.AppConstants.ICD_VERSION, JSON.parse(JSON.stringify(this.iCDVersionModel))).subscribe(function (response) {
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
        }
        else {
            this.notificationService.error('Required Fields are missing', 'ICD Version');
        }
    };
    VersionComponent.prototype.deleteICDVersion = function (iCDVersionId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.deleteRequest(app_constants_1.AppConstants.ICD_VERSION_DELETE + iCDVersionId, {})
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_VERSION_DEL_SUC_11') {
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
    VersionComponent.prototype.refreshICDsVersionTable = function (page) {
        this.getVersionsFromServer(page);
    };
    VersionComponent = __decorate([
        core_1.Component({
            selector: 'icd-version-component',
            templateUrl: '../../../templates/dashboard/setting/version.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router])
    ], VersionComponent);
    return VersionComponent;
}());
exports.VersionComponent = VersionComponent;
//# sourceMappingURL=version.component.js.map