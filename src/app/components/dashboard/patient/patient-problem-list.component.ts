import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";


@Component({
    selector: 'patient-problem-list',
    templateUrl: '../../../templates/dashboard/patient/patient-problem-list.template.html',
})
export class PatientProblemListComponent implements OnInit {
    constructor(private router: Router) {
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");

    }

    goToUserDashBoard(){
        this.router.navigate(['/dashboard/'+atob(localStorage.getItem(btoa('user_type')))+'/']);
    }
}