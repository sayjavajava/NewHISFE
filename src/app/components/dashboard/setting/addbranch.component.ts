import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RequestsService} from '../../../services/requests.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../../services/notification.service';
import {Branch} from '../../../model/Branch';
import {AmazingTimePickerService} from 'amazing-time-picker';
import {AppConstants} from '../../../utils/app.constants';
import {ExamRooms} from '../../../model/ExamRooms';

@Component({
    selector: 'addbranch-component',
    templateUrl: '../../../templates/dashboard/setting/addbranch.template.html',
})
export class AddBranchComponent implements OnInit {


    error: any;
    branchForm: FormGroup;
    examRooms: any = [];
    officeHoursStart: string;
    officeHoursEnd: string;
    userSelected: string = 'doctor';
    pDoctor: any = [];
    branchesList: any = [];
    responseBranch: Branch;
    billingForm: FormGroup;
    scheduleForm: FormGroup;


    constructor(private router: Router, private requestService: RequestsService,
                private fb: FormBuilder, private notificationService: NotificationService,
                private amazingTimePickerService?: AmazingTimePickerService) {
        this.requestService.getRequest(AppConstants.USER_BY_ROLE + '?name=' + this.userSelected)
            .subscribe(
                (response: Response) => {
                    if (response['responseStatus'] === 'SUCCESS') {
                        let data = response['responseData'];
                        let userNameData = data;
                        this.pDoctor = response['responseData'];
                        console.log(this.pDoctor);
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                });
        this.allBranches();

    }

    ngOnInit() {
        this.createBranchMendatoryForm();
        console.log('user found:' + this.pDoctor.length);
        this.createBranchForm();
        this.createScheduleForm();


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
            'noOfExamRooms': [null],
            'examRooms': this.fb.array([this.createExamRoom()]),
        })
    }

    prepareSaveBranch(): Branch {
        const formModel = this.branchForm.value;
        const billingModel = this.billingForm.value;
        const scheduleModel = this.scheduleForm.value;

        const secretLairsDeepCopy: ExamRooms = formModel.examRooms.map(
            (examRooms: ExamRooms) => Object.assign({}, examRooms)
        );

        // return new `Hero` object containing a combination of original hero value(s)
        // and deep copies of changed form model values
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

                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })
    }

    addBranch(data: any, value: string) {

        if (this.branchForm.valid) {
            let branchObject = this.prepareSaveBranch();
            if (value === 'done') {
                this.requestService.postRequest(AppConstants.ADD_BRANCH, branchObject)
                    .subscribe(function (response) {
                        if (data['responseCode'] === 'BRANCH_ADD_SUCCESS_01') {
                            this.notificationService.success('Branch is Created Successfully');

                        }
                    }, function (error) {
                        this.notificationService.error('ERROR', 'Branch is not Created');
                    });
            }

        } else {
            this.validateAllFormFields(this.branchForm);
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
            'examName': '',
            'allowOnlineScheduling': '',
        });
    }

    addFields(no: number): void {
        this.examRooms = this.branchForm.get('examRooms') as FormArray;
        for (var i = 0; i < no; i++) {
            this.examRooms.push(this.createExamRoom());
        }
    }

    deleteField(index: number) {
        this.examRooms = this.branchForm.get('examRooms') as FormArray;
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

    getCountry(value: any) {
        if (value) {
            this.branchForm.controls['country'].setValue(value);
        }
    }

    getState(value: any) {
        if (value) {
            this.branchForm.controls['state'].setValue(value);
        }
    }

    getBillingBranch(value: any) {
        if (value) {
            this.billingForm.controls['billingBranch'].setValue(value);
        }
    }

    getZipCode(value: any) {
        if (value) {
            this.branchForm.controls['zipCode'].setValue(value);
        }
    }

    getNoOfExamRooms(value: any) {
        if (value) {
            // this.examRooms=[];
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
