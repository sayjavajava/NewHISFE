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
var notification_service_1 = require("../../../services/notification.service");
var User_1 = require("../../../model/User");
var amazing_time_picker_1 = require("amazing-time-picker");
var router_1 = require("@angular/router");
var app_constants_1 = require("../../../utils/app.constants");
var UpdateNurseComponent = (function () {
    function UpdateNurseComponent(route, router, requestService, fb, notificationService, amazingTimePickerService) {
        this.route = route;
        this.router = router;
        this.requestService = requestService;
        this.fb = fb;
        this.notificationService = notificationService;
        this.amazingTimePickerService = amazingTimePickerService;
        this.selectedDepartment = [];
        this.selectedServices = [];
        this.dutyWithDoctors = [];
        this.selectedVacationWeek = [];
        this.selectedVisitBranches = [];
        this.selectedDoctors = [];
        this.branchesList = [];
        this.primaryDoctor = [];
        this.departmentList = [];
        this.defaultBranch = 'primaryBranch';
        this.userSelected = 'doctor';
        this.allBranches();
        this.allDepartments();
        this.allDoctors();
    }
    UpdateNurseComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createUserForm();
        this.sub = this.route.params.subscribe(function (params) {
            _this.id = params['id'];
            console.log(_this.id);
        });
        this.patchData();
    };
    UpdateNurseComponent.prototype.allBranches = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branchesList = response['responseData'];
                //   this.branchesList.indexOf({name :this.defaultBranch}) === -1 ? this.branchesList.push({name :this.defaultBranch}) :console.log('already there');
                if (_this.branchesList.length > 1) {
                    _this.removeBranch();
                }
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    UpdateNurseComponent.prototype.allDoctors = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + this.userSelected)
            .subscribe(function (response) {
            if (response['responseStatus'] === 'SUCCESS') {
                var data = response['responseData'];
                var userNameData = data;
                _this.primaryDoctor = response['responseData'];
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    UpdateNurseComponent.prototype.allDepartments = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI)
            .subscribe(function (response) {
            if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                _this.departmentList = response['responseData'];
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    UpdateNurseComponent.prototype.removeBranch = function () {
        var _this = this;
        this.branchesList.forEach(function (item, index) {
            if (item === _this.defaultBranch)
                _this.branchesList.splice(index, 1);
        });
    };
    UpdateNurseComponent.prototype.createUserForm = function () {
        this.userForm = this.fb.group({
            'firstName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4)])],
            'lastName': [null],
            'userName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4), forms_1.Validators.pattern('^[a-z0-9_-]{4,15}$')])],
            'password': [null],
            'confirmPassword': [null],
            'homePhone': [null, forms_1.Validators.required],
            'cellPhone': [null],
            'primaryBranch': [null, forms_1.Validators.required],
            'email': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.email])],
            'restrictBranch': [null],
            'allowDiscount': [null],
            'otherDashboard': '',
            'sendBillingReport': '',
            'useReceptDashboard': '',
            'otherDoctorDashBoard': '',
            'accountExpiry': [null],
            'active': '',
            'managePatientInvoices': '',
            'managePatientRecords': '',
            'departmentControl': [null],
            'nurseDutyWithDoctor': [null, forms_1.Validators.required],
        });
    };
    UpdateNurseComponent.prototype.patchData = function () {
        var _this = this;
        if (this.id) {
            this.requestService.findById(app_constants_1.AppConstants.FETCH_USER_BY_ID + this.id).subscribe(function (user) {
                //  this.id = user.id;
                _this.userForm.patchValue({
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                    email: user.email,
                    homePhone: user.profile.homePhone,
                    cellPhone: user.profile.cellPhone,
                    sendBillingReport: user.profile.sendBillingReport,
                    userName: user.userName,
                    active: user.profile.active,
                    accountExpiry: user.profile.accountExpiry,
                    otherDashboard: user.profile.otherDashboard,
                    useReceptDashboard: user.profile.useReceptDashBoard,
                    otherDoctorDashBoard: user.profile.otherDoctorDashBoard,
                    managePatientRecords: user.profile.managePatientRecords,
                    managePatientInvoices: user.profile.managePatientInvoices,
                    primaryBranch: user.branch.name,
                    interval: user.profile.check
                });
            }, function (error) {
                //console.log(error.json());
                _this.error = error.error.error_description;
            });
        }
    };
    UpdateNurseComponent.prototype.addUser = function (data) {
        console.log('i am invalid');
        if (this.userForm.valid) {
            var nurse = new User_1.User({
                userType: 'nurse',
                firstName: data.firstName,
                lastName: data.lastName,
                userName: data.userName,
                password: data.password,
                homePhone: data.homePhone,
                cellPhone: data.cellPhone,
                sendBillingReport: data.sendBillingReport,
                useReceptDashboard: data.useReceptDashboard,
                otherDashboard: data.otherDashboard,
                accountExpiry: data.accountExpiry,
                primaryBranch: data.primaryBranch,
                email: data.email,
                selectedVisitBranches: this.selectedVisitBranches,
                otherDoctorDashBoard: data.otherDoctorDashBoard,
                active: data.active,
                managePatientRecords: data.managePatientRecords,
                managePatientInvoices: data.managePatientInvoices,
                dutyWithDoctors: this.dutyWithDoctors,
                selectedDepartment: this.selectedDepartment,
            });
            this.makeService(nurse);
        }
        else {
            console.log('i am else');
            this.validateAllFormFields(this.userForm);
        }
    };
    UpdateNurseComponent.prototype.makeService = function (user) {
        var _this = this;
        this.requestService.putRequest('/user/edit/' + this.id, user).subscribe(function (response) {
            if (response['responseStatus'] === 'SUCCESS') {
                console.log('saved00');
                _this.responseUser = response['responseData'];
                _this.notificationService.success('User has been updated Successfully');
                _this.router.navigate(['/dashboard/setting/staff']);
            }
        }, function (error) {
            //console.log(error.json());
            _this.error = error.error.error_description;
            _this.notificationService.error('ERROR', 'User is not Updated');
        });
    };
    UpdateNurseComponent.prototype.isFieldValid = function (field) {
        return !this.userForm.get(field).valid && this.userForm.get(field).touched;
    };
    UpdateNurseComponent.prototype.displayFieldCss = function (field) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    };
    UpdateNurseComponent.prototype.getBranch = function (value) {
        if (value) {
            this.userForm.controls['primaryBranch'].setValue(value);
        }
    };
    UpdateNurseComponent.prototype.validateAllFormFields = function (formGroup) {
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
    UpdateNurseComponent.prototype.selectDepartment = function (event, item) {
        console.log(event.checked);
        if (event.target.checked) {
            this.selectedDepartment.push(item.id);
        }
        else {
            var updateItem = this.selectedDepartment.find(this.findIndexToUpdate, item.id);
            var index = this.selectedDepartment.indexOf(updateItem);
            this.selectedDepartment.splice(index, 1);
        }
        console.log(this.selectedDepartment);
    };
    UpdateNurseComponent.prototype.selectVisitBranches = function (event, item) {
        console.log(item);
        if (event.target.checked) {
            this.selectedVisitBranches.push(item.id);
        }
        else {
            var updateItem = this.selectedVisitBranches.find(this.findIndexToUpdate, item.id);
            var index = this.selectedVisitBranches.indexOf(updateItem);
            this.selectedVisitBranches.splice(index, 1);
        }
        console.log(this.selectedVisitBranches);
    };
    UpdateNurseComponent.prototype.dutyWithDoctor = function (event, item) {
        console.log(item);
        if (event.target.checked) {
            this.dutyWithDoctors.push(item.id);
        }
        else {
            var updateItem = this.dutyWithDoctors.find(this.findIndexToUpdate, item.id);
            var index = this.dutyWithDoctors.indexOf(updateItem);
            this.dutyWithDoctors.splice(index, 1);
        }
        console.log(this.dutyWithDoctors);
    };
    UpdateNurseComponent.prototype.findIndexToUpdate = function (type) {
        return type.name === this;
    };
    UpdateNurseComponent.prototype.getSelectedDashboard = function (value) {
        if (value) {
            this.userForm.controls['otherDashboard'].setValue(value);
        }
    };
    UpdateNurseComponent.prototype.getSelectedBranch = function (value) {
        console.log(value);
        if (value === undefined) {
            this.userForm.controls['primaryBranch'].setValue('primaryBranch');
        }
        else {
            this.userForm.controls['primaryBranch'].setValue(value);
        }
    };
    UpdateNurseComponent.prototype.cancel = function () {
        this.router.navigate(['/dashboard/setting/staff']);
    };
    UpdateNurseComponent = __decorate([
        core_1.Component({
            selector: 'addnurse-component',
            templateUrl: '../../../templates/dashboard/setting/updatenurse.template.html',
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, requests_service_1.RequestsService,
            forms_1.FormBuilder, notification_service_1.NotificationService,
            amazing_time_picker_1.AmazingTimePickerService])
    ], UpdateNurseComponent);
    return UpdateNurseComponent;
}());
exports.UpdateNurseComponent = UpdateNurseComponent;
//# sourceMappingURL=updatenurse.component.js.map