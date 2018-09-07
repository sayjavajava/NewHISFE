import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'nurse-dashboard-component',
    templateUrl: '../../../templates/dashboard/nurse/nurse-dashboard.template.html',
    styleUrls: [],
})
export class NurseDashboardComponent {

    title: string = "Nurse Dashboard";

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title) {
    };

    ngOnInit() {

    }
}