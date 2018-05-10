import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from "../../../services/requests.service";
import {HISUtilService} from "../../../services/his-util.service";
import {Router} from "@angular/router";
import {ICDVersionModel} from "../../../models/ICDVersionModel";

@Component({
    selector: 'icd-version-component',
    templateUrl: '../../../templates/dashboard/setting/version.template.html',
})
export class VersionComponent implements OnInit {
    public iCDVersionModel: ICDVersionModel = new ICDVersionModel();
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: any;
    searchVersion: string = "";
    private searched: boolean;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Manage ICD';
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.getICDsVersionFromServer(0);
        }
    }

    getPageWiseICDsVersion(page: number) {
        this.data = [];
        if (this.searched){
            this.searchByVersion(page);
        }else {
            this.getICDsVersionFromServer(page);
        }
    }
    refreshVersionsTable() {
        this.searched = false;
        this.getICDsVersionFromServer(0);
    }
    getICDsVersionFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            '/setting/icd/versions/' + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_SUC_02') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }


    editICDVersion(iCDVersion: any) {
        this.iCDVersionModel = iCDVersion;
    }

    updateICDVersion() {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.putRequest(
                '/setting/icd/version/update',
                JSON.parse(JSON.stringify(this.iCDVersionModel))
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_CODE_UPDATE_SUC_07') {
                        this.iCDVersionModel = new ICDVersionModel();
                        this.notificationService.success(response['responseMessage'], 'ICD');
                        document.getElementById('close-btn-update').click();
                        this.getPageWiseICDsVersion(this.currPage);
                    } else {
                        this.notificationService.error(response['responseMessage'], 'ICD')
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

    onAddICDVersionPopupLoad() {
        this.iCDVersionModel = new ICDVersionModel();
    }
    searchByVersion(page:number) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.searched = true;
            this.requestsService.getRequest(
                '/setting/icd/version/search/'+page+'?searchVersion=' + this.searchVersion)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_SUC_02') {
                            this.nextPage = response['responseData']['nextPage'];
                            this.prePage = response['responseData']['prePage'];
                            this.currPage = response['responseData']['currPage'];
                            this.pages = response['responseData']['pages'];
                            this.data = response['responseData']['data'];
                        } else {
                            this.nextPage = 0;
                            this.prePage = 0;
                            this.currPage = 0;
                            this.pages = [];
                            this.data =[];
                            this.notificationService.warn('ICD not found');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        }
    }

    saveICDVersion() {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(
                '/setting/icd/version/save',
                JSON.parse(JSON.stringify(this.iCDVersionModel))
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_VERSION_SUC_08') {
                        this.iCDVersionModel = new ICDVersionModel();
                        this.notificationService.success(response['responseMessage'], 'ICD');
                        document.getElementById('close-btn-ICDVersion').click();
                        this.refreshICDsVersionTable(0);
                    } else {
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

    deleteICDVersion(iCDVersionId: any) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.deleteRequest(
                '/setting/icd/version/delete?iCDVersionId=' + iCDVersionId,
                {})
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'ICD Version');
                            this.getPageWiseICDsVersion(this.currPage);
                        } else {
                            this.getPageWiseICDsVersion(this.currPage);
                            this.notificationService.error(response['responseMessage'], 'ICD Version');
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

    refreshICDsVersionTable(page: number) {
        this.getICDsVersionFromServer(page)
    }

}
