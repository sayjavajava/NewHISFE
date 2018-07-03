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
var platform_browser_1 = require("@angular/platform-browser");
var requests_service_1 = require("../../../services/requests.service");
var router_1 = require("@angular/router");
var PatientReportsComponent = (function () {
    function PatientReportsComponent(requestsService, router, titleService) {
        this.requestsService = requestsService;
        this.router = router;
        this.titleService = titleService;
    }
    ;
    PatientReportsComponent.prototype.ngOnInit = function () {
        this.titleService.setTitle('HIS | Patient Reports');
    };
    PatientReportsComponent = __decorate([
        core_1.Component({
            selector: 'patient-reports',
            templateUrl: '../../../templates/dashboard/patient/patient-reports.template.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router,
            platform_browser_1.Title])
    ], PatientReportsComponent);
    return PatientReportsComponent;
}());
exports.PatientReportsComponent = PatientReportsComponent;
//# sourceMappingURL=patient-reports.component.js.map