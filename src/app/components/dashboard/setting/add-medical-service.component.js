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
var AddMedicalServiceComponent = (function () {
    function AddMedicalServiceComponent() {
    }
    AddMedicalServiceComponent.prototype.ngOnInit = function () {
    };
    AddMedicalServiceComponent = __decorate([
        core_1.Component({
            selector: 'medicl-services-component',
            templateUrl: '../../../templates/dashboard/setting/add-medical-services.template.html',
        }),
        __metadata("design:paramtypes", [])
    ], AddMedicalServiceComponent);
    return AddMedicalServiceComponent;
}());
exports.AddMedicalServiceComponent = AddMedicalServiceComponent;
//# sourceMappingURL=add-medical-service.component.js.map