import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {DataService} from "../../../services/DataService";



@Component({
    selector: 'patient-history-menu',
    templateUrl: '../../../templates/dashboard/patient/patient-history-menu.template.html',
})
export class PatientHistoryMenuComponent implements OnInit,OnDestroy {
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    id:any;
    subscription :Subscription;
    constructor(private router: Router,private route:ActivatedRoute,private dataService:DataService) {
        this.subscription =this.dataService.currentPatientId.subscribe(id=>{this.id=id})
    }
    ngOnInit(): void {
        /*this.route.params.subscribe(params => {
            this.id = params['id'];

        });*/
    }

}