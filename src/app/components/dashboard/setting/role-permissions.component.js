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
var forms_1 = require("@angular/forms");
var requests_service_1 = require("../../../services/requests.service");
var roleandpermission_1 = require("../../../model/roleandpermission");
var his_util_service_1 = require("../../../services/his-util.service");
var app_constants_1 = require("../../../utils/app.constants");
var RolePermissionsComponent = (function () {
    function RolePermissionsComponent(notificationService, requestService, fb, hisUtilService, elementRef) {
        this.notificationService = notificationService;
        this.requestService = requestService;
        this.fb = fb;
        this.hisUtilService = hisUtilService;
        this.elementRef = elementRef;
        this.showForm = true;
        this.showForm2 = true;
        this.titleAlert = 'name should be bw 5 and 30';
        this.descriptionAlert = 'description is required';
        this.addedRolePermissionsIds = new Array();
    }
    RolePermissionsComponent.prototype.ngOnInit = function () {
        this.createForm();
        this.allRolePermissions();
        this.createSelectedForm();
    };
    RolePermissionsComponent.prototype.createForm = function () {
        this.roleForm = this.fb.group({
            'name': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(5), forms_1.Validators.maxLength(30)])],
            'description': [null],
            'active': ''
        });
    };
    RolePermissionsComponent.prototype.createSelectedForm = function () {
        this.selectForm = new forms_1.FormGroup({
            role: new forms_1.FormControl(null)
        });
        this.selectForm.controls['role'].setValue(this.defaultRole, { onlySelf: true });
    };
    RolePermissionsComponent.prototype.addRole = function (formdata) {
        var _this = this;
        formdata.active = true;
        var obj = new roleandpermission_1.RoleAndPermission(formdata.name, formdata.description, formdata.active, 'Role');
        this.showForm = false;
        setTimeout(function () {
            _this.formReset();
            _this.showForm = true;
        });
        this.requestService.postRequest(app_constants_1.AppConstants.ROLE_ENDPOINT, obj)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ROL_SUC_01') {
                _this.notificationService.success(response['responseMessage']);
                _this.closeModal();
            }
            else {
                _this.notificationService.error(response['responseMessage']);
            }
        }, function (error) {
            _this.notificationService.error(error.error.error_description);
            _this.hisUtilService.tokenExpired(error.error);
        });
    };
    /*    addPermission(formdata: any) {
            let obj: RoleAndPermission = new RoleAndPermission(formdata.name, formdata.description, formdata.active, 'Permission');
            this.showForm = false;
            setTimeout(() => {
                this.formReset();
                this.showForm = true;
            });
            this.requestService.postRequest(
                AppConstants.ROLE_ENDPOINT
                , obj)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PER_SUC_01') {
                            this.notificationService.success(response['responseMessage']);
                            this.allRolePermissions();
                        } else {
                            this.notificationService.error(response['responseMessage']);
                        }
                    },
                    (error: any) => {
                        // console.log(error.json());
                        this.notificationService.error(error.error.error_description);
                        this.hisUtilService.tokenExpired(error.error);
    
                    });
        }*/
    RolePermissionsComponent.prototype.allRolePermissions = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.PERMISSION_ENDPOINT)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ROL_PER_SUC_02') {
                var resources = response['responseData'];
                _this.allDBPermissions = resources['allPermissions'];
                _this.allDBRoles = resources['allRoleAndPermissions'];
            }
        }, function (error) {
            _this.hisUtilService.tokenExpired(error.error.error);
        });
    };
    RolePermissionsComponent.prototype.saveRolePermissions = function () {
        var _this = this;
        this.requestService.postRequest(app_constants_1.AppConstants.ASSIGN_PERMISSIONS_TO_ROLES, {
            'permissionIds': this.addedRolePermissionsIds,
            'selectedRole': this.selectedRole
        })
            .subscribe(function (response) {
            if (response['responseCode'] === 'ROL_PER_SUC_02') {
                _this.notificationService.success(response['responseMessage'], 'Roles & Permissions');
            }
            else {
                _this.notificationService.error(response['responseMessage'], 'Roles & Permissions');
            }
        }, function (error) {
            _this.notificationService.error(error.error, 'Roles & Permissions');
            _this.hisUtilService.tokenExpired(error.error.error);
        });
    };
    RolePermissionsComponent.prototype.onPermissionSelected = function (per) {
        var index = this.addedRolePermissionsIds.indexOf(per.id);
        if (index <= -1) {
            this.addedRolePermissionsIds.push(per.id);
        }
        else {
            this.addedRolePermissionsIds.splice(index, 1);
        }
    };
    RolePermissionsComponent.prototype.permissionByRole = function (roleName) {
        var _this = this;
        this.selectedRole = roleName;
        this.requestService.getRequestWithParam(app_constants_1.AppConstants.PERMISSION_BY_ROLE, roleName)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ROL_PER_SUC_02') {
                _this.rolePermissions = response['responseData'];
                for (var _i = 0, _a = _this.rolePermissions; _i < _a.length; _i++) {
                    var rp = _a[_i];
                    _this.addedRolePermissionsIds.push(rp.id);
                    var checkbox = document.getElementById('chkbox-' + rp.id);
                    checkbox.checked = true;
                }
            }
        }, function (error) {
            _this.hisUtilService.tokenExpired(error.error.error);
        });
    };
    RolePermissionsComponent.prototype.closeModal = function () {
        this.closeBtn.nativeElement.click();
    };
    RolePermissionsComponent.prototype.onRoleChange = function (selectedRole) {
        for (var _i = 0, _a = this.allDBPermissions; _i < _a.length; _i++) {
            var rp = _a[_i];
            var checkbox = document.getElementById('chkbox-' + rp.id);
            checkbox.checked = false;
        }
        this.addedRolePermissionsIds = new Array();
        this.permissionByRole(selectedRole);
    };
    RolePermissionsComponent.prototype.formReset = function () {
        this.roleForm.reset();
        this.closeModal();
    };
    __decorate([
        core_1.ViewChild('closeBtn'),
        __metadata("design:type", core_1.ElementRef)
    ], RolePermissionsComponent.prototype, "closeBtn", void 0);
    RolePermissionsComponent = __decorate([
        core_1.Component({
            selector: 'role-permissions-component',
            templateUrl: '../../../templates/dashboard/setting/roles-permissions.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            forms_1.FormBuilder,
            his_util_service_1.HISUtilService,
            core_1.ElementRef])
    ], RolePermissionsComponent);
    return RolePermissionsComponent;
}());
exports.RolePermissionsComponent = RolePermissionsComponent;
//# sourceMappingURL=role-permissions.component.js.map