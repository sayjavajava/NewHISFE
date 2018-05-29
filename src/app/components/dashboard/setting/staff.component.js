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
var forms_1 = require("@angular/forms");
var requests_service_1 = require("../../../services/requests.service");
var router_1 = require("@angular/router");
var notification_service_1 = require("../../../services/notification.service");
var SearchUser_1 = require("../../../model/SearchUser");
var app_constants_1 = require("../../../utils/app.constants");
var material_1 = require("@angular/material");
var ConformationDialogService_1 = require("../../../services/ConformationDialogService");
var StaffComponent = (function () {
    function StaffComponent(requestService, router, notificationService, fb, matDialog, confirmationDialogService) {
        this.requestService = requestService;
        this.router = router;
        this.notificationService = notificationService;
        this.fb = fb;
        this.matDialog = matDialog;
        this.confirmationDialogService = confirmationDialogService;
        this.roles = ['Doctor', 'Nurse', 'Receptionist', 'Cashier', 'SuperAdmin'];
        this.default = 'SuperAdmin';
        this.pages = [];
        this.pageNo = 0;
        this.selectedRole = 'SUPER_ADMIN';
        this.userNameError = 'name is required';
    }
    StaffComponent.prototype.ngOnInit = function () {
        this.searchForm = this.fb.group({
            'role': [null],
            'name': [null],
            'email': [null]
        });
        this.searchForm.controls['role'].setValue(this.default, { onlySelf: true });
        this.getUserFromServer(0);
    };
    StaffComponent.prototype.searchData = function (data) {
        var _this = this;
        console.log('I am in ');
        if (this.searchForm.valid) {
            console.log('Valid ');
            var searchUserObj = new SearchUser_1.SearchUser(data.name, data.email, data.role);
            this.requestService.getRequest(app_constants_1.AppConstants.USER_SEARCH + this.pageNo + '?name=' + data.name + '&email=' + data.email + '&role=' + this.selectedRole)
                .subscribe(function (response) {
                if (response['responseCode'] === 'USER_SUC_01') {
                    _this.nextPage = response['responseData']['nextPage'];
                    _this.prePage = response['responseData']['prePage'];
                    _this.currPage = response['responseData']['currPage'];
                    _this.pages = response['responseData']['pages'];
                    _this.data = response['responseData']['data'];
                }
            }, function (error) {
                _this.error = error.error.error;
            });
        }
        else {
            this.validateAllFormFields(this.searchForm);
        }
    };
    StaffComponent.prototype.validateAllFormFields = function (formGroup) {
        var _this = this;
        Object.keys(formGroup.controls).forEach(function (field) {
            //console.log(field);
            var control = formGroup.get(field);
            if (control instanceof forms_1.FormControl) {
                control.markAsTouched({ onlySelf: true });
            }
            else if (control instanceof forms_1.FormGroup) {
                _this.validateAllFormFields(control);
            }
        });
    };
    StaffComponent.prototype.isFieldValid = function (field) {
        return !this.searchForm.get(field).valid && this.searchForm.get(field).touched;
    };
    StaffComponent.prototype.displayFieldCss = function (field) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    };
    StaffComponent.prototype.getUserFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_USERS_URI + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'USER_SUC_01') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.data = response['responseData']['data'];
                var data = response['responseData']['data'];
            }
        }, function (error) {
            //  this.HISUtilService.tokenExpired(error.error.error);
            _this.error = error.error.error;
        });
    };
    StaffComponent.prototype.updateUser = function (item, id) {
        if (item === 'doctor') {
            console.log('iam doc');
            this.router.navigate(['/dashboard/setting/doctor/edit/', id]);
        }
        else if (item === 'cashier') {
            this.router.navigate(['/dashboard/setting/cashier/edit/', id]);
        }
        else if (item === 'nurse') {
            this.router.navigate(['/dashboard/setting/nurse/edit/', id]);
        }
        else {
            this.router.navigate(['/dashboard/setting/receptionist/edit/', id]);
        }
    };
    StaffComponent.prototype.roleSelected = function (role) {
        this.searchForm.controls['role'].setValue(role);
        this.selectedRole = role;
        console.log('selected role' + role);
    };
    StaffComponent.prototype.getData = function (id) {
        if (id) {
            this.router.navigate(['/dashboard/setting/receptionist/edit/', id]);
        }
    };
    StaffComponent.prototype.deleteUser = function (id) {
        var _this = this;
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(function (res) {
            if (id) {
                _this.requestService.deleteRequest('/user/delete/' + id).subscribe(function (data) {
                    if (data['responseCode'] === 'USER_DEL_SUC_01') {
                        _this.notificationService.success('User has been Deleted Successfully');
                        _this.getUserFromServer(0);
                    }
                }, function (error) {
                    _this.error = error.error.error_description;
                    _this.notificationService.error('ERROR', 'User Unable to Delete ');
                });
                // this.router.navigate(['/home']);
            }
        });
    };
    StaffComponent = __decorate([
        core_1.Component({
            selector: 'staff-component',
            templateUrl: '../../../templates/dashboard/setting/staff.template.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService, router_1.Router,
            notification_service_1.NotificationService, forms_1.FormBuilder,
            material_1.MatDialog, ConformationDialogService_1.ConformationDialogService])
    ], StaffComponent);
    return StaffComponent;
}());
exports.StaffComponent = StaffComponent;
//# sourceMappingURL=staff.component.js.map