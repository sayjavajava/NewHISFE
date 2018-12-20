import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {ActivatedRoute, Router} from "@angular/router";
import {SmsTemplateModel} from "../../../model/SmsTemplateModel";
import {PrefixTemplateModel} from "../../../model/PrefixTemplateModel";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'prefix-template-component',
    templateUrl: '../../../templates/dashboard/setting/prefix.template.html',
})
export class PrefixTemplateComponent {

    smsTemplateList: SmsTemplateModel[] = [];
    prefixTemplateList: PrefixTemplateModel[];
    prefixTemplate: PrefixTemplateModel = new PrefixTemplateModel();

    id: number;
    cols: any[];

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {
        this.cols = [
            {field: "module", header: "Module"},
            {field: "name", header: "Prefix"},
            {field: "startValue", header: "Start Value"},
            {field: "currentValue", header: "Current Value"},
            {field: "action", header: "Action"}
        ];
    }

    ngOnInit() {
        document.title = 'HIS | Email Template';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getAllPrefixList();
        }
    }

    getAllPrefixList() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(AppConstants.FETCH_PREFIX_CONFIGURATIONS
            ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.prefixTemplateList = response['responseData'];
                           // console.log("Length : " + this.prefixTemplateList.length);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Prefix Configurations');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error(Response['responseMessage'], 'Prefix Configurations');
                    }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }


    editPrefixModule(formData: NgForm) {
        if (localStorage.getItem(btoa('access_token'))) {



            if (this.prefixTemplate.module == null || this.prefixTemplate.module.trim().length <= 0) {
                this.notificationService.error("Please provide Module");
                return;
            }
            if (this.prefixTemplate.currentValue == "" || this.prefixTemplate.currentValue == null) {

                this.notificationService.error('Please provide Current Value');

                return;
            }

            if (this.prefixTemplate.startValue == 1) {

                this.notificationService.error('Please provide Start Value');

                return;
            }
            if (this.prefixTemplate.name == "" || this.prefixTemplate.name == null) {

                this.notificationService.error('Please provide Name');

                return;
            }

            this.requestsService.postRequest(AppConstants.PREFIX_CONFIGURATION_SAVE , this.prefixTemplate)
             .subscribe(
               (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            // this.prefixTemplateList = response['responseData'];
                            document.getElementById('close-btn-Prefix').click();
                            this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                            this.notificationService.success(response['responseMessage'], 'Update Module Prefix');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Update Module Prefix');
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


    edit(editModule: any){
        this.prefixTemplate = editModule;
    }
}