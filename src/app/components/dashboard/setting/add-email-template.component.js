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
var notification_service_1 = require("../../../services/notification.service");
var requests_service_1 = require("../../../services/requests.service");
var his_util_service_1 = require("../../../services/his-util.service");
var EmailTemplateModel_1 = require("../../../model/EmailTemplateModel");
var router_1 = require("@angular/router");
var app_constants_1 = require("../../../utils/app.constants");
var AddEmailTemplateComponent = (function () {
    function AddEmailTemplateComponent(notificationService, requestsService, HISUtilService, router) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.emailTempModel = new EmailTemplateModel_1.EmailTemplateModel();
        this.emailType = [];
    }
    AddEmailTemplateComponent.prototype.ngOnInit = function () {
        document.title = 'HIS | Email Template';
        this.emailType = [
            { label: 'APPOINTMENT', value: 'APPOINTMENT' },
            { label: 'CONFIRM_APPOINTMENT', value: 'CONFIRM_APPOINTMENT' },
            { label: 'APPOINTMENT_REMINDER', value: 'APPOINTMENT_REMINDER' }
        ];
    };
    AddEmailTemplateComponent.prototype.saveEmailTemplate = function (form) {
        var _this = this;
        if (form.valid) {
            if (this.emailTempModel.type == '-1') {
                this.notificationService.warn('Please select type.');
                document.getElementById('type').focus();
                return;
            }
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(app_constants_1.AppConstants.EMAIL_TEMPLATE_SAVE_URL, this.emailTempModel).subscribe(function (response) {
                    if (response['responseCode'] === 'EMAIL_TEMP_SUC_04') {
                        _this.emailTempModel = new EmailTemplateModel_1.EmailTemplateModel();
                        _this.notificationService.success(response['responseMessage'], 'Email Template');
                        _this.router.navigate(['dashboard/setting/email-template']);
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Email Template');
                    }
                }, function (error) {
                    _this.HISUtilService.tokenExpired(error.error.error);
                });
            }
            else {
                this.router.navigate(['/login']);
            }
        }
        else {
            if (this.emailTempModel.title == '') {
                this.notificationService.warn('Please enter title.');
                document.getElementById('title').focus();
                return;
            }
            if (this.emailTempModel.subject == '') {
                this.notificationService.warn('Please enter subject.');
                document.getElementById('subject').focus();
                return;
            }
            if (this.emailTempModel.type == '-1') {
                this.notificationService.warn('Please select type.');
                document.getElementById('type').focus();
                return;
            }
            if (this.emailTempModel.emailTemplate == '') {
                this.notificationService.warn('Please enter some data in emailTemplate.');
                document.getElementById('emailTemplate').focus();
                return;
            }
            // this.notificationService.error('Required Fields are missing', 'Email Template');
        }
    };
    AddEmailTemplateComponent = __decorate([
        core_1.Component({
            selector: 'service-tax-component',
            templateUrl: '../../../templates/dashboard/setting/add-email-template.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router])
    ], AddEmailTemplateComponent);
    return AddEmailTemplateComponent;
}());
exports.AddEmailTemplateComponent = AddEmailTemplateComponent;
//# sourceMappingURL=add-email-template.component.js.map