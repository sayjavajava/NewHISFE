import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserEditModel} from '../../../model/UserEditModel';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {User} from '../../../model/User';
import {AmazingTimePickerService} from 'amazing-time-picker';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConstants} from '../../../utils/app.constants';
import {HISUtilService} from '../../../services/his-util.service';
import {UserTypeEnum} from "../../../enums/user-type-enum";
import {forEach} from "@angular/router/src/utils/collection";
import {Subscription} from "rxjs/Subscription";
import {DataService} from "../../../services/DataService";

@Component({
    selector: 'addnurse-component',
    templateUrl: '../../../templates/dashboard/setting/updatenurse.template.html',
})
export class UpdateNurseComponent implements OnInit,OnDestroy {
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

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
    departmentFlag : boolean =false;
    selectedDepartment: any = [];

    staffDepartment: any = [];

    selectedServices: any = [];
    selectedTime: string;
    secondShiftFromTime: string;
    secondShiftToTime: string;
    firstShiftFromTime: string;
    firstShiftToTime: string;
    selectedVacationWeek: any = [];
    selectedVisitBranches: any = [];
    testBranches:any;
    selectedDoctors: any = [];
    branchesList: any = [];
    staffBranches: any [];

    doctorsList: any = [];
    dutyWithDoctors:any=[];

    departmentList: any = [];
    error: string;
    defaultBranch:string='primaryBranch';
    responseUser: any[];
    private sub: any;
    id: number;
    userSelected: string = 'doctor';
    user: UserEditModel;
    private subscription :Subscription;
    userId:number;
    departmentError: string = 'Select atleast one Department';

    filterBranches: any [];
    constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestsService,
                private fb: FormBuilder, private notificationService: NotificationService,private dataService: DataService,
                private amazingTimePickerService?: AmazingTimePickerService) {
        this.allBranches();
        this.allDepartments();
        this.allDoctors();
    }

    ngOnInit() {
        this.createUserForm();
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.subscription=  this.dataService.currentStaffServiceId.subscribe(x=>{this.userId=x})
        this.patchData();
    }
    allBranches() {
        this.requestService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchesList = response['responseData'];
                        this.filterBranches = response['responseData'];
                        //   this.branchesList.indexOf({name :this.defaultBranch}) === -1 ? this.branchesList.push({name :this.defaultBranch}) :console.log('already there');
                        /*if(this.branchesList.length > 1){
                            this.removeBranch();
                         }*/
                    }

                },
                (error: any) => {
                    this.error = error.error.error;
                })
    }

    /*allDoctors() {
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

    }*/

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
    removeBranch(){
        this.branchesList.forEach( (item: any, index :any) => {
            if(item === this.defaultBranch) this.branchesList.splice(index,1);
        });
    }


    createUserForm() {
        this.userForm = this.fb.group({
                'firstName': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
                'lastName': [null],
                'userName': [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.pattern('^[a-z0-9_-]{4,15}$')])],
                'homePhone': [null],
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
                'nurseDutyWithDoctor': [null],

            }
        )
    }

    public patchData() {
        if (this.id) {
            this.requestService.findByIdAndType(AppConstants.FETCH_USER_BY_ID + this.id,'NURSE').subscribe(
                user => {

                    //  this.id = user.id;
                    this.userForm.patchValue({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        homePhone: user.homePhone,
                        cellPhone: user.cellPhone,
                        userName: user.userName,
                        active: user.active,
                        accountExpiry: user.accountExpiry,
                        managePatientRecords: user.managePatientRecords,
                        managePatientInvoices: user.managePatientInvoices,
                        primaryBranch:user.primaryBranchId,

                    });

                    if (user.expiryDate != null) {
                        this.userForm.controls['accountExpiry'].setValue(new Date(user.expiryDate));
                    }
                   user.nurseDepartmentList.forEach((x:any)=>{
                            this.selectedDepartment.push(x.id);
                        }),
                    //for selected
                    this.staffBranches = user.staffBranches;
                    this.selectedDoctors = user.dutyWithDoctors;

                   /* for(let key in this.branchesList){
                        for(let k in this.staffBranches){
                            if(this.staffBranches[k].id == this.branchesList[key].id){
                                this.branchesList[key].checked = true;
                                this.selectedVisitBranches.push(this.staffBranches[k].id);
                                break;
                            }
                        }
                    }*/
                    for(let key in this.doctorsList){
                        for(let k in this.selectedDoctors){
                            if(this.selectedDoctors[k].id == this.doctorsList[key].id){
                                this.doctorsList[key].checked = true;
                                this.dutyWithDoctors.push(this.selectedDoctors[k].id );
                                break;
                            }
                        }
                    }
                    let nurseDept: any [] = user.nurseDepartmentList;
                    for(let key in this.departmentList){
                        for(let k in nurseDept){
                            if(nurseDept[k].id == this.departmentList[key].id){
                                this.departmentList[key].checked = true;
                                this.selectedDepartment.push(nurseDept[k].id);
                                break;
                            }
                        }
                    };
                    //selectedVisitBranches
                    this.selectedVisitBranches.length=0;
                    user.staffBranches.forEach((x:any)=>{
                        console.log('logging...'+ x.id);
                       this.selectedVisitBranches.push(x.id);
                    })


                }, (error: any) => {
                    //console.log(error.json());
                    this.error = error.error.error_description;

                });
        }

    }

    addUser(data: any) {
        if (this.userForm.valid) {
            if (this.selectedDepartment.length != 0) {
                console.log('fine')
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

            } else { this.departmentFlag =true;
                console.log('select deprat err')
                this.userForm.setErrors({notValid:true});
            }
        }        else {
            console.log('err')
            this.validateAllFormFields(this.userForm);
        }
    }


    makeService(user: any) {

        this.requestService.putRequest('/user/edit/' + this.userId, user).subscribe(
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

    selectDepartment(eventObj: any, item?: any) {
        this.departmentFlag = false;
        let event = eventObj.value;
        /*if (event) {
            this.selectedDepartment.push(item.value);
        }
        else {
            let updateItem = this.selectedDepartment.find(this.findIndexToUpdate, item.value);
            let index = this.selectedDepartment.indexOf(updateItem);
            this.selectedDepartment.splice(index, 1);
        }*/
      //  this.selectedVisitBranches2.forEach((x:any)=>console.log('visiting..' + x))

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
    }

    dutyWithDoctor(eventObj: any) {
        let eventVal = eventObj.value;
        this.selectedDoctors.push(eventVal);
    }


    findIndexToUpdate(type: any) {
        return type.name === this;
    }


    getSelectedDashboard(value: any) {
        if (value) {
            this.userForm.controls['otherDashboard'].setValue(value);

        }
    }
    getSelectedBranch(value: any) {
        console.log(value);
        //this.filterBranches = this.branchesList;
        /*this.filterBranches =this.branchesList.filter(function (val:any) {
                                 return val.id != value;
                             });
        this.selectedVisitBranches.splice(this.selectedVisitBranches.indexOf(value), 1);*/
        console.log("done:" + this.filterBranches);
        if (value === undefined) {
            this.userForm.controls['primaryBranch'].setValue('primaryBranch');
        }
        else {
            this.userForm.controls['primaryBranch'].setValue(value);}

    }

    cancel() {
        this.router.navigate(['/dashboard/setting/staff']);
    }


}
