import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";


@Component({
    selector: 'patient-lab-orders',
    templateUrl: '../../../templates/dashboard/patient/patient-lab-orders.template.html',
})
export class PatientLabOrdersComponent implements OnInit {
    constructor(private router: Router) {
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
    }

    goToUserDashBoard(){
        this.router.navigate(['/dashboard/'+atob(localStorage.getItem(btoa('user_type')))+'/']);
    }
}