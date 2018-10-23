import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {VitalSetupModel} from "../../../model/VitalSetupModel";

@Component({
    selector: 'vital-setup-template-component',
    templateUrl: '../../../templates/dashboard/setting/vital-setup.template.html',
})
export class VitalSetupComponent {

    vitalSetupTemplateList: VitalSetupModel[];
    vitalSetupTemplate: VitalSetupModel = new VitalSetupModel();
    id: number;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Vital Setup Template';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getVitalSetupList();
        }
    }

    getVitalSetupList() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(AppConstants.FETCH_VITALS_CONFIGURATIONS
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.vitalSetupTemplateList = response['responseData'];
                        // console.log("Length : " + this.prefixTemplateList.length);
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Vital Setup Configurations');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], 'Vital Setup Configurations');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }


    editVitalSetup(formData: NgForm) {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(AppConstants.VITALS_CONFIGURATION_SAVE , this.vitalSetupTemplate)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.vitalSetupTemplateList = response['responseData'];
                            document.getElementById('close-btn-Prefix').click();
                            this.notificationService.success(response['responseMessage'], 'Vital Setup Configurations');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Vital Setup Configurations');
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
        if(editModule) {
            this.vitalSetupTemplate = editModule;
            console.log("status : " + this.vitalSetupTemplate.status);
        }else{
            this.vitalSetupTemplate = new VitalSetupModel();
        }
    }
}