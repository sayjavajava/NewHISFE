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
var requests_service_1 = require("../../services/requests.service");
var router_1 = require("@angular/router");
var user_shared_service_1 = require("../../services/user.shared.service");
var his_util_service_1 = require("../../services/his-util.service");
var permissions_service_1 = require("../../services/permissions.service");
var HeaderComponent = (function () {
    function HeaderComponent(requestsService, router, userSharedService, HISUtilService, permissionService) {
        this.requestsService = requestsService;
        this.router = router;
        this.userSharedService = userSharedService;
        this.HISUtilService = HISUtilService;
        this.permissionService = permissionService;
        this.showMenu = false;
        this.showSettings = false;
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.firstName = this.userSharedService.firstName;
            this.lastName = this.userSharedService.lastName;
            this.profileImg = this.userSharedService.profileImg;
            this.role = this.userSharedService.roles;
            var userType = atob(localStorage.getItem(btoa('user_type')));
            if (userType === 'admin' || userType === 'manager') {
                this.showMenu = true;
                this.showSettings = true;
            }
            this.requestsService.getRequest('/user/auth/loggedInUser')
                .subscribe(function (response) {
                if (response['responseCode'] === 'ADM_SUC_03') {
                    _this.userSharedService.firstName = response['responseData'].firstName;
                    _this.userSharedService.lastName = response['responseData'].lastName;
                    _this.userSharedService.profileImg = response['responseData'].profileImg;
                    _this.userSharedService.roles = response['responseData'].commaSeparatedRoles;
                    _this.permissionService.loadPermissions(response['responseData'].permissions);
                    _this.firstName = _this.userSharedService.firstName;
                    _this.lastName = _this.userSharedService.lastName;
                    _this.profileImg = _this.userSharedService.profileImg;
                    _this.role = _this.userSharedService.roles;
                }
            }, function (error) {
                //console.log(error.json())
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    HeaderComponent.prototype.logout = function () {
        var _this = this;
        this.requestsService.getRequest('/user/auth/logout')
            .subscribe(function (response) {
            if (response['responseCode'] === 'USR_AUTH_SUC_02') {
                window.localStorage.removeItem(btoa('access_token'));
                window.localStorage.removeItem(btoa('refresh_token'));
                window.localStorage.removeItem(btoa('expire_in'));
                window.localStorage.removeItem('permissions');
                _this.router.navigate(['/login']);
            }
        }, function (error) {
            //console.log(error.json);
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    HeaderComponent.prototype.goToUserDashBoard = function () {
        //this.router.navigate(['/dashboard/'+window.localStorage.getItem(atob('user_type'))+'/']);
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    };
    HeaderComponent = __decorate([
        core_1.Component({
            selector: 'header-component',
            templateUrl: '../../templates/dashboard/header.template.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router,
            user_shared_service_1.UserSharedService,
            his_util_service_1.HISUtilService,
            permissions_service_1.PermissionsService])
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=header.component.js.map