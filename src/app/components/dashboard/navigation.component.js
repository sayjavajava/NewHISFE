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
var NavigationComponent = /** @class */ (function () {
    function NavigationComponent(requestsService, router) {
        this.requestsService = requestsService;
        this.router = router;
    }
    ;
    NavigationComponent.prototype.ngOnInit = function () {
    };
    NavigationComponent.prototype.logout = function () {
        window.localStorage.removeItem('access_token');
        this.router.navigate(['/login/']);
    };
    NavigationComponent.prototype.populatePasswordPolicy = function () {
        if (window.localStorage.getItem('access_token')) {
            this.router.navigate(['/dashboard/passwordPolicies']);
        }
    };
    NavigationComponent.prototype.goToActivityLog = function () {
        if (window.localStorage.getItem('access_token')) {
            this.router.navigate(['/admin/activityLogs']);
        }
    };
    NavigationComponent.prototype.goToAdminProfile = function () {
        if (window.localStorage.getItem('access_token')) {
            this.router.navigate(['/admin/profile']);
        }
    };
    NavigationComponent.prototype.goToAdminSettings = function () {
        if (window.localStorage.getItem('access_token')) {
            this.router.navigate(['/admin/settings']);
        }
    };
    NavigationComponent = __decorate([
        core_1.Component({
            selector: 'navigation-component',
            templateUrl: '../../templates/dashboard/navigation.template.html',
            styleUrls: ['../../styles/dashboard/navigation.style.css']
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router])
    ], NavigationComponent);
    return NavigationComponent;
}());
exports.NavigationComponent = NavigationComponent;
//# sourceMappingURL=navigation.component.js.map