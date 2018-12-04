import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {ActivatedRoute, Router} from "@angular/router";
import {SmsTemplateModel} from "../../../model/SmsTemplateModel";

@Component({
    selector: 'sms-template-component',
    templateUrl: '../../../templates/dashboard/setting/sms.template.html',

})
export class SmsTemplateComponent{

    smsTemplateList: SmsTemplateModel[] = [];
    id: number;
    cols: any[];

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {
        this.cols = [
            {field: "subject", header: "Subject"},
            {field: "type", header: "Type"},
            {field: "active", header: "Status"},
            {field: "action", header: "Action"}
        ];
    }

    ngOnInit() {
        document.title = 'HIS | Email Template';
     /*   this.route.params.subscribe(params => {
            this.id = params['id'];
        });*/
        if (localStorage.getItem(btoa('access_token'))) {
            this.getAllSmsList();
        }
    }

    getAllSmsList() {
        if (localStorage.getItem(btoa('access_token'))) {

            this.requestsService.getRequest(AppConstants.FETCH_SMS_CONFIGURATIONS
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.smsTemplateList = response['responseData'];
                    } else {
                        this.notificationService.error(response['responseMessage'], 'SMS Configurations');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], 'SMS Configurations');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }


    deleteSmsTemplate(id: any) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are you sure?")) return;
            this.requestsService.deleteRequest(
                AppConstants.SMS_CONFIGURATION_DELETE_SAVE + id)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.smsTemplateList = response['responseData'];
                            this.notificationService.success(response['responseMessage'], 'Email Template');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Email Template');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }


}