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
var app_constants_1 = require("../../../utils/app.constants");
var his_util_service_1 = require("../../../services/his-util.service");
var AddPatientComponent = (function () {
    function AddPatientComponent(requestsService, router, titleService, HISUTilService) {
        var _this = this;
        this.requestsService = requestsService;
        this.router = router;
        this.titleService = titleService;
        this.HISUTilService = HISUTilService;
        this.doctors = [];
        this.requestsService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + 'DOCTOR')
            .subscribe(function (response) {
            if (response['responseStatus'] === 'SUCCESS') {
                _this.doctors = response['responseData'];
            }
        }, function (error) {
            _this.HISUTilService.tokenExpired(error.error.error);
        });
    }
    ;
    AddPatientComponent.prototype.ngOnInit = function () {
        this.titleService.setTitle('HIS | Add Patient');
    };
    AddPatientComponent = __decorate([
        core_1.Component({
            selector: 'add-patient',
            templateUrl: '../../../templates/dashboard/patient/add-patient.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router,
            platform_browser_1.Title,
            his_util_service_1.HISUtilService])
    ], AddPatientComponent);
    return AddPatientComponent;
}());
exports.AddPatientComponent = AddPatientComponent;
//# sourceMappingURL=add-patient.component.js.map