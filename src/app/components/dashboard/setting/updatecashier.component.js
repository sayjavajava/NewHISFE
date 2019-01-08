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
var PasswordValidation_1 = require("./PasswordValidation");
var router_1 = require("@angular/router");
var requests_service_1 = require("../../../services/requests.service");
var notification_service_1 = require("../../../services/notification.service");
var User_1 = require("../../../model/User");
var app_constants_1 = require("../../../utils/app.constants");
var DataService_1 = require("../../../services/DataService");
var user_type_enum_1 = require("../../../enums/user-type-enum");
var UpdateCashierComponent = (function () {
    function UpdateCashierComponent(route, router, requestService, dataService, fb, notificationService) {
        this.route = route;
        this.router = router;
        this.requestService = requestService;
        this.dataService = dataService;
        this.fb = fb;
        this.notificationService = notificationService;
        this.branchesList = [];
        this.primaryDoctor = [];
        this.defaultBranch = 'primaryBranch';
        this.userSelected = 'doctor';
        this.selectedVisitBranches = [];
        this.allBranches();
        this.allDoctors();
    }
    UpdateCashierComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    UpdateCashierComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createUserForm();
        this.sub = this.route.params.subscribe(function (params) {
            _this.id = params['id'];
        });
        this.subscription = this.dataService.currentStaffServiceId.subscribe(function (x) {
            _this.userId = x;
        });
        this.patchData();
    };
    UpdateCashierComponent.prototype.allDoctors = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + user_type_enum_1.UserTypeEnum.DOCTOR)
            .subscribe(function (response) {
            if (response['responseCode'] === 'USER_SUC_01') {
                _this.doctorsList = response['responseData'];
            }
        }, function (error) {
        });
    };
    UpdateCashierComponent.prototype.allBranches = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branchesList = response['responseData'];
                _this.visitingBranches = response['responseData'];
                //   this.branchesList.indexOf({name :this.defaultBranch}) === -1 ? this.branchesList.push({name :this.defaultBranch}) :console.log('already there');
                /*if(this.branchesList.length > 1 ){
                    this.removeBranch();
                }*/
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    UpdateCashierComponent.prototype.createUserForm = function () {
        this.userForm = this.fb.group({
            'firstName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4)])],
            'lastName': [null],
            'userName': [null],
            'password': [null],
            'confirmPassword': [null],
            'homePhone': [null],
            'cellPhone': [null],
            'primaryBranch': [null, forms_1.Validators.required],
            'interval': [null],
            'email': [null],
            'restrictBranch': [null],
            'allowDiscount': [null],
            'otherDashboard': '',
            'sendBillingReport': '',
            'useReceptDashboard': '',
            'shift2': '',
            'vacation': '',
            'otherDoctorDashBoard': '',
            'accountExpiry': [null],
            'active': '',
            'dateFrom': [null],
            'dateTo': [null],
            'receivePayment': [null],
            'managePatientInvoices': '',
            'managePatientRecords': '',
            'departmentControl': [null],
            'servicesControl': [null],
            'shift1': [null],
            'nurseDutyWithDoctor': [null],
            'changeUser': [null]
        }, {
            validator: PasswordValidation_1.CustomValidators.Match('password', 'confirmPassword')
        });
    };
    UpdateCashierComponent.prototype.patchData = function () {
        var _this = this;
        if (this.id) {
            this.requestService.findByIdAndType(app_constants_1.AppConstants.FETCH_USER_BY_ID + this.id, 'CASHIER').subscribe(function (cashier) {
                _this.userForm.patchValue({
                    firstName: cashier.firstName,
                    lastName: cashier.lastName,
                    email: cashier.email,
                    homePhone: cashier.homePhone,
                    cellPhone: cashier.cellPhone,
                    userName: cashier.userName,
                    active: cashier.active,
                    accountExpiry: cashier.expiryDate,
                    otherDashboard: cashier.otherDashboard,
                    primaryBranch: cashier.primaryBranchId,
                    sendBillingReport: cashier.sendBillingReport,
                    useReceptDashboard: cashier.useReceptDashboard,
                    otherDoctorDashBoard: cashier.otherDoctorDashBoard,
                    receivePayment: cashier.receivePayment
                });
                _this.staffBranches = cashier.staffBranches;
                //this.selectedDoctors = cashier.dutyWithDoctors;
                if (cashier.permittedDoctorDashboard) {
                    _this.selectedDoctorDashboard = cashier.permittedDoctorDashboard.slice();
                }
                _this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        _this.branchesList = response['responseData'];
                        _this.staffBranches = _this.staffBranches.filter(function (br) { return br.id != _this.userForm.controls['primaryBranch'].value; });
                        _this.visitingBranches = _this.visitingBranches.filter(function (br) { return br.id != _this.userForm.controls['primaryBranch'].value; });
                        for (var key in _this.visitingBranches) {
                            for (var k in _this.staffBranches) {
                                if (_this.staffBranches[k].id == _this.visitingBranches[key].id) {
                                    _this.visitingBranches[key].checked = true;
                                    _this.selectedVisitBranches.push(_this.staffBranches[k].id);
                                    break;
                                }
                            }
                        }
                    }
                }, function (error) {
                    _this.error = error.error.error;
                });
            }, function (error) {
                _this.error = error.error.error_description;
            });
        }
    };
    UpdateCashierComponent.prototype.removeBranch = function () {
        var _this = this;
        this.branchesList.forEach(function (item, index) {
            if (item === _this.defaultBranch)
                _this.branchesList.splice(index, 1);
        });
    };
    UpdateCashierComponent.prototype.addCashier = function (data) {
        if (this.userForm.valid) {
            var cashier = new User_1.User({
                userType: 'cashier',
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
                receivePayment: data.receivePayment,
                primaryBranch: data.primaryBranch,
                email: data.email,
                selectedVisitBranches: this.selectedVisitBranches,
                selectedDoctorDashboard: this.selectedDoctorDashboard,
                otherDoctorDashBoard: data.otherDoctorDashBoard,
                active: data.active,
                allowDiscount: data.allowDiscount,
            });
            this.makeService(cashier);
        }
        else {
            this.validateAllFormFields(this.userForm);
        }
    };
    UpdateCashierComponent.prototype.makeService = function (user) {
        var _this = this;
        this.requestService.putRequest('/user/edit/' + this.userId, user).subscribe(function (response) {
            if (response['responseCode'] === 'USER_UPDATE_SUC_01') {
                _this.responseUser = response['responseData'];
                _this.notificationService.success('User has been updated Successfully');
                _this.router.navigate(['/dashboard/setting/staff']);
            }
        }, function (error) {
            _this.error = error.error.error_description;
            _this.notificationService.error('ERROR', 'User is not Updated');
        });
    };
    UpdateCashierComponent.prototype.isFieldValid = function (field) {
        return !this.userForm.get(field).valid && this.userForm.get(field).touched;
    };
    UpdateCashierComponent.prototype.displayFieldCss = function (field) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    };
    UpdateCashierComponent.prototype.validateAllFormFields = function (formGroup) {
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
    UpdateCashierComponent.prototype.selectVisitBranches = function (event, item) {
        if (event.target.checked) {
            this.selectedVisitBranches.push(item.id);
        }
        else {
            var updateItem = this.selectedVisitBranches.find(this.findIndexToUpdate, item.id);
            var index = this.selectedVisitBranches.indexOf(updateItem);
            this.selectedVisitBranches.splice(index, 1);
        }
    };
    UpdateCashierComponent.prototype.findIndexToUpdate = function (type) {
        return type.name === this;
    };
    UpdateCashierComponent.prototype.getSelectedDashboard = function (value) {
        if (value) {
            this.userForm.controls['otherDashboard'].setValue(value);
        }
    };
    UpdateCashierComponent.prototype.cancel = function () {
        this.router.navigate(['/dashboard/setting/staff']);
    };
    UpdateCashierComponent.prototype.getSelectedBranch = function (event) {
        if (event && event.target.value) {
            this.userForm.controls['primaryBranch'].setValue(event.target.value);
        }
        this.visitingBranches = this.branchesList;
        this.visitingBranches = this.visitingBranches.filter(function (br) { return br.id != event.target.value; });
    };
    UpdateCashierComponent = __decorate([
        core_1.Component({
            selector: 'addcashier-component',
            templateUrl: '../../../templates/dashboard/setting/updatecashier.template.html',
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, requests_service_1.RequestsService, DataService_1.DataService,
            forms_1.FormBuilder, notification_service_1.NotificationService])
    ], UpdateCashierComponent);
    return UpdateCashierComponent;
}());
exports.UpdateCashierComponent = UpdateCashierComponent;
//# sourceMappingURL=updatecashier.component.js.map