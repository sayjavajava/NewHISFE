import {Component, OnInit} from '@angular/core';
import {AppConstants} from '../../../utils/app.constants';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../services/notification.service';
import {AmazingTimePickerService} from 'amazing-time-picker';
import {RequestsService} from '../../../services/requests.service';
import {CustomValidators} from './PasswordValidation';
import {Organization} from '../../../model/organization';

@Component({
    selector: 'add-organization-component',
    templateUrl: '../../../templates/dashboard/setting/add-organization.template.html',
})
export class AddOrganizationComponent implements OnInit {
    branchesList: any = [];
    timezoneList: any = [];
    orgForm: FormGroup;
    generalForm: FormGroup;
    defaultBranch: string = 'primaryBranch';

    constructor(private router: Router, private  fb: FormBuilder,
                private requestService: RequestsService,
                private notificationService: NotificationService,
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
                'firstName': [null, Validators.compose([Validators.required])],
                'lastName': [null],
                'userName': [null, Validators.compose([Validators.required])],
                'email': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
                'companyName': [null, Validators.compose([Validators.required])],
                'password': [null, Validators.compose([Validators.required])],
                'confirmPassword': [null, Validators.compose([Validators.required])],
                'homePhone': [null, Validators.compose([Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
                'cellPhone': [null, Validators.compose([Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
                'officePhone': [null, Validators.compose([Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
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
            'defaultBranch': [null],
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
            //console.log(value);
        }
    }

    allBranches() {
        this.requestService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchesList = response['responseData'];
                        if (this.branchesList.length > 1) {
                            this.removeBranch();
                        }
                    }

                },
                (error: any) => {

                })
    }

    removeBranch() {
        this.branchesList.forEach((item: any, index: any) => {
            if (item.name === this.defaultBranch) this.branchesList.splice(index, 1);
        });
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
                var that = this;
                this.requestService.postRequest(AppConstants.ORGANIZATION_CREATE_URL, orgObject)
                    .subscribe(function (response) {
                        if (response['responseCode'] === 'ORG_SUC_01') {
                            that.notificationService.success(response['responseMessage'], 'Organization');
                        } else {
                            that.notificationService.error(response['responseMessage'], 'Organization');
                        }
                    }, function (error) {
                        that.notificationService.error(error.error, 'Unable to create Organization.');

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
            email: formModel.email,
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
