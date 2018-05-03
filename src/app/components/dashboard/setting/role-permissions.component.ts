import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RequestsService} from '../../../services/requests.service';
import {RoleAndPermission} from '../../../models/roleandpermission';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';


@Component({
    selector: 'rolepermissions-component',
    templateUrl: '../../../templates/dashboard/setting/roles-permissions.template.html',

})
export class RolePermissionsComponent implements OnInit {

    name: string;
    description: string;
    active: boolean;
    roleform: FormGroup;
    showForm: boolean = true;
    showForm2: boolean = true;
    @ViewChild('closeBtn') closeBtn: ElementRef;
    titleAlert: string = 'name should be bw 5 and 30';
    descriptionalert: string = 'description is required';
    allpermissions: RoleAndPermission[];
    allroles: RoleAndPermission[];
    selectform : FormGroup;
    defaultrole:'SUPER_ADMIN';
    filteredpermissions:RoleAndPermission[];
    test2:RoleAndPermission[];



    constructor(private notificationservice: NotificationService, private requestService: RequestsService,
                private fb: FormBuilder, private hisUtilService: HISUtilService) {
                this.allRoles();
    }

    ngOnInit() {
        this.createForm();
        this.allPermissions();
        this.createSelectedForm();
    }


    createForm() {
        this.roleform = this.fb.group({
            'name': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30)])],
            'description': [null, Validators.required],
            'active': ''
        });
    }
    createSelectedForm(){
        this.selectform = new FormGroup({
            role:new FormControl(null)
        });

        this.selectform.controls['role'].setValue(this.defaultrole, {onlySelf: true});
    }

    addRole(formdata: any) {

        let obj: RoleAndPermission = new RoleAndPermission(formdata.name, formdata.description, formdata.active, 'Role');

        this.showForm = false;
        setTimeout(() => {
            this.formReset()
            this.showForm = true;
        });
        this.requestService.postRequest(
            AppConstants.ROLE_ENDPOINT
            , obj)
            .subscribe(
                (response: Response) => {

                    console.log('i am testing:' + response['responseMessage']);
                    if (response['responseCode'] === 'ROL_SUC_01') {
                        this.notificationservice.success(response['responseMessage']);
                        this.closeModal();

                    } else {
                        this.notificationservice.error(response['responseMessage'])
                    }
                },
                (error: any) => {
                    //console.log(error.json());
                    this.notificationservice.error(error.error.error_description);
                    this.hisUtilService.tokenExpired(error.error);

                });

    }

    addPermission(formdata: any) {

        let obj: RoleAndPermission = new RoleAndPermission(formdata.name, formdata.description, formdata.active, 'Permission');
        this.showForm = false;
        setTimeout(() => {
            this.formReset()
            this.showForm = true;
        });
        this.requestService.postRequest(
            AppConstants.ROLE_ENDPOINT
            , obj)
            .subscribe(
                (response: Response) => {

                    console.log('i am testing:' + response['responseMessage']);
                    if (response['responseCode'] === 'PER_SUC_01') {

                        this.notificationservice.success(response['responseMessage']);
                        this.allPermissions();


                    } else {
                        this.notificationservice.error(response['responseMessage'])
                    }
                },
                (error: any) => {
                    //console.log(error.json());
                    this.notificationservice.error(error.error.error_description);
                    this.hisUtilService.tokenExpired(error.error);

                });

    }

    allPermissions() {
        this.requestService.getRequest(AppConstants.PERMISSION_ENDPOINT).subscribe(response => {
            let resources = response['responseData'];
            let resource = resources['allPermissions'];
            console.log(resource['name']);
            this.allpermissions = resource;
        })
    }

    allRoles() {
        this.requestService.getRequest(AppConstants.PERMISSION_ENDPOINT).subscribe(response => {
            let resources = response['responseData'];
            let resource = resources['allRoleAndPermissions'];
            this.allroles = resource;
        })
    }

   private permissionByRole(name:string){
       let nameencoded = name.replace(/\s/g, "")

        this.requestService.getRequestWithParam('/setting/rolePermission/permissionsbyrole',nameencoded)

            .subscribe(response =>{

                let resources = response['responseData'];
                this.filteredpermissions = resources;
            })
    }


    private closeModal(): void {
        this.closeBtn.nativeElement.click();
    }

    onRoleChange(event:string) {
        let data = event.slice(2);
        console.log(data);
        this.permissionByRole(data);
        /* for(let rp in this.allpermissions){
             for(let fp in this.filteredpermissions){
                 if(fp === rp){
                     rp.assigned = true;
                     break;
                 }
             }
         }*/


    }
    private formReset() {
        this.roleform.reset();
        this.closeModal();

    }

    test(){
        var arra3 = this.allpermissions;
        var arr4 = this.filteredpermissions;
        let missing = arr4.filter(item => arra3.indexOf(item) < 0) ;
        console.log(missing);

    }


}
