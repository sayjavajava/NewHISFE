import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'doctor-dashboard-component',
    templateUrl: '../../../templates/dashboard/doctor/doctor-dashboard.template.html',
    styleUrls: [],
})
export class DoctorDashboardComponent {

    title: string = "Doctor Dashboard";

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title) {
    };

    ngOnInit() {

    }
}
