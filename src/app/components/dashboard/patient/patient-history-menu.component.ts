import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
    selector: 'patient-history-menu',
    templateUrl: '../../../templates/dashboard/patient/patient-history-menu.template.html',
})
export class PatientHistoryMenuComponent implements OnInit {
    id:any;
    constructor(private router: Router,private route:ActivatedRoute) {
    }
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            console.log('history-appt'+ this.id);
        });
    }

}