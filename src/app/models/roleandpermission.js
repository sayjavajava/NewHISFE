"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RoleAndPermission = (function () {
    function RoleAndPermission(name, description, isActive, type) {
        this.assigned = false;
        this.name = name;
        this.description = description;
        this.active = isActive;
        this.type = type;
    }
    return RoleAndPermission;
}());
exports.RoleAndPermission = RoleAndPermission;
//# sourceMappingURL=roleandpermission.js.map