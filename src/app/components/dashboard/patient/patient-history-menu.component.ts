import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";


@Component({
    selector: 'patient-history-menu',
    templateUrl: '../../../templates/dashboard/patient/patient-history-menu.template.html',
})
export class PatientHistoryMenuComponent implements OnInit {
    constructor(private router: Router) {
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
    }
}