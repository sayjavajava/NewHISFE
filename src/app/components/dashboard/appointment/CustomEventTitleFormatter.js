"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var angular_calendar_1 = require("angular-calendar");
var core_1 = require("@angular/core");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var CustomEventTitleFormatter = (function (_super) {
    __extends(CustomEventTitleFormatter, _super);
    function CustomEventTitleFormatter(renderer) {
        var _this = _super.call(this) || this;
        _this.renderer = renderer;
        // @ViewChild("showPopApt") lab :any ;
        _this.title = 'tool tip works ';
        _this.title2 = 'tool tip does not  ';
        return _this;
    }
    CustomEventTitleFormatter.prototype.ngAfterViewInit = function () {
        console.log('child init ');
        this.renderer.setProperty(this.nameInputRef.nativeElement, 'innerHTML', this.appointmentId);
    };
    CustomEventTitleFormatter.prototype.monthTooltip = function (event) {
        console.log('event test:' + event.id + event.patient);
        //   //`<div style="margin-left: 0px !important;">left menu</div>` ;
        //   return  (document.getElementById("det").innerHTML=event.status);
        //   this.renderer.setProperty(this.nameInputRef.nativeElement, 'innerHTML', this.appointmentId );
        this.appointmentId = 'hard code';
        return event.appointmentId;
    };
    CustomEventTitleFormatter.prototype.weekTooltip = function (event) {
        return;
    };
    CustomEventTitleFormatter.prototype.dayTooltip = function (event) {
        return;
    };
    __decorate([
        core_1.ViewChild('el'),
        __metadata("design:type", core_1.ElementRef)
    ], CustomEventTitleFormatter.prototype, "nameInputRef", void 0);
    __decorate([
        core_1.ViewChild('childModal'),
        __metadata("design:type", ngx_bootstrap_1.ModalDirective)
    ], CustomEventTitleFormatter.prototype, "childModal", void 0);
    CustomEventTitleFormatter = __decorate([
        core_1.Component({
            selector: 'tool-root',
            template: "<div>{{title}}</div>\n    <div #el></div>\n    <div bsModal #childModal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\"\n         role=\"dialog\" aria-labelledby=\"dialog-child-name\">\n        <div class=\"modal-dialog modal-sm\">\n            <div class=\"modal-content\">\n                <div class=\"modal-header\">\n                    <h4 id=\"dialog-child-name\" class=\"modal-title pull-left\">Child modal</h4>\n                    <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"hideChildModal()\">\n                        <span aria-hidden=\"true\">&times;</span>\n                    </button>\n                </div>\n                <div class=\"modal-body\">\n                    I am a child modal, opened from parent component!\n                </div>\n            </div>\n        </div>\n    </div>\n    <br>\n    <ng-content></ng-content>",
        }),
        __metadata("design:paramtypes", [core_1.Renderer2])
    ], CustomEventTitleFormatter);
    return CustomEventTitleFormatter;
}(angular_calendar_1.CalendarEventTitleFormatter));
exports.CustomEventTitleFormatter = CustomEventTitleFormatter;
//# sourceMappingURL=CustomEventTitleFormatter.js.map