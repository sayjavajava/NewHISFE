import {Component} from '@angular/core';
import {RequestsService} from '../../../services/requests.service';
import {Router} from '@angular/router';

@Component({
    selector: 'patient-navigation-component',
    templateUrl: '../../../templates/dashboard/patient/patient-navigation.template.html'
})
export class PatientNavigationComponent {
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
