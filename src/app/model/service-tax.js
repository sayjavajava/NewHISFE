"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TaxService = (function () {
    function TaxService() {
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
    return TaxService;
}());
exports.TaxService = TaxService;
//# sourceMappingURL=service-tax.js.map