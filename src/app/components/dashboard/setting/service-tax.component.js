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
var service_tax_1 = require("../../../model/service-tax");
var router_1 = require("@angular/router");
var taxComponent = (function () {
    function taxComponent(notificationService, requestsService, HISUtilService, router) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.serviceTax = new service_tax_1.TaxService();
        this.dataTaxes = [];
        this.isUpdateServiceTax = false;
        this.isSearchedTax = false;
        this.searchTax = '';
        this.cols = [
            { field: 'name', header: 'name' },
            { field: 'rate', header: 'rate' },
            { field: 'fromDate', header: 'fromDate' },
            { field: 'toDate', header: 'toDate' },
            { field: 'description', header: 'description' },
            { field: 'status', header: 'status' },
            { field: 'Action', header: 'Action' },
        ];
    }
    taxComponent.prototype.ngOnInit = function () {
        document.title = 'HIS | Service Tax';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getAllTaxesForDataTable();
        }
    };
    taxComponent.prototype.getAllTaxesForDataTable = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_TAX_DATA_TABLE_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'SER_TAX_SUC_01') {
                _this.dataTaxes = response['responseData'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    taxComponent.prototype.onTaxPopupLoad = function () {
        this.isUpdateServiceTax = false;
        this.serviceTax = new service_tax_1.TaxService();
    };
    taxComponent.prototype.saveServiceTax = function (form) {
        var _this = this;
        if (form.valid) {
            if (new Date(this.serviceTax.fromDate) > new Date(this.serviceTax.toDate)) {
                this.notificationService.warn('FROM DATE must be less than or equal to TO DATE.');
                document.getElementById('fromDate').focus();
                return;
            }
            if (this.serviceTax.rate < 0 || this.serviceTax.rate > 100) {
                this.notificationService.error('Please enter valid tax', 'Tax');
                return;
            }
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(app_constants_1.AppConstants.SERVICE_TAX_SAVE_URL, this.serviceTax).subscribe(function (response) {
                    if (response['responseCode'] === 'SER_TAX_SUC_03') {
                        _this.notificationService.success(response['responseMessage'], 'Tax');
                        _this.getAllTaxesForDataTable();
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
            if (this.serviceTax.name === '') {
                this.notificationService.warn('Please enter Name.');
                document.getElementById('name').focus();
                return;
            }
            if (this.serviceTax.fromDate === '') {
                this.notificationService.warn('Please enter from date.');
                document.getElementById('fromDate').focus();
                return;
            }
            if (this.serviceTax.toDate === '') {
                this.notificationService.warn('Please enter to date.');
                document.getElementById('toDate').focus();
                return;
            }
            if (new Date(this.serviceTax.fromDate) > new Date(this.serviceTax.toDate)) {
                this.notificationService.warn('FROM DATE must be less than or equal to TO DATE.');
                document.getElementById('fromDate').focus();
                return;
            }
            if (this.serviceTax.rate < 0 || this.serviceTax.rate > 100) {
                this.notificationService.error('Please enter valid tax', 'Tax');
                return;
            }
            this.notificationService.error('Required Fields are missing', 'Tax Service');
        }
    };
    taxComponent.prototype.deleteServiceTax = function (taxId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are you soure?'))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.SERVICE_TAX_DELETE_URL + taxId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'SER_TAX_SUC_02') {
                    _this.notificationService.success(response['responseMessage'], 'Tax');
                    _this.getAllTaxesForDataTable();
                }
                else {
                    _this.getAllTaxesForDataTable();
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
    taxComponent.prototype.editServiceTax = function (serviceTax) {
        this.isUpdateServiceTax = true;
        this.serviceTax = serviceTax;
    };
    taxComponent.prototype.updateServiceTax = function (updateServiceTaxForm) {
        var _this = this;
        if (updateServiceTaxForm.valid) {
            if (new Date(this.serviceTax.fromDate) > new Date(this.serviceTax.toDate)) {
                this.notificationService.warn('FROM DATE must be less than or equal to TO DATE.');
                document.getElementById('fromDate').focus();
                return;
            }
            if (this.serviceTax.rate < 0 || this.serviceTax.rate > 100) {
                this.notificationService.error('Please enter valid tax', 'Tax');
                return;
            }
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(app_constants_1.AppConstants.SERVICE_TAX_UPDATE_URL, this.serviceTax).subscribe(function (response) {
                    if (response['responseCode'] === 'SER_TAX_SUC_06') {
                        _this.serviceTax = new service_tax_1.TaxService();
                        _this.notificationService.success(response['responseMessage'], 'Tax');
                        document.getElementById('close-btn').click();
                        _this.getAllTaxesForDataTable();
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
            if (this.serviceTax.name === '') {
                this.notificationService.warn('Please enter Name.');
                document.getElementById('name').focus();
                return;
            }
            if (this.serviceTax.fromDate === '') {
                this.notificationService.warn('Please enter from date.');
                document.getElementById('fromDate').focus();
                return;
            }
            if (this.serviceTax.toDate === '') {
                this.notificationService.warn('Please enter to date.');
                document.getElementById('toDate').focus();
                return;
            }
            if (this.serviceTax.rate < 0 || this.serviceTax.rate > 100) {
                this.notificationService.error('Please enter valid tax', 'Tax');
                return;
            }
            this.notificationService.error('Required Fields are missing', 'Tax');
        }
    };
    taxComponent.prototype.refreshTaxesTable = function () {
        this.isSearchedTax = false;
        this.searchTax = '';
        this.getAllTaxesForDataTable();
    };
    taxComponent = __decorate([
        core_1.Component({
            selector: 'service-tax-component',
            templateUrl: '../../../templates/dashboard/setting/tax.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router])
    ], taxComponent);
    return taxComponent;
}());
exports.taxComponent = taxComponent;
//# sourceMappingURL=service-tax.component.js.map