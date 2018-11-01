import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


import {ActivatedRoute, Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {User} from '../../../model/User';
import {UserEditModel} from '../../../model/UserEditModel';
import {AmazingTimePickerService} from 'amazing-time-picker';
import {AppConstants} from '../../../utils/app.constants';
import {HISUtilService} from '../../../services/his-util.service';
import {Subscription} from "rxjs/Subscription";
import {DataService} from "../../../services/DataService";

@Component({
    selector: 'adddoctor-component',
    templateUrl: '../../../templates/dashboard/setting/updatedoctor.template.html',
})
export class UpdatedoctorComponent implements OnInit,OnDestroy {
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
    selectedDepartment: any = [];
    selectedServices: any = [];
    doctorServices: any = [];
    selectedTime: string;
    secondShiftFromTime: string;
    secondShiftToTime: string;
    firstShiftFromTime: string;
    firstShiftToTime: string;
    selectedWorkingDays: any = [];
    selectedVisitBranches: any = [];
    selectedDoctors: any = [];
    departmentList:any=[];
    selectedUser:string='doctor';
    error: string;
    responseUser: any[];
    private sub: any;
    id: number;
    userSelected:string='doctor';
    user: UserEditModel;
    defaultBranch:string ='primaryBranch';
    matches: any = [];
    branchesList:any=[];
    servicesList:any=[];
    primaryDoctor:any=[];
    staffBranches: any [];
    pBranch :string;
    workingDays = [
        {label: 'Monday',value:'Monday'},
        {label: 'Tuesday',value:'Tuesday'},
        {label: 'Wednesday',value:'Wednesday'},
        {label: 'Thursday',value:'Thursday'},
        {label: 'Friday',value:'Friday'},
        {label: 'Saturday',value:'Saturday'},
        {label: 'Sunday',value:'Sunday'},

    ];
    private subscription :Subscription;
    userId:number;
    intervalList:any;
    constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestsService,private dataService:DataService
                ,private fb: FormBuilder, private notificationService: NotificationService
        , private amazingTimePickerService?: AmazingTimePickerService) {
           this.allBranches();
           //this.allServices();
           this.allDepartments();
           this.allDoctors();
    }

    date = new FormControl(new Date());
    ngOnInit() {
        this.createUserForm();
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.subscription=  this.dataService.currentStaffServiceId.subscribe(x=>{this.userId=x})
        this.patchData();
        this.intervalList = [
            {label: '5', value: 5},
            {label: '10', value: 10},
            {label: '15', value: 15},
            {label: '20', value: 20},
            {label: '25', value: 25},
            {label: '30', value: 30},
            {label: '35', value: 35},
            {label: '40', value: 40},
            {label: '45', value: 45},
            {label: '50', value: 50},
        ];

        }

    allBranches() {
        this.requestService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL+'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchesList = response['responseData'];
                        if(this.branchesList.length >1){
                            this.removeBranch();
                        }
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
                        this.primaryDoctor = response['responseData'];
                        }
                },
                (error: any) => {
                    this.error = error.error.error;
                });

    }
    removeBranch(){
        this.branchesList.forEach( (item: any, index :any) => {
            if(item === this.defaultBranch) this.branchesList.splice(index,1);
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

    allServices() {
        this.requestService.getRequest(AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'MED_SER_SUC_01') {
                        this.servicesList = response['responseData'];
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
                'homePhone': [null],
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
                'shift1': [null],//, Validators.required],
                'secondShiftFromTimeControl': [null],
                workingDaysContorl: new FormGroup({
                    //  new FormControl(''),
                    sunday: new FormControl(''),
                    monday: new FormControl(''),
                    tuesday: new FormControl(''),
                    thursday: new FormControl(''),
                    friday: new FormControl(''),
                    saturday: new FormControl(''),
                    wednesday: new FormControl(''),

                })

            }
        )
    }

    get workingDaysContorl(): FormArray {
        return this.userForm.get('workingDaysContorl') as FormArray;
    }

    public patchData() {
        if (this.id) {
            this.requestService.findByIdAndType(AppConstants.FETCH_USER_BY_ID + this.id,'DOCTOR').subscribe(
                user => {
                    //  this.id = user.id;
                    this.userForm.patchValue({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        homePhone: user.homePhone,
                        cellPhone: user.cellPhone,
                        sendBillingReport: user.sendBillingReport,
                        userName: user.userName,
                        active: user.active,

                        otherDashboard: user.otherDashboard,
                        useReceptDashboard: user.useReceptDashBoard,
                        otherDoctorDashBoard: user.otherDoctorDashBoard,
                        primaryBranch: user.primaryBranchId,
                        interval: user.checkUpInterval,
                        // shift1: user.dutyShift.dutyTimmingShift1,
                        // shift2: user.dutyShift.dutyTimmingShift2,
                        //  secondShiftFromTimeControl: user.dutyShift.secondShiftFromTime,
                        vacation: user.vacation,
                    });
                    let docDeptId = user.docDepartmentId;
                    //this.servicesList = this.getDeptServices(docDeptId);

                    if (user.expiryDate != null) {
                        this.userForm.controls['accountExpiry'].setValue(new Date(user.expiryDate));
                    }
                    //let shifts: any [] = user.dutyShifts;
                    if (user.dutyShifts!=null && user.dutyShifts.length > 0) {
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
                    }

                    for(let k in this.departmentList){
                        if(this.departmentList[k].id == docDeptId){
                            this.departmentList[k].selected = true;
                            this.selectedDepartment[0] = docDeptId;
                            break;
                        }
                    }
                    this.staffBranches = user.staffBranches;
                    for(let key in this.branchesList){
                        for(let k in this.staffBranches){
                            if(this.staffBranches[k].id == this.branchesList[key].id){
                                this.branchesList[key].checked = true;
                                this.selectedVisitBranches.push(this.staffBranches[k].id);
                                break;
                            }
                        }
                    }
                    this.doctorServices = user.doctorMedicalSrvcList;

                    this.requestService.getRequest(AppConstants.FETCH_DEPT_MEDICAL_SERVICES_URL+docDeptId)
                        .subscribe(
                            (response: Response) => {
                                if (response['responseCode'] === 'MED_SER_SUC_01') {
                                    this.servicesList = response['responseData'];
                                    for(let key in this.servicesList){
                                        for(let k in this.doctorServices){
                                            if(this.doctorServices[k].id == this.servicesList[key].id){
                                                this.servicesList[key].checked = true;
                                                this.selectedServices.push(this.doctorServices[k].id);
                                                break;
                                            }
                                        }
                                    }
                                }else{
                                    this.servicesList = [];
                                }
                            },
                            (error: any) => {
                                this.servicesList = [];
                                this.error = error.error.error;
                            })

                    /*for(let key in this.servicesList){
                        for(let k in this.doctorServices){
                            if(this.doctorServices[k].id == this.servicesList[key].id){
                                this.servicesList[key].checked = true;
                                this.selectedServices.push(this.doctorServices[k].id);
                                break;
                            }
                        }
                    }*/
                     if(user.vacation){
                     this.userForm.controls['dateFrom'].setValue(new Date(user.vacationFrom));
                     this.userForm.controls['dateTo'].setValue(new Date(user.vacationTo));}
                     this.userForm.controls['workingDaysContorl'].patchValue({
                        sunday: this.checkAvailabilty('sunday', user.workingDays),
                        monday: this.checkAvailabilty('monday', user.workingDays),
                        tuesday: this.checkAvailabilty('tuesday', user.workingDays),
                        thursday: this.checkAvailabilty('thursday', user.workingDays),
                        friday: this.checkAvailabilty('friday', user.workingDays),
                        saturday: this.checkAvailabilty('saturday', user.workingDays),
                        wednesday: this.checkAvailabilty('wednesday', user.workingDays)

                    })
                        /*this.secondShiftFromTime = user.dutyShifts[0].startTime,
                        this.secondShiftToTime = user.dutyShifts[0].endTime,
                        this.firstShiftFromTime = user.dutyShifts[1].startTime,
                        this.firstShiftToTime = user.dutyShifts[1].endTime*/
                }, (error: any) => {
                    //console.log(error.json());
                    this.error = error.error.error_description;

                });
        }

    }

    getDeptServices(deptId: any) {
        this.requestService.getRequest(AppConstants.FETCH_DEPT_MEDICAL_SERVICES_URL+deptId)
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

    getShiftFromTime(time: string){
        var timeArray = time.split(':');
        var shift = Number(timeArray[0]) <=12 ? 'first':'second';
     }

    checkAvailabilty(value: string, array: string[]) {
        return array.indexOf(value) > -1;
    }


    setPreset() {
        this.workingDaysContorl.patchValue(['LA', 'MTV']);
    }

    addUser(data: any) {
        let days = this.userForm.get('workingDaysContorl');
        let daysOfDoctor: { key: string, value: boolean }[] = []
        daysOfDoctor.push({key: 'sunday', value: days.get('sunday').value});
        daysOfDoctor.push({key: 'monday', value: days.get('monday').value});
        daysOfDoctor.push({key: 'tuesday', value: days.get('tuesday').value});
        daysOfDoctor.push({key: 'wednesday', value: days.get('wednesday').value});
        daysOfDoctor.push({key: 'thursday', value: days.get('thursday').value});
        daysOfDoctor.push({key: 'friday', value: days.get('friday').value});
        daysOfDoctor.push({key: 'saturday', value: days.get('saturday').value});
        if (this.userForm.valid) {
            var result = daysOfDoctor.filter(function (obj) {
                return obj.value == true;
            });
            for (var key in result) {
                this.selectedWorkingDays.push(result[key].key);
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
                    active: data.active,
                    selectedDoctors: this.selectedDoctors,
                    selectedDepartment: this.selectedDepartment,
                    selectedServices: this.selectedServices,
                    interval: data.interval,
                    selectedVisitBranches: this.selectedVisitBranches,
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

        } else {
            this.validateAllFormFields(this.userForm);
        }
    }

    selectDoctorDepartment(itemId: any) {
        console.log("Doc Dept:"+itemId);
        if (itemId) {
            this.selectedDepartment[0] = itemId;
        }
    }

    makeService(user: any) {
        this.requestService.putRequest('/user/edit/' + this.userId, user).subscribe(
            (response: Response) => {
                if (response['responseStatus'] === 'SUCCESS') {

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

    selectWorkingDays(event: any, item: any) {
        if (event.target.checked) {
            this.selectedWorkingDays.push(item.name);
        }
        else {
            let updateItem = this.selectedWorkingDays.find(this.findIndexToUpdate, item.name);
            let index = this.selectedWorkingDays.indexOf(updateItem);
            this.selectedWorkingDays.splice(index, 1);
        }
    }

    selectRestrictBranch(event: any, item: any) {
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

    getSelectedDashboard(value: any) {
        if (value) {
            this.userForm.controls['otherDashboard'].setValue(value);
        }
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

    cancel() {
        this.router.navigate(['/dashboard/setting/staff']);
    }

}