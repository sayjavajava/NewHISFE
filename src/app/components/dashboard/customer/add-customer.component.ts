import { Component } from '@angular/core';
import { customer } from '../../../model/customer';
import {Router} from "@angular/router";
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from "../../../services/notification.service";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {User} from "../../../model/User";
@Component({
    templateUrl:"../../../templates/dashboard/customer_app/customer-dashboard-template.html",



})

export class AddCustomerComponent
{

    customer: customer = new customer();

    constructor(private service:RequestsService,private notificationService: NotificationService, private router: Router,private HISUtilService: HISUtilService){

    }

    createUser(): void {
        this.service.postRequest(AppConstants.GET_ALL_CUSTOMER,this.customer)
            .subscribe( data => {

                alert("Customer created successfully.");
            });

    };


}
