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
var material_1 = require("@angular/material");
var confirmationdialog_component_1 = require("../components/dashboard/confirmationdialog.component");
var ConformationDialogService = /** @class */ (function () {
    function ConformationDialogService(matdialog) {
        this.matdialog = matdialog;
    }
    ConformationDialogService.prototype.confirm = function (title, message) {
        var dialogref;
        dialogref = this.matdialog.open(confirmationdialog_component_1.ConfirmationdialogComponent, {
            height: "230px",
            width: "320px",
            panelClass: 'myapp-no-padding-dialog'
        });
        dialogref.componentInstance.title = title;
        dialogref.componentInstance.message = message;
        return dialogref.afterClosed();
    };
    ConformationDialogService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [material_1.MatDialog])
    ], ConformationDialogService);
    return ConformationDialogService;
}());
exports.ConformationDialogService = ConformationDialogService;
//# sourceMappingURL=ConformationDialogService.js.map