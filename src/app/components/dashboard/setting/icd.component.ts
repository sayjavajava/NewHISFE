import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {ICDModel} from "../../../models/ICDModel";
import {RequestsService} from "../../../services/requests.service";
import {HISUtilService} from "../../../services/his-util.service";
import {Router} from "@angular/router";
import {ICDVersionModel} from "../../../models/ICDVersionModel";

@Component({
    selector: 'icd-component',
    templateUrl: '../../../templates/dashboard/setting/icd.template.html',
})
export class ICDComponent implements OnInit {
    public iCDModel: ICDModel = new ICDModel();
    private iCDVersions: ICDVersionModel [];
    private iCDData: any;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Manage ICD';
    }

    onAddICDPopupLoad() {
        /*this.notificationService.success('ICD', 'Popup loaded.')*/
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                '/setting/icd/iCDCodeVersions')
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_SUC_01') {
                            this.iCDModel = new ICDModel();
                            this.iCDVersions = response['responseData'];
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

    saveICDVersion() {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(
                '/setting/icd/save',
                JSON.parse(JSON.stringify(this.iCDModel))
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_SAVE_SUC_01') {
                        this.iCDModel = new ICDModel();
                        this.iCDData = response['responseData'];
                        this.notificationService.success('ICD', response['responseMessage'])
                    } else {
                        this.iCDData = response['responseData'];
                        this.notificationService.error('ICD', response['responseMessage'])
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
