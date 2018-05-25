import {Component} from '@angular/core';
import {RequestsService} from '../../services/requests.service';
import {Router} from '@angular/router';

@Component({
    selector: 'navigation-component',
    templateUrl: '../../templates/dashboard/navigation.template.html',
    styleUrls: ['../../styles/dashboard/navigation.style.css']
})
export class NavigationComponent {
    firstName: string;
    lastName: string;
    profileImg: string;
    userDesignation: string;

    constructor(private requestsService: RequestsService,
                private router: Router) {
    };

    ngOnInit() {
    }

    logout() {
        window.localStorage.removeItem('access_token');
        this.router.navigate(['/login/']);
    }

    populatePasswordPolicy() {
        if (window.localStorage.getItem('access_token')) {
            this.router.navigate(['/dashboard/passwordPolicies']);
        }
    }

    goToActivityLog() {
        if (window.localStorage.getItem('access_token')) {
            this.router.navigate(['/admin/activityLogs']);
        }
    }

    goToAdminProfile() {
        if (window.localStorage.getItem('access_token')) {
            this.router.navigate(['/admin/profile']);
        }
    }

    goToAdminSettings() {
        if (window.localStorage.getItem('access_token')) {
            this.router.navigate(['/admin/settings']);
        }
    }

}
