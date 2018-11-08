import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RequestsService} from '../../../services/requests.service';
/*import {RoleAndPermission} from '../../../model/roleandpermission';*/
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {Permission} from "../../../model/Permission";
import {Dropdown} from "primeng/dropdown";
import {Observable} from "rxjs/Observable";


@Component({
    selector: 'user-permissions-component',
    templateUrl: '../../../templates/dashboard/setting/user-permissions.template.html',

})
export class UserPermissionsComponent implements OnInit {

    name: string;
    description: string;
    active: boolean;
    //roleForm: FormGroup;
    showForm: boolean = true;
    showForm2: boolean = true;
    @ViewChild('closeBtn') closeBtn: ElementRef;
    titleAlert: string = 'name should be bw 5 and 30';
    descriptionAlert: string = 'description is required';
    allUserDBPermissions: Permission[];
    allUsers: any[];
    userPermissions: Permission[];
    showPermissions: boolean = true;
    addedUserPermissionsIds: number[] = new Array();
    selectedUser: any;

    constructor(private notificationService: NotificationService,
                private requestService: RequestsService,
                private fb: FormBuilder,
                private hisUtilService: HISUtilService,
                private elementRef: ElementRef) {
    }

    ngOnInit() {
        //this.createForm();
        this.allUserPermissions();
        //this.createSelectedForm();
        this.getAllUsers();
    }

    getAllUsers(){
        this.requestService.getRequest(
            AppConstants.FETCH_ALL_USERS_URI)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'USER_SUC_01') {
                        this.allUsers = response['responseData'];
                        //this.allDBRoles = resources['allRoleAndPermissions'];
                    }
                }, (error: any) => {
                    this.hisUtilService.tokenExpired(error.error.error);
                }
            );
    }

    /*createForm() {
        this.roleForm = this.fb.group({
            'name': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30)])],
            'description': [null],
            'active': ''
        });
    }*/

    /*createSelectedForm() {
        this.selectUserForm = new FormGroup({
            user: new FormControl(null)
        });

        //this.selectUserForm.controls['user'].setValue(this.defaultRole, {onlySelf: true});
    }*/

/*    addPermission(formdata: any) {
        let obj: RoleAndPermission = new RoleAndPermission(formdata.name, formdata.description, formdata.active, 'Permission');
        this.showForm = false;
        setTimeout(() => {
            this.formReset();
            this.showForm = true;
        });
        this.requestService.postRequest(
            AppConstants.ROLE_ENDPOINT
            , obj)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PER_SUC_01') {
                        this.notificationService.success(response['responseMessage']);
                        this.allRolePermissions();
                    } else {
                        this.notificationService.error(response['responseMessage']);
                    }
                },
                (error: any) => {
                    // console.log(error.json());
                    this.notificationService.error(error.error.error_description);
                    this.hisUtilService.tokenExpired(error.error);

                });
    }*/

    allUserPermissions() {
        this.requestService.getRequest(
            AppConstants.USER_ALL_PERMISSIONS)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'USR_PER_SUC_01') {
                        this.allUserDBPermissions = response['responseData'];
                    }
                }, (error: any) => {
                    this.hisUtilService.tokenExpired(error.error.error);
                }
            );
    }


    saveUserPermissions() {
        if(this.selectedUser) {
            this.requestService.postRequest(
                AppConstants.ASSIGN_PERMISSIONS_TO_USERS,
                {
                    'permissionIds': this.addedUserPermissionsIds,
                    'userId': this.selectedUser.id
                })
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_PER_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'User & Permissions');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'User & Permissions');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error(error.error, 'User & Permissions');
                        this.hisUtilService.tokenExpired(error.error.error);
                    }
                );
        }else{
            this.notificationService.error('Select User', 'User & Permissions');
        }
    }

    onPermissionSelected(per: Permission) {
        const index: number = this.addedUserPermissionsIds.indexOf(per.id);
        if (index <= -1) {
            this.addedUserPermissionsIds.push(per.id);
        } else {
            this.addedUserPermissionsIds.splice(index, 1);
        }
    }

    private permissionByUser() {
        this.requestService.getRequest(AppConstants.PERMISSION_BY_USER+this.selectedUser.id)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'USR_PER_SUC_01') {
                        this.userPermissions = response['responseData'];
                        for (let rp of this.userPermissions) {
                            this.addedUserPermissionsIds.push(rp.id);
                            let checkbox = (<HTMLInputElement>document.getElementById('chkbox-' + rp.id));
                            checkbox.checked = true;
                        }
                    }
                },
                (error: any) => {
                    this.hisUtilService.tokenExpired(error.error.error);
                }
            );
    }

    private closeModal(): void {
        this.closeBtn.nativeElement.click();
    }

    onUserChange(userId: number) {
        if (userId) {
            for (let up of this.allUserDBPermissions) {
                let checkbox = (<HTMLInputElement>document.getElementById('chkbox-' + up.id));
                checkbox.checked = false;
            }
            this.addedUserPermissionsIds = new Array();
            this.permissionByUser();
        }
    }

    clearFilter(dropdown: Dropdown) {
        dropdown.resetFilter();
    }
    /*private formReset() {
        this.roleForm.reset();
        this.closeModal();

    }*/

}
