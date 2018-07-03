import {Component} from '@angular/core';
import {RequestsService} from '../../../services/requests.service';
import {Router} from '@angular/router';

@Component({
    selector: 'appointment-navigation-component',
    templateUrl: '../../../templates/dashboard/appointment/appointment-navigation.template.html'
})
export class AppointmentNavigationComponent {
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
