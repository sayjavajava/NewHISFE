import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../../services/notification.service";
import {RequestsService} from "../../../services/requests.service";
import {HISUtilService} from "../../../services/his-util.service";
import {Router} from "@angular/router";
import {SMTPS} from "../../../model/SMTPS";
import {AmazonSES} from "../../../model/AmazonSES";
import {NgForm} from '@angular/forms';
import {AppConstants} from "../../../utils/app.constants";

@Component({
    selector: 'service-tax-component',
    templateUrl: '../../../templates/dashboard/setting/email-configuration.template.html',

})

export class EmailConfigurationComponent {

    smtps: SMTPS = new SMTPS();
    amazonSES: AmazonSES = new AmazonSES();

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
        this.getAllConfigurations();
    }

    getAllConfigurations() {
        if (localStorage.getItem(btoa('access_token'))) {

            this.requestsService.getRequest(AppConstants.FETCH_EMAIL_CONFIGURATIONS
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        if (response['responseData'].length > 0) {

                            let smtpConfiguration: SMTPS[] = response['responseData'].filter((x: any) => x.serverType === "SMTP");
                            let sesConfiguration: AmazonSES[] = response['responseData'].filter((x: any) => x.serverType === "SES");

                            if (smtpConfiguration.length > 0) {
                                this.smtps = smtpConfiguration[0];
                            }
                            if (sesConfiguration.length > 0) {
                                this.amazonSES = response['responseData'].filter((x: any) => x.serverType === "SES")[0];
                            }
                        }
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Email Configurations');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], 'Email Configurations');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }

    saveSMTPSConfiguration(smtpsForm: NgForm, sesForm: NgForm) {
        if (smtpsForm.invalid || sesForm.invalid) {
            this.notificationService.error('Please provide required Values', 'Patient');
            return;
        } else {
            if (localStorage.getItem(btoa('access_token'))) {

                this.requestsService.postRequest(
                    AppConstants.EMAIL_CONFIGURATION_SMTPS_SAVE, this.smtps
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success(response['responseMessage'], 'SMTPS Configuration');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'SMTPS Configurations');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error(Response['responseMessage'], 'SMTPS Configurations');
                    }
                );
            } else {
                this.router.navigate(['/login']);
            }
        }
    }

    saveSESConfiguration(smtpsForm: NgForm, sesForm: NgForm) {
        if (smtpsForm.invalid || sesForm.invalid) {
            this.notificationService.error('Please provide required Values', 'Patient');
            return;
        } else {
            if (localStorage.getItem(btoa('access_token'))) {

                this.requestsService.postRequest(
                    AppConstants.EMAIL_CONFIGURATION_SES_SAVE, this.amazonSES
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success(response['responseMessage'], ' AmazonSES Configurations');
                        } else {
                            this.notificationService.error(response['responseMessage'], ' AmazonSES Configurations');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error(Response['responseMessage'], ' AmazonSES Configurations');
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
            } else {
                this.router.navigate(['/login']);
            }
        }
    }


}