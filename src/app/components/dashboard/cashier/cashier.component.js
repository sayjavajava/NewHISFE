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
var requests_service_1 = require("../../../services/requests.service");
var app_constants_1 = require("../../../utils/app.constants");
var router_1 = require("@angular/router");
var CashierComponent = (function () {
    function CashierComponent(router, route, requestsService) {
        this.router = router;
        this.route = route;
        this.requestsService = requestsService;
    }
    CashierComponent.prototype.ngOnInit = function () {
        this.getAllInvoicesList();
    };
    CashierComponent.prototype.getAllInvoicesList = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.GET_All_PENDING_INVOICES)
            .subscribe(function (res) {
            _this.invoiceList = res['responseData'];
            console.log("get All Invoice_Items Data : " + _this.invoiceList);
        }, function (error) {
            _this.error = error;
        });
    };
    // payment.component.ts											
    CashierComponent.prototype.runPayment = function (id) {
        this.router.navigate(['/dashboard/payment/', id]);
    };
    CashierComponent = __decorate([
        core_1.Component({
            selector: 'cashier-component',
            templateUrl: '../../../templates/dashboard/cashier/cashier-dashboard.template.html',
        }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, requests_service_1.RequestsService])
    ], CashierComponent);
    return CashierComponent;
}());
exports.CashierComponent = CashierComponent;
//# sourceMappingURL=cashier.component.js.map