import { Component, OnInit } from '@angular/core';
import {AppConstants} from '../../../utils/app.constants';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../services/notification.service';
import {AmazingTimePickerService} from 'amazing-time-picker';
import {RequestsService} from '../../../services/requests.service';
import {CustomValidators} from './PasswordValidation';
import {Organization} from '../../../model/organization';

@Component({
  selector: 'addorganization-component',
  templateUrl: '../../../templates/dashboard/setting/addorganization.template.html',
})
export class AddOrganizationComponent implements OnInit {
    branchesList:any=[];
    timezoneList:any=[];
    orgForm:FormGroup;
    generalForm:FormGroup;

    constructor(private router: Router, private  fb: FormBuilder, private requestService: RequestsService, private notificationService: NotificationService,
                private amazingTimePickerService?: AmazingTimePickerService) {
                this.allBranches();
                this.allTimezone();
    }

  ngOnInit() {
        this.createProfileForm();
        this.createGenralForm();
  }
    createProfileForm() {
        this.orgForm = this.fb.group({
                'firstName': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
                'lastName': [null],
                'userName': [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.pattern('^[a-z0-9_-]{4,15}$')])],
                'email': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
                'companyName': [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9_-]{4,15}$')])],
                'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
                'confirmPassword': [null, Validators.compose([Validators.required])],
                'homePhone': [null, Validators.compose([Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
                'cellPhone': [null, Validators.compose([ Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
                'officePhone': [null, Validators.compose([ Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
                'timeZone': [null],
                'specialty': [null],
                'appointmentSerial': [null, Validators.compose([Validators.required])],
                'website': [null, Validators.pattern('^(http:\\/\\/|https:\\/\\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}.?([a-z]+)?$')],


            },
            {
                validator: CustomValidators.Match('password', 'confirmPassword')
            }
        )
    }
    createGenralForm() {
        this.generalForm = this.fb.group({
            'defaultBranch':[null],
            'durationOfExam': [null],
            'followUpExam': [null],
        })
    }


    getSelectedBranch(value: any) {
        if (value) {
            this.generalForm.controls['defaultBranch'].setValue(value);
        }
    }
    getSelectedTimezone(value: any) {
        if (value) {
            this.orgForm.controls['timeZone'].setValue(value);
            console.log(value);
        }
    }

    allBranches() {
        this.requestService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchesList = response['responseData'];
                        }
                },
                (error: any) => {

                })
    }

    allTimezone() {
        this.requestService.getRequest(AppConstants.TIMEZONE_FETCH_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'TZ_SUC_01') {
                        this.timezoneList = response['responseData'];
                    }
                },
                (error: any) => {

                })
    }
    addOrganization(data: any, value: string) {

        if (this.orgForm.valid) {
            let orgObject = this.prepareSaveOrganization();
             if (value === 'done') {
                var self =this;
                this.requestService.postRequest(AppConstants.ORGANIZATION_CREATE_URL, orgObject)
                    .subscribe(function (response) {
                        if (response['responseCode'] === 'ORG_SUC_01') {
                            self.notificationService.success('Organization has been Created Successfully');
                            }
                    }, function (error) {
                        self.notificationService.error('ERROR', 'Organization is not Created');

                    });
                }

        } else {
            this.validateAllFormFields(this.orgForm);
        }
    }

    prepareSaveOrganization(): Organization {
        const formModel = this.orgForm.value;
        const generalModel = this.generalForm.value;
        const saveBranchModel: Organization = {
            firstName: formModel.firstName,
            lastName: formModel.lastName,
            userName: formModel.userName,
            email:formModel.email,
            companyName: formModel.companyName,
            password: formModel.password,
            confirmPassword: formModel.confirmPassword,
            officePhone: formModel.officePhone,
            homePhone: formModel.homePhone,
            cellPhone: formModel.cellPhone,
            appointmentSerial: formModel.appointmentSerial,
            website: formModel.website,
            timeZone: formModel.timeZone,
            specialty: formModel.specialty,

            defaultBranch: generalModel.defaultBranch,
            durationOfExam: generalModel.durationOfExam,
            followUpExam: generalModel.followUpExam,

        };
        return saveBranchModel;
    }
    getDurationOfExam(value: any) {
        if (value) {
            this.generalForm.controls['durationOfExam'].setValue(value);
        }
    }
    isFieldValid(field: string) {
        return !this.orgForm.get(field).valid && this.orgForm.get(field).touched;
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
    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }

}
