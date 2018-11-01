import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {ICDCodeModel} from '../../../model/ICDCodeModel';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AppConstants} from '../../../utils/app.constants';
import {Organization} from "../../../model/organization";

@Component({
    selector: 'icd-code-component',
    templateUrl: '../../../templates/dashboard/setting/admin-profile.template.html',
})
export class AdminProfileComponent implements OnInit {
    accountForm: FormGroup;
    id:number;
    data:any;
    organization : Organization = new Organization();
    ngOnInit(): void {
        this.createAccountForm();
    }

    constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestsService,private fb: FormBuilder,private notificationService: NotificationService) {
   //  this.getOrganizationAccount();
     this.getOrganizationFromServer(0);
    }
    createAccountForm() {
        this.accountForm = this.fb.group({
            'firstName': [null],
            'userId':[null],
            'lastName': [null],
            'userName': [null],
            'userEmail': [null,Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
            'cellPhone': [null],
            'userAddress': [null],
            'formName': ['ACCOUNT'],
            'homePhone': [null],
        })
    }
    saveAccount(data: FormData) {
        var self = this;
        if(this.accountForm.valid) {
            //account url can be change
            this.requestService.putRequest(AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
                .subscribe(function (response) {
                    if (response['responseCode'] === 'ORG_SUC_03') {
                        self.notificationService.success('Organization has been Update Successfully');
                    }
                }, function (error) {
                    self.notificationService.error('ERROR', 'Organization is not Updated');

                });
        }else {
            this.validateAllFormFields(this.accountForm);
        }

    }
    getOrganizationAccount() {
        this.requestService.getRequest(AppConstants.FETCH_ORG_ACCOUNT_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_04') {
                        this.organization = response['responseData'];
                    }
                },
                (error: any) => {

                })
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
    getOrganizationFromServer(page: number)
    {
        if (page > 0) {
            page = page;

        }
        this.requestService.getRequest(
            AppConstants.FETCH_ALL_ORGANIZATION_URL_PAGINATED + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_02') {
                        this.data = response['responseData']['data'];
                        this.id = this.data[0].id;
                        this.getOrganizationAccount();
                    }
                },
                (error: any) => {

                }
            );
    }

}
