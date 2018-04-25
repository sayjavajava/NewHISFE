import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../services/requests.service';
import {Router} from '@angular/router';
import {UserSharedService} from "../../services/user.shared.service";

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

    constructor(private requestsService: RequestsService,
                private router: Router,
                private userSharedService: UserSharedService) {
    }

    ngOnInit() {

        if (window.localStorage.getItem(btoa('access_token'))) {
            this.firstName = this.userSharedService.firstName;
            this.lastName = this.userSharedService.lastName;
            this.profileImg = this.userSharedService.profileImg;
            this.role = this.userSharedService.role;
            this.requestsService.getRequest(
                '/user/loggedInUser')
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ADM_SUC_01') {
                            this.userSharedService.firstName = response['responseData'].firstName;
                            this.userSharedService.lastName = response['responseData'].lastName;
                            this.userSharedService.profileImg = response['responseData'].profileImg;
                            this.userSharedService.role = response['responseData'].role;

                            this.firstName = this.userSharedService.firstName;
                            this.lastName = this.userSharedService.lastName;
                            this.profileImg = this.userSharedService.profileImg;
                            this.role = this.userSharedService.role;
                        }
                    },
                    (error: any) => {
                        // this.apUtilServer.tokenExpired(error.json()['error']);
                        console.log(error.json())
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
                        this.router.navigate(['/login']);
                    }
                },
                (error: any) => {
                    console.log(error.json);
                }
            );
    }

}
