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
var ICDCodeModel_1 = require("../../../model/ICDCodeModel");
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
        this.icdVersions = [];
        this.checkedVersions = [];
        this.selectAll = false;
        //selectedVersion:ICDVersionModel[];
        this.selectedVersion = [
            { 'label': 'waqas', 'value': 'waqas' },
            { 'label': 'kamran', 'value': 'kamran' }
        ];
        this.selectedScope = [];
    }
    CodeComponent.prototype.ngOnInit = function () {
        document.title = 'HIS | ICD Code';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getICDCodesFromServer(0);
        }
        this.getCheckedVersionsByCodeId(null);
    };
    CodeComponent.prototype.getPageWiseICDs = function (page) {
        this.data = [];
        if (this.searched) {
            this.searchByCode(page);
        }
        else {
            this.getICDCodesFromServer(page);
        }
    };
    CodeComponent.prototype.refreshCodesTable = function () {
        this.searched = false;
        this.searchCode = '';
        this.getICDCodesFromServer(0);
    };
    CodeComponent.prototype.refreshICDsTable = function (page) {
        this.getICDCodesFromServer(page);
    };
    CodeComponent.prototype.deleteICD = function (codeId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete'))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.ICD_CODE_DELETE_URL + codeId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_SUC_03') {
                    _this.notificationService.success('ICD Code', response['responseMessage']);
                    _this.getICDCodesFromServer(0);
                }
                else {
                    _this.getICDCodesFromServer(0);
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
    CodeComponent.prototype.getICDCodesFromServer = function (page) {
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
            /*   if (localStorage.getItem(btoa('access_token'))) {
                   let versionFound = 0;
                   for (let version of this.icdVersions) {
                       if (version.selectedVersion) {
                           versionFound++;
                           break;
                       }
                   }
   
                   if (versionFound == 0) {
                       this.notificationService.warn('Please select at least one version.');
                       return;
                   }*/
            this.iCDModel.selectedVersions = this.icdVersions;
            this.requestsService.postRequest(app_constants_1.AppConstants.ICD_CODE_SAVE_URL, JSON.parse(JSON.stringify(this.iCDModel))).subscribe(function (response) {
                if (response['responseCode'] === 'ICD_SAVE_SUC_01') {
                    _this.iCDModel = new ICDCodeModel_1.ICDCodeModel();
                    _this.iCDData = response['responseData'];
                    _this.notificationService.success('ICD Code', response['responseMessage']);
                    document.getElementById('close-btn').click();
                    _this.refreshICDsTable(0);
                }
                else {
                    _this.iCDData = response['responseData'];
                    _this.notificationService.error('ICD Code', response['responseMessage']);
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        } /*else {
            this.router.navigate(['/login']);
        }
        }*/
        else {
            /*if (this.iCDModel.code === '') {
                this.notificationService.warn('Please enter Code value.');
                document.getElementById('codeId').focus();
                return;
            }*/
            this.notificationService.error('ICD Code', 'Required Fields are missing');
        }
    };
    CodeComponent.prototype.updateICDCode = function (updateCodeForm) {
        var _this = this;
        if (updateCodeForm.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                var versionFound = 0;
                for (var _i = 0, _a = this.icdVersions; _i < _a.length; _i++) {
                    var version = _a[_i];
                    if (version.selectedVersion) {
                        versionFound++;
                        break;
                    }
                }
                if (versionFound == 0) {
                    this.notificationService.warn('Please select at least one version.');
                    return;
                }
                this.iCDModel.selectedVersions = this.icdVersions;
                this.requestsService.putRequest(app_constants_1.AppConstants.ICD_CODE_UPDATE_URL, JSON.parse(JSON.stringify(this.iCDModel))).subscribe(function (response) {
                    if (response['responseCode'] === 'ICD_CODE_UPDATE_SUC_07') {
                        _this.iCDModel = new ICDCodeModel_1.ICDCodeModel();
                        _this.iCDData = response['responseData'];
                        _this.notificationService.success('ICD Code', response['responseMessage']);
                        document.getElementById('close-btn').click();
                        _this.refreshICDsTable(0);
                    }
                    else {
                        _this.iCDData = response['responseData'];
                        _this.notificationService.error('ICD Code', response['responseMessage']);
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
            if (this.iCDModel.code === '') {
                this.notificationService.warn('Please enter Code value.');
                document.getElementById('codeId').focus();
                return;
            }
            this.notificationService.error('ICD Code', 'Required Fields are missing');
        }
    };
    CodeComponent.prototype.editICDCode = function (iCDCode) {
        var _this = this;
        this.isCodeUpdate = true;
        // this.iCDModel = iCDCode;
        this.selectAll = false;
        this.requestsService.getRequest(app_constants_1.AppConstants.ICD_CODE_GET + iCDCode.id)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ICD_SUC_02') {
                _this.selectedScope.length = 0;
                _this.iCDModel = response['responseData'];
                _this.icdVersions = [];
                _this.icdVersions = _this.iCDModel.selectedVersions;
                _this.icdVersions.map(function (x) { _this.selectedScope.push(x.value); });
                //    this.selectedVersion = this.iCDModel.selectedVersions;
                /*for (let version of this.icdVersions) {
                    if (version.selectedVersion) {
                        this.selectAll = true;
                        break;
                    }
                }*/
            }
            else {
                _this.notificationService.error('ICD Code', response['responseMessage']);
            }
        }, function (error) {
            _this.notificationService.warn(error.error.error);
        });
    };
    CodeComponent.prototype.onAddICDCodePopupLoad = function () {
        this.isCodeUpdate = false;
        this.iCDModel = new ICDCodeModel_1.ICDCodeModel();
        this.selectAll = false;
        this.getICDVersionsFromServer();
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
    CodeComponent.prototype.getICDVersionsFromServer = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(app_constants_1.AppConstants.ICD_VERSIONS)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_VERSIONS_FOUND_03') {
                    _this.icdVersions = [];
                    _this.icdVersions = response['responseData'];
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    CodeComponent.prototype.getCheckedVersionsByCodeId = function (id) {
        var _this = this;
        if (id > 0) {
            this.requestsService.getRequest(app_constants_1.AppConstants.ICD_VERSIONS_BY_CODE_URL + id)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_VERSIONS_SUC_14') {
                    _this.checkedVersions = response['responseData'];
                }
                else {
                    _this.checkedVersions = [];
                }
            }, function (error) {
                _this.notificationService.error(error.error.error);
            });
        }
    };
    CodeComponent.prototype.checkedAllVersion = function () {
        for (var _i = 0, _a = this.icdVersions; _i < _a.length; _i++) {
            var version = _a[_i];
            version.selectedVersion = this.selectAll;
        }
    };
    /***
     * if one , version found true then true otherwise false
     * */
    CodeComponent.prototype.checkedVersion = function () {
        var checkedFound = false;
        for (var _i = 0, _a = this.icdVersions; _i < _a.length; _i++) {
            var version = _a[_i];
            if (version.selectedVersion) {
                checkedFound = true;
                break;
            }
        }
        if (checkedFound) {
            this.selectAll = true;
            console.log(this.selectAll);
        }
        else {
            this.selectAll = false;
            console.log(this.selectAll);
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