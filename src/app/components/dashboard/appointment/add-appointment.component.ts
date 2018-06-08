import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";

@Component({
    selector: 'add-appointment-component',
    templateUrl: '../../../templates/dashboard/appointment/add-appointment-template.html',
})
export class AddAppointmentComponent implements OnInit {

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title) {
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Add Appointment');
    }
}
