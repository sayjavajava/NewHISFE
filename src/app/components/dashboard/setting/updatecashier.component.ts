import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from './PasswordValidation';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {User} from '../../../model/User';
import {UserEditModel} from '../../../model/UserEditModel';
import {AppConstants} from '../../../utils/app.constants';
import {HISUtilService} from '../../../services/his-util.service';
import {Subscription} from "rxjs/Subscription";
import {DataService} from "../../../services/DataService";
import {UserTypeEnum} from "../../../enums/user-type-enum";


@Component({
    selector: 'addcashier-component',
    templateUrl: '../../../templates/dashboard/setting/updatecashier.template.html',
})
export class UpdateCashierComponent implements OnInit, OnDestroy {


    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestsService, private dataService: DataService,
                private fb: FormBuilder, private notificationService: NotificationService) {
        this.allBranches();
        this.allDoctors();
    }

    private sub: any;
    id: number;
    responseUser: any[];
    branchesList: any = [];
    visitingBranches: any [];
    selectedDoctorDashboard: any[];
    primaryDoctor: any = [];
    error: any;
    defaultBranch: string = 'primaryBranch';
    userSelected: string = 'doctor';
    userForm: FormGroup;
    cashier: UserEditModel;
    selectedVisitBranches: any = [];
    staffBranches: any[];
    selectedDoctors: any [];
    doctorsList: any;
    private subscription: Subscription;
    userId: number;

    ngOnInit() {
        this.createUserForm();
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.subscription= this.dataService.currentStaffServiceId.subscribe(x => {
            this.userId = x
        })

        this.patchData();
    }

    allDoctors() {
        this.requestService.getRequest(
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

    allBranches() {
        this.requestService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchesList = response['responseData'];
                        this.visitingBranches = response['responseData'];
                        //   this.branchesList.indexOf({name :this.defaultBranch}) === -1 ? this.branchesList.push({name :this.defaultBranch}) :console.log('already there');
                        /*if(this.branchesList.length > 1 ){
                            this.removeBranch();
                        }*/
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
                'userName': [null],
                'password': [null],
                'confirmPassword': [null],
                'homePhone': [null],
                'cellPhone': [null],
                'primaryBranch': [null, Validators.required],
                'interval': [null],
                'email': [null],
                'restrictBranch': [null],
                'allowDiscount': [null],
                'allowDiscountCheck': [null],
                'canAccessPatientRecord': '',
                'otherDashboard': '',
                'sendBillingReport': '',
                'useReceptDashboard': '',
                'shift2': '',
                'vacation': '',
                'otherDoctorDashBoard': '',
                'hidePatientPhoneNumber': '',
                'accountExpiry': [null],
                'active': '',
                'dateFrom': [null],
                'dateTo': [null],
                'receivePayment':[null],
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
            this.requestService.findByIdAndType(AppConstants.FETCH_USER_BY_ID + this.id, 'CASHIER').subscribe(
                cashier => {
                    this.userForm.patchValue({
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
                        receivePayment :cashier.receivePayment,
                        allowDiscount :cashier.allowDiscount,
                        allowDiscountCheck :cashier.allowDiscountCheck,
                        hidePatientPhoneNumber :cashier.hidePatientPhoneNumber,
                        canAccessPatientRecord:cashier.canAccessPatientRecord,

                    });
                    this.staffBranches = cashier.staffBranches;
                    //this.selectedDoctors = cashier.dutyWithDoctors;
                    if(cashier.permittedDoctorDashboard){
                        this.selectedDoctorDashboard = [...cashier.permittedDoctorDashboard]
                    }
                    this.requestService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
                        .subscribe(
                            (response: Response) => {
                                if (response['responseCode'] === 'BR_SUC_01') {
                                    this.branchesList = response['responseData'];

                                    this.staffBranches = this.staffBranches.filter(br => br.id != this.userForm.controls['primaryBranch'].value);
                                    this.visitingBranches = this.visitingBranches.filter(br => br.id != this.userForm.controls['primaryBranch'].value);

                                    for (let key in this.visitingBranches) {
                                        for (let k in this.staffBranches) {
                                            if (this.staffBranches[k].id == this.visitingBranches[key].id) {
                                                this.visitingBranches[key].checked = true;
                                                this.selectedVisitBranches.push(this.staffBranches[k].id);
                                                break;
                                            }
                                        }
                                    }
                                }
                            },
                            (error: any) => {
                                this.error = error.error.error;
                            });
                }, (error: any) => {
                    this.error = error.error.error_description;

                });
        }

    }

    removeBranch() {
        this.branchesList.forEach((item: any, index: any) => {
            if (item === this.defaultBranch) this.branchesList.splice(index, 1);
        });
    }

    addCashier(data: any) {
        if (this.userForm.valid) {
            let cashier = new User({
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
                allowDiscountCheck :data.allowDiscountCheck,
                canAccessPatientRecord :data.canAccessPatientRecord,
                receivePayment:data.receivePayment,
                primaryBranch: data.primaryBranch,
                email: data.email,
                selectedVisitBranches: this.selectedVisitBranches,
                selectedDoctorDashboard: this.selectedDoctorDashboard,
                otherDoctorDashBoard: data.otherDoctorDashBoard,
                active: data.active,
                allowDiscount: data.allowDiscount,
                hidePatientPhoneNumber :data.hidePatientPhoneNumber
            });
            this.makeService(cashier);
        } else {
            this.validateAllFormFields(this.userForm);
        }
    }

    makeService(user: any) {
        this.requestService.putRequest('/user/edit/' + this.userId, user).subscribe(
            (response: Response) => {
                if (response['responseCode'] === 'USER_UPDATE_SUC_01') {
                    this.responseUser = response['responseData'];
                    this.notificationService.success('User has been updated Successfully')
                    this.router.navigate(['/dashboard/setting/staff']);
                }
            }
            , (error: any) => {
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

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({onlySelf: true});
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    selectVisitBranches(event: any, item: any) {
        if (event.target.checked) {
            this.selectedVisitBranches.push(item.id);
        }
        else {
            let updateItem = this.selectedVisitBranches.find(this.findIndexToUpdate, item.id);
            let index = this.selectedVisitBranches.indexOf(updateItem);
            this.selectedVisitBranches.splice(index, 1);
        }
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

    getSelectedBranch(event: any) {
        if (event && event.target.value) {
            this.userForm.controls['primaryBranch'].setValue(event.target.value);
        }
        this.visitingBranches = this.branchesList;
        this.visitingBranches = this.visitingBranches.filter(br => br.id != event.target.value);
    }

}