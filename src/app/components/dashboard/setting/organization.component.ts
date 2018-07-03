import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ConformationDialogService} from '../../../services/ConformationDialogService';
import {RequestsService} from '../../../services/requests.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../../services/notification.service';
import {AppConstants} from '../../../utils/app.constants';
import {MatDialog} from '@angular/material';

@Component({

     selector: 'organization',
     templateUrl: '../../../templates/dashboard/setting/organization.template.html',
})
export class OrganizationComponent implements OnInit {
    nextPage: number;
    prePage: number;
    currPage: number;
    pages: number[] = [];
    data: any[];
    error: any;
    pageNo: number = 0;
    organization:any;
    selectedRole:string='SUPER_ADMIN';
    branchesList:any=[];

    searchForm: FormGroup;
    responseUser: any[];


    constructor(private requestService: RequestsService, private router: Router,
                private notificationService: NotificationService,private fb:FormBuilder,
                private matDialog:MatDialog,private confirmationDialogService:ConformationDialogService
    ) {

    }

    ngOnInit() {
        this.searchForm = this.fb.group({
            'organization': [null],
        });

        this.getOrganizationFromServer(0);
    }


    /*searchData(data: SearchBranch) {
        console.log('I am in ');
        if (this.searchForm.valid) {
            console.log('Valid ');
            let searchUserObj = new SearchBranch(data.branch, data.department, data.description);

            this.requestService.getRequest(AppConstants.BRANCH_SEARCH + this.pageNo+'?branch='+data.branch +'&department='+data.department +'&description='+data.description)
                .subscribe(
                    (response: Response) => {

                        if (response['responseCode'] === 'BRANCH_SUC_01') {
                            this.nextPage = response['responseData']['nextPage'];
                            this.prePage = response['responseData']['prePage'];
                            this.currPage = response['responseData']['currPage'];
                            this.pages = response['responseData']['pages'];
                            this.data = response['responseData']['data'];

                        }
                    },
                    (error: any) => {

                        this.error = error.error.error;
                    })
        }else {this.validateAllFormFields(this.searchForm)}
    }

*/

    validateAllFormFields(formGroup: FormGroup)
    {
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

    isFieldValid(field: string)
    {
        return !this.searchForm.get(field).valid && this.searchForm.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
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
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                        console.log(this.data);
                        }
                },
                (error: any) => {

                }
            );
    }

    /*deleteBranch(id: number) {
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(res => {
                if (id) {
                    this.requestService.deleteRequest(AppConstants.DELETE_BRANCH_URI + id).subscribe((data: Response) => {
                        if (data['responseCode'] === 'BRANCH_DEL_SUC_01') {
                            this.notificationService.success('User has been Deleted Successfully');
                            this.getBranchFromServer(this.currPage);

                        }
                    }, error => {
                        this.notificationService.error('ERROR', 'User Unable to Delete ');

                    });
                }
            });
    }*/

    updateOrganization(id: any) {
        this.router.navigate(['/dashboard/setting/organization/edit/', id]);
    }

    getSelectedBranch(value: any) {
        if (value) {
            this.searchForm.controls['branch'].setValue(value);
        }
    }

}
