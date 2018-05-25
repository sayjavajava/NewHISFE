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
var service_tax_1 = require("../../../models/service-tax");
var router_1 = require("@angular/router");
var ServiceTaxComponent = (function () {
    function ServiceTaxComponent(notificationService, requestsService, HISUtilService, router) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.serviceTax = new service_tax_1.ServiceTax();
        this.pages = [];
        this.dataTaxes = [];
        this.isUpdateServiceTax = false;
        this.isSearchedTax = false;
        this.searchTax = "";
    }
    ServiceTaxComponent.prototype.ngOnInit = function () {
        document.title = 'HIS | Service Tax';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getTaxesFromServer(0);
        }
    };
    ServiceTaxComponent.prototype.getTaxesFromServer = function (page) {
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
                _this.dataTaxes = response['responseData']['data'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    ServiceTaxComponent.prototype.onTaxPopupLoad = function () {
        this.isUpdateServiceTax = false;
        this.serviceTax = new service_tax_1.ServiceTax();
    };
    ServiceTaxComponent.prototype.saveServiceTax = function (form) {
        var _this = this;
        if (form.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(app_constants_1.AppConstants.SERVICE_TAX_SAVE_URL, this.serviceTax).subscribe(function (response) {
                    if (response['responseCode'] === 'SER_TAX_SUC_03') {
                        _this.notificationService.success(response['responseMessage'], 'Tax');
                        _this.getPageWiseICDs(_this.currPage);
                        document.getElementById('close-btn').click();
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Tax');
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
            this.notificationService.error('Required Fields are missing', 'Tax Service');
        }
    };
    ServiceTaxComponent.prototype.deleteServiceTax = function (taxId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are you soure?"))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.SERVICE_TAX_DELETE_URL + taxId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'SER_TAX_SUC_02') {
                    _this.notificationService.success(response['responseMessage'], 'Tax');
                    _this.getPageWiseICDs(_this.currPage);
                }
                else {
                    _this.getPageWiseICDs(_this.currPage);
                    _this.notificationService.error(response['responseMessage'], 'Tax');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    ServiceTaxComponent.prototype.editServiceTax = function (serviceTax) {
        this.isUpdateServiceTax = true;
        this.serviceTax = serviceTax;
    };
    ServiceTaxComponent.prototype.updateServiceTax = function (updateServiceTaxForm) {
        var _this = this;
        if (updateServiceTaxForm.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(app_constants_1.AppConstants.SERVICE_TAX_UPDATE_URL, this.serviceTax).subscribe(function (response) {
                    if (response['responseCode'] === 'SER_TAX_SUC_06') {
                        _this.serviceTax = new service_tax_1.ServiceTax();
                        _this.notificationService.success(response['responseMessage'], 'Tax');
                        document.getElementById('close-btn').click();
                        _this.getPageWiseICDs(_this.currPage);
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Tax');
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
            this.notificationService.error('Required Fields are missing', 'Tax');
        }
    };
    ServiceTaxComponent.prototype.getPageWiseICDs = function (page) {
        this.dataTaxes = [];
        if (this.isSearchedTax) {
            this.searchByTaxName();
        }
        else {
            this.getTaxesFromServer(page);
        }
    };
    ServiceTaxComponent.prototype.refreshTaxesTable = function () {
        this.isSearchedTax = false;
        this.searchTax = '';
        this.getTaxesFromServer(0);
    };
    ServiceTaxComponent.prototype.searchByTaxName = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.isSearchedTax = true;
            this.requestsService.getRequest(app_constants_1.AppConstants.SERVICE_TAX_SEARCH_URL + '0?searchTax=' + this.searchTax)
                .subscribe(function (response) {
                if (response['responseCode'] === 'SER_TAX_SUC_07') {
                    _this.nextPage = response['responseData']['nextPage'];
                    _this.prePage = response['responseData']['prePage'];
                    _this.currPage = response['responseData']['currPage'];
                    _this.pages = response['responseData']['pages'];
                    _this.dataTaxes = response['responseData']['data'];
                    _this.notificationService.success('Taxes found successfully');
                }
                else {
                    _this.nextPage = 0;
                    _this.prePage = 0;
                    _this.currPage = 0;
                    _this.pages = [];
                    _this.dataTaxes = [];
                    _this.notificationService.warn('Taxes not found');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
    };
    ServiceTaxComponent = __decorate([
        core_1.Component({
            selector: 'service-tax-component',
            templateUrl: '../../../templates/dashboard/setting/service-tax.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router])
    ], ServiceTaxComponent);
    return ServiceTaxComponent;
}());
exports.ServiceTaxComponent = ServiceTaxComponent;
//# sourceMappingURL=service-tax.component.js.map