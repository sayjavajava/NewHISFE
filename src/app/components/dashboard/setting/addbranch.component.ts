import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RequestsService} from '../../../services/requests.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../../services/notification.service';
import {Branch} from '../../../model/branch';
import {AmazingTimePickerService} from 'amazing-time-picker';
import {AppConstants} from '../../../utils/app.constants';
import {ExamRooms} from '../../../model/ExamRooms';
import {Organization} from "../../../model/organization";

@Component({
    selector: 'addbranch-component',
    templateUrl: '../../../templates/dashboard/setting/addbranch.template.html',
})
export class AddBranchComponent implements OnInit {


    error: any;
    branchForm: FormGroup;
    examRooms: any = [];
    officeHoursStart: string = '07:00';
    officeHoursEnd: string = '17:00';
    userSelected: string = 'doctor';
    organization: Organization  = new Organization();
    branchesList: any = [];
    // defaultDoctor:string='primarydoctor';
    defaultBranch: string = 'primaryBranch';
    billingForm: FormGroup;
    scheduleForm: FormGroup;
    noOfRoom: number = 1;
    cities: any = [];
    noOfRoomsList:any;
    countryList: Array<any> = [
        {name: 'Germany', label:'Germany',value:'Germany', cities: ['Duesseldorf', 'Leinfelden-Echterdingen', 'Eschborn']},
        {name: 'Pakistan',label:'Pakistan',value:'Pakistan', cities: ['Punjab', 'Sindh', 'Balochistan', 'KPK']},
        {name: 'USA',label:'USA',value:'USA', cities: ['California', 'Florida', 'Texas', 'New York', 'Hawai', 'Pennsylvania']},
        {name: 'Canada',label:'Caanda',value:'Canada', cities: ['Alberta', 'Ontario']},
        {name: 'Saudi Arab',label:'Saudi Arab',value:'Saudi Arab', cities: ['Riyadh', 'Jeddah', 'Dammam']},
        {name: 'China',label:'China',value:'China', cities: ['Hainan', 'Sichuan', 'Hunan', 'Henan']},
    ];
    flowList:any;
    flow:any;


    constructor(private router: Router, private requestService: RequestsService,
                private fb: FormBuilder, private notificationService: NotificationService,
                private amazingTimePickerService?: AmazingTimePickerService) {
        this.requestService.getRequest(AppConstants.BRANCH_ORGANIZATION)
            .subscribe(
                (response: Response) => {
                    if (response['responseStatus'] === 'SUCCESS') {
                        this.organization = response['responseData'];

                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                });
        this.allBranches();
    }

    ngOnInit() {
        this.createBranchMendatoryForm();
        this.createBranchForm();
        this.createScheduleForm();
        this.branchForm.controls['companyName'].disable();
        this.noOfRoomsList = [
            { label: '1', value: 1 },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
            { label: '4', value: 4 },
            { label: '5', value: 5 },
            { label: '6', value: 6 },
            { label: '7', value: 7 },
            { label: '8', value: 8 },
            { label: '9', value: 9 },
            { label: '10', value: 10 },
            { label: '15', value: 15 },
            { label: '20', value: 20 },
            { label: '25', value: 25 },
            { label: '30', value: 30 },
            { label: '35', value: 35 },
            { label: '40', value: 40 },
        ];
        this.flowList = [
            { label: 'RCND', value: 'RCND' },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
            { label: '4', value: 4 },

        ];

    }

    createBranchForm() {
        this.billingForm = this.fb.group({
            'billingBranch': [null],
            'billingName': [null],
            'billingTaxID': [null],
        })
    }

    createScheduleForm() {
        this.scheduleForm = this.fb.group({
            'showBranchOnline': '',
            'allowOnlineSchedulingInBranch': '',
        })
    }

    createBranchMendatoryForm() {
        this.branchForm = this.fb.group({
            'companyName' : [null],
            'flow':[null],
            'branchName': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
            'country': [null],
            'state': [null],
            'city': [null],
            'primaryDoctor': [null],
            'zipCode': [null],
            'address': [null],
            'officePhone': [null],
            'fax': [null],
            'formattedAddress': [null],
            'officeHoursStart': [null, Validators.required],
            'officeHoursEnd': [null, Validators.required],
            'noOfExamRooms': [null, Validators.required],
            'examRooms': this.fb.array([this.createExamRoom()]),
        })
        this.examRooms.push(this.createExamRoom());
    }

    /*    removeDoctor(){
            this.pDoctor.forEach( (item: any, index :any) => {
                if(item.userName === this.defaultDoctor) this.pDoctor.splice(index,1);
            });
        }*/
    getSelectedStates(countryObj: any) {
        const  country = countryObj.value;
        this.cities = this.countryList.find((x: any) => x.name == country).cities;
        this.branchForm.controls['country'].setValue(country);
    }

    removeBranch() {
        this.branchesList.forEach((item: any, index: any) => {
            if (item === this.defaultBranch) this.branchesList.splice(index, 1);
        });
    }

    prepareSaveBranch(): Branch {
        const formModel = this.branchForm.value;
        const billingModel = this.billingForm.value;
        const scheduleModel = this.scheduleForm.value;

        const secretLairsDeepCopy: ExamRooms = formModel.examRooms.map(
            (examRooms: ExamRooms) => Object.assign({}, examRooms)
        );

        const saveBranchModel: Branch = {
            branchName: formModel.branchName,
            officeHoursStart: formModel.officeHoursStart,
            officeHoursEnd: formModel.officeHoursEnd,
            noOfExamRooms: formModel.noOfExamRooms,
            state: formModel.state,
            city: formModel.city,
            country: formModel.country,
            primaryDoctor: formModel.primaryDoctor,
            zipCode: formModel.zipCode,
            address: formModel.address,
            officePhone: formModel.officePhone,
            fax: formModel.fax,
            formattedAddress: formModel.formattedAddress,
            examRooms: secretLairsDeepCopy,
            billingBranch: billingModel.billingBranch,
            billingName: billingModel.billingName,
            billingTaxID: billingModel.billingTaxID,

            showBranchOnline: scheduleModel.showBranchOnline,
            allowOnlineSchedulingInBranch: scheduleModel.allowOnlineSchedulingInBranch

        };
        return saveBranchModel;
    }

    allBranches() {
        this.requestService.getRequest(AppConstants.BRANCHES_NAME)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BRANCH_SUC_01') {
                        this.branchesList = response['responseData'];
                        if (this.branchesList.length > 1) {
                            this.removeBranch();
                        }

                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })
    }

    addBranch(data: FormData) {
        if (this.branchForm.valid) {
            // let branchObject = this.prepareSaveBranch();
            this.requestService.postRequest(AppConstants.ADD_BRANCH, data)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'BRANCH_ADD_SUCCESS_01') {
                            this.notificationService.success('Branch is Created Successfully');
                            this.router.navigate(['/dashboard/setting/branch'])
                        }
                        if (response['responseCode'] === 'BR_ALREADY_EXISTS_01') {
                            this.notificationService.warn('Branch already Exists');
                            //  this.router.navigate(['/dashboard/setting/branch'])
                        }
                    }, function (error) {
                        this.notificationService.error('ERROR', 'Branch is not Created');
                    });


        } else {
            this.validateAllFormFields(this.branchForm);
            if (this.examRooms.length != 0) {
                /*let examRoomLen = this.examRooms.length;
                for (var i = 0; i < examRoomLen; i++) {
                   console.log(this.examRooms.controls(i).controls['roomName'].value);
                }*/
                this.notificationService.error("Fill examroom Properly");
            }
        }
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

    createExamRoom(): FormGroup {
        return this.fb.group({
            'roomName': [null, Validators.required],
            'allowOnlineScheduling': '',
        });
    }

    addFields(no: number): void {
        this.removeAllFields();
        this.examRooms = this.branchForm.get('examRooms') as FormArray;
        for (var i = 0; i < no; i++) {
            this.examRooms.push(this.createExamRoom());
        }
    }

    removeAllFields() {
        this.examRooms = this.branchForm.get('examRooms') as FormArray;
        let examRoomLen = this.examRooms.length;
        for (var i = 0; i < examRoomLen; i++) {
            this.examRooms.removeAt(0);
        }
    }

    deleteField(index: number) {
        this.examRooms = this.branchForm.get('examRooms') as FormArray;
        this.noOfRoom = this.noOfRoom - 1;
        this.examRooms.removeAt(index);
    }

    getOfficeHoursStart() {
        const amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(time => {
            this.officeHoursStart = time;
            this.branchForm.controls['officeHoursStart'].setValue(time);
        })
    }

    getOfficeHoursEnd() {
        const amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(time => {
            this.officeHoursEnd = time;
            this.branchForm.controls['officeHoursEnd'].setValue(time);

        })
    }

    getDoctor(value: any) {
        if (value) {
            this.branchForm.controls['primaryDoctor'].setValue(value);
        }
    }


    getState(value: any) {
        if (value) {
            this.branchForm.controls['state'].setValue(value);
        }
    }

    getZipCode(value: any) {
        if (value) {
            this.branchForm.controls['zipCode'].setValue(value);
        }
    }

    getNoOfExamRooms(room: any) {
        const value = room.value;
        if (value) {
            this.noOfRoom = value;
            this.branchForm.controls['noOfExamRooms'].setValue(value);
            //  this.noOfExamRooms=value;
            this.addFields(value);
        }
    }

    getSelectedBranch(value: any) {
        if (value) {
            this.billingForm.controls['billingBranch'].setValue(value);
        }
    }
}
