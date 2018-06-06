import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-patient',
    templateUrl: '../../../templates/dashboard/patient/patient.template.html',
})
export class PatientComponent implements OnInit {

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title) {
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Add Patient');
    }
}
