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
var ErrordisplayComponent = (function () {
    function ErrordisplayComponent() {
    }
    ErrordisplayComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ErrordisplayComponent.prototype, "errorMsg", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ErrordisplayComponent.prototype, "displayError", void 0);
    ErrordisplayComponent = __decorate([
        core_1.Component({
            selector: 'app-field-error-display',
            templateUrl: '../../../templates/dashboard/setting/error-display.template.html',
            styles: ["\n        .error-msg {\n            color: #a94442;\n        }\n        .fix-error-icon {\n            top: 27px;\n        }\n  "],
        }),
        __metadata("design:paramtypes", [])
    ], ErrordisplayComponent);
    return ErrordisplayComponent;
}());
exports.ErrordisplayComponent = ErrordisplayComponent;
//# sourceMappingURL=errordisplay.component.js.map