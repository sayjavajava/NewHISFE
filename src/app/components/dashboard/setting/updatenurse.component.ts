import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserEditModel} from '../../../model/UserEditModel';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {User} from '../../../model/User';
import {AmazingTimePickerService} from 'amazing-time-picker';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConstants} from '../../../utils/app.constants';

@Component({
    selector: 'addnurse-component',
    templateUrl: '../../../templates/dashboard/setting/updatenurse.template.html',
})
export class UpdateNurseComponent implements OnInit {

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
    dutyWithDoctors:any=[];
    selectedTime: string;
    secondShiftFromTime: string;
    secondShiftToTime: string;
    firstShiftFromTime: string;
    firstShiftToTime: string;
    selectedVacationWeek: any = [];
    selectedVisitBranches: any = [];
    selectedDoctors: any = [];
    branchesList: any = [];
    primaryDoctor: any = [];
    departmentList: any = [];
    error: string;
    responseUser: any[];
    private sub: any;
    id: number;
    userSelected: string = 'doctor';
    user: UserEditModel;

    constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestsService,
                private fb: FormBuilder, private notificationService: NotificationService
        ,private amazingTimePickerService?: AmazingTimePickerService) {
        this.allBranches();
        this.allDepartments();
        this.allDoctors();
    }

    ngOnInit() {
        this.createUserForm();
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            console.log(this.id);
        });
        this.patchData();
    }
    allBranches() {
        this.requestService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchesList = response['responseData'];
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })
    }

    allDoctors() {
        this.requestService.getRequest(AppConstants.USER_BY_ROLE + '?name=' + this.userSelected)
            .subscribe(
                (response: Response) => {
                    if (response['responseStatus'] === 'SUCCESS') {
                        let data = response['responseData'];
                        let userNameData = data;
                        this.primaryDoctor = response['responseData'];

                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                });

    }

    allDepartments() {
        this.requestService.getRequest(AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI)
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
                'email': [null, Validators.compose([Validators.required, Validators.email])],
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
                'nurseDutyWithDoctor': [null, Validators.required],

            }
        )
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
                        managePatientRecords: user.profile.managePatientRecords,
                        managePatientInvoices: user.profile.managePatientInvoices,
                        primaryBranch:user.branch.name,
                        interval: user.profile.check
                    });

                }, (error: any) => {
                    //console.log(error.json());
                    this.error = error.error.error_description;

                });
        }

    }

    addUser(data: any) {
        console.log('i am invalid');
        if (this.userForm.valid) {
            let nurse = new User({
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

    selectDepartment(event: any, item: any) {
        console.log(event.checked);

        if (event.target.checked) {

            this.selectedDepartment.push(item.id);
        }
        else {
            let updateItem = this.selectedDepartment.find(this.findIndexToUpdate, item.id);

            let index = this.selectedDepartment.indexOf(updateItem);

            this.selectedDepartment.splice(index, 1);
        }
        console.log(this.selectedDepartment);

    }

    selectVisitBranches(event: any, item: any) {
        console.log(item);
        if (event.target.checked) {
            this.selectedVisitBranches.push(item.id);
        }
        else {
            let updateItem = this.selectedVisitBranches.find(this.findIndexToUpdate, item.id);

            let index = this.selectedVisitBranches.indexOf(updateItem);

            this.selectedVisitBranches.splice(index, 1);
        }
        console.log(this.selectedVisitBranches);

    }

    dutyWithDoctor(event: any, item: any) {
        console.log(item);
        if (event.target.checked) {
            this.dutyWithDoctors.push(item.id);
        }
        else {
            let updateItem = this.dutyWithDoctors.find(this.findIndexToUpdate, item.id);

            let index = this.dutyWithDoctors.indexOf(updateItem);

            this.dutyWithDoctors.splice(index, 1);
        }
        console.log(this.dutyWithDoctors);
    }


    findIndexToUpdate(type: any) {
        return type.name === this;
    }


    getSelectedDashboard(value: any) {
        if (value) {
            this.userForm.controls['otherDashboard'].setValue(value);

        }
    }

    cancel() {
        this.router.navigate(['/dashboard/setting/staff']);
    }


}
