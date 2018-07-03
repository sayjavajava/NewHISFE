import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";

@Component({
    selector: 'patient-dashboard',
    templateUrl: '../../../templates/dashboard/patient/patient-dashboard.html',
})
export class PatientDashboardComponent implements OnInit {

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title) {
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Patient Dashboard');
    }
}
