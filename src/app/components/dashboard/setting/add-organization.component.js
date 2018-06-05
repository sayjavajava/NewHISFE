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
var app_constants_1 = require("../../../utils/app.constants");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var notification_service_1 = require("../../../services/notification.service");
var amazing_time_picker_1 = require("amazing-time-picker");
var requests_service_1 = require("../../../services/requests.service");
var PasswordValidation_1 = require("./PasswordValidation");
var AddOrganizationComponent = (function () {
    function AddOrganizationComponent(router, fb, requestService, notificationService, amazingTimePickerService) {
        this.router = router;
        this.fb = fb;
        this.requestService = requestService;
        this.notificationService = notificationService;
        this.amazingTimePickerService = amazingTimePickerService;
        this.branchesList = [];
        this.timezoneList = [];
        this.allBranches();
        this.allTimezone();
    }
    AddOrganizationComponent.prototype.ngOnInit = function () {
        this.createProfileForm();
        this.createGenralForm();
    };
    AddOrganizationComponent.prototype.createProfileForm = function () {
        this.orgForm = this.fb.group({
            'firstName': [null, forms_1.Validators.compose([forms_1.Validators.required])],
            'lastName': [null],
            'userName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern('^[a-z0-9_-]{4,15}$')])],
            'email': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
            'companyName': [null, forms_1.Validators.compose([forms_1.Validators.required])],
            'password': [null, forms_1.Validators.compose([forms_1.Validators.required])],
            'confirmPassword': [null, forms_1.Validators.compose([forms_1.Validators.required])],
            'homePhone': [null, forms_1.Validators.compose([forms_1.Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
            'cellPhone': [null, forms_1.Validators.compose([forms_1.Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
            'officePhone': [null, forms_1.Validators.compose([forms_1.Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
            'timeZone': [null],
            'specialty': [null],
            'appointmentSerial': [null, forms_1.Validators.compose([forms_1.Validators.required])],
            'website': [null, forms_1.Validators.pattern('^(http:\\/\\/|https:\\/\\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}.?([a-z]+)?$')],
        }, {
            validator: PasswordValidation_1.CustomValidators.Match('password', 'confirmPassword')
        });
    };
    AddOrganizationComponent.prototype.createGenralForm = function () {
        this.generalForm = this.fb.group({
            'defaultBranch': [null],
            'durationOfExam': [null],
            'followUpExam': [null],
        });
    };
    AddOrganizationComponent.prototype.getSelectedBranch = function (value) {
        if (value) {
            this.generalForm.controls['defaultBranch'].setValue(value);
        }
    };
    AddOrganizationComponent.prototype.getSelectedTimezone = function (value) {
        if (value) {
            this.orgForm.controls['timeZone'].setValue(value);
            console.log(value);
        }
    };
    AddOrganizationComponent.prototype.allBranches = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branchesList = response['responseData'];
            }
        }, function (error) {
        });
    };
    AddOrganizationComponent.prototype.allTimezone = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.TIMEZONE_FETCH_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'TZ_SUC_01') {
                _this.timezoneList = response['responseData'];
            }
        }, function (error) {
        });
    };
    AddOrganizationComponent.prototype.addOrganization = function (data, value) {
        if (this.orgForm.valid) {
            var orgObject = this.prepareSaveOrganization();
            if (value === 'done') {
                var self = this;
                this.requestService.postRequest(app_constants_1.AppConstants.ORGANIZATION_CREATE_URL, orgObject)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'ORG_SUC_01') {
                        self.notificationService.success('Organization has been Created Successfully');
                    }
                }, function (error) {
                    self.notificationService.error('ERROR', 'Organization is not Created');
                });
            }
        }
        else {
            this.validateAllFormFields(this.orgForm);
        }
    };
    AddOrganizationComponent.prototype.prepareSaveOrganization = function () {
        var formModel = this.orgForm.value;
        var generalModel = this.generalForm.value;
        var saveBranchModel = {
            firstName: formModel.firstName,
            lastName: formModel.lastName,
            userName: formModel.userName,
            email: formModel.email,
            companyName: formModel.companyName,
            password: formModel.password,
            confirmPassword: formModel.confirmPassword,
            officePhone: formModel.officePhone,
            homePhone: formModel.homePhone,
            cellPhone: formModel.cellPhone,
            appointmentSerial: formModel.appointmentSerial,
            website: formModel.website,
            timeZone: formModel.timeZone,
            specialty: formModel.specialty,
            defaultBranch: generalModel.defaultBranch,
            durationOfExam: generalModel.durationOfExam,
            followUpExam: generalModel.followUpExam,
        };
        return saveBranchModel;
    };
    AddOrganizationComponent.prototype.getDurationOfExam = function (value) {
        if (value) {
            this.generalForm.controls['durationOfExam'].setValue(value);
        }
    };
    AddOrganizationComponent.prototype.isFieldValid = function (field) {
        return !this.orgForm.get(field).valid && this.orgForm.get(field).touched;
    };
    AddOrganizationComponent.prototype.validateAllFormFields = function (formGroup) {
        var _this = this;
        Object.keys(formGroup.controls).forEach(function (field) {
            var control = formGroup.get(field);
            if (control instanceof forms_1.FormControl) {
                control.markAsTouched({ onlySelf: true });
            }
            else if (control instanceof forms_1.FormGroup) {
                _this.validateAllFormFields(control);
            }
        });
    };
    AddOrganizationComponent.prototype.displayFieldCss = function (field) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    };
    AddOrganizationComponent = __decorate([
        core_1.Component({
            selector: 'add-organization-component',
            templateUrl: '../../../templates/dashboard/setting/add-organization.template.html',
        }),
        __metadata("design:paramtypes", [router_1.Router, forms_1.FormBuilder,
            requests_service_1.RequestsService,
            notification_service_1.NotificationService,
            amazing_time_picker_1.AmazingTimePickerService])
    ], AddOrganizationComponent);
    return AddOrganizationComponent;
}());
exports.AddOrganizationComponent = AddOrganizationComponent;
//# sourceMappingURL=add-organization.component.js.map