import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../services/requests.service';
import {Router} from '@angular/router';
import {PermissionsService} from '../../services/permissions.service';
import {UserSharedService} from "../../services/user.shared.service";
import {Alert} from "selenium-webdriver";
import {HISUtilService} from '../../services/his-util.service';

@Component({
    selector: 'content-component',
    templateUrl: '../../templates/dashboard/content.template.html',
    styleUrls: ['../../styles/dashboard/content.style.css']
})
export class ContentComponent implements OnInit {
    firstName: string;
    lastName: string;
    profileImg: string;
    roles: string;

    constructor(private requestsService: RequestsService,
                private router: Router,
                private permissionsService: PermissionsService,
                private userSharedService: UserSharedService,
                private HISUtilService: HISUtilService) {
    };

    ngOnInit() {

        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                '/user/loggedInUser')
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ADM_SUC_03') {
                            this.userSharedService.firstName = response['responseData'].firstName;
                            this.userSharedService.lastName = response['responseData'].lastName;
                            this.userSharedService.profileImg = response['responseData'].profileImg;
                            this.userSharedService.roles = response['responseData'].commaSeparatedRoles;

                            console.log(this.userSharedService.roles);

                            this.firstName = this.userSharedService.firstName;
                            this.lastName = this.userSharedService.lastName;
                            this.profileImg = this.userSharedService.profileImg;
                            this.roles = this.userSharedService.roles;
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
            '/user/logout')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'USR_AUTH_SUC_02') {
                        window.localStorage.removeItem(btoa('access_token'));
                        window.localStorage.removeItem(btoa('refresh_token'));
                        window.localStorage.removeItem(btoa('expire_in'));
                        window.localStorage.removeItem(atob('permissions'));

                        this.router.navigate(['/login']);
                    }
                },
                (error: any) => {
                    //console.log(error.json);
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

}
