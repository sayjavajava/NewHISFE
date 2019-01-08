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
var router_1 = require("@angular/router");
var requests_service_1 = require("../../../services/requests.service");
var notification_service_1 = require("../../../services/notification.service");
var User_1 = require("../../../model/User");
var amazing_time_picker_1 = require("amazing-time-picker");
var app_constants_1 = require("../../../utils/app.constants");
var DataService_1 = require("../../../services/DataService");
var service_comission_1 = require("../../../model/service-comission");
var user_type_enum_1 = require("../../../enums/user-type-enum");
var UpdatedoctorComponent = (function () {
    function UpdatedoctorComponent(route, router, requestService, dataService, fb, notificationService, amazingTimePickerService) {
        this.route = route;
        this.router = router;
        this.requestService = requestService;
        this.dataService = dataService;
        this.fb = fb;
        this.notificationService = notificationService;
        this.amazingTimePickerService = amazingTimePickerService;
        this.dutyShift1 = false;
        this.selectedDepartment = [];
        this.selectedDepartmentObj = [];
        this.selectedServices = [];
        this.doctorServices = [];
        this.selectedWorkingDays = [];
        this.selectedVisitBranches = [];
        this.selectedDoctorDashboard = new Array();
        this.selectedDoctors = [];
        this.departmentList = [];
        this.selectedUser = 'doctor';
        this.userSelected = 'doctor';
        this.defaultBranch = 'primaryBranch';
        this.matches = [];
        this.branchesList = [];
        this.servicesList = [];
        this.primaryDoctor = [];
        this.doctorsList = [];
        this.workingDays = [
            { label: 'Monday', value: 'Monday' },
            { label: 'Tuesday', value: 'Tuesday' },
            { label: 'Wednesday', value: 'Wednesday' },
            { label: 'Thursday', value: 'Thursday' },
            { label: 'Friday', value: 'Friday' },
            { label: 'Saturday', value: 'Saturday' },
            { label: 'Sunday', value: 'Sunday' },
        ];
        this.serviceComission = [];
        this.hasServices = false;
        this.listOfServices = [];
        this.showComissioninput = false;
        this.comissionBtn = 'Show';
        this.dept_In_Branch = false;
        this.date = new forms_1.FormControl(new Date());
        this.allBranches();
        this.allDoctors();
    }
    UpdatedoctorComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    UpdatedoctorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createUserForm();
        this.sub = this.route.params.subscribe(function (params) {
            _this.id = params['id'];
        });
        this.subscription = this.dataService.currentStaffServiceId.subscribe(function (x) { _this.userId = x; });
        this.patchData();
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
    UpdatedoctorComponent.prototype.allBranches = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branchesList = response['responseData'];
                _this.visitingBranches = response['responseData'];
                /*if(this.branchesList.length >1){
                    this.removeBranch();
                }*/
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    UpdatedoctorComponent.prototype.allDoctors = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + '?name=' + user_type_enum_1.UserTypeEnum.DOCTOR)
            .subscribe(function (response) {
            if (response['responseCode'] === 'USER_SUC_01') {
                _this.doctorsList = response['responseData'];
            }
        }, function (error) {
        });
    };
    UpdatedoctorComponent.prototype.removeBranch = function () {
        var _this = this;
        this.branchesList.forEach(function (item, index) {
            if (item === _this.defaultBranch)
                _this.branchesList.splice(index, 1);
        });
    };
    UpdatedoctorComponent.prototype.selectedBranch = function (eventObj) {
        this.hasServices = false;
        this.selectedBranchId = eventObj.value;
        this.allDepartments();
    };
    UpdatedoctorComponent.prototype.loadDepartmentByBranchOnIntialization = function (selectedBranchId) {
        this.hasServices = false;
        this.selectedBranchId = selectedBranchId;
        this.allDepartments();
    };
    UpdatedoctorComponent.prototype.loadServicesByDepartment = function (deptId) {
        if (deptId) {
            this.selectedDepartment[0] = deptId;
            this.getDeptServices(deptId);
        }
        else {
            this.servicesList = [];
        }
    };
    UpdatedoctorComponent.prototype.allDepartments = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_DEPARTMENT_BY_BRANCH + this.selectedBranchId)
            .subscribe(function (response) {
            if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                _this.departmentList = response['responseData'];
                _this.dept_In_Branch = false;
            }
            if (response['responseCode'] === 'CLI_DPT_ERR_03') {
                _this.departmentList.length = 0;
                _this.dept_In_Branch = true;
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    UpdatedoctorComponent.prototype.getDeptServices = function (deptId) {
        var _this = this;
        this.hasServices = false;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_DEPT_MEDICAL_SERVICES_URL + deptId)
            .subscribe(function (response) {
            if (response['responseCode'] === 'MED_SER_SUC_01') {
                _this.servicesList = response['responseData'];
                //this.hasServices =true;
                _this.servicesList.forEach(function (x) {
                    _this.listOfServices.forEach(function (y) {
                        if ((x.id == y.id)) {
                            x.checked = true;
                            var sc = new service_comission_1.ServiceComission(y.id, true, y.comission);
                            _this.serviceComission.push(sc);
                        }
                    });
                });
            }
            else {
                _this.servicesList = [];
            }
        }, function (error) {
            _this.servicesList = [];
            _this.error = error.error.error;
        });
    };
    UpdatedoctorComponent.prototype.showServiceComission = function () {
        this.showComissioninput = !this.showComissioninput;
        if (this.showComissioninput)
            this.comissionBtn = 'HIDE';
        else
            this.comissionBtn = 'SHOW';
        this.listOfServices.forEach(function (x) {
            var input = document.getElementById(x.id);
            if (input != null)
                input.value = x.comission;
        });
        // console.log('flat:' + input);
    };
    UpdatedoctorComponent.prototype.addComission = function (service, item) {
        // serviceComission:{id:number,checked:boolean,comission:''}[];
        console.log('i am comission..' + service.target.value + ':' + item.value);
        var list = this.serviceComission.filter(function (x) { return x.id == item.value; });
        if (list != null) {
            list.forEach(function (x) {
                x.comission = service.target.value;
                console.log('content:' + service.target.value);
            });
        }
    };
    UpdatedoctorComponent.prototype.addComissionCheck = function (ser, item) {
        var _this = this;
        console.log('checkbox:' + ser.target.checked + ': :' + item.id);
        if (ser.target.checked == true) {
            this.serviceComission.forEach(function (it, index) {
                if (it === item.value)
                    _this.serviceComission.splice(index, 1);
            });
            console.log('flatt check  :' + ser + 'checking..' + item.value);
            var sc = new service_comission_1.ServiceComission(item.value, ser.target.checked, '');
            this.serviceComission.push(sc);
        }
        else {
            this.serviceComission.splice(this.serviceComission.findIndex(function (it) { return it.id = item.id; }), 1);
            console.log('fatt..' + this.serviceComission.length);
        }
    };
    UpdatedoctorComponent.prototype.allServices = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'MED_SER_SUC_01') {
                _this.servicesList = response['responseData'];
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    UpdatedoctorComponent.prototype.createUserForm = function () {
        this.userForm = this.fb.group({
            'firstName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4)])],
            'lastName': [null],
            'userName': [null],
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
            'receivePayment': [null],
            'active': '',
            'dateFrom': [null],
            'dateTo': [null],
            'departmentControl': [null],
            'servicesControl': [null],
            'shift1': [null],
            'secondShiftFromTimeControl': [null],
            workingDaysContorl: new forms_1.FormGroup({
                //  new FormControl(''),
                sunday: new forms_1.FormControl(''),
                monday: new forms_1.FormControl(''),
                tuesday: new forms_1.FormControl(''),
                thursday: new forms_1.FormControl(''),
                friday: new forms_1.FormControl(''),
                saturday: new forms_1.FormControl(''),
                wednesday: new forms_1.FormControl(''),
            })
        });
    };
    Object.defineProperty(UpdatedoctorComponent.prototype, "workingDaysContorl", {
        get: function () {
            return this.userForm.get('workingDaysContorl');
        },
        enumerable: true,
        configurable: true
    });
    UpdatedoctorComponent.prototype.patchData = function () {
        var _this = this;
        if (this.id) {
            this.requestService.findByIdAndType(app_constants_1.AppConstants.FETCH_USER_BY_ID + this.id, 'DOCTOR').subscribe(function (user) {
                //  this.id = user.id;
                _this.userForm.patchValue({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    homePhone: user.homePhone,
                    cellPhone: user.cellPhone,
                    userName: user.userName,
                    active: user.active,
                    otherDashboard: user.otherDashboard,
                    primaryBranch: user.primaryBranchId,
                    interval: user.checkUpInterval,
                    // shift1: user.dutyShift.dutyTimmingShift1,
                    // shift2: user.dutyShift.dutyTimmingShift2,
                    //  secondShiftFromTimeControl: user.dutyShift.secondShiftFromTime,
                    vacation: user.vacation,
                    sendBillingReport: user.sendBillingReport,
                    useReceptDashboard: user.useReceptDashboard,
                    otherDoctorDashBoard: user.otherDoctorDashBoard,
                });
                var docDeptId = user.docDepartmentId;
                //this.servicesList = this.getDeptServices(docDeptId);
                _this.selectedWorkingDays = user.workingDays.slice();
                if (user.expiryDate != null) {
                    _this.userForm.controls['accountExpiry'].setValue(new Date(user.expiryDate));
                }
                if (user.primaryBranchId) {
                    _this.loadDepartmentByBranchOnIntialization(user.primaryBranchId);
                } //selectedDoctorDashboard
                if (user.permittedDoctorDashboard) {
                    _this.selectedDoctorDashboard = user.permittedDoctorDashboard.slice();
                }
                // user.doctorMedicalSrvcList.forEach((x:any)=>this.listOfServices.push('med service'+x.id));
                console.log('med service ' + user.doctorMedicalSrvcList.length);
                user.doctorServiceComission.forEach(function (x) {
                    _this.listOfServices.push({ id: x.id, comission: x.comissionService });
                });
                //let shifts: any [] = user.dutyShifts;
                /*if (user.dutyShifts!=null && user.dutyShifts.length > 0) {
                    for (let s in user.dutyShifts) {
                        if (user.dutyShifts[s].shiftName === 'SHIFT1') {
                            this.userForm.controls['shift1'].setValue(true);
                            this.firstShiftFromTime = user.dutyShifts[s].startTime;
                            this.firstShiftToTime = user.dutyShifts[s].endTime;
                        } else if (user.dutyShifts[s].shiftName === 'SHIFT2') {
                            this.userForm.controls['shift2'].setValue(true);
                            this.secondShiftFromTime = user.dutyShifts[s].startTime;
                            this.secondShiftToTime = user.dutyShifts[s].endTime;
                        }
                    }

                    if (user.dutyShifts[0].shiftName == 'MORNING') {
                        // console.log('doneee'+user.dutyShifts[0].shiftName);
                        this.userForm.controls['shift1'].setValue(true);
                    }
                    if (user.dutyShifts.length > 1 && user.dutyShifts[1].shiftName == 'EVENING') {
                        // console.log('doneee'+user.dutyShifts[0].shiftName);
                        this.userForm.controls['shift2'].setValue(true);
                    }
                }*/
                if (user.shift1) {
                    user.shift1.forEach(function (x) {
                        _this.userForm.controls['shift1'].setValue(true);
                        _this.firstShiftFromTime = x.startDutyTime,
                            _this.firstShiftToTime = x.endDutyTime;
                    });
                }
                if (user.shift2.length != 0) {
                    user.shift1.forEach(function (x) {
                        _this.userForm.controls['shift2'].setValue(true);
                        _this.secondShiftFromTime = x.startDutyTime,
                            _this.secondShiftToTime = x.endDutyTime;
                    });
                }
                for (var k in _this.departmentList) {
                    if (_this.departmentList[k].id == docDeptId) {
                        _this.departmentList[k].selected = true;
                        _this.selectedDepartment[0] = docDeptId;
                        break;
                    }
                    /*this.selectedDepartmentObj.push(user.docDepartmentId);
                    console.log( 'depart doc'+this.selectedDepartmentObj[0].value)*/
                }
                if (user.docDepartmentId) {
                    _this.selectedDepartmentObj.push(user.docDepartmentId);
                    _this.getDeptServices(user.docDepartmentId);
                }
                console.log('depart doc' + _this.selectedDepartmentObj + 'deprt id ' + user.docDepartmentId);
                _this.staffBranches = user.staffBranches;
                _this.staffBranches = _this.staffBranches.filter(function (br) { return br.id != _this.userForm.controls['primaryBranch'].value; });
                //   this.visitingBranches = this.visitingBranches.filter(br=> br.id != this.userForm.controls['primaryBranch'].value);
                /* for(let key in this.visitingBranches){
                     for(let k in this.staffBranches){
                         if(this.staffBranches[k].id == this.visitingBranches[key].id){
                             this.visitingBranches[key].checked = true;
                             this.selectedVisitBranches.push(this.staffBranches[k].id);
                             break;
                         }
                     }
                 }*/
                _this.selectedVisitBranches.length = 0;
                user.staffBranches.forEach(function (x) {
                    _this.selectedVisitBranches.push(x.id);
                });
                _this.staffBranches.forEach(function (x) {
                    _this.selectedVisitBranches.push(x.id);
                });
                _this.doctorServices = user.doctorMedicalSrvcList;
                if (user.vacationFrom && user.vacationTo) {
                    _this.userForm.controls['dateFrom'].setValue(new Date(user.vacationFrom));
                    _this.userForm.controls['dateTo'].setValue(new Date(user.vacationTo));
                }
                /*this.userForm.controls['workingDaysContorl'].patchValue({
                   sunday: this.checkAvailabilty('sunday', user.workingDays),
                   monday: this.checkAvailabilty('monday', user.workingDays),
                   tuesday: this.checkAvailabilty('tuesday', user.workingDays),
                   thursday: this.checkAvailabilty('thursday', user.workingDays),
                   friday: this.checkAvailabilty('friday', user.workingDays),
                   saturday: this.checkAvailabilty('saturday', user.workingDays),
                   wednesday: this.checkAvailabilty('wednesday', user.workingDays)

               }
               )*/
                /*this.secondShiftFromTime = user.dutyShifts[0].startTime,
                this.secondShiftToTime = user.dutyShifts[0].endTime,
                this.firstShiftFromTime = user.dutyShifts[1].startTime,
                this.firstShiftToTime = user.dutyShifts[1].endTime*/
            }, function (error) {
                //console.log(error.json());
                _this.error = error.error.error_description;
            });
        }
    };
    UpdatedoctorComponent.prototype.getShiftFromTime = function (time) {
        var timeArray = time.split(':');
        var shift = Number(timeArray[0]) <= 12 ? 'first' : 'second';
    };
    UpdatedoctorComponent.prototype.checkAvailabilty = function (value, array) {
        return array.indexOf(value) > -1;
    };
    UpdatedoctorComponent.prototype.setPreset = function () {
        this.workingDaysContorl.patchValue(['LA', 'MTV']);
    };
    UpdatedoctorComponent.prototype.addUser = function (data) {
        var days = this.userForm.get('workingDaysContorl');
        var daysOfDoctor = [];
        daysOfDoctor.push({ key: 'sunday', value: days.get('sunday').value });
        daysOfDoctor.push({ key: 'monday', value: days.get('monday').value });
        daysOfDoctor.push({ key: 'tuesday', value: days.get('tuesday').value });
        daysOfDoctor.push({ key: 'wednesday', value: days.get('wednesday').value });
        daysOfDoctor.push({ key: 'thursday', value: days.get('thursday').value });
        daysOfDoctor.push({ key: 'friday', value: days.get('friday').value });
        daysOfDoctor.push({ key: 'saturday', value: days.get('saturday').value });
        if (this.userForm.valid) {
            if (!this.firstShiftFromTime || !this.firstShiftToTime) {
                this.dutyShift1 = true;
                data.shift = true;
                return;
            }
            var result = daysOfDoctor.filter(function (obj) {
                return obj.value == true;
            });
            for (var key in result) {
                this.selectedWorkingDays.push(result[key].key);
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
                active: data.active,
                selectedDoctors: this.selectedDoctors,
                selectedDepartment: this.selectedDepartment,
                selectedServices: this.selectedServices,
                interval: data.interval,
                selectedVisitBranches: this.selectedVisitBranches,
                selectedDoctorDashboard: this.selectedDoctorDashboard,
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
            this.workingDays.length = 0;
        }
        else {
            this.validateAllFormFields(this.userForm);
        }
    };
    UpdatedoctorComponent.prototype.selectDoctorDepartment = function (deptIdObj) {
        var deptId = deptIdObj.value;
        if (deptId) {
            this.selectedDepartment[0] = deptId;
            this.getDeptServices(deptId);
        }
        else {
            this.servicesList = [];
        }
    };
    UpdatedoctorComponent.prototype.makeService = function (user) {
        var _this = this;
        user.serviceComission = this.serviceComission;
        console.log('service update:' + this.serviceComission);
        this.requestService.putRequest('/user/edit/' + this.userId, user).subscribe(function (response) {
            if (response['responseStatus'] === 'SUCCESS') {
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
    UpdatedoctorComponent.prototype.isFieldValid = function (field) {
        return !this.userForm.get(field).valid && this.userForm.get(field).touched;
    };
    UpdatedoctorComponent.prototype.displayFieldCss = function (field) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    };
    UpdatedoctorComponent.prototype.getBranch = function (value) {
        if (value) {
            this.userForm.controls['primaryBranch'].setValue(value);
        }
    };
    UpdatedoctorComponent.prototype.validateAllFormFields = function (formGroup) {
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
    UpdatedoctorComponent.prototype.secondShiftFrom = function () {
        var _this = this;
        var amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(function (time) {
            _this.secondShiftFromTime = time;
        });
    };
    UpdatedoctorComponent.prototype.firstShiftFrom = function () {
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
    UpdatedoctorComponent.prototype.firstShiftTo = function () {
        var _this = this;
        var amazingTimePicker = this.amazingTimePickerService.open({
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
    UpdatedoctorComponent.prototype.secondShiftTo = function () {
        var _this = this;
        var amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(function (time) {
            _this.secondShiftToTime = time;
        });
    };
    UpdatedoctorComponent.prototype.checkupIntervalMethod = function (value) {
        if (value) {
            this.userForm.controls['interval'].setValue(value);
        }
    };
    /*selectDepartment(event: any, item: any) {
        if (event.target.checked) {

            this.selectedDepartment.push(item.id);
        }
        else {
            let updateItem = this.selectedDepartment.find(this.findIndexToUpdate, item.id);

            let index = this.selectedDepartment.indexOf(updateItem);

            this.selectedDepartment.splice(index, 1);
        }
    }*/
    UpdatedoctorComponent.prototype.selectWorkingDays = function (event, item) {
        if (event.target.checked) {
            this.selectedWorkingDays.push(item.name);
        }
        else {
            var updateItem = this.selectedWorkingDays.find(this.findIndexToUpdate, item.name);
            var index = this.selectedWorkingDays.indexOf(updateItem);
            this.selectedWorkingDays.splice(index, 1);
        }
    };
    UpdatedoctorComponent.prototype.selectRestrictBranch = function (event, item) {
        console.log(item);
        if (event.target.checked) {
            this.selectedVisitBranches.push(item.id);
        }
        else {
            var updateItem = this.selectedVisitBranches.find(this.findIndexToUpdate, item.id);
            var index = this.selectedVisitBranches.indexOf(updateItem);
            this.selectedVisitBranches.splice(index, 1);
        }
    };
    UpdatedoctorComponent.prototype.findIndexToUpdate = function (type) {
        return type.name === this;
    };
    UpdatedoctorComponent.prototype.selectServices = function (event, item) {
        if (event.target.checked) {
            this.selectedServices.push(item.id);
        }
        else {
            var updateItem = this.selectedServices.find(this.findIndexToUpdate, item.id);
            var index = this.selectedServices.indexOf(updateItem);
            this.selectedServices.splice(index, 1);
        }
    };
    UpdatedoctorComponent.prototype.getSelectedDashboard = function (value) {
        if (value) {
            this.userForm.controls['otherDashboard'].setValue(value);
        }
    };
    UpdatedoctorComponent.prototype.getSelectedBranch = function (event) {
        if (event && event.target.value) {
            this.userForm.controls['primaryBranch'].setValue(event.target.value);
        }
        this.visitingBranches = this.branchesList;
        this.visitingBranches = this.visitingBranches.filter(function (br) { return br.id != event.target.value; });
        /*if (value === undefined) {
            console.log('i am esss');
            this.userForm.controls['primaryBranch'].setValue('primaryBranch');
        }
        else {
            console.log('i am too' + value);
            this.userForm.controls['primaryBranch'].setValue(value);
        }*/
    };
    UpdatedoctorComponent.prototype.selectVisitBranches = function (event, item) {
        if (event.target.checked) {
            this.selectedVisitBranches.push(item.id);
        }
        else {
            var updateItem = this.selectedVisitBranches.find(this.findIndexToUpdate, item.id);
            var index = this.selectedVisitBranches.indexOf(updateItem);
            this.selectedVisitBranches.splice(index, 1);
        }
    };
    UpdatedoctorComponent.prototype.cancel = function () {
        this.router.navigate(['/dashboard/setting/staff']);
    };
    UpdatedoctorComponent = __decorate([
        core_1.Component({
            selector: 'adddoctor-component',
            templateUrl: '../../../templates/dashboard/setting/updatedoctor.template.html',
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, requests_service_1.RequestsService, DataService_1.DataService,
            forms_1.FormBuilder, notification_service_1.NotificationService,
            amazing_time_picker_1.AmazingTimePickerService])
    ], UpdatedoctorComponent);
    return UpdatedoctorComponent;
}());
exports.UpdatedoctorComponent = UpdatedoctorComponent;
//# sourceMappingURL=updatedoctor.component.js.map