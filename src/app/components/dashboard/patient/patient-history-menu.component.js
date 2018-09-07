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
var DataService_1 = require("../../../services/DataService");
var PatientHistoryMenuComponent = (function () {
    function PatientHistoryMenuComponent(router, route, dataService) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.dataService = dataService;
        this.subscription = this.dataService.currentPatientId.subscribe(function (id) { _this.id = id; });
    }
    PatientHistoryMenuComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    PatientHistoryMenuComponent.prototype.ngOnInit = function () {
        /*this.route.params.subscribe(params => {
            this.id = params['id'];

        });*/
    };
    PatientHistoryMenuComponent = __decorate([
        core_1.Component({
            selector: 'patient-history-menu',
            templateUrl: '../../../templates/dashboard/patient/patient-history-menu.template.html',
        }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, typeof (_a = typeof DataService_1.DataService !== "undefined" && DataService_1.DataService) === "function" && _a || Object])
    ], PatientHistoryMenuComponent);
    return PatientHistoryMenuComponent;
    var _a;
}());
exports.PatientHistoryMenuComponent = PatientHistoryMenuComponent;
//# sourceMappingURL=patient-history-menu.component.js.map