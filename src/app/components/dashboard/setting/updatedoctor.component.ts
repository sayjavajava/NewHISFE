import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {CustomValidators} from './PasswordValidation';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {User} from '../../../model/User';
import {UserEditModel} from '../../../model/UserEditModel';
import {AmazingTimePickerService} from 'amazing-time-picker';
import {AppConstants} from '../../../utils/app.constants';

@Component({
    selector: 'adddoctor-component',
    templateUrl: '../../../templates/dashboard/setting/updatedoctor.template.html',
})
export class UpdatedoctorComponent implements OnInit {


    department: boolean;
    dutytimmingshift1: boolean;
    dutytimmingshift2: boolean;
    vacation: boolean;
    vacationweek: boolean;
    services: boolean;
    dutywithdoctor: boolean;
    managepatientrecord: boolean;
    managepatientinvoices: boolean;
    userForm: FormGroup;
    selectedDepartment: any = [];
    selectedServices: any = [];
    selectedTime: string;
    secondShiftFromTime: string;
    secondShiftToTime: string;
    firstShiftFromTime: string;
    firstShiftToTime: string;
    selectedWorkingDays: any = [];
    selectedRestrictBranch: any = [];
    selectedDoctors: any = [];

    error: string;
    responseUser: any[];
    private sub: any;
    id: number;
    user: UserEditModel;

    branches = [
        {id: 1, name: 'Primary'},
        {id: 2, name: 'Lahore'},
        {id: 3, name: 'Karachi'},
    ];


    departmentList = [
        {id: 1, name: 'Dermatolgy'},
        {id: 2, name: 'Plasticsurgery'},
        {id: 3, name: 'Dental'},
        {id: 4, name: 'DkinCareLaser'},
        {id: 5, name: 'MessageClinic'},

    ];

    servicesList = [{id: 1, name: 'Consultation'},
        {id: 2, name: 'Consultation-Complimentary'},
        {id: 3, name: 'BotoxAxilla'},
        {id: 4, name: 'BotoxFullFace'},
        {id: 5, name: 'BotoxUpperFace'},
        {id: 6, name: 'GummySmile'},
        {id: 7, name: 'MesotherapyForHair'},
        {id: 8, name: 'TesoyalKiss1ml'},
        {id: 9, name: 'RestylanceVital1ml'},
        {id: 10, name: 'RestylanceVital1ml'},
        {id: 10, name: 'RestyLaneSubLidocain2ml'},
    ];

    RestrictBranch = [
        {id: 1, name: 'PrimaryOffice'},
        {id: 2, name: 'LahoreOffice'},
        {id: 3, name: 'KarachiOffice'},
    ];

    workingDays = [
        {id: 1, name: 'Monday'},
        {id: 2, name: 'Tuesday'},
        {id: 3, name: 'Wednesday'},
        {id: 4, name: 'Thurseday'},
        {id: 5, name: 'Friday'},
        {id: 6, name: 'Satureday'},
        {id: 7, name: 'Sunday'},

    ];
    doctorsList = [
        {id: 1, name: 'Dr.Zahra'},
        {id: 2, name: 'Dr.kobler'},
        {id: 3, name: 'Dr.Nimra'},
    ];

    matches: any = [];

    constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestsService,
                private fb: FormBuilder, private notificationService: NotificationService
        , private amazingTimePickerService?: AmazingTimePickerService) {

    }

    date = new FormControl(new Date());
    ngOnInit() {
        this.createUserForm();
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            console.log(this.id);
        });
        this.patchData();
        //console.log('value:'+this.userForm.controls['firstName'].value);

    }

    createUserForm() {
        this.userForm = this.fb.group({
                'firstName': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
                'lastName': [null],
                'userName': [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.pattern('^[a-z0-9_-]{4,15}$')])],
                'password': [null],
                'confirmPassword': [null],
                'homePhone': [null, Validators.required],
                'cellPhone': [null],
                'primaryBranch': [null, Validators.required],
                'interval': [null, Validators.required],
                'email': [null, Validators.compose([Validators.required, Validators.email])],
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
                'departmentControl': [null],
                'servicesControl': [null],
                'shift1': [null, Validators.required],
                'secondShiftFromTimeControl': [null],
                workingDaysContorl: new FormGroup({
                    //  new FormControl(''),
                    sunday: new FormControl(''),
                    monday: new FormControl(''),
                    tuesday: new FormControl(''),
                    thurseday: new FormControl(''),
                    friday: new FormControl(''),
                    satureday: new FormControl(''),
                    wednesday: new FormControl(''),

                    /*   new FormControl('Wednesday'),
                       new FormControl('Thurseday'),
                       new FormControl('Friday'),
                       new FormControl('Satureday'),*/
                })

            }
        )
    }


    get workingDaysContorl(): FormArray {
        return this.userForm.get('workingDaysContorl') as FormArray;
    }

    public patchData() {
        if (this.id) {
            this.requestService.findById(AppConstants.FETCH_USER_BY_ID + this.id).subscribe(
                user => {
                    //  this.id = user.id;
                     this.userForm.patchValue({
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
                        primaryBranch: user.primaryBranch,
                        interval: user.profile.checkUpInterval,
                        shift1: user.dutyShift.dutyTimmingShift1,
                        shift2: user.dutyShift.dutyTimmingShift2,
                        secondShiftFromTimeControl: user.dutyShift.secondShiftFromTime,
                        vacation: user.vacation.status,
                        //dateFrom:user.vacation.startDate,
                        dateFrom: '',


                    });
                    this.userForm.controls['workingDaysContorl'].patchValue({

                        sunday: this.checkAvailabilty('sunday', user.profile.workingDays),
                        monday: this.checkAvailabilty('monday', user.profile.workingDays),
                        tuesday: this.checkAvailabilty('tuesday', user.profile.workingDays),
                        thurseday: this.checkAvailabilty('thurseday', user.profile.workingDays),
                        friday: this.checkAvailabilty('friday', user.profile.workingDays),
                        satureday: this.checkAvailabilty('satureday', user.profile.workingDays),
                        wednesday: this.checkAvailabilty('wednesday', user.profile.workingDays)

                    })
                    this.secondShiftFromTime = user.dutyShift.startTimeShift2,
                        this.secondShiftToTime = user.dutyShift.endTimeShift2,
                        this.firstShiftFromTime = user.dutyShift.startTimeShift1,
                        this.firstShiftToTime = user.dutyShift.endTimeShift1,
                        this.userForm.controls['dateFrom'].setValue(new Date(8/17/2019));
                        this.date.setValue(new Date(2017,12,12));
                    console.log(user.profile.workingDays);
                }, (error: any) => {
                    //console.log(error.json());
                    this.error = error.error.error_description;

                });
        }

    }


    checkAvailabilty(value: string, array: string[]) {
        return array.indexOf(value) > -1;
    }


    setPreset() {
        this.workingDaysContorl.patchValue(['LA', 'MTV']);
    }

    addUser(data: any) {
        console.log('i am invalid');
        let days = this.userForm.get('workingDaysContorl');
        let daysOfDoctor: { key: string, value: boolean }[] = []
        daysOfDoctor.push({key: 'sunday', value: days.get('sunday').value});
        daysOfDoctor.push({key: 'monday', value: days.get('monday').value});
        daysOfDoctor.push({key: 'tuesday', value: days.get('tuesday').value});
        daysOfDoctor.push({key: 'thurseday', value: days.get('thurseday').value});
        daysOfDoctor.push({key: 'friday', value: days.get('friday').value});
        daysOfDoctor.push({key: 'satureday', value: days.get('satureday').value});
        if (this.userForm.valid) {
            var result = daysOfDoctor.filter(function (obj) {

                return obj.value == true;
            });
            console.log('res :' + result);
            for (var key in result) {
                this.selectedWorkingDays.push(result[key].key);

            }

            console.log('i am doctor submit' + data);
            let doctor = new User({
                userType: 'doctor',
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
                selectedRestrictBranch: data.selectedRestrictBranch,
                otherDoctorDashBoard: data.otherDoctorDashBoard,
                active: data.active,

                selectedDoctors: data.selectedDoctors,
                selectedDepartment: data.selectedDepartment,
                interval: data.interval,
                selectedServices: data.selectedServices,
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
            });
            this.makeService(doctor);
            console.log('sel days' + this.selectedWorkingDays);
            this.workingDays.length = 0;

        } else {
            console.log('i am else');
            this.validateAllFormFields(this.userForm);
        }
    }


    makeService(user: any) {

        this.requestService.putRequest('/user/edit/' + this.id, user).subscribe(
            (response: Response) => {
                if (response['responseStatus'] === 'SUCCESS') {
                    console.log('saved00')
                    this.responseUser = response['responseData'];
                    this.notificationService.success('User has been updated Successfully')
                    this.router.navigate(['/dashboard/setting/staff']);
                }
            }
            , (error: any) => {
                //console.log(error.json());
                this.error = error.error.error_description;
                this.notificationService.error('ERROR', 'User is not Updated');
            });
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

    getBranch(value: any) {
        if (value) {
            this.userForm.controls['primaryBranch'].setValue(value);
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

    checkupIntervalMethod(value: any) {
        if (value) {
            this.userForm.controls['interval'].setValue(value);
        }
    }

    selectDepartment(event: any, item: any) {
        console.log(event.checked);

        if (event.target.checked) {

            this.selectedDepartment.push(item);
        }
        else {
            let updateItem = this.selectedDepartment.find(this.findIndexToUpdate, item.name);

            let index = this.selectedDepartment.indexOf(updateItem);

            this.selectedDepartment.splice(index, 1);
        }
        console.log(this.selectedDepartment);

    }

    selectWorkingDays(event: any, item: any) {
        console.log(event.checked);

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

    selectRestrictBranch(event: any, item: any) {
        console.log(item);
        if (event.target.checked) {
            this.selectedRestrictBranch.push(item);
        }
        else {
            let updateItem = this.selectedRestrictBranch.find(this.findIndexToUpdate, item.name);

            let index = this.selectedRestrictBranch.indexOf(updateItem);

            this.selectedRestrictBranch.splice(index, 1);
        }
        console.log(this.selectedRestrictBranch);

    }


    findIndexToUpdate(type: any) {
        return type.name === this;
    }

    selectServices(event: any, item: any) {

        console.log(event.checked);
        console.log(item);
        if (event.target.checked) {
            this.selectedServices.push(item);
        }
        else {
            let updateItem = this.selectedServices.find(this.findIndexToUpdate, item.name);

            let index = this.selectedServices.indexOf(updateItem);

            this.selectedServices.splice(index, 1);

        }
        console.log(this.selectedServices);

    }

    cancel() {
        this.router.navigate(['/dashboard/setting/staff']);
    }

}