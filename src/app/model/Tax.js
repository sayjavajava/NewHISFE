"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by jamal on 8/1/2018.
 */
var Tax = (function () {
    function Tax() {
        this.rate = 0.0;
        /**
         * we decided if child record found then we should not update status
         * */
        this.hasChild = false;
    }
    return Tax;
}());
exports.Tax = Tax;
//# sourceMappingURL=Tax.js.map