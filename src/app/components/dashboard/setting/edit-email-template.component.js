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
var app_constants_1 = require("../../../utils/app.constants");
var EmailTemplateModel_1 = require("../../../model/EmailTemplateModel");
var router_1 = require("@angular/router");
var EditEmailTemplateComponent = (function () {
    function EditEmailTemplateComponent(notificationService, requestsService, HISUtilService, router, activatedRoute) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.emailTempModel = new EmailTemplateModel_1.EmailTemplateModel();
    }
    EditEmailTemplateComponent.prototype.ngOnInit = function () {
        var _this = this;
        document.title = 'HIS | Edit Email Template';
        if (localStorage.getItem(btoa('access_token'))) {
            this.activatedRoute.params.subscribe(function (params) {
                _this.getEmailTemplateById(Number(params['id']));
            });
        }
        else {
            this.router.navigate(['/login']);
        }
        this.ckeConfig = {
            allowedContent: false,
            forcePasteAsPlainText: true
        };
    };
    EditEmailTemplateComponent.prototype.getEmailTemplateById = function (id) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.EMAIL_TEMPLATE_EDIT_URL + id)
            .subscribe(function (response) {
            if (response['responseCode'] === 'EMAIL_TEMP_SUC_02') {
                _this.emailTempModel = response['responseData'];
                var emailStr = _this.getPlainText(_this.emailTempModel.emailTemplate);
                _this.emailTempModel.emailTemplate = emailStr;
            }
        }, function (error) {
            //console.log(error.json())
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    EditEmailTemplateComponent.prototype.updateEmailTemplate = function (form) {
        var _this = this;
        if (form.valid) {
            if (this.emailTempModel.type == '-1') {
                this.notificationService.warn('Please select type.');
                document.getElementById('type').focus();
                return;
            }
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(app_constants_1.AppConstants.EMAIL_TEMPLATE_UPDATE_URL, this.emailTempModel).subscribe(function (response) {
                    if (response['responseCode'] === 'EMAIL_TEMP_SUC_08') {
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
        }
    };
    EditEmailTemplateComponent.prototype.getPlainText = function (strSrc) {
        var resultStr = "";
        // Ignore the <p> tag if it is in very start of the text
        if (strSrc.indexOf('<p>') == 0)
            resultStr = strSrc.substring(3);
        else
            resultStr = strSrc;
        resultStr = resultStr.replace(/<p>/gi, "\r\n\r\n");
        resultStr = resultStr.replace(/<br \/>/gi, "\r\n");
        resultStr = resultStr.replace(/<br>/gi, "\r\n");
        return resultStr.replace(/<[^<|>]+?>/gi, '');
    };
    EditEmailTemplateComponent = __decorate([
        core_1.Component({
            selector: 'service-tax-component',
            templateUrl: '../../../templates/dashboard/setting/edit-email-template.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router,
            router_1.ActivatedRoute])
    ], EditEmailTemplateComponent);
    return EditEmailTemplateComponent;
}());
exports.EditEmailTemplateComponent = EditEmailTemplateComponent;
//# sourceMappingURL=edit-email-template.component.js.map