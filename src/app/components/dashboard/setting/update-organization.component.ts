import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';

import {Organization} from '../../../model/organization';
import {AppConstants} from '../../../utils/app.constants';


@Component({
    selector: 'addcashier-component',
    templateUrl: '../../../templates/dashboard/setting/update-organization.template.html',
})
export class UpdateOrganizationComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestsService,
                private fb: FormBuilder, private notificationService: NotificationService) {
        this.allTimezone();
        this.allBranches();
    }

    private sub: any;
    id: number;
    responseUser: any[];
    error: any;
    orgForm: FormGroup;
    generalForm: FormGroup;
    timezoneList: any = [];
    branchesList: any = [];

    //organization :Organization;
    ngOnInit() {
        this.createProfileForm();
        this.createGenralForm();

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

        });
        this.patchData();
        this.orgForm.controls['userName'].disable();
        this.orgForm.controls['email'].disable();

    }

    createProfileForm() {
        this.orgForm = this.fb.group({
                'userName': [null],
                'email': [null],
                'companyName': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
                'homePhone': [null, Validators.compose([Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
                'cellPhone': [null, Validators.compose([Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
                'officePhone':[null, Validators.compose([Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
                'timeZone': [null],
                'specialty': [null],
                'appointmentSerial': [null, Validators.compose([Validators.required])],
                'website': [null, Validators.pattern('^(http:\\/\\/|https:\\/\\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}.?([a-z]+)?$')],
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

    public patchData() {
        if (this.id) {

            this.requestService.findById(AppConstants.FETCH_ORGANIZATION_BY_ID + this.id).subscribe(
                organization => {
                    //  this.id = user.id;
                    this.orgForm.patchValue({
                        userName: organization.userName,
                        email:organization.user.email,
                        countryName: organization.countryName,
                        homePhone: organization.homePhone,
                        cellPhone: organization.cellPhone,
                        officePhone: organization.officePhone,
                        appointmentSerial: organization.appointmentSerial,
                        timeZone: organization.timezone,
                        website: organization.website,
                        companyName: organization.companyName,
                        specialty: organization.speciality.name

                    });
                    this.generalForm.patchValue({
                        defaultBranch: organization.defaultBranch,
                        durationOfExam: organization.durationOfExam,
                        followUpExam: organization.followUpExam
                    })
                }, (error: any) => {
                    //console.log(error.json());
                    this.error = error.error.error_description;

                });
        }

    }

    isFieldValid(field: string) {
        return !this.orgForm.get(field).valid && this.orgForm.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
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

    addOrganization(data: any, value?:string) {
        console.log('i m in');
        if (this.orgForm.valid) {
            let orgObject = this.prepareSaveOrganization();
            if (value === 'done') {
                var self = this;
                this.requestService.putRequest(AppConstants.UPDATE_ORGANIZATION_URL+this.id, orgObject)
                    .subscribe(function (response) {
                        if (response['responseCode'] === 'ORG_SUC_03') {
                            self.notificationService.success('Organization has been Update Successfully');
                        }
                    }, function (error) {
                        self.notificationService.error('ERROR', 'Organization is not Updated');

                    });
            }

        } else {
            this.validateAllFormFields(this.orgForm);
        }
    }
    getSelectedTimezone(value: any) {
        if (value) {
            this.orgForm.controls['timeZone'].setValue(value);
            console.log(value);
        }
    }
    getSelectedBranch(value: any) {
        if (value) {
            this.generalForm.controls['defaultBranch'].setValue(value);
        }
    }
    getDurationOfExam(value: any) {
        if (value) {
            this.generalForm.controls['durationOfExam'].setValue(value);
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

    cancel() {

        this.router.navigate(['/dashboard/setting/organization']);
    }

}