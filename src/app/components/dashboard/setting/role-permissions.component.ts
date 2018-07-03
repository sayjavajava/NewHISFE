import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RequestsService} from '../../../services/requests.service';
import {RoleAndPermission} from '../../../model/roleandpermission';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';


@Component({
    selector: 'role-permissions-component',
    templateUrl: '../../../templates/dashboard/setting/roles-permissions.template.html',

})
export class RolePermissionsComponent implements OnInit {

    name: string;
    description: string;
    active: boolean;
    roleForm: FormGroup;
    showForm: boolean = true;
    showForm2: boolean = true;
    @ViewChild('closeBtn') closeBtn: ElementRef;
    titleAlert: string = 'name should be bw 5 and 30';
    descriptionAlert: string = 'description is required';
    allDBPermissions: RoleAndPermission[];
    allDBRoles: RoleAndPermission[];
    selectForm: FormGroup;
    defaultRole: 'SUPER_ADMIN';
    rolePermissions: RoleAndPermission[];
    selectedRole: string;
    addedRolePermissionsIds: number[] = new Array();

    constructor(private notificationService: NotificationService,
                private requestService: RequestsService,
                private fb: FormBuilder,
                private hisUtilService: HISUtilService,
                private elementRef: ElementRef) {
        this.allRoles();
    }

    ngOnInit() {
        this.createForm();
        this.allPermissions();
        this.createSelectedForm();
    }

    createForm() {
        this.roleForm = this.fb.group({
            'name': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30)])],
            'description': [null],
            'active': ''
        });
    }

    createSelectedForm() {
        this.selectForm = new FormGroup({
            role: new FormControl(null)
        });

        this.selectForm.controls['role'].setValue(this.defaultRole, {onlySelf: true});
    }

    addRole(formdata: any) {
        let obj: RoleAndPermission = new RoleAndPermission(formdata.name, formdata.description, formdata.active, 'Role');
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
                    if (response['responseCode'] === 'ROL_SUC_01') {
                        this.notificationService.success(response['responseMessage']);
                        this.closeModal();
                    } else {
                        this.notificationService.error(response['responseMessage'])
                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error_description);
                    this.hisUtilService.tokenExpired(error.error);

                });
    }

    addPermission(formdata: any) {
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
                        this.allPermissions();
                    } else {
                        this.notificationService.error(response['responseMessage'])
                    }
                },
                (error: any) => {
                    //console.log(error.json());
                    this.notificationService.error(error.error.error_description);
                    this.hisUtilService.tokenExpired(error.error);

                });
    }

    allPermissions() {
        this.requestService.getRequest(
            AppConstants.PERMISSION_ENDPOINT)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ROL_PER_SUC_02') {
                        let resources = response['responseData'];
                        let resource = resources['allPermissions'];
                        this.allDBPermissions = resource;
                    }
                }, (error: any) => {
                    this.hisUtilService.tokenExpired(error.error.error);
                }
            );
    }

    allRoles() {
        this.requestService.getRequest(
            AppConstants.PERMISSION_ENDPOINT)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ROL_PER_SUC_02') {
                        let resources = response['responseData'];
                        let resource = resources['allRoleAndPermissions'];
                        this.allDBRoles = resource;
                    }
                },
                (error: any) => {
                    this.hisUtilService.tokenExpired(error.error.error);
                }
            );
    }

    saveRolePermissions() {
        this.requestService.postRequest(
            AppConstants.ASSIGN_PERMISSIONS_TO_ROLES,
            {
                'permissionIds': this.addedRolePermissionsIds,
                'selectedRole': this.selectedRole
            })
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ROL_PER_SUC_03') {
                        this.notificationService.success(response['responseMessage'], 'Roles & Permissions')
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Roles & Permissions')
                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error, 'Roles & Permissions');
                    this.hisUtilService.tokenExpired(error.error.error);
                }
            );
    }

    onPermissionSelected(per: RoleAndPermission) {
        const index: number = this.addedRolePermissionsIds.indexOf(per.id);
        if (index <= -1) {
            this.addedRolePermissionsIds.push(per.id);
        } else {
            this.addedRolePermissionsIds.splice(index, 1);
        }
    }

    private permissionByRole(roleName: string) {
        this.requestService.getRequestWithParam(AppConstants.PERMISSION_BY_ROLE, roleName)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ROL_PER_SUC_02') {
                        this.rolePermissions = response['responseData'];
                        for (let rp of this.rolePermissions) {
                            this.addedRolePermissionsIds.push(rp.id);
                            var checkbox = (<HTMLInputElement>document.getElementById('chkbox-' + rp.id));
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

    onRoleChange() {
        for (let rp of this.allDBPermissions) {
            var checkbox = (<HTMLInputElement>document.getElementById('chkbox-' + rp.id));
            checkbox.checked = false;
          }
        this.addedRolePermissionsIds = new Array();
        this.permissionByRole(this.selectedRole);

    }

    private formReset() {
        this.roleForm.reset();
        this.closeModal();

    }

}
