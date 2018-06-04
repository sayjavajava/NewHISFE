import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {RequestsService} from '../../../services/requests.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../../services/notification.service';
import {MatDialog} from '@angular/material';
import {ConformationDialogService} from '../../../services/ConformationDialogService';
import {AppConstants} from '../../../utils/app.constants';
import {SearchBranch} from '../../../model/searchBranch';

@Component({
    selector: 'branch-component',
    templateUrl: '../../../templates/dashboard/setting/branch.template.html',
})
export class BranchComponent implements OnInit {
    nextPage: number;
    prePage: number;
    currPage: number;
    pages: number[] = [];
    data: any[];
    departments: any[];
    error: any;
    pageNo: number = 0;
    branch: any;
    selectedRole: string = 'SUPER_ADMIN';
    branchesList: any = [];

    searchForm: FormGroup;
    responseUser: any[];


    constructor(private requestService: RequestsService, private router: Router,
                private notificationService: NotificationService, private fb: FormBuilder,
                private matDialog: MatDialog, private confirmationDialogService: ConformationDialogService
    ) {
        this.allBranches();
        this.allDepartments();

    }

    ngOnInit() {
        this.searchForm = this.fb.group({
            'branch': [null],
            'department': [null],
            'description': [null]
        });
        this.getBranchFromServer(0);
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

    allDepartments() {
        this.requestService.getRequest(AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                        this.departments = response['responseData'];
                        console.log('dept' + this.departments);
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })

    }

    searchData(data: SearchBranch) {
        if (this.searchForm.valid) {
            let searchUserObj = new SearchBranch(data.branch, data.department, data.description);

            this.requestService.getRequest(AppConstants.BRANCH_SEARCH + this.pageNo + '?branch=' + data.branch + '&department=' + data.department)
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
        } else {
            this.validateAllFormFields(this.searchForm)
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

    isFieldValid(field: string) {
        return !this.searchForm.get(field).valid && this.searchForm.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }

    getBranchFromServer(page: number) {
        if (page > 0) {
            page = page;

        }
        this.requestService.getRequest(
            AppConstants.FETCH_ALL_BRANCHES_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BRANCH_SUC_01') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                        let data = response['responseData']['data'];

                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                }
            );
    }

    deleteBranch(id: number) {
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
    }

    updateBranch(id: any) {
        this.router.navigate(['/dashboard/setting/branch/edit/', id]);
    }

    getSelectedBranch(value: any) {
        if (value) {
            this.searchForm.controls['branch'].setValue(value);
        }
    }

    getSelectedDepartment(value: any) {
        if (value) {
            console.log('sel:'+ value);
            this.searchForm.controls['department'].setValue(value);
        }
    }

}
