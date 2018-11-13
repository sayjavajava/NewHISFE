import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";
import {SearchUser} from "../../../model/SearchUser";
import {AppConstants} from "../../../utils/app.constants";
import {MatDialog} from "@angular/material";
import {ConformationDialogService} from "../../../services/ConformationDialogService";
import {HISUtilService} from '../../../services/his-util.service';
import {DataService} from "../../../services/DataService";

@Component({
    selector: 'staff-component',
    templateUrl: '../../../templates/dashboard/setting/staff.template.html',
})
export class StaffComponent implements OnInit {
    userTypes: string[] = ['Doctor', 'Nurse', 'Receptionist', 'Cashier', 'SuperAdmin'];
    default: string = '';
    nextPage: number;
    prePage: number;
    currPage: number;
    pages: number[] = [];
    data: any[];
    error: any;
    pageNo: number = 0;
    branch: any;
    selectedType: string;
    allDBRoles: any[];
    cols:any;

    responseUser: any[];
    allStaffTypes = [
        {name: 'NURSE',label : 'NURSE' ,value :'NURSE'},
        {name: 'DOCTOR',label : 'DOCTOR',value :'DOCTOR'},
        {name: 'RECEPTIONIST',label : 'RECEPTIONIST',value : 'RECEPTIONIST'},
        {name: 'CASHIER',label : 'CASHIER',value : 'CASHIER'}

    ];


    constructor(private requestService: RequestsService, private router: Router,
                private notificationService: NotificationService, private fb: FormBuilder,private dataService: DataService
                ,private matDialog: MatDialog, private confirmationDialogService: ConformationDialogService) {
    }

    searchForm: FormGroup;

    userNameError: string = 'name is required';

    ngOnInit() {
        this.searchForm = this.fb.group({
            'userType': [null],
            'name': [null]
        });
        this.searchForm.controls['userType'].setValue(this.default, {onlySelf: true});
        this.getUserFromServer();
        this.cols = [
            { field: 'firstName', header: 'Name' },
            { field: 'primaryBranch', header: 'Primary Branch' },
            { field: 'username', header: 'User Name' },
            { field: 'email', header: 'Email' },
            { field: 'Action', header: 'Action' }
        ];
    }

    searchData(data: SearchUser) {
        if (this.searchForm.valid) {
            console.log('Valid ');
            let searchUserObj = new SearchUser(data.name, data.userType);
            this.requestService.getRequest(AppConstants.USER_SEARCH + this.pageNo + '?name=' + data.name + '&userType=' + this.selectedType)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USER_SUC_01') {
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

    getUserFromServer() {
       /* if (page > 0) {
            page = page;

        }*/
        this.requestService.getRequest(
        //    AppConstants.FETCH_ALL_USERS + page)
                 AppConstants.FETCH_ALL_USERS)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'USER_SUC_01') {
                       /* this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];*/
                        this.data = response['responseData'];
                      //  let data = response['responseData']['data'];


                    }
                },
                (error: any) => {
                    //  this.HISUtilService.tokenExpired(error.error.error);
                    this.error = error.error.error;
                }
            );
    }

    updateUser(item: any, id: any,staffId:number) {
        this.dataService.updateStaffId(staffId);
        if (item === 'DOCTOR') {
            console.log('iam doc');
            this.router.navigate(['/dashboard/setting/doctor/edit/', id]);

        } else if (item === 'CASHIER') {
            this.router.navigate(['/dashboard/setting/cashier/edit/', id]);
        }
        else if (item === 'NURSE') {
            this.router.navigate(['/dashboard/setting/nurse/edit/', id]);

        }
        else {
            this.router.navigate(['/dashboard/setting/receptionist/edit/', id]);
        }


    }

    roleSelected(typeObj: any) {
        const type = typeObj.value;
        this.searchForm.controls['userType'].setValue(type);
        this.selectedType = type;
    }

    getData(id: number) {
        if (id) {
            this.router.navigate(['/dashboard/setting/receptionist/edit/', id]);
        }
    }

    deleteUser(id: number) {
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(res => {
                if (res == true) {
                    this.requestService.deleteRequest('/user/delete/' + id).subscribe((data: Response) => {
                        if (data['responseCode'] === 'USER_DEL_SUC_01') {
                            this.notificationService.success('User has been Deleted Successfully');
                            this.getUserFromServer();

                        }
                    }, error => {
                        this.error = error.error.error_description;
                        this.notificationService.error('ERROR', 'User Unable to Delete ');

                    });
                    // this.router.navigate(['/home']);
                }
            });
    }


}
