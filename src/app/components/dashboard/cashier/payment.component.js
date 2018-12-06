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
var PaymentRequest_1 = require("../../../model/PaymentRequest");
var notification_service_1 = require("../../../services/notification.service");
var PaymentComponent = (function () {
    function PaymentComponent(router, route, requestsService, notificationService) {
        this.router = router;
        this.route = route;
        this.requestsService = requestsService;
        this.notificationService = notificationService;
        this.invoiceList = [];
        this.show = false;
        this.useAdvancedBal = false;
        this.paidAmount = 0.00;
        this.patientAdvanceDeposit = 0.00;
        this.usedAdvanceDeposit = 0.00;
        this.discountAmount = 0.00;
        this.paymentRequest = new PaymentRequest_1.PaymentRequest();
        this.grandTotal = 0.00;
        this.grandTotalDiscount = 0.00;
        this.grandTotalTax = 0.00;
        this.grandTotalWithTax = 0.00;
    }
    PaymentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.invoiceId = params['id'];
            _this.id = params['id'];
            console.log("ngOnInit --> invoice Id :" + _this.invoiceId);
        });
        this.getAppointmentDataById();
        this.getAllPaymentTypes();
    };
    PaymentComponent.prototype.getAppointmentDataById = function () {
        var _this = this;
        if (this.invoiceId) {
            this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_APPOINTMENTS_BY_INOVICE_ID + this.invoiceId)
                .subscribe(function (res) {
                _this.appointment = res.responseData;
                _this.patientAdvanceDeposit = res.responseData.patientAdvanceDeposit;
                _this.invoicePrefix = res.responseData.invoicePrefix;
                _this.patientName = res.responseData.patient;
                _this.scheduleDateAndTime = _this.appointment.scheduleDateAndTime;
                _this.appointmentStartedOn = _this.appointment.appointmentStartedOn;
                _this.docFirstName = _this.appointment.docFirstName;
                _this.docLastName = _this.appointment.docLastName;
                _this.appointmentId = res.responseData.id;
                _this.receivedAmount = res.responseData.receivedAmount;
                console.log("Appointment ID : " + _this.appointmentId);
                _this.getInvoiceItemsById();
            }, function (error) {
                _this.error = error;
            });
        }
    };
    PaymentComponent.prototype.getInvoiceItemsById = function () {
        var _this = this;
        if (this.appointmentId) {
            this.requestsService.getRequest(app_constants_1.AppConstants.GET_INVOICE_ITEMS + this.appointmentId)
                .subscribe(function (res) {
                _this.invoiceList = res.responseData;
                console.log("get Invoice Items By Id Data : " + _this.invoiceList);
                _this.getTotalOfAllInviceItems();
            }, function (error) {
                _this.error = error;
            });
        }
    };
    PaymentComponent.prototype.getAllPaymentTypes = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.GET_ALL_PAYMENTTYPE)
            .subscribe(function (response) {
            if (response["responseCode"] === "PAYMENT_SUC_11") {
                _this.paymentTypeList = response["responseData"].data;
                console.log("------------" + _this.paymentTypeList);
                if (_this.paymentTypeList.length > 0) {
                    _this.paymentRequest.paymentTypeId = _this.paymentTypeList[0].id;
                }
            }
        }, function (error) {
            this.notificationService.error("ERROR", "Payment Types List is not available");
        });
    };
    PaymentComponent.prototype.getSelectedPaymentType = function (selectedPaymentTyp) {
        console.log("------------" + selectedPaymentTyp);
        this.paymentRequest.paymentTypeId = selectedPaymentTyp.id;
    };
    PaymentComponent.prototype.getTotalOfAllInviceItems = function () {
        var itemAmt = 0.00;
        var taxAmt = 0.00;
        var discAmount = 0.00;
        var i = 0, len = this.invoiceList.length;
        for (; i < len; i++) {
            itemAmt = this.invoiceList[i].quantity * this.invoiceList[i].unitFee;
            this.grandTotal += itemAmt;
            discAmount = (this.invoiceList[i].quantity * this.invoiceList[i].unitFee) * this.invoiceList[i].discountRate / 100;
            this.grandTotalDiscount += discAmount;
            taxAmt = (this.invoiceList[i].quantity * this.invoiceList[i].unitFee) * this.invoiceList[i].taxRate / 100;
            this.grandTotalTax += taxAmt;
            this.grandTotalWithTax += itemAmt + taxAmt - discAmount;
        }
        console.log("----grandTotal : " + this.grandTotal);
    };
    PaymentComponent.prototype.savePayment = function () {
        var _this = this;
        this.paymentRequest = new PaymentRequest_1.PaymentRequest();
        this.paymentRequest.id = this.id;
        this.paymentRequest.invoiceId = "0";
        this.paymentRequest.paidAmount = this.paidAmount;
        this.paymentRequest.invoiceAmount = this.grandTotalWithTax;
        this.paymentRequest.paidAmount = this.paidAmount;
        this.paymentRequest.useAdvancedBal = this.useAdvancedBal;
        this.paymentRequest.usedAdvanceDeposit = this.usedAdvanceDeposit;
        this.paymentRequest.discountAmount = this.discountAmount;
        this.paymentRequest.patientAdvanceDeposit = this.patientAdvanceDeposit;
        console.log("save invoice data : " + this.paymentRequest);
        //    alert("Use advance deposit : " + this.useAdvancedBal + "Patient Bal :" + this.patientAdvanceDeposit);
        var paymentAmount = this.paidAmount + this.usedAdvanceDeposit + this.discountAmount;
        var pendingAmount = this.grandTotalWithTax - this.receivedAmount;
        if (paymentAmount > pendingAmount) {
            this.notificationService.error("ERROR", "Invalid Amount Entered");
        }
        else {
            this.requestsService.postRequest(app_constants_1.AppConstants.SAVE_PAYMENT, this.paymentRequest)
                .subscribe(function (response) {
                console.log(" Added : " + response);
                if (response['responseCode'] === 'SUCCESS') {
                    _this.router.navigate(['/dashboard/cashier']);
                    /*  this.notificationService.success('Branch is Created Successfully'); */
                }
            }, function (error) {
                //    this.error('ERROR', 'Branch is not Created');
            });
        }
    };
    PaymentComponent.prototype.backPage = function () {
        this.router.navigate(['/dashboard/cashier']);
    };
    PaymentComponent = __decorate([
        core_1.Component({
            selector: 'payment-component',
            templateUrl: '../../../templates/dashboard/cashier/payment-dashboard.template.html',
        }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, requests_service_1.RequestsService, notification_service_1.NotificationService])
    ], PaymentComponent);
    return PaymentComponent;
}());
exports.PaymentComponent = PaymentComponent;
//# sourceMappingURL=payment.component.js.map