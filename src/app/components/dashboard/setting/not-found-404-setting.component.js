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
var NotFound404SettingComponent = (function () {
    function NotFound404SettingComponent(titleService) {
        this.titleService = titleService;
    }
    ;
    NotFound404SettingComponent.prototype.ngOnInit = function () {
        this.titleService.setTitle('HIS | Resource not found');
    };
    NotFound404SettingComponent = __decorate([
        core_1.Component({
            selector: 'not-found-404-setting-component',
            templateUrl: '../../../templates/dashboard/setting/not-found-404-setting.template.html',
        }),
        __metadata("design:paramtypes", [platform_browser_1.Title])
    ], NotFound404SettingComponent);
    return NotFound404SettingComponent;
}());
exports.NotFound404SettingComponent = NotFound404SettingComponent;
//# sourceMappingURL=not-found-404-setting.component.js.map