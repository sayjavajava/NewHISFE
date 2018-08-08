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
var router_1 = require("@angular/router");
var PatientLabOrdersComponent = (function () {
    function PatientLabOrdersComponent(router) {
        this.router = router;
    }
    PatientLabOrdersComponent.prototype.ngOnInit = function () {
        //throw new Error("Method not implemented.");
    };
    PatientLabOrdersComponent.prototype.goToUserDashBoard = function () {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    };
    PatientLabOrdersComponent = __decorate([
        core_1.Component({
            selector: 'patient-lab-orders',
            templateUrl: '../../../templates/dashboard/patient/patient-lab-orders.template.html',
        }),
        __metadata("design:paramtypes", [router_1.Router])
    ], PatientLabOrdersComponent);
    return PatientLabOrdersComponent;
}());
exports.PatientLabOrdersComponent = PatientLabOrdersComponent;
//# sourceMappingURL=patient-lab-orders.component.js.map