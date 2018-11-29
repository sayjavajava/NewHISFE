import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../services/requests.service';
import {Router} from '@angular/router';
import {UserSharedService} from '../../services/user.shared.service';
import {HISUtilService} from '../../services/his-util.service';
import {PermissionsService} from "../../services/permissions.service";
import {items} from "../../model/items";

@Component({
    selector: 'header-component',
    templateUrl: '../../templates/dashboard/header.template.html',
})
export class HeaderComponent implements OnInit {
    id: number;
    firstName: string;
    lastName: string;
    profileImg: string;
    userDesignation: string;
    role: string;
    showMenu: boolean = false;
    showSettings: boolean = false;
    items:any[];
    items2:any=[];
    constructor(private requestsService: RequestsService,
                private router: Router,
                private userSharedService: UserSharedService,
                private HISUtilService: HISUtilService,
                private permissionService: PermissionsService) {
        this.items = [
            {
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
            },
            {
                label: 'Appointments', icon: 'icon-calendar',
                items: [
                    [
                        {label: 'Appointment',
                            items: [{label: 'Appointments',icon: 'icon-clock',routerLink: ['/dashboard/appointment/manage']},
                                {label: 'New Appointment',icon: 'fa fa-calendar-plus-o',routerLink: ['/dashboard/appointment/add']},
                                {label: 'Reports',icon: 'fa fa-book',routerLink: ['/dashboard/appointment/reports']}]

                        },
                    ],

                ],
            },
            {
                label: 'Patient', icon: 'fa fa-hotel',
                items: [
                    [
                        {   label: 'Patient',
                            items: [
                                {label: 'Manage Patient',icon: 'icon-user-following',routerLink: ['/dashboard/patient/manage']},
                                {label: 'New Patient',icon: 'icon-user-follow',routerLink: ['/dashboard/patient/add']},
                                {label: 'Reports',icon: 'fa fa-book',routerLink: ['/dashboard/patient/reports']},
                                {label: 'Invoice Listing',icon: 'far fa-file-invoice',routerLink: ['/dashboard/invoice-listing']},
                                {label: 'Receipt Listing',icon: 'fas fa-file-invoice',routerLink: ['/dashboard/receipt-listing']},
                                {label: 'Refunds Listing',icon: 'icon-user-follow',routerLink: ['/dashboard/refund']},
                                {label: 'Invoices',icon: 'icon-user-following',routerLink: ['/dashboard/invoice']},
                                {label: 'Receipt',icon: 'fa fa-book',routerLink: ['/dashboard/patient/payment']}
                                ]

                        },

                    ],
                ],
            },
        ];

        /*test*/
       this.items2= [
            {
                label: 'Dashboard', icon: 'fa fa-fw fa-check',
                items: [
                    [
                        {   label: 'Dash',
                            items: [{label: 'Cashier',icon: 'fa fa-dashboard',routerLink: ['/dashboard/cashier']},
                                {label: 'Receptionist',icon: 'fa fa-fw fa-soccer-ball-o',routerLink: ['/dashboard/receptionist']},
                                {label: 'Nurse',icon: 'fa fa-fw fa-soccer-ball-o',routerLink: ['/dashboard/nurse']},
                                {label: 'Doctor',icon: 'fa fa-fw fa-soccer-ball-o',routerLink: ['/dashboard/doctor']}]

                        },
                    ],
                    [
                        {
                            label: 'TV 3',
                            items: [{label: 'TV 3.1'},{label: 'TV 3.2'}]
                        },
                        {
                            label: 'TV 4',
                            items: [{label: 'TV 4.1'},{label: 'TV 4.2'}]
                        }
                    ]
                ]
            }
        ];
    }
    ngOnInit() {

        if (window.localStorage.getItem(btoa('access_token'))) {
            this.firstName = this.userSharedService.firstName;
            this.lastName = this.userSharedService.lastName;
            this.profileImg = this.userSharedService.profileImg;
            this.role = this.userSharedService.roles;

            let userType: string = atob(localStorage.getItem(btoa('user_type')))
            if(userType === 'admin' || userType === 'manager') {
                this.showMenu = true;
                this.showSettings = true;
            }

            this.requestsService.getRequest(
                '/user/auth/loggedInUser')
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ADM_SUC_03') {
                            this.userSharedService.firstName = response['responseData'].firstName;
                            this.userSharedService.lastName = response['responseData'].lastName;
                            this.userSharedService.profileImg = response['responseData'].profileImg;
                            this.userSharedService.roles = response['responseData'].commaSeparatedRoles;
                            this.permissionService.loadPermissions(response['responseData'].permissions);

                            this.firstName = this.userSharedService.firstName;
                            this.lastName = this.userSharedService.lastName;
                            this.profileImg = this.userSharedService.profileImg;
                            this.role = this.userSharedService.roles;
                        }
                    },
                    (error: any) => {
                        //console.log(error.json())
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }

    logout() {
        this.requestsService.getRequest(
            '/user/auth/logout')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'USR_AUTH_SUC_02') {
                        window.localStorage.removeItem(btoa('access_token'));
                        window.localStorage.removeItem(btoa('refresh_token'));
                        window.localStorage.removeItem(btoa('expire_in'));
                        window.localStorage.removeItem('permissions');
                        this.router.navigate(['/login']);
                    }
                },
                (error: any) => {
                    //console.log(error.json);
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }


    goToUserDashBoard() {
        //this.router.navigate(['/dashboard/'+window.localStorage.getItem(atob('user_type'))+'/']);
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    }
}


