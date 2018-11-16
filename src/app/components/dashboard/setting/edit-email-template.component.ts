import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {EmailTemplateModel} from '../../../model/EmailTemplateModel';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';


@Component({
    selector: 'service-tax-component',
    templateUrl: '../../../templates/dashboard/setting/edit-email-template.template.html',

})
export class EditEmailTemplateComponent implements OnInit {
    emailTempModel: EmailTemplateModel = new EmailTemplateModel();
    ckeConfig: any;
    ckeditorContent: string;
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

        this.ckeConfig = {
            allowedContent: false,
            forcePasteAsPlainText: true
        };
    }

    getEmailTemplateById(id: any) {
        this.requestsService.getRequest(AppConstants.EMAIL_TEMPLATE_EDIT_URL + id)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'EMAIL_TEMP_SUC_02') {
                        this.emailTempModel = response['responseData'];
                        var emailStr=this.getPlainText(this.emailTempModel.emailTemplate);
                        this.emailTempModel.emailTemplate=emailStr;
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

            if (this.emailTempModel.type == '-1') {
                this.notificationService.warn('Please select type.');
                document.getElementById('type').focus();
                return;
            }

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
            if (this.emailTempModel.title == '') {
                this.notificationService.warn('Please enter title.');
                document.getElementById('title').focus();
                return;
            }
            if (this.emailTempModel.subject == '') {
                this.notificationService.warn('Please enter subject.');
                document.getElementById('subject').focus();
                return;
            }
            if (this.emailTempModel.type == '-1') {
                this.notificationService.warn('Please select type.');
                document.getElementById('type').focus();
                return;
            }
            if (this.emailTempModel.emailTemplate == '') {
                this.notificationService.warn('Please enter some data in emailTemplate.');
                document.getElementById('emailTemplate').focus();
                return;
            }
        }
    }

    getPlainText(strSrc:string ) {
        var resultStr = "";

        // Ignore the <p> tag if it is in very start of the text
        if(strSrc.indexOf('<p>') == 0)
            resultStr = strSrc.substring(3);
        else
            resultStr = strSrc;
        resultStr = resultStr.replace(/<p>/gi, "\r\n\r\n");
        resultStr = resultStr.replace(/<br \/>/gi, "\r\n");
        resultStr = resultStr.replace(/<br>/gi, "\r\n");
        return  resultStr.replace( /<[^<|>]+?>/gi,'' );
    }

}
