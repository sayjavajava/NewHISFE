
import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {AppConstants} from '../../../utils/app.constants';
import {SmsTemplateModel} from "../../../model/SmsTemplateModel";


@Component({
    selector: 'add-edit-sms-component',
    templateUrl: '../../../templates/dashboard/setting/add-edit-sms.template.html',

})

export  class  AddEditSmsTemplateComponent{
    smsTemplate: SmsTemplateModel = new SmsTemplateModel();
    id: number;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {

    }

    ngOnInit() {
        document.title = 'HIS | SMS Template';

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.getSmsTemplateById();
    }

    getSmsTemplateById(){
        if(this.id){
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(
                    AppConstants.FETCH_SMS_CONFIG_BY_ID + this.id
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.smsTemplate = response['responseData'];
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Edit SMS Template');
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

    saveSMSTemplate(form: NgForm) {
        if (form.valid) {

            if (this.smsTemplate.type == '-1') {
                this.notificationService.warn('Please select type.');
                document.getElementById('type').focus();
                return;
            }

            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(
                    AppConstants.SMS_CONFIGURATION_SAVE,this.smsTemplate
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.smsTemplate = new SmsTemplateModel();
                            this.notificationService.success(response['responseMessage'], 'SMS Template');
                            this.router.navigate(['dashboard/setting/sms-template']);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'SMS Template');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
            } else {
                this.router.navigate(['/login']);
            }
        } else {
            if (this.smsTemplate.subject == '') {
                this.notificationService.warn('Please enter subject.');
                document.getElementById('subject').focus();
                return;
            }
            if (this.smsTemplate.type == '-1') {
                this.notificationService.warn('Please select type.');
                document.getElementById('type').focus();
                return;
            }
            if (this.smsTemplate.smsTemplate == '') {
                this.notificationService.warn('Please enter some data in emailTemplate.');
                document.getElementById('emailTemplate').focus();
                return;
            }
        }
    }

}