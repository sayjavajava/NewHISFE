import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {ICDCodeModel} from '../../../model/ICDCodeModel';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AppConstants} from '../../../utils/app.constants';
import {Organization} from "../../../model/organization";
import {CustomValidators} from "./PasswordValidator";
import {UserSharedService} from "../../../services/user.shared.service";

@Component({
    selector: 'icd-code-component',
    templateUrl: '../../../templates/dashboard/setting/admin-profile.template.html',
})
export class AdminProfileComponent implements OnInit {
    accountForm: FormGroup;
    id:number;
    data:any;
    organization : Organization = new Organization();
    profileImgD: File = null;
    urlOrganization:string;
    firstName: string;
    lastName: string;
    profileImg: string;
    userDesignation: string;
    role: string;
    showMenu: boolean = false;
    showSettings: boolean = false;
    items:any[];
    items2:any=[];
    isPresent:boolean=false;
    isUserLoggedIn: boolean;
    ngOnInit(): void {
        this.createAccountForm();
    }

    constructor(private route: ActivatedRoute, private router: Router,private userSharedService: UserSharedService, private requestService: RequestsService,private fb: FormBuilder,private notificationService: NotificationService) {
   //  this.getOrganizationAccount();
     this.getOrganizationFromServer(0);
    }
    createAccountForm() {
        this.accountForm = this.fb.group({
            'firstName': [null,Validators.compose([Validators.required])],
            'userId':[null],
            'lastName': [null,Validators.compose([Validators.required])],
            'userName': [null],
            'userEmail': [null,Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
            'cellPhone': [null],
            'userAddress': [null],
            'formName': ['ACCOUNT'],
            'homePhone': [null],
            'password': [null, Validators.compose([Validators.minLength(5)])],
            'confirmPassword': [null],
        },
            {
                validator: CustomValidators.Match('password', 'confirmPassword')
            })
    }
    saveAccount(data: FormData) {
        var self = this;
        if(this.accountForm.valid) {
            //account url can be change
         //   postRequestMultipartFormAndDataWithOneFile
            this.requestService.putRequest(AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
                .subscribe(function (response) {
                    if (response['responseCode'] === 'ORG_SUC_03') {
                        self.notificationService.success('User Profile  has been Update Successfully');
                    }
                }, function (error) {
                    self.notificationService.error('ERROR', 'Profile is not Updated');

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
                        this.urlOrganization=this.organization.profileImgUrl;
                       /* if(this.urlOrganization!=null){
                            this.urlOrganization=""
                        }*/
                        console.log(this.organization);
                     //   console.log(this.organization);
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

     cancel() {
        this.router.navigate(['/dashboard/setting/admin/profile']);
     }

    uploadImgOnChange(event: any) {

        let fileList: FileList = event.target.files;
        debugger
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === "profileImgUrl") {
                this.profileImgD = fileList[0];
            }
        }
    }


    uploadProfileImg() {
        if (this.profileImg && this.profileImgD.size <= 40000000) {
            this.requestService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PROFILE_NEW_IMAGE_URL + this.id
                , this.profileImgD)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ORG_SUC_02') {

                            this.urlOrganization=response['responseData'];
                            this.notificationService.success('Profile Image has been updated Successfully');
                        //    this.profileImgD = null;
                            this.userSharedService.isUserLoggedIn.next(true);

                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Profile Image uploading failed', 'Update Profile');

                    }
                );
        } else {
            this.notificationService.error('File size must be less then 4 mb.', 'Update Organization');
        }
    }

   /* RefreshSharedService() {

        if (window.localStorage.getItem(btoa('access_token'))) {
            this.firstName = this.userSharedService.firstName;
            this.lastName = this.userSharedService.lastName;
            this.profileImg = this.userSharedService.profileImg;
            this.role = this.userSharedService.roles;

            let userType: string = atob(localStorage.getItem(btoa('user_type')))
            if(userType === 'admin' || userType === 'manager') {
                this.showMenu = true;
                this.showSettings = true;
                var db ={
                    label: 'Dashboard', icon: 'icon-home',
                    items: [
                        [
                            { label: 'DashBoard',
                                items: [{label: 'Cashier',icon: 'fa fa-briefcase',routerLink: ['/dashboard/cashier']},
                                    {label: 'Receptionist',icon: 'fa fa-laptop',routerLink: ['/dashboard/receptionist']},
                                    {label: 'Nurse',icon: 'fa fa-stethoscope',routerLink: ['/dashboard/nurse']},
                                    {label: 'Doctor',icon: 'fa fa-user-md',routerLink: ['/dashboard/doctor']}]

                            },
                        ]
                    ],
                };
                this.items.push(db)
            }

        //    this.requestsService.getRequest(
                '/user/auth/loggedInUser')
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ADM_SUC_03') {
                            this.userSharedService.firstName = response['responseData'].firstName;
                            this.userSharedService.lastName = response['responseData'].lastName;
                            this.userSharedService.profileImg = response['responseData'].profileImg;
                            this.userSharedService.roles = response['responseData'].commaSeparatedRoles;
                //            this.permissionService.loadPermissions(response['responseData'].permissions);

                            this.firstName = this.userSharedService.firstName;
                            this.lastName = this.userSharedService.lastName;
                            this.profileImg = this.userSharedService.profileImg;
                            this.role = this.userSharedService.roles;
                            if(this.userSharedService.profileImg!=null){
                                this.isPresent=true;
                                this.userSharedService.profileImg = response['responseData'].profileImg;

                            }else{

                                this.userSharedService.profileImg="/public/images/avatar3_small.jpg";
                                this.isPresent=false;
                            }
                            //  alert(this.userSharedService.profileImg);
                        }
                    },
                    (error: any) => {
                        //console.log(error.json())
              //          this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }*/

}
