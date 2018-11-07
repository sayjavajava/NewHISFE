import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from "../../../services/notification.service";
import {Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import { customer } from '../../../model/customer';
import {NgForm} from '@angular/forms';

@Component({
    selector :"customer-app",
    templateUrl:"../../../templates/dashboard/customer_app/customer-dashboard-template.html",

})

export class customerComponent implements OnInit {


 customerlst:customer[];
 newCustomer: customer = new customer();

 constructor(private service:RequestsService,private notificationService: NotificationService, private router: Router,private HISUtilService: HISUtilService){}

    ngOnInit(): void {

            this.getCustomerList();

    }

   /* format(date) {
        return moment(date).format('lll');
    }*/

 getCustomerList(){

     this.service.getRequest(AppConstants.GET_ALL_CUSTOMER).subscribe(
         (response: Response) => {
             if (response['responseCode'] === 'CUSTOMER_SUC_11') {
                 this.customerlst= response['responseData'];

             }
         },
         (error: any) => {
             //console.log(error.json())
             this.HISUtilService.tokenExpired(error.error.error);
         }
     );

 }


    saveCustomer(form: NgForm): void {
        if (window.localStorage.getItem(btoa('access_token'))) {
            if (form.valid) {
                this.service.postRequest(AppConstants.SAVE_CUSTOMER_URL, this.newCustomer)
                    .subscribe((response: Response) => {
                            if (response['responseCode'] === 'CUST_SUC_02') {
                                this.notificationService.success(response['responseMessage'], 'Customer');
                                this.getCustomerList();
                                //    this.HISUtilService.hidePopupWithCloseButtonId('closeButton');

                            } else {
                                this.getCustomerList();
                                this.notificationService.error(response['responseMessage'], 'Customer');
                            }
                        },
                        (error: any) => {

                            this.HISUtilService.tokenExpired(error.error.error);
                        })
            } else {
                this.notificationService.error('Required fields missing', 'Customer');
            }

        } else {
            this.router.navigate(['/login']);
        }
    };




    onAddPopupLoad() {
        this.newCustomer = new customer();
    }

    onUpdatePopupLoad(objCustomer: customer) {
        this.newCustomer = objCustomer;
    }



    deleteCustomer(cstId: number) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Sure You Want To Delete')) return;
            this.service.deleteRequest(
                AppConstants.DELETE_CUSTOMER_URI + cstId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'CUSTOMER_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Customer Delete');
                            this.getCustomerList();
                        } else {
                            this.getCustomerList();
                            this.notificationService.error(response['responseMessage'], 'Customer Delete');
                        }
                    },
                    (error: any) => {

                        this.notificationService.error(error.error, 'Customer  Delete')
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );

        } else {
            this.router.navigate(['/login']);
        }
    }

    updateCustomer(form: NgForm) {
        if (window.localStorage.getItem(btoa('access_token'))) {

            if (form.valid) {
                this.service.putRequest(
                    AppConstants.UPDATE_CUSTOMER_URL,
                    this.newCustomer)
                    .subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'CUST_SUC_03') {
                                this.notificationService.success(response['responseMessage'], 'Customer Update');
                                this.getCustomerList();

                            } else {
                                this.getCustomerList();
                                this.notificationService.error(response['responseMessage'], 'Customer Update');
                            }
                        },
                        (error: any) => {
                            this.notificationService.error(error.error, 'Customer Update')
                            this.HISUtilService.tokenExpired(error.error.error);


                        }
                    );
            } else {
                this.notificationService.error('Required fields missing', 'Customer Update');
            }
        }else {
                this.router.navigate(['/login']);
   }}
}