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
    private role: string;
    id: number;
    responseUser: any[];
    error: any;
    proForm: FormGroup;
    generalForm: FormGroup;
    accountForm: FormGroup
    timezoneList: any = [];
    branchesList: any = [];
    defaultBranch: string = 'primaryBranch';


    ngOnInit() {
        this.createProfileForm();
        this.createGenralForm();
        this.createAccountForm();

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

        });
        this.patchData();
        this.proForm.controls['companyName'].disable();
        this.accountForm.controls['userName'].disable();

    }

    createProfileForm() {
        this.proForm = this.fb.group({
                'companyEmail': [null],
                'companyName': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
                'officePhone': [null, Validators.compose([Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
                'specialty': [null],
                'fax': [null],
                'formName': ['PROFILE'],
                'address': [null],
                'website': [null, Validators.pattern('^(http:\\/\\/|https:\\/\\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}.?([a-z]+)?$')],
            }
        );
    }

    createGenralForm() {
        this.generalForm = this.fb.group({
            'defaultBranch': [null],
            'durationOfExam': [null],
            'durationFollowUp': [null],
            'prefixSerialPatient': [null],
            'prefixSerialUser': [null],
            'formName': ['GENERAL'],
            'prefixSerialDepartment': [null],
            'prefixSerialAppointment': [null],
            'prefixSerialInvoices': [null],
        });
    }

    createAccountForm() {
        this.accountForm = this.fb.group({
            'firstName': [null],
            'lastName': [null],
            'userName': [null],
            'userEmail': [null],
            'cellPhone': [null],
            'userAddress': [null],
            'formName': ['ACCOUNT'],
            'homePhone': [null],
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
        this.requestService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchesList = response['responseData'];
                        if (this.branchesList.length > 1) {
                            this.branchesList.splice(this.branchesList.indexOf({name: this.defaultBranch}), 1);
                        }
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
                    this.proForm.patchValue({
                        userName: organization.userName,
                        companyEmail: organization.companyEmail,
                        fax: organization.fax,
                        countryName: organization.countryName,
                        homePhone: organization.homePhone,
                        officePhone: organization.officePhone,
                        address: organization.address,
                        website: organization.website,
                        companyName: organization.companyName,
                        specialty: organization.specialty

                    });
                    this.generalForm.patchValue({
                        defaultBranch: organization.defaultBranch,
                        durationOfExam: organization.durationOfExam,
                        durationFollowUp: organization.durationFollowUp
                    })
                }, (error: any) => {
                    //console.log(error.json());
                    this.error = error.error.error_description;

                });
        }

    }

    isFieldValid(field: string) {
        return !this.proForm.get(field).valid && this.proForm.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }

    prepareSaveOrganization(): Organization {
        const formModel = this.proForm.value;
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

    addOrganization(data: any, value?: string) {
        console.log('i m in');
        if (this.proForm.valid) {
            let orgObject = this.prepareSaveOrganization();
            if (value === 'done') {
                var self = this;
                this.requestService.putRequest(AppConstants.UPDATE_ORGANIZATION_URL + this.id, orgObject)
                    .subscribe(function (response) {
                        if (response['responseCode'] === 'ORG_SUC_03') {
                            self.notificationService.success('Organization has been Update Successfully');
                        }
                    }, function (error) {
                        self.notificationService.error('ERROR', 'Organization is not Updated');

                    });
            }

        } else {
            this.validateAllFormFields(this.proForm);
        }
    }

    saveProfile(data: FormData) {
        var self = this;
        this.requestService.putRequest(AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
            .subscribe(function (response) {
                if (response['responseCode'] === 'ORG_SUC_03') {
                    self.notificationService.success('Organization has been Update Successfully');
                }
            }, function (error) {
                self.notificationService.error('ERROR', 'Organization is not Updated');

            });
    }

    saveGeneralSettings(data: FormData) {
        var self = this;
        this.requestService.putRequest(AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
            .subscribe(function (response) {
                if (response['responseCode'] === 'ORG_SUC_03') {
                    self.notificationService.success('Organization has been Update Successfully');
                }
            }, function (error) {
                self.notificationService.error('ERROR', 'Organization is not Updated');

            });

    }

    saveAccount(data: FormData) {
        var self = this;
        //account url can be change
        this.requestService.putRequest(AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
            .subscribe(function (response) {
                if (response['responseCode'] === 'ORG_SUC_03') {
                    self.notificationService.success('Organization has been Update Successfully');
                }
            }, function (error) {
                self.notificationService.error('ERROR', 'Organization is not Updated');

            });


    }

    getSelectedTimezone(value: any) {
        if (value) {
            this.proForm.controls['timeZone'].setValue(value);
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