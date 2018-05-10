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
var ICDCodeModel_1 = require("../../../models/ICDCodeModel");
var requests_service_1 = require("../../../services/requests.service");
var his_util_service_1 = require("../../../services/his-util.service");
var router_1 = require("@angular/router");
var IcdCodeComponent = (function () {
    function IcdCodeComponent(notificationService, requestsService, HISUtilService, router) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.iCDModel = new ICDCodeModel_1.ICDCodeModel();
        this.pages = [];
        this.searchCode = "";
        this.searched = false;
    }
    IcdCodeComponent.prototype.ngOnInit = function () {
        document.title = 'HIS | Manage ICD';
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.getICDsFromServer(0);
        }
    };
    IcdCodeComponent.prototype.getPageWiseICDs = function (page) {
        this.data = [];
        if (this.searched) {
            this.searchByCode(page);
        }
        else {
            this.getICDsFromServer(page);
        }
    };
    IcdCodeComponent.prototype.refreshCodesTable = function () {
        this.searched = false;
        this.getICDsFromServer(0);
    };
    IcdCodeComponent.prototype.refreshICDsTable = function (page) {
        this.getICDsFromServer(page);
    };
    IcdCodeComponent.prototype.deleteICD = function (iCDId) {
        var _this = this;
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.deleteRequest('/setting/icd/code/delete?icdId=' + iCDId, {})
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_SUC_03') {
                    _this.notificationService.success(response['responseMessage'], 'ICD');
                    _this.getPageWiseICDs(_this.currPage);
                }
                else {
                    _this.getPageWiseICDs(_this.currPage);
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
    IcdCodeComponent.prototype.getICDsFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest('/setting/icd/codes/' + page)
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
    IcdCodeComponent.prototype.onAddICDPopupLoad = function () {
        var _this = this;
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest('/setting/icd/iCDCodeVersions')
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_SUC_01') {
                    _this.iCDModel = new ICDCodeModel_1.ICDCodeModel();
                    // this.iCDVersions = response['responseData'];
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    IcdCodeComponent.prototype.saveICDCode = function () {
        var _this = this;
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest('/setting/icd/code/save', JSON.parse(JSON.stringify(this.iCDModel))).subscribe(function (response) {
                if (response['responseCode'] === 'ICD_SAVE_SUC_01') {
                    _this.iCDModel = new ICDCodeModel_1.ICDCodeModel();
                    _this.iCDData = response['responseData'];
                    _this.notificationService.success(response['responseMessage'], 'ICD');
                    document.getElementById('close-btn').click();
                    _this.refreshICDsTable(0);
                }
                else {
                    _this.iCDData = response['responseData'];
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
    IcdCodeComponent.prototype.updateICDCode = function () {
        var _this = this;
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.putRequest('/setting/icd/code/update', JSON.parse(JSON.stringify(this.iCDModel))).subscribe(function (response) {
                if (response['responseCode'] === 'ICD_CODE_UPDATE_SUC_07') {
                    _this.iCDModel = new ICDCodeModel_1.ICDCodeModel();
                    _this.iCDData = response['responseData'];
                    _this.notificationService.success(response['responseMessage'], 'ICD');
                    document.getElementById('close-btn-update').click();
                    _this.refreshICDsTable(0);
                }
                else {
                    _this.iCDData = response['responseData'];
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
    IcdCodeComponent.prototype.editICDCode = function (iCDCode) {
        this.iCDModel = iCDCode;
    };
    IcdCodeComponent.prototype.onAddICDCodePopupLoad = function () {
        this.iCDModel = new ICDCodeModel_1.ICDCodeModel();
    };
    //
    // onKey(event: any) {
    //     if (event.key === "Enter") {
    //         console.log(event);
    //     }
    // }
    IcdCodeComponent.prototype.searchByCode = function (pageNo) {
        var _this = this;
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.searched = true;
            this.requestsService.getRequest('/setting/icd/code/search/' + pageNo + '?code=' + this.searchCode)
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
    IcdCodeComponent = __decorate([
        core_1.Component({
            selector: 'icd-code-component',
            templateUrl: '../../../templates/dashboard/setting/code.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router])
    ], IcdCodeComponent);
    return IcdCodeComponent;
}());
exports.IcdCodeComponent = IcdCodeComponent;
//# sourceMappingURL=icd-code.component.js.map