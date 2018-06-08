import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from './PasswordValidation';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {User} from '../../../model/User';
import {Receptionist} from '../../../model/Receptionist';
import {UserEditModel} from '../../../model/UserEditModel';
import {AppConstants} from '../../../utils/app.constants';


@Component({
    selector: 'addcashier-component',
    templateUrl: '../../../templates/dashboard/setting/update-receptionist.template.html',
})
export class UpdateReceptionistComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestsService,
                private fb: FormBuilder, private notificationService: NotificationService) {
        this.allBranches();
        this.allDoctors();
    }
    private sub: any;
    id: number;
    responseUser: any[];
    branchesList:any=[];
    primaryDoctor:any=[];
    error: any;
    defaultBranch:string='primaryBranch';
    userSelected:string='doctor';
    userForm: FormGroup;
    receptionist: UserEditModel;
    selectedVisitBranches:any=[];

    ngOnInit() {
        this.createUserForm();
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            console.log(this.id);
        });
        this.patchData();
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
    allBranches() {
        this.requestService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL+'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchesList = response['responseData'];
                     //  this.branchesList.indexOf({name :this.defaultBranch}) === -1 ? this.branchesList.push({name :this.defaultBranch}) :console.log('already there');
                     if(this.branchesList.length >1 ){
                      this.removeBranch();
                     }
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
                'interval': [null],
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
                'managePatientInvoices': '',
                'managePatientRecords': '',
                'departmentControl': [null],
                'servicesControl': [null],
                'shift1': [null],
                'nurseDutyWithDoctor': [null],
                'changeUser': [null]
            },
            {
                validator: CustomValidators.Match('password', 'confirmPassword')
            }
        )
    }


    public patchData() {
        if (this.id) {
            this.requestService.findById(AppConstants.FETCH_USER_BY_ID + this.id).subscribe(
                receptionist => {
                    //  this.id = user.id;
                    this.userForm.patchValue({
                        firstName: receptionist.profile.firstName,
                        lastName: receptionist.profile.lastName,
                        email: receptionist.email,
                        homePhone: receptionist.profile.homePhone,
                        cellPhone: receptionist.profile.cellPhone,
                        sendBillingReport: receptionist.profile.sendBillingReport,
                        userName: receptionist.userName,
                        active: receptionist.profile.active,
                        accountExpiry: receptionist.profile.accountExpiry,
                        otherDashboard: receptionist.profile.otherDashboard,
                        useReceptDashboard: receptionist.profile.useReceptDashBoard,
                        otherDoctorDashBoard: receptionist.profile.otherDoctorDashBoard,
                        allowDiscount:receptionist.profile.allowDiscount,
                        primaryBranch: receptionist.branch.name,
                    });

                }, (error: any) => {
                    //console.log(error.json());
                    this.error = error.error.error_description;

                });
        }

    }
    removeBranch(){
        this.branchesList.forEach( (item: any, index :any) => {
            if(item === this.defaultBranch) this.branchesList.splice(index,1);
        });
    }

    addCashier(data: any) {
        console.log('i am invalid');
        if (this.userForm.valid) {

            console.log('i am cashier submit' + data);
            let cashier = new User({
                userType: 'receptionist',
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

            });

            this.makeService(cashier);

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
    findIndexToUpdate(type: any) {
        return type.name === this;
    }
    getSelectedDashboard(value: any) {
        if (value) {
            this.userForm.controls['otherDashboard'].setValue(value);

        }
    }
    cancel(){
        this.router.navigate(['/dashboard/setting/staff']);
    }
    getSelectedBranch(value: any) {
        console.log(value);
        if (value === undefined) {
            console.log('i am esss');
            this.userForm.controls['primaryBranch'].setValue('primaryBranch');
        }
        else {
            console.log('i am too' + value);
            this.userForm.controls['primaryBranch'].setValue(value);}

    }

}