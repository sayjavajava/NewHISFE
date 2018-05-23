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
var app_constants_1 = require("../../../utils/app.constants");
var CodeComponent = (function () {
    function CodeComponent(notificationService, requestsService, HISUtilService, router) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.iCDModel = new ICDCodeModel_1.ICDCodeModel();
        this.pages = [];
        this.searchCode = '';
        this.searched = false;
        this.isCodeUpdate = false;
    }
    CodeComponent.prototype.ngOnInit = function () {
        document.title = 'HIS | ICD Code';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getICDsFromServer(0);
        }
    };
    CodeComponent.prototype.getPageWiseICDs = function (page) {
        this.data = [];
        if (this.searched) {
            this.searchByCode(page);
        }
        else {
            this.getICDsFromServer(page);
        }
    };
    CodeComponent.prototype.refreshCodesTable = function () {
        this.searched = false;
        this.searchCode = '';
        this.getICDsFromServer(0);
    };
    CodeComponent.prototype.refreshICDsTable = function (page) {
        this.getICDsFromServer(page);
    };
    CodeComponent.prototype.deleteICD = function (codeId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.deleteRequest(app_constants_1.AppConstants.ICD_CODE_DELETE_URL + codeId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_SUC_03') {
                    _this.notificationService.success(response['responseMessage'], 'ICD Code');
                    _this.getPageWiseICDs(_this.currPage);
                }
                else {
                    _this.getPageWiseICDs(_this.currPage);
                    _this.notificationService.error(response['responseMessage'], 'ICD Code');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    CodeComponent.prototype.getICDsFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(app_constants_1.AppConstants.ICD_CODES + page)
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
    CodeComponent.prototype.saveICDCode = function (form) {
        var _this = this;
        if (form.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(app_constants_1.AppConstants.ICD_CODE_SAVE_URL, JSON.parse(JSON.stringify(this.iCDModel))).subscribe(function (response) {
                    if (response['responseCode'] === 'ICD_SAVE_SUC_01') {
                        _this.iCDModel = new ICDCodeModel_1.ICDCodeModel();
                        _this.iCDData = response['responseData'];
                        _this.notificationService.success(response['responseMessage'], 'ICD Code');
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
        }
        else {
            this.notificationService.error('Required Fields are missing', 'ICD Code');
        }
    };
    CodeComponent.prototype.updateICDCode = function (updateCodeForm) {
        var _this = this;
        if (updateCodeForm.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(app_constants_1.AppConstants.ICD_CODE_UPDATE_URL, JSON.parse(JSON.stringify(this.iCDModel))).subscribe(function (response) {
                    if (response['responseCode'] === 'ICD_CODE_UPDATE_SUC_07') {
                        _this.iCDModel = new ICDCodeModel_1.ICDCodeModel();
                        _this.iCDData = response['responseData'];
                        _this.notificationService.success(response['responseMessage'], 'ICD Code');
                        document.getElementById('close-btn').click();
                        _this.refreshICDsTable(0);
                    }
                    else {
                        _this.iCDData = response['responseData'];
                        _this.notificationService.error(response['responseMessage'], 'ICD Code');
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
            this.notificationService.error('Required Fields are missing', 'ICD Code');
        }
    };
    CodeComponent.prototype.editICDCode = function (iCDCode) {
        this.isCodeUpdate = true;
        this.iCDModel = iCDCode;
    };
    CodeComponent.prototype.onAddICDCodePopupLoad = function () {
        this.isCodeUpdate = false;
        this.iCDModel = new ICDCodeModel_1.ICDCodeModel();
    };
    CodeComponent.prototype.searchByCode = function (pageNo) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.searched = true;
            this.requestsService.getRequest(app_constants_1.AppConstants.ICD_CODE_SEARCH + pageNo + '?code=' + this.searchCode)
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
                    _this.notificationService.warn('ICD Code not found');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
    };
    CodeComponent = __decorate([
        core_1.Component({
            selector: 'icd-code-component',
            templateUrl: '../../../templates/dashboard/setting/code.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router])
    ], CodeComponent);
    return CodeComponent;
}());
exports.CodeComponent = CodeComponent;
//# sourceMappingURL=code.component.js.map