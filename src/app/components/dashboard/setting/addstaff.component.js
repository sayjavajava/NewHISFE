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
var angular2_datetimepicker_1 = require("angular2-datetimepicker");
var user_type_enum_1 = require("../../../enums/user-type-enum");
var service_comission_1 = require("../../../model/service-comission");
var AddStaffComponent = (function () {
    function AddStaffComponent(router, fb, requestsService, notificationService, amazingTimePickerService) {
        this.router = router;
        this.fb = fb;
        this.requestsService = requestsService;
        this.notificationService = notificationService;
        this.amazingTimePickerService = amazingTimePickerService;
        this.selectedUser = 'RECEPTIONIST';
        this.allowdiscount = true;
        this.selectedDepartment = [];
        this.dutyWithDoctors = [];
        this.selectedServices = [];
        this.selectedWorkingDays = [];
        this.selectedVisitBranches = [];
        this.selectedRoles = [];
        this.selectedDoctors = [];
        this.departmentFlag = false;
        this.userSelected = 'doctor';
        this.defaultBranch = 'primaryBranch';
        this.branchesList = [];
        this.departmentList = [];
        this.primaryDoctor = [];
        this.servicesList = [];
        this.doctorsList = [];
        this.allServicesList = [];
        this.workingDays = [
            { label: 'Monday', value: 'Monday' },
            { label: 'Tuesday', value: 'Tuesday' },
            { label: 'Wednesday', value: 'Wednesday' },
            { label: 'Thursday', value: 'Thursday' },
            { label: 'Friday', value: 'Friday' },
            { label: 'Saturday', value: 'Saturday' },
            { label: 'Sunday', value: 'Sunday' },
        ];
        this.firstNameError = 'First name is required';
        this.userNameError = 'User name is required';
        this.emailError = 'Email is required';
        this.passwordError = 'Password is required';
        this.confirmPasswordError = 'Password must be equal';
        this.primaryBranchError = 'Select Primary Branch';
        this.restrictBranchError = 'Select Allow Branch';
        this.departmentError = 'Select atleast one Department';
        this.serviceError = 'Select one or more Services';
        this.dutyTimmingShiftError = 'Select Duty Time';
        this.userRoleError = 'Select atleast one role';
        this.changeUserError = 'Select atleast one role';
        this.allStaffTypes = [
            { name: 'NURSE', label: 'NURSE', value: 'NURSE' },
            { name: 'DOCTOR', label: 'DOCTOR', value: 'DOCTOR' },
            { name: 'RECEPTIONIST', label: 'RECEPTIONIST', value: 'RECEPTIONIST' },
            { name: 'CASHIER', label: 'CASHIER', value: 'CASHIER' }
        ];
        this.dutyShift1 = false;
        this.hasServices = false;
        this.intervalList = [];
        this.pRoles = [];
        this.date = new Date();
        //serviceComission:{id:number,checked:boolean,comission:''}[]=[];
        this.serviceComission = [];
        this.allRoles();
        this.allBranches();
        this.allDoctors();
        this.allServices();
        angular2_datetimepicker_1.DatePicker.prototype.ngOnInit = function () {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }
            this.settings.timePicker = true;
            this.date = new Date();
        };
    }
    AddStaffComponent.prototype.ngOnInit = function () {
        this.createUserForm();
        this.intervalList = [
            { label: '5', value: 5 },
            { label: '10', value: 10 },
            { label: '15', value: 15 },
            { label: '20', value: 20 },
            { label: '25', value: 25 },
            { label: '30', value: 30 },
            { label: '35', value: 35 },
            { label: '40', value: 40 },
            { label: '45', value: 45 },
            { label: '50', value: 50 },
        ];
    };
    AddStaffComponent.prototype.addComission = function (service, item) {
        // serviceComission:{id:number,checked:boolean,comission:''}[];
        var list = this.serviceComission.filter(function (x) { return x.id == item.value; });
        if (list != null) {
            list.forEach(function (x) {
                x.comission = service.target.value;
            });
        }
    };
    AddStaffComponent.prototype.addComissionCheck = function (ser, item) {
        var _this = this;
        if (ser == true) {
            this.serviceComission.forEach(function (it, index) {
                if (it === item.value)
                    _this.serviceComission.splice(index, 1);
            });
            console.log('flatt check  :' + ser + 'checking..' + item.value);
            var sc = new service_comission_1.ServiceComission(item.value, ser, '');
            this.serviceComission.push(sc);
        }
    };
    /*    removeBranch() {
            this.branchesList.forEach((item: any, index: any) => {
                if (item.name === this.defaultBranch) this.branchesList.splice(index, 1);
            });
        }*/
    AddStaffComponent.prototype.allBranches = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branchesList = response['responseData'];
                _this.visitingBranches = response['responseData'];
            }
            // this.userForm.controls['primaryBranch'].setValue(this.branchesList[0].id)
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    AddStaffComponent.prototype.sortServices = function (branchObj) {
        //uncomment and check branches from server to filter service by  visit branches
        /* let brId =  branchObj.value;
         console.log(this.allServicesList)
         let sortedList = this.allServicesList.filter((x:any)=>{
             if(x.branches !=null || x.branches != "undefined"){
                 x.branches.id ==brId
 
             }
         })*/
    };
    AddStaffComponent.prototype.allServices = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'MED_SER_SUC_01') {
                _this.allServicesList = response['responseData'];
            }
        }, function (error) {
        });
    };
    AddStaffComponent.prototype.allRoles = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.PERMISSION_ENDPOINT)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ROL_PER_SUC_02') {
                var resources = response['responseData'];
                var resource = resources['allRoleAndPermissions'];
                _this.allDBRoles = resource;
            }
        }, function (error) {
        });
    };
    AddStaffComponent.prototype.allDoctors = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + user_type_enum_1.UserTypeEnum.DOCTOR)
            .subscribe(function (response) {
            if (response['responseCode'] === 'USER_SUC_01') {
                _this.doctorsList = response['responseData'];
            }
        }, function (error) {
        });
    };
    AddStaffComponent.prototype.allDepartments = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_DEPARTMENT_BY_BRANCH + this.selectedBranchId)
            .subscribe(function (response) {
            if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                _this.departmentList = response['responseData'];
                if (_this.departmentList) {
                    var first = _this.departmentList[0];
                    if (_this.doctorDepartment)
                        _this.getDeptServices(first.id);
                }
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    AddStaffComponent.prototype.selectedBranch = function (eventObj) {
        this.hasServices = false;
        this.selectedBranchId = eventObj.value;
        this.allDepartments();
    };
    AddStaffComponent.prototype.getDeptServices = function (deptId) {
        var _this = this;
        this.hasServices = false;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_DEPT_MEDICAL_SERVICES_URL + deptId)
            .subscribe(function (response) {
            if (response['responseCode'] === 'MED_SER_SUC_01') {
                _this.servicesList = response['responseData'];
                if (_this.servicesList.length == 0) {
                    _this.hasServices = true;
                }
            }
            else {
                _this.servicesList = [];
            }
        }, function (error) {
            _this.servicesList = [];
            _this.error = error.error.error;
        });
    };
    AddStaffComponent.prototype.createUserForm = function () {
        this.userForm = this.fb.group({
            'firstName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4)])],
            'lastName': [null],
            'userName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4), forms_1.Validators.pattern('^[a-zA-Z0-9_-]{4,15}$')])],
            'password': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(6)])],
            'confirmPassword': [null, forms_1.Validators.compose([forms_1.Validators.required])],
            //'userRole': [null, Validators.required],
            'homePhone': [null, forms_1.Validators.compose([forms_1.Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
            'cellPhone': [null, forms_1.Validators.compose([forms_1.Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
            'primaryBranch': [null, forms_1.Validators.required],
            'interval': [null],
            'email': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
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
            'managePatientInvoices': '',
            'managePatientRecords': '',
            'departmentControl': [null, forms_1.Validators.pattern('true')],
            'servicesControl': [null],
            'shift1': [null, forms_1.Validators.required],
            'nurseDutyWithDoctor': [null],
            'changeUser': [this.allStaffTypes[2].name, forms_1.Validators.required],
            'comission': '',
        }, {
            validator: PasswordValidation_1.CustomValidators.Match('password', 'confirmPassword')
        });
        if (this.allStaffTypes[2].name === 'RECEPTIONIST') {
            this.goTo(this.allStaffTypes[2].name);
        }
    };
    AddStaffComponent.prototype.addData = function (data) {
        if (this.userForm.valid) {
            if (this.selectedUser === 'CASHIER') {
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
                    userType: this.selectedUser,
                });
                this.makeService(cashier);
            }
            if (this.selectedUser === 'RECEPTIONIST') {
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
                    //selectedRoles : this.selectedRoles,
                    userType: this.selectedUser
                });
                this.makeService(receptionist);
            }
            if (this.selectedUser === 'NURSE') {
                if (this.selectedDepartment.length != 0) {
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
                        //selectedRoles : this.selectedRoles,
                        userType: this.selectedUser
                    });
                    this.makeService(nurse);
                }
                else {
                    this.departmentFlag = true;
                    this.userForm.setErrors({ notValid: true });
                }
            }
            if (this.selectedUser === 'DOCTOR') {
                if (!this.firstShiftFromTime || !this.firstShiftToTime) {
                    this.dutyShift1 = true;
                    data.shift = true;
                    return;
                }
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
                    //selectedRoles : this.selectedRoles,
                    userType: this.selectedUser,
                });
                this.makeService(doctor);
            }
        }
        else {
            // console.log('i am invalid');
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
        //console.log('assignedUser' + userAssigned);
        if (userAssigned === 'nurse') {
            //console.log('i am nurse');
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
            //console.log('i am doctor' + departmentControl);
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
            checkUpIntervalControl.setValidators(forms_1.Validators.required); //markAsUntouched();
            shift1Control.setValidators(forms_1.Validators.required); //markAsUntouched();
        }
        else {
            //console.log('i am in else ');
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
        // console.log('i am normal ');
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
        user.serviceComission = this.serviceComission;
        //console.log('i am make service ....');
        this.requestsService.postRequest('/user/add', user).subscribe(function (response) {
            if (response['responseCode'] === 'USER_ADD_SUCCESS_01') {
                _this.responseUser = response['responseData'];
                _this.notificationService.success(_this.responseUser['username'] + ' has been Created Successfully');
                _this.router.navigate(['/dashboard/setting/staff']);
            } //
            else if (response["responseCode"] === "USER_ADD_ERR_02") {
                _this.notificationService.warn("User already Exists");
                //  this.router.navigate(['/dashboard/setting/branch'])
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
        this.departmentFlag = false;
        if (event.target.checked) {
            this.selectedDepartment.push(item.id);
        }
        else {
            var updateItem = this.selectedDepartment.find(this.findIndexToUpdate, item.id);
            var index = this.selectedDepartment.indexOf(updateItem);
            this.selectedDepartment.splice(index, 1);
        }
    };
    AddStaffComponent.prototype.selectDoctorDepartment = function (deptObj) {
        var deptId = deptObj.value;
        if (deptId) {
            this.selectedDepartment[0] = deptId;
            this.getDeptServices(deptId);
        }
        else {
            this.servicesList = [];
        }
    };
    AddStaffComponent.prototype.selectWorkingDays = function (event, item) {
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
        //console.log(item);
        if (event.target.checked) {
            this.selectedVisitBranches.push(item.id);
        }
        else {
            var updateItem = this.selectedVisitBranches.find(this.findIndexToUpdate, item.id);
            var index = this.selectedVisitBranches.indexOf(updateItem);
            this.selectedVisitBranches.splice(index, 1);
        }
        //console.log(this.selectedVisitBranches);
    };
    AddStaffComponent.prototype.selectRoles = function (event, item) {
        //console.log(item);
        if (event.target.checked) {
            this.selectedRoles.push(item.id);
        }
        else {
            var updateItem = this.selectedRoles.find(this.findIndexToUpdate, item.id);
            var index = this.selectedRoles.indexOf(updateItem);
            this.selectedRoles.splice(index, 1);
        }
    };
    AddStaffComponent.prototype.dutyWithDoctor = function (eventObj, item) {
        var eventVal = eventObj.value;
        this.selectedDoctors.push(eventVal);
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
    AddStaffComponent.prototype.goTo = function (typeObj) {
        console.log('typesss:' + '' + typeObj.value);
        var value = typeObj.value ? typeObj.value : 'RECEPTIONIST';
        this.selectedDepartment.length = 0;
        this.selectedServices.length = 0;
        this.selectedVisitBranches.length = 0;
        this.selectedDoctors.length = 0;
        this.selectedWorkingDays.length = 0;
        this.firstShiftFromTime = '';
        //this.userForm.controls['restrictBranch'].setValue('');
        this.firstShiftToTime = '';
        this.secondShiftFromTime = '';
        this.secondShiftToTime = '';
        this.clearFormFields();
        //console.log('i am goto' + this.selectedDepartment.length);
        if (value) {
            this.selectedUser = value;
            console.log('selectedUser' + this.selectedUser);
            this.checkPermission(value);
            this.setValidate(value);
            if (value === 'DOCTOR' || value === 'NURSE') {
                // this.allDepartments();
                //this.allServices();
            }
        }
        else {
            this.checkUpInterval = false;
            this.doctorDepartment = false;
            this.dutytimmingshift1 = false;
            this.dutytimmingshift2 = false;
            this.vacation = false;
            this.vacationweek = false;
            this.services = false;
            this.nurseDepartment = false;
            this.managepatientinvoices = false;
            this.managepatientrecord = false;
            this.dutywithdoctor = false;
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
        //this.userForm.controls['primaryBranch'].setValue('');
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
            case 'DOCTOR':
                this.doctorPermissions();
                break;
            case 'NURSE':
                this.nursePermissions();
                break;
            case 'RECEPTIONIST':
                this.receptionistPermissions();
                break;
            case 'CASHIER':
                this.cashierPermissions();
                break;
            default:
                this.doctorPermissions();
        }
    };
    AddStaffComponent.prototype.doctorPermissions = function () {
        this.checkUpInterval = true;
        this.doctorDepartment = true;
        this.dutytimmingshift1 = true;
        this.dutytimmingshift2 = true;
        this.vacation = true;
        this.vacationweek = true;
        this.services = true;
    };
    AddStaffComponent.prototype.nursePermissions = function () {
        this.nurseDepartment = true;
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
        this.nurseDepartment = this.doctorDepartment = false;
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
    AddStaffComponent.prototype.getSelectedBranch = function (event) {
        if (event && event.target.value) {
            this.userForm.controls['primaryBranch'].setValue(event.target.value);
        }
        this.visitingBranches = this.branchesList;
        this.visitingBranches = this.visitingBranches.filter(function (br) { return br.id != event.target.value; });
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