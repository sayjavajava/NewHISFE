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
var roleandpermission_1 = require("../../../models/roleandpermission");
var his_util_service_1 = require("../../../services/his-util.service");
var app_constants_1 = require("../../../utils/app.constants");
var RolePermissionsComponent = (function () {
    function RolePermissionsComponent(notificationservice, requestService, fb, hisUtilService) {
        this.notificationservice = notificationservice;
        this.requestService = requestService;
        this.fb = fb;
        this.hisUtilService = hisUtilService;
        this.showForm = true;
        this.showForm2 = true;
        this.titleAlert = 'name should be bw 5 and 30';
        this.descriptionalert = 'description is required';
        this.allRoles();
    }
    RolePermissionsComponent.prototype.ngOnInit = function () {
        this.createForm();
        this.allPermissions();
        this.createSelectedForm();
    };
    RolePermissionsComponent.prototype.createForm = function () {
        this.roleform = this.fb.group({
            'name': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(5), forms_1.Validators.maxLength(30)])],
            'description': [null, forms_1.Validators.required],
            'active': ''
        });
    };
    RolePermissionsComponent.prototype.createSelectedForm = function () {
        this.selectform = new forms_1.FormGroup({
            role: new forms_1.FormControl(null)
        });
        this.selectform.controls['role'].setValue(this.defaultrole, { onlySelf: true });
    };
    RolePermissionsComponent.prototype.addRole = function (formdata) {
        var _this = this;
        var obj = new roleandpermission_1.RoleAndPermission(formdata.name, formdata.description, formdata.active, 'Role');
        this.showForm = false;
        setTimeout(function () {
            _this.formReset();
            _this.showForm = true;
        });
        this.requestService.postRequest(app_constants_1.AppConstants.ROLE_ENDPOINT, obj)
            .subscribe(function (response) {
            console.log('i am testing:' + response['responseMessage']);
            if (response['responseCode'] === 'ROL_SUC_01') {
                _this.notificationservice.success(response['responseMessage']);
                _this.closeModal();
            }
            else {
                _this.notificationservice.error(response['responseMessage']);
            }
        }, function (error) {
            //console.log(error.json());
            _this.notificationservice.error(error.error.error_description);
            _this.hisUtilService.tokenExpired(error.error);
        });
    };
    RolePermissionsComponent.prototype.addPermission = function (formdata) {
        var _this = this;
        var obj = new roleandpermission_1.RoleAndPermission(formdata.name, formdata.description, formdata.active, 'Permission');
        this.showForm = false;
        setTimeout(function () {
            _this.formReset();
            _this.showForm = true;
        });
        this.requestService.postRequest(app_constants_1.AppConstants.ROLE_ENDPOINT, obj)
            .subscribe(function (response) {
            console.log('i am testing:' + response['responseMessage']);
            if (response['responseCode'] === 'PER_SUC_01') {
                _this.notificationservice.success(response['responseMessage']);
                _this.allPermissions();
            }
            else {
                _this.notificationservice.error(response['responseMessage']);
            }
        }, function (error) {
            //console.log(error.json());
            _this.notificationservice.error(error.error.error_description);
            _this.hisUtilService.tokenExpired(error.error);
        });
    };
    RolePermissionsComponent.prototype.allPermissions = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.PERMISSION_ENDPOINT).subscribe(function (response) {
            var resources = response['responseData'];
            var resource = resources['allPermissions'];
            console.log(resource['name']);
            _this.allpermissions = resource;
        });
    };
    RolePermissionsComponent.prototype.allRoles = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.PERMISSION_ENDPOINT).subscribe(function (response) {
            var resources = response['responseData'];
            var resource = resources['allRoleAndPermissions'];
            _this.allroles = resource;
        });
    };
    RolePermissionsComponent.prototype.permissionByRole = function (name) {
        var _this = this;
        var nameencoded = name.replace(/\s/g, "");
        this.requestService.getRequestWithParam('/setting/rolePermission/permissionsbyrole', nameencoded)
            .subscribe(function (response) {
            var resources = response['responseData'];
            _this.filteredpermissions = resources;
        });
    };
    RolePermissionsComponent.prototype.closeModal = function () {
        this.closeBtn.nativeElement.click();
    };
    RolePermissionsComponent.prototype.onRoleChange = function (event) {
        var data = event.slice(2);
        console.log(data);
        this.permissionByRole(data);
        /* for(let rp in this.allpermissions){
             for(let fp in this.filteredpermissions){
                 if(fp === rp){
                     rp.assigned = true;
                     break;
                 }
             }
         }*/
    };
    RolePermissionsComponent.prototype.formReset = function () {
        this.roleform.reset();
        this.closeModal();
    };
    RolePermissionsComponent.prototype.test = function () {
        var arra3 = this.allpermissions;
        var arr4 = this.filteredpermissions;
        var missing = arr4.filter(function (item) { return arra3.indexOf(item) < 0; });
        console.log(missing);
    };
    __decorate([
        core_1.ViewChild('closeBtn'),
        __metadata("design:type", core_1.ElementRef)
    ], RolePermissionsComponent.prototype, "closeBtn", void 0);
    RolePermissionsComponent = __decorate([
        core_1.Component({
            selector: 'rolepermissions-component',
            templateUrl: '../../../templates/dashboard/setting/roles-permissions.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService, requests_service_1.RequestsService,
            forms_1.FormBuilder, his_util_service_1.HISUtilService])
    ], RolePermissionsComponent);
    return RolePermissionsComponent;
}());
exports.RolePermissionsComponent = RolePermissionsComponent;
//# sourceMappingURL=role-permissions.component.js.map