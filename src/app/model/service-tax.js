"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceTax = (function () {
    function ServiceTax() {
        this.id = 0;
        this.name = '';
        this.description = '';
        this.rate = 0.0;
        this.fromDate = '';
        this.toDate = '';
        this.active = true;
        this.deleted = false;
        this.hasChild = false;
    }
    return ServiceTax;
}());
exports.ServiceTax = ServiceTax;
//# sourceMappingURL=service-tax.js.map