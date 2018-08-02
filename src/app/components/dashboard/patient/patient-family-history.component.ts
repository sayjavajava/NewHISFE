import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: 'patient-family-history',
    templateUrl: '../../../templates/dashboard/patient/patient-family-history.template.html',
})
export class PatientFamilyHistoryComponent implements OnInit {
    constructor(private router: Router) {
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");

    }

    goToUserDashBoard(){
        this.router.navigate(['/dashboard/'+atob(localStorage.getItem(btoa('user_type')))+'/']);
    }
}