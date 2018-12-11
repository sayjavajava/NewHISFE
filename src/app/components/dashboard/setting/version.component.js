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
var ICDVersionModel_1 = require("../../../model/ICDVersionModel");
var app_constants_1 = require("../../../utils/app.constants");
var VersionComponent = (function () {
    function VersionComponent(notificationService, requestsService, HISUtilService, router) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.iCDVersionModel = new ICDVersionModel_1.ICDVersionModel();
        this.pages = [];
        this.searchVersion = '';
        this.loading = false;
    }
    VersionComponent.prototype.ngOnInit = function () {
        document.title = 'HIS | Manage ICD';
        if (localStorage.getItem(btoa('access_token'))) {
            this.cols = [
                { field: 'name', header: 'Name' },
                { field: 'description', header: 'Description' },
                { field: 'status', header: 'Sstatus' },
                { field: 'Action', header: 'Action' }
            ];
            this.getAllVersionsFromServer();
        }
    };
    VersionComponent.prototype.refreshVersionsTable = function () {
        this.searchVersion = '';
        this.searched = false;
        this.getAllVersionsFromServer();
    };
    VersionComponent.prototype.getAllVersionsFromServer = function () {
        var _this = this;
        this.loading = true;
        this.requestsService.getRequest(app_constants_1.AppConstants.ICD_VERSIONS_DATA_TABLE)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ICD_VERSIONS_FOUND_03') {
                _this.data = response['responseData'];
            }
            _this.loading = false;
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
            _this.loading = false;
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
                this.requestsService.putRequest(app_constants_1.AppConstants.ICD_VERSION_UPDATE_URL, JSON.parse(JSON.stringify(this.iCDVersionModel))).subscribe(function (response) {
                    if (response['responseCode'] === 'ICD_VERSION_UPDATE_SUC_07') {
                        _this.iCDVersionModel = new ICDVersionModel_1.ICDVersionModel();
                        _this.notificationService.success(response['responseMessage'], 'ICD Version');
                        document.getElementById('close-btn-ICDVersion').click();
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'ICD Version');
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
    VersionComponent.prototype.saveICDVersion = function (form) {
        var _this = this;
        if (form.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(app_constants_1.AppConstants.ICD_VERSION_SAVE_URL, JSON.parse(JSON.stringify(this.iCDVersionModel))).subscribe(function (response) {
                    if (response['responseCode'] === 'ICD_VERSION_SUC_08') {
                        _this.iCDVersionModel = new ICDVersionModel_1.ICDVersionModel();
                        _this.notificationService.success('ICD Version', response['responseMessage']);
                        document.getElementById('close-btn-ICDVersion').click();
                        _this.refreshICDsVersionTable(0);
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'ICD Version');
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
            if (this.iCDVersionModel.name === '') {
                this.notificationService.warn('Please enter Version value.');
                document.getElementById('nameNameId').focus();
                return;
            }
            this.notificationService.error('Required Fields are missing', 'ICD Version');
        }
    };
    VersionComponent.prototype.deleteICDVersion = function (iCDVersionId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete'))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.ICD_VERSION_DELETE_URL + iCDVersionId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_VERSION_DEL_SUC_11') {
                    _this.notificationService.success(response['responseMessage'], 'ICD Version');
                    _this.getAllVersionsFromServer();
                }
                else {
                    _this.getAllVersionsFromServer();
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
        this.getAllVersionsFromServer();
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