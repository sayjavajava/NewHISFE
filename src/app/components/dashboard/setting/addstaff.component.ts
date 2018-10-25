import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AmazingTimePickerService} from 'amazing-time-picker';

import {User} from '../../../model/User';
import {RequestsService} from '../../../services/requests.service';
import {AppConstants} from '../../../utils/app.constants';
import {NotificationService} from '../../../services/notification.service';
import {CustomValidators} from './PasswordValidation';
import {RoleAndPermission} from '../../../model/roleandpermission';

import {BranchResponse} from '../../../model/BranchResponse';
import {UserTypeEnum} from '../../../enums/user-type-enum';
@Component({
    selector: 'addstaff-component',
    templateUrl: '../../../templates/dashboard/setting/addstaff.template.html',
})
export class AddStaffComponent implements OnInit {

    selectedUser: string = 'RECEPTIONIST';
    allowdiscount: boolean = true;
    doctorDepartment: boolean;
    nurseDepartment: boolean;
    checkUpInterval: boolean;
    dutytimmingshift1: boolean;
    dutytimmingshift2: boolean;
    vacation: boolean;
    vacationweek: boolean;
    services: boolean;
    dutywithdoctor: boolean;
    managepatientrecord: boolean;
    managepatientinvoices: boolean;
    allDBRoles: RoleAndPermission[];
    userForm: FormGroup;
    selectedDepartment: any = [];
    dutyWithDoctors: any = [];
    selectedServices: any = [];
    selectedTime: string;
    secondShiftFromTime: string;
    secondShiftToTime: string;
    firstShiftFromTime: string;
    firstShiftToTime: string;
    selectedWorkingDays: any = [];
    selectedVisitBranches: any = [];
    selectedRoles : any=[];
    selectedDoctors: any = [];
    error: string;
    responseUser: any[];
    userSelected: string = 'doctor';
    defaultBranch: string = 'primaryBranch';

    branchesList: any = [];
    visitingBranches: any [];
    departmentList: any = [];
    primaryDoctor: any = [];
    servicesList: any = [];
    doctorsList :any =[];
    workingDays = [
        {name: 'Monday'},
        {name: 'Tuesday'},
        {name: 'Wednesday'},
        {name: 'Thursday'},
        {name: 'Friday'},
        {name: 'Saturday'},
        {name: 'Sunday'},

    ];
    firstNameError: string = 'First name is required';
    userNameError: string = 'User name is required';
    emailError: string = 'Email is required';
    passwordError: string = 'Password is required';
    confirmPasswordError: string = 'Password must be equal';
    primaryBranchError: string = 'Select Primary Branch';
    restrictBranchError: string = 'Select Allow Branch';
    departmentError: string = 'Select atleast one Department';
    serviceError: string = 'Select one or more Services';
    dutyTimmingShiftError: string = 'Select Duty Time';
    userRoleError: string = 'Select atleast one role';
    changeUserError: string = 'Select atleast one role';
    allStaffTypes = [
        {name: 'NURSE'},
        {name: 'DOCTOR'},
        {name: 'RECEPTIONIST'},
        {name: 'CASHIER'}

    ];
    dutyShift1: boolean = false;

    constructor(private router: Router, private  fb: FormBuilder, private requestsService: RequestsService, private notificationService: NotificationService,
                private amazingTimePickerService?: AmazingTimePickerService) {
        this.allRoles();
        this.allBranches();
        this.allDepartments();
        this.allDoctors();
        //this.allServices();


    }

    ngOnInit() {
        this.createUserForm();

    }

/*    removeBranch() {
        this.branchesList.forEach((item: any, index: any) => {
            if (item.name === this.defaultBranch) this.branchesList.splice(index, 1);
        });
    }*/

    allBranches() {
        this.requestsService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchesList = response['responseData'];
                        this.visitingBranches = response['responseData'];
                    }
                   // this.userForm.controls['primaryBranch'].setValue(this.branchesList[0].id)
                },
                (error: any) => {
                    this.error = error.error.error;
                })
    }

    allRoles() {
        this.requestsService.getRequest(
            AppConstants.PERMISSION_ENDPOINT)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ROL_PER_SUC_02') {
                        let resources = response['responseData'];
                        let resource = resources['allRoleAndPermissions'];
                        this.allDBRoles = resource;
                    }
                },
                (error: any) => {
                }
            );
    }

    allDoctors() {

        this.requestsService.getRequest(
            AppConstants.USER_BY_ROLE + '?name=' + UserTypeEnum.DOCTOR)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'USER_SUC_01') {
                        this.doctorsList = response['responseData'];
                    }
                },
                (error: any) => {
                }
            );
    }

    allDepartments() {
        this.requestsService.getRequest(AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                        this.departmentList = response['responseData'];
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })

    }

    getDeptServices(deptId: any) {
        this.requestsService.getRequest(AppConstants.FETCH_DEPT_MEDICAL_SERVICES_URL+deptId)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'MED_SER_SUC_01') {
                        this.servicesList = response['responseData'];
                        //console.log(this.servicesList);
                    }else{
                        this.servicesList = [];
                    }
                },
                (error: any) => {
                    this.servicesList = [];
                    this.error = error.error.error;
                })

    }

    createUserForm() {
        this.userForm = this.fb.group({
                'firstName': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
                'lastName': [null],
                'userName': [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9_-]{4,15}$')])],
                'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
                'confirmPassword': [null, Validators.compose([Validators.required])],
                //'userRole': [null, Validators.required],
                'homePhone': [null, Validators.compose([Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
                'cellPhone': [null, Validators.compose([Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
                'primaryBranch': [null, Validators.required],
                'interval': [null,Validators.required],
                'email': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
                'restrictBranch': [null, Validators.required],
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
                'departmentControl': [null,Validators.required],
                'servicesControl': [null],
                'shift1': [null, Validators.required],
                'nurseDutyWithDoctor': [null],
                'changeUser': [this.allStaffTypes[2].name, Validators.required],

            },
            {
                validator: CustomValidators.Match('password', 'confirmPassword')
            }
        )
        if(this.allStaffTypes[2].name==='RECEPTIONIST'){
            this.goTo(this.allStaffTypes[2].name);
        }
    }

    addData(data: any) {
        if (this.userForm.valid) {
            if (this.selectedUser === 'CASHIER') {
                let cashier = new User({
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
                    //selectedRoles : this.selectedRoles
                });

                this.makeService(cashier);

            }

            if (this.selectedUser === 'RECEPTIONIST') {

                let receptionist = new User({
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

                let nurse = new User({
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

            if (this.selectedUser === 'DOCTOR') {
                if( !this.firstShiftFromTime || !this.firstShiftToTime ){
                    this.dutyShift1 = true;
                    data.shift = true;
                    return;
                }
                let doctor = new User({
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
                    userType: this.selectedUser
                });
                this.makeService(doctor);
            }
        } else {
            // console.log('i am invalid');
            this.validateAllFormFields(this.userForm);
        }
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            //console.log(field);
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({onlySelf: true});
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    setValidate(userAssigned: string): void {
        const departmentControl = this.userForm.get('departmentControl');
        const servicesControl = this.userForm.get('servicesControl');
        const shift1Control = this.userForm.get('shift1');
        const checkUpIntervalControl = this.userForm.get('interval');
        const nurseDutyWithDoctorControl = this.userForm.get('nurseDutyWithDoctor');
        const firstNameControl = this.userForm.get('firstName');
        const userNameControl = this.userForm.get('userName');
        const passwordControl = this.userForm.get('password');
        const confirmPasswordControl = this.userForm.get('confirmPassword');
        const emailControl = this.userForm.get('email');
        const primaryBranchControl = this.userForm.get('primaryBranch');
        const restrictBranchControl = this.userForm.get('restrictBranch');


        //console.log('assignedUser' + userAssigned);

        if (userAssigned === 'nurse') {
            //console.log('i am nurse');
            nurseDutyWithDoctorControl.setValidators(Validators.required);
            departmentControl.setValidators(Validators.required);
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
            departmentControl.setValidators(Validators.required);
            servicesControl.setValidators(Validators.required);
            shift1Control.setValidators(Validators.required);
            checkUpIntervalControl.setValidators(Validators.required);
            firstNameControl.markAsUntouched();
            userNameControl.markAsUntouched();
            emailControl.markAsUntouched();
            passwordControl.markAsUntouched();
            confirmPasswordControl.markAsUntouched();
            restrictBranchControl.markAsUntouched();
            primaryBranchControl.markAsUntouched();
            departmentControl.markAsUntouched();
            servicesControl.markAsUntouched();
            checkUpIntervalControl.setValidators(Validators.required);//markAsUntouched();
            shift1Control.setValidators(Validators.required);//markAsUntouched();
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
    }

    reset() {
        this.userForm.reset();
    }

    isFieldValid(field: string) {
        return !this.userForm.get(field).valid && this.userForm.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }

    makeService(user: any) {
        //console.log('i am make service ....');
        this.requestsService.postRequest('/user/add', user).subscribe(
            (response: Response) => {
                if (response['responseCode'] === 'USER_ADD_SUCCESS_01') {
                    this.responseUser = response['responseData'];
                    this.notificationService.success(this.responseUser['username'] + ' has been Created Successfully');
                    this.router.navigate(['/dashboard/setting/staff']);
                }
            }
            , (error: any) => {
                //console.log(error.json());
                this.error = error.error.error_description;
                this.notificationService.error('ERROR', 'User Registeration is Failed ');

            });
    }

    secondShiftFrom() {
        const amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(time => {
            this.secondShiftFromTime = time;
        })
    }

    firstShiftFrom() {
        const amazingTimePicker = this.amazingTimePickerService.open({

            time: this.firstShiftFromTime,
            theme: 'dark',
            arrowStyle: {
                background: 'red',
                color: 'white'
            }
        });
        amazingTimePicker.afterClose().subscribe(time => {
            this.firstShiftFromTime = time;
        })
    }

    firstShiftTo() {
        const amazingTimePicker = this.amazingTimePickerService.open({
            //locale: 'ar',
            time: this.firstShiftToTime,
            theme: 'dark',
            arrowStyle: {
                background: 'red',
                color: 'white'
            }
        });
        amazingTimePicker.afterClose().subscribe(time => {
            this.firstShiftToTime = time;
        })
    }

    secondShiftTo() {
        const amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(time => {
            this.secondShiftToTime = time;
        })
    }

    getBranch(value: any) {

        if (value) {
            this.userForm.controls['primaryBranch'].setValue(value);
        }
    }

    checkupIntervalMethod(value: any) {
        if (value) {
            this.userForm.controls['interval'].setValue(value);
        }
    }

    selectDepartment(event: any, item: any) {
        if (event.target.checked) {
            this.selectedDepartment.push(item.id);
        }
        else {
            let updateItem = this.selectedDepartment.find(this.findIndexToUpdate, item.id);
            let index = this.selectedDepartment.indexOf(updateItem);
            this.selectedDepartment.splice(index, 1);
        }
    }

    selectDoctorDepartment(deptId: any) {
        if (deptId) {
            this.selectedDepartment[0] = deptId;
            this.getDeptServices(deptId);
        }else{
            this.servicesList = [];
        }
    }

    selectWorkingDays(event: any, item: any) {
        if (event.target.checked) {
            this.selectedWorkingDays.push(item.name);
        }
        else {
            let updateItem = this.selectedWorkingDays.find(this.findIndexToUpdate, item.name);

            let index = this.selectedWorkingDays.indexOf(updateItem);

            this.selectedWorkingDays.splice(index, 1);
        }
        console.log(this.selectedWorkingDays);

    }

    selectVisitBranches(event: any, item: any) {
        //console.log(item);
        if (event.target.checked) {
            this.selectedVisitBranches.push(item.id);
        }
        else {
            let updateItem = this.selectedVisitBranches.find(this.findIndexToUpdate, item.id);

            let index = this.selectedVisitBranches.indexOf(updateItem);

            this.selectedVisitBranches.splice(index, 1);
        }
        //console.log(this.selectedVisitBranches);
    }
    selectRoles(event: any, item: any) {
        //console.log(item);
        if (event.target.checked) {
            this.selectedRoles.push(item.id);
        }
        else {
            let updateItem = this.selectedRoles.find(this.findIndexToUpdate, item.id);

            let index = this.selectedRoles.indexOf(updateItem);

            this.selectedRoles.splice(index, 1);
        }
}

    dutyWithDoctor(event: any, item: any) {
       // console.log(item);
        if (event.target.checked) {
            this.dutyWithDoctors.push(item.id);
        }
        else {
            let updateItem = this.dutyWithDoctors.find(this.findIndexToUpdate, item.id);

            let index = this.dutyWithDoctors.indexOf(updateItem);

            this.dutyWithDoctors.splice(index, 1);
        }
        //console.log(this.dutyWithDoctors);
    }

    findIndexToUpdate(type: any) {
        return type.name === this;
    }

    selectServices(event: any, item: any) {
        if (event.target.checked) {
            this.selectedServices.push(item.id);
        }
        else {
            let updateItem = this.selectedServices.find(this.findIndexToUpdate, item.id);

            let index = this.selectedServices.indexOf(updateItem);

            this.selectedServices.splice(index, 1);

        }

    }

    public goTo(value: any) {
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
            this.checkPermission(value);
            this.setValidate(value);
            if(value==='DOCTOR' || value==='NURSE'){
                this.allDepartments();
                //this.allServices();
            }
        }else{
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

    }

    clearFormFields() {
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

    }

    checkPermission(user: string) {
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
    }

    private doctorPermissions() {
        this.checkUpInterval = true;
        this.doctorDepartment = true;
        this.dutytimmingshift1 = true;
        this.dutytimmingshift2 = true;
        this.vacation = true;
        this.vacationweek = true;
        this.services = true;

    }

    private nursePermissions() {

        this.nurseDepartment = true;
        this.managepatientinvoices = true;
        this.managepatientrecord = true;
        this.dutywithdoctor = true;
    }

    private receptionistPermissions() {
        this.allowdiscount = true;
    }

    private cashierPermissions() {
        this.allowdiscount = true;
    }

    private changeState() {
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
    }

    cancel() {
        this.router.navigate(['/dashboard/setting/staff']);
    }

    getSelectedBranch(event: any) {
        if (event && event.target.value) {
            this.userForm.controls['primaryBranch'].setValue(event.target.value);
        }
        this.visitingBranches = this.branchesList;
        this.visitingBranches = this.visitingBranches.filter(br=> br.id != event.target.value);
    }

    getSelectedDashboard(value: any) {
        if (value) {
            this.userForm.controls['otherDashboard'].setValue(value);

        }
    }
}