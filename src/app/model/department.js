"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Department = (function () {
    function Department() {
        this.name = '';
        this.active = true;
        /**
         * we decided if child record found then we should not update status
         * */
        this.hasChild = false;
    }
    return Department;
}());
exports.Department = Department;
//# sourceMappingURL=department.js.map