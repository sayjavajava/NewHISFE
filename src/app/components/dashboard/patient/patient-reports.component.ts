import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";

@Component({
    selector: 'patient-reports',
    templateUrl: '../../../templates/dashboard/patient/patient-reports.html',
})
export class PatientReportsComponent implements OnInit {

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title) {
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Patient Reports');
    }
}
