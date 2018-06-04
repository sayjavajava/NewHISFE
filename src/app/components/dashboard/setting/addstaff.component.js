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
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var amazing_time_picker_1 = require("amazing-time-picker");
var User_1 = require("../../../model/User");
var requests_service_1 = require("../../../services/requests.service");
var app_constants_1 = require("../../../utils/app.constants");
var notification_service_1 = require("../../../services/notification.service");
var PasswordValidation_1 = require("./PasswordValidation");
var AddStaffComponent = (function () {
    function AddStaffComponent(router, fb, requestsService, notificationService, amazingTimePickerService) {
        this.router = router;
        this.fb = fb;
        this.requestsService = requestsService;
        this.notificationService = notificationService;
        this.amazingTimePickerService = amazingTimePickerService;
        this.selectedUser = 'receptionist';
        this.allowdiscount = true;
        this.selectedDepartment = [];
        this.dutyWithDoctors = [];
        this.selectedServices = [];
        this.selectedWorkingDays = [];
        this.selectedVisitBranches = [];
        this.selectedDoctors = [];
        this.userSelected = 'doctor';
        this.branches = [
            { id: 1, name: 'Primary' },
            { id: 2, name: 'Lahore' },
            { id: 3, name: 'Karachi' },
        ];
        this.branchesList = [];
        this.departmentList = [];
        this.primaryDoctor = [];
        this.servicesList = [];
        this.RestrictBranch = [
            { id: 1, name: 'PrimaryOffice' },
            { id: 2, name: 'LahoreOffice' },
            { id: 3, name: 'KarachiOffice' },
        ];
        this.workingDays = [
            { name: 'Monday' },
            { name: 'Tuesday' },
            { name: 'Wednesday' },
            { name: 'Thursday' },
            { name: 'Friday' },
            { name: 'Satureday' },
            { name: 'Sunday' },
        ];
        this.doctorsList = [
            { id: 1, name: 'Dr.Zahra' },
            { id: 2, name: 'Dr.kobler' },
            { id: 3, name: 'Dr.Nimra' },
        ];
        this.firstNameError = 'First name is required';
        this.userNameError = 'User name is required';
        this.emailError = 'Email is required';
        this.passwordError = 'Password is required';
        this.confirmPasswordError = 'Password must be equal';
        this.primaryBranchError = 'Select Primary Branch';
        this.restrictBranchError = 'Select Restrict Branch';
        this.departmentError = 'Select one or more Departments';
        this.serviceError = 'Select one or more Services';
        this.dutyTimmingShiftError = 'Select Duty Time';
        this.allBranches();
        this.allDepartments();
        this.allDoctors();
        this.allServices();
    }
    AddStaffComponent.prototype.ngOnInit = function () {
        this.createUserForm();
        //this.userForm.get('changeUser').patchValue('receptionist');
        //  this.userForm.get('primaryBranch').patchValue('lahore');
        /*        this.userForm.get('changeUser').valueChanges
                    .subscribe(value => {
                        this.createUserForm();
        //                setTimeout(()=>{ this.setValidate(value);},5000)
                        this.setValidate(value);
                    });*/
    };
    AddStaffComponent.prototype.allBranches = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branchesList = response['responseData'];
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    AddStaffComponent.prototype.allDoctors = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + this.userSelected)
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
    AddStaffComponent.prototype.allDepartments = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI)
            .subscribe(function (response) {
            if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                _this.departmentList = response['responseData'];
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    AddStaffComponent.prototype.allServices = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL)
            .subscribe(function (response) {
            console.log('i am branch call');
            if (response['responseCode'] === 'MED_SER_SUC_01') {
                _this.servicesList = response['responseData'];
                console.log(_this.servicesList);
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    AddStaffComponent.prototype.createUserForm = function () {
        this.userForm = this.fb.group({
            'firstName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4)])],
            'lastName': [null],
            'userName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4), forms_1.Validators.pattern('^[a-z0-9_-]{4,15}$')])],
            'password': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(6)])],
            'confirmPassword': [null, forms_1.Validators.compose([forms_1.Validators.required])],
            'homePhone': [null, forms_1.Validators.compose([forms_1.Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
            'cellPhone': [null, forms_1.Validators.compose([forms_1.Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
            'primaryBranch': [null, forms_1.Validators.required],
            'interval': [null],
            'email': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
            'restrictBranch': [null, forms_1.Validators.required],
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
            'managePatientInvoices': '',
            'managePatientRecords': '',
            'departmentControl': [null],
            'servicesControl': [null],
            'shift1': [null],
            'nurseDutyWithDoctor': [null],
            'changeUser': [null],
        }, {
            validator: PasswordValidation_1.CustomValidators.Match('password', 'confirmPassword')
        });
    };
    AddStaffComponent.prototype.addData = function (data) {
        console.log('i am submit' + data);
        if (this.userForm.valid) {
            console.log('i am valid' + this.selectedUser);
            if (this.selectedUser === 'cashier') {
                var cashier = new User_1.User({
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
                    allowDiscount: data.allowDiscount,
                    userType: this.selectedUser
                });
                this.makeService(cashier);
            }
            if (this.selectedUser === 'receptionist') {
                var receptionist = new User_1.User({
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
                    allowDiscount: data.allowDiscount,
                    selectedDoctors: this.selectedDoctors,
                    userType: this.selectedUser
                });
                this.makeService(receptionist);
            }
            if (this.selectedUser === 'nurse') {
                var nurse = new User_1.User({
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
                    selectedDoctors: this.selectedDoctors,
                    selectedDepartment: this.selectedDepartment,
                    dutyWithDoctors: this.dutyWithDoctors,
                    userType: this.selectedUser
                });
                this.makeService(nurse);
            }
            if (this.selectedUser === 'doctor') {
                var doctor = new User_1.User({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    userName: data.userName,
                    password: data.password,
                    homePhone: data.homePhone,
                    cellPhone: data.cellPhone,
                    sendBillingReport: data.sendBillingReport,
                    useReceptDashboard: data.useReceptDashboard,
                    otherDashboard: data.otherDashboard,
                    otherDoctorDashBoard: data.otherDoctorDashBoard,
                    accountExpiry: data.accountExpiry,
                    primaryBranch: data.primaryBranch,
                    email: data.email,
                    selectedVisitBranches: this.selectedVisitBranches,
                    active: data.active,
                    selectedDoctors: this.selectedDoctors,
                    selectedDepartment: this.selectedDepartment,
                    interval: data.interval,
                    selectedServices: this.selectedServices,
                    shift1: data.shift1,
                    shift2: data.shift2,
                    secondShiftToTime: this.secondShiftToTime,
                    secondShiftFromTime: this.secondShiftFromTime,
                    firstShiftToTime: this.firstShiftToTime,
                    firstShiftFromTime: this.firstShiftFromTime,
                    vacation: data.vacation,
                    dateTo: data.dateTo,
                    dateFrom: data.dateFrom,
                    selectedWorkingDays: this.selectedWorkingDays,
                    userType: this.selectedUser
                });
                this.makeService(doctor);
            }
        }
        else {
            console.log('i am invalid');
            this.validateAllFormFields(this.userForm);
        }
    };
    AddStaffComponent.prototype.validateAllFormFields = function (formGroup) {
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
    AddStaffComponent.prototype.setValidate = function (userAssigned) {
        var departmentControl = this.userForm.get('departmentControl');
        var servicesControl = this.userForm.get('servicesControl');
        var shift1Control = this.userForm.get('shift1');
        var checkUpIntervalControl = this.userForm.get('interval');
        var nurseDutyWithDoctorControl = this.userForm.get('nurseDutyWithDoctor');
        var firstNameControl = this.userForm.get('firstName');
        var userNameControl = this.userForm.get('userName');
        var passwordControl = this.userForm.get('password');
        var confirmPasswordControl = this.userForm.get('confirmPassword');
        var emailControl = this.userForm.get('email');
        var primaryBranchControl = this.userForm.get('primaryBranch');
        var restrictBranchControl = this.userForm.get('restrictBranch');
        console.log('assignedUser' + userAssigned);
        if (userAssigned === 'nurse') {
            console.log('i am nurse');
            nurseDutyWithDoctorControl.setValidators(forms_1.Validators.required);
            departmentControl.setValidators(forms_1.Validators.required);
            firstNameControl.markAsUntouched();
            userNameControl.markAsUntouched();
            emailControl.markAsUntouched();
            passwordControl.markAsUntouched();
            confirmPasswordControl.markAsUntouched();
            restrictBranchControl.markAsUntouched();
            primaryBranchControl.markAsUntouched();
            nurseDutyWithDoctorControl.markAsUntouched();
            departmentControl.markAsUntouched();
        }
        else if (userAssigned === 'doctor') {
            console.log('i am doctor' + departmentControl);
            departmentControl.setValidators(forms_1.Validators.required);
            servicesControl.setValidators(forms_1.Validators.required);
            shift1Control.setValidators(forms_1.Validators.required);
            checkUpIntervalControl.setValidators(forms_1.Validators.required);
            firstNameControl.markAsUntouched();
            userNameControl.markAsUntouched();
            emailControl.markAsUntouched();
            passwordControl.markAsUntouched();
            confirmPasswordControl.markAsUntouched();
            restrictBranchControl.markAsUntouched();
            primaryBranchControl.markAsUntouched();
            departmentControl.markAsUntouched();
            servicesControl.markAsUntouched();
            checkUpIntervalControl.markAsUntouched();
            shift1Control.markAsUntouched();
        }
        else {
            console.log('i am in else ');
            firstNameControl.markAsUntouched();
            userNameControl.markAsUntouched();
            emailControl.markAsUntouched();
            passwordControl.markAsUntouched();
            confirmPasswordControl.markAsUntouched();
            restrictBranchControl.markAsUntouched();
            primaryBranchControl.markAsUntouched();
            departmentControl.clearValidators();
            servicesControl.clearValidators();
            servicesControl.clearValidators();
            shift1Control.clearValidators();
            checkUpIntervalControl.clearValidators();
            nurseDutyWithDoctorControl.clearValidators();
        }
        console.log('i am normal ');
        firstNameControl.updateValueAndValidity();
        userNameControl.updateValueAndValidity();
        emailControl.updateValueAndValidity();
        primaryBranchControl.updateValueAndValidity();
        restrictBranchControl.updateValueAndValidity();
        passwordControl.updateValueAndValidity();
        confirmPasswordControl.updateValueAndValidity();
        shift1Control.updateValueAndValidity();
        departmentControl.updateValueAndValidity();
        servicesControl.updateValueAndValidity();
        servicesControl.updateValueAndValidity();
        shift1Control.updateValueAndValidity();
        checkUpIntervalControl.updateValueAndValidity();
        nurseDutyWithDoctorControl.updateValueAndValidity();
    };
    AddStaffComponent.prototype.reset = function () {
        this.userForm.reset();
    };
    AddStaffComponent.prototype.isFieldValid = function (field) {
        return !this.userForm.get(field).valid && this.userForm.get(field).touched;
    };
    AddStaffComponent.prototype.displayFieldCss = function (field) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    };
    AddStaffComponent.prototype.makeService = function (user) {
        var _this = this;
        console.log('i am make service ....');
        this.requestsService.postRequest('/user/add', user).subscribe(function (response) {
            if (response['responseCode'] === 'USER_ADD_SUCCESS_01') {
                _this.responseUser = response['responseData'];
                _this.notificationService.success(_this.responseUser['username'] + '' + 'has been Created Successfully');
                _this.router.navigate(['/dashboard/setting/staff']);
            }
        }, function (error) {
            //console.log(error.json());
            _this.error = error.error.error_description;
            _this.notificationService.error('ERROR', 'User Registeration is Failed ');
        });
    };
    AddStaffComponent.prototype.secondShiftFrom = function () {
        var _this = this;
        var amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(function (time) {
            _this.secondShiftFromTime = time;
            console.log(time);
        });
    };
    AddStaffComponent.prototype.firstShiftFrom = function () {
        var _this = this;
        var amazingTimePicker = this.amazingTimePickerService.open({
            time: this.firstShiftFromTime,
            theme: 'dark',
            arrowStyle: {
                background: 'red',
                color: 'white'
            }
        });
        amazingTimePicker.afterClose().subscribe(function (time) {
            _this.firstShiftFromTime = time;
        });
    };
    AddStaffComponent.prototype.firstShiftTo = function () {
        var _this = this;
        var amazingTimePicker = this.amazingTimePickerService.open({
            //locale: 'ar',
            time: this.firstShiftToTime,
            theme: 'dark',
            arrowStyle: {
                background: 'red',
                color: 'white'
            }
        });
        amazingTimePicker.afterClose().subscribe(function (time) {
            _this.firstShiftToTime = time;
        });
    };
    AddStaffComponent.prototype.secondShiftTo = function () {
        var _this = this;
        var amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(function (time) {
            _this.secondShiftToTime = time;
        });
    };
    AddStaffComponent.prototype.getBranch = function (value) {
        if (value) {
            this.userForm.controls['primaryBranch'].setValue(value);
        }
    };
    AddStaffComponent.prototype.checkupIntervalMethod = function (value) {
        if (value) {
            this.userForm.controls['interval'].setValue(value);
        }
    };
    AddStaffComponent.prototype.selectDepartment = function (event, item) {
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
    AddStaffComponent.prototype.selectWorkingDays = function (event, item) {
        console.log(event.checked);
        if (event.target.checked) {
            this.selectedWorkingDays.push(item.name);
        }
        else {
            var updateItem = this.selectedWorkingDays.find(this.findIndexToUpdate, item.name);
            var index = this.selectedWorkingDays.indexOf(updateItem);
            this.selectedWorkingDays.splice(index, 1);
        }
        console.log(this.selectedWorkingDays);
    };
    AddStaffComponent.prototype.selectVisitBranches = function (event, item) {
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
    AddStaffComponent.prototype.dutyWithDoctor = function (event, item) {
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
    AddStaffComponent.prototype.findIndexToUpdate = function (type) {
        return type.name === this;
    };
    AddStaffComponent.prototype.selectServices = function (event, item) {
        if (event.target.checked) {
            this.selectedServices.push(item.id);
        }
        else {
            var updateItem = this.selectedServices.find(this.findIndexToUpdate, item.id);
            var index = this.selectedServices.indexOf(updateItem);
            this.selectedServices.splice(index, 1);
        }
    };
    AddStaffComponent.prototype.goTo = function (value) {
        this.selectedDepartment.length = 0;
        this.selectedServices.length = 0;
        this.selectedVisitBranches.length = 0;
        this.selectedDoctors.length = 0;
        this.selectedWorkingDays.length = 0;
        this.firstShiftFromTime = '';
        this.userForm.controls['restrictBranch'].setValue('');
        this.firstShiftToTime = '';
        this.secondShiftFromTime = '';
        this.secondShiftToTime = '';
        this.clearFormFields();
        console.log('i am goto' + this.selectedDepartment.length);
        if (value) {
            this.selectedUser = value;
            this.checkPermission(value);
            this.setValidate(value);
            // this.createUserForm();
        }
    };
    AddStaffComponent.prototype.clearFormFields = function () {
        this.userForm.controls['email'].setValue('');
        this.userForm.controls['firstName'].setValue('');
        this.userForm.controls['lastName'].setValue('');
        this.userForm.controls['password'].setValue('');
        this.userForm.controls['confirmPassword'].setValue('');
        this.userForm.controls['restrictBranch'].setValue('');
        this.userForm.controls['homePhone'].setValue('');
        this.userForm.controls['cellPhone'].setValue('');
        this.userForm.controls['useReceptDashboard'].setValue('');
        this.userForm.controls['otherDashboard'].setValue('');
        this.userForm.controls['sendBillingReport'].setValue('');
        this.userForm.controls['allowDiscount'].setValue('');
        this.userForm.controls['active'].setValue('');
        this.userForm.controls['vacation'].setValue('');
        this.userForm.controls['interval'].setValue('');
        this.userForm.controls['primaryBranch'].setValue('');
        this.userForm.controls['dateFrom'].setValue('');
        this.userForm.controls['dateTo'].setValue('');
        this.userForm.controls['accountExpiry'].setValue('');
        this.userForm.controls['departmentControl'].setValue('');
        this.userForm.controls['servicesControl'].setValue('');
        this.userForm.controls['nurseDutyWithDoctor'].setValue('');
        //  this.userForm.controls['changeUser'].setValue('');
        this.userForm.controls['shift2'].setValue('');
        this.userForm.controls['shift1'].setValue('');
        this.userForm.controls['userName'].setValue('');
    };
    AddStaffComponent.prototype.checkPermission = function (user) {
        this.changeState();
        switch (user) {
            case 'doctor':
                this.doctorPermissions();
                break;
            case 'nurse':
                this.nursePermissions();
                break;
            case 'receptionist':
                this.receptionistPermissions();
                break;
            case 'cashier':
                this.cashierPermissions();
                break;
            default:
                this.doctorPermissions();
        }
    };
    AddStaffComponent.prototype.doctorPermissions = function () {
        this.checkUpInterval = true;
        this.department = true;
        this.dutytimmingshift1 = true;
        this.dutytimmingshift2 = true;
        this.vacation = true;
        this.vacationweek = true;
        this.services = true;
    };
    AddStaffComponent.prototype.nursePermissions = function () {
        this.department = true;
        this.managepatientinvoices = true;
        this.managepatientrecord = true;
        this.dutywithdoctor = true;
    };
    AddStaffComponent.prototype.receptionistPermissions = function () {
        this.allowdiscount = true;
    };
    AddStaffComponent.prototype.cashierPermissions = function () {
        this.allowdiscount = true;
    };
    AddStaffComponent.prototype.changeState = function () {
        this.allowdiscount = false;
        this.department = false;
        this.checkUpInterval = false;
        this.dutytimmingshift1 = false;
        this.dutytimmingshift2 = false;
        this.vacation = false;
        this.vacationweek = false;
        this.services = false;
        this.dutywithdoctor = false;
        this.managepatientrecord = false;
        this.managepatientinvoices = false;
    };
    AddStaffComponent.prototype.cancel = function () {
        this.router.navigate(['/dashboard/setting/staff']);
    };
    AddStaffComponent.prototype.getSelectedBranch = function (value) {
        if (value) {
            this.userForm.controls['primaryBranch'].setValue(value);
        }
    };
    AddStaffComponent.prototype.getSelectedDashboard = function (value) {
        if (value) {
            this.userForm.controls['otherDashboard'].setValue(value);
        }
    };
    AddStaffComponent = __decorate([
        core_1.Component({
            selector: 'addstaff-component',
            templateUrl: '../../../templates/dashboard/setting/addstaff.template.html',
        }),
        __metadata("design:paramtypes", [router_1.Router, forms_1.FormBuilder, requests_service_1.RequestsService, notification_service_1.NotificationService,
            amazing_time_picker_1.AmazingTimePickerService])
    ], AddStaffComponent);
    return AddStaffComponent;
}());
exports.AddStaffComponent = AddStaffComponent;
//# sourceMappingURL=addstaff.component.js.map