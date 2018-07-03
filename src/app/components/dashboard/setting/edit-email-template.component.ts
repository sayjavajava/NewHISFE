import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {EmailTemplateModel} from "../../../model/EmailTemplateModel";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";


@Component({
    selector: 'service-tax-component',
    templateUrl: '../../../templates/dashboard/setting/edit-email-template.template.html',

})
export class EditEmailTemplateComponent implements OnInit {
    emailTempModel: EmailTemplateModel = new EmailTemplateModel();

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        document.title = 'HIS | Edit Email Template';
        if (localStorage.getItem(btoa('access_token'))) {

            this.activatedRoute.params.subscribe(
                params => {
                    this.getEmailTemplateById(Number(params['id']));
                });
        } else {
            this.router.navigate(['/login']);
        }
    }

    getEmailTemplateById(id: any) {
        this.requestsService.getRequest(AppConstants.EMAIL_TEMPLATE_EDIT_URL + id)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'EMAIL_TEMP_SUC_02') {
                        this.emailTempModel = response['responseData'];
                    }
                },
                (error: any) => {
                    //console.log(error.json())
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    updateEmailTemplate(form: NgForm) {
        if (form.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(
                    AppConstants.EMAIL_TEMPLATE_UPDATE_URL,
                    this.emailTempModel
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'EMAIL_TEMP_SUC_08') {
                            this.emailTempModel = new EmailTemplateModel();
                            this.notificationService.success(response['responseMessage'], 'Email Template');
                            this.router.navigate(['dashboard/setting/email-template']);
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
        } else {
            this.notificationService.error('Required Fields are missing', 'Email Template');
        }
    }

}
