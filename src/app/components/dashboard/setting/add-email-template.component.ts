import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {EmailTemplateModel} from "../../../model/EmailTemplateModel";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {AppConstants} from "../../../utils/app.constants";


@Component({
    selector: 'service-tax-component',
    templateUrl: '../../../templates/dashboard/setting/add-email-template.template.html',

})
export class AddEmailTemplateComponent implements OnInit {
    emailTempModel: EmailTemplateModel = new EmailTemplateModel();

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {

    }

    ngOnInit() {
        document.title = 'HIS | Email Template';
    }

    saveEmailTemplate(form: NgForm) {
        if (form.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(
                    AppConstants.EMAIL_TEMPLATE_SAVE_URL,
                    this.emailTempModel
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'EMAIL_TEMP_SUC_04') {
                            this.emailTempModel = new EmailTemplateModel();
                            this.notificationService.success(response['responseMessage'], 'Email Template');
                            this.router.navigate(['dashboard/setting/email-template']);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Email Template')
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
            this.notificationService.error('Required Fields are missing', 'Email Template');
        }
    }

}
