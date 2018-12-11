"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PaymentRequest = (function () {
    function PaymentRequest() {
        this.paidAmount = 0.00;
        this.invoiceAmount = 0.00;
        this.patientAdvanceDeposit = 0.00; // Patient Advanced amount/balance
        this.usedAdvanceDeposit = 0.00; // use from advanced amount
        this.discountAmount = 0.00;
    }
    return PaymentRequest;
}());
exports.PaymentRequest = PaymentRequest;
//# sourceMappingURL=PaymentRequest.js.map