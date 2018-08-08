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
var PermissionsService = (function () {
    function PermissionsService() {
    }
    PermissionsService.prototype.loadPermissions = function (dbPermissions) {
        var permissions = [];
        dbPermissions.forEach(function (item, index) {
            permissions[index] = item;
        });
        window.localStorage.setItem(btoa('permissions'), btoa(JSON.stringify(permissions)));
    };
    PermissionsService.prototype.unloadPermissions = function () {
    };
    PermissionsService.prototype.hasPermission = function (permission) {
        var hasPermission = false;
        var permissions;
        var userPermissions = localStorage.getItem(btoa('permissions'));
        if (userPermissions) {
            permissions = JSON.parse(atob(userPermissions));
            permissions.forEach(function (item, index) {
                //properties.hasOwnProperty('name') && properties.
                if (item.name === permission) {
                    hasPermission = true;
                    return hasPermission;
                }
            });
        }
        return hasPermission;
    };
    PermissionsService.prototype.ngOnInit = function () {
    };
    PermissionsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], PermissionsService);
    return PermissionsService;
}());
exports.PermissionsService = PermissionsService;
//# sourceMappingURL=permissions.service.js.map