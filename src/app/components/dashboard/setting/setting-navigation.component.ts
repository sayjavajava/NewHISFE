import {Component} from '@angular/core';
import {RequestsService} from '../../../services/requests.service';
import {Router} from '@angular/router';


@Component({
    selector: 'setting-navigation-component',
    templateUrl: '../../../templates/dashboard/setting/setting-navigation.template.html'
})
export class SettingNavigationComponent {
    firstName: string;
    lastName: string;
    profileImg: string;
    userDesignation: string;

    constructor(private requestsService: RequestsService,
                private router: Router) {
    };

    ngOnInit() {
    }

}
