import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'receptionist-dashboard-component',
    templateUrl: '../../../templates/dashboard/receptionist/receptionist-dashboard.template.html',
    styleUrls: [],
})
export class ReceptionistDashboardComponent {

    title: string = "Receptionist Dashboard";

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title) {
    };

    ngOnInit() {

    }
}