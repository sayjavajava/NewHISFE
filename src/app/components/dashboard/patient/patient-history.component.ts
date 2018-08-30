import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
    selector: 'patient-history',
    templateUrl: '../../../templates/dashboard/patient/patient-history.template.html',
})
export class PatientHistoryComponent implements OnInit {
    id:Number;
    constructor(private router: Router,private route:ActivatedRoute) {
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
        this.route.params.subscribe(params => {
            this.id = params['id'];
            console.log(this.id);
        });
    }

    goToUserDashBoard(){
        this.router.navigate(['/dashboard/'+atob(localStorage.getItem(btoa('user_type')))+'/']);
    }
}