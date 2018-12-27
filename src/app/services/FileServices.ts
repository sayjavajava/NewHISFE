import {Injectable} from '@angular/core';
import {RequestsService} from "./requests.service";
import {AppConstants} from "../utils/app.constants";
import {HISUtilService} from "./his-util.service";
import {NotificationService} from "./notification.service";

@Injectable()
export class FileServices {

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService) {
    }

    downloadSampleFile(fileName: string) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are you sure want to the Download Sample File?')) return;
            if (fileName === 'icd_code') {
                this.requestsService.getRequest(AppConstants.ICD_CODE_DOWNLOAD_SAMPLE_FILE)
                    .subscribe((response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success('ICD Code', response['responseMessage']);
                        } else {
                            this.notificationService.error('ICD Code', response['responseMessage']);
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
            }
        }
    }

    importData(fileName: string, event: any) {
        if (localStorage.getItem(btoa('access_token'))) {
            // if (!confirm('Are you sure want to Import Data?')) return;
            if (fileName === 'icd_code') {

            }
        }
    }
}
