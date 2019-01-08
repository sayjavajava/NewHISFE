"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TaxService = (function () {
    function TaxService() {
        this.id = 0;
        this.name = '';
        this.description = '';
        this.rate = 0.0;
        this.fromDate = new Date();
        this.toDate = new Date();
        this.active = true;
        this.deleted = false;
        this.strtoDate = '';
        this.strfromDate = '';
        this.hasChild = false;
    }
    return TaxService;
}());
exports.TaxService = TaxService;
//# sourceMappingURL=service-tax.js.map