import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from "../../../services/requests.service";
import {HISUtilService} from "../../../services/his-util.service";
import {Router} from "@angular/router";
import {ICDVersionModel} from "../../../models/ICDVersionModel";
import {ICDCodeVersionModel} from "../../../models/ICDCodeVersionModel";
import {ICDCodeModel} from "../../../models/ICDCodeModel";

@Component({
    selector: 'manage-icd-component',
    templateUrl: '../../../templates/dashboard/setting/code-version.template.html',
})
export class CodeVersionComponent implements OnInit {
    public iCDCVM: ICDCodeVersionModel = new ICDCodeVersionModel();
    private iCDVersions: ICDVersionModel [];
    private iCDCodes: ICDCodeModel [];
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: ICDCodeVersionModel[] = [];
    searchVersion: string = "";
    searched: boolean;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | ICD Code Version';
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.getICDCVsFromServer(0);
        }
    }

    versionsPopupLoadByServer() {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                '/setting/icd/versions')
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_SUC_01') {
                            this.iCDCVM = new ICDCodeVersionModel();
                            this.iCDVersions = [];
                            this.iCDVersions = response['responseData'];
                            // this.iCDCVM.selectedICDVersionId = response['responseData'][0].id;
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

    codesPopupLoadByServer() {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                '/setting/icd/codes')
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_SUC_01') {
                            this.iCDCVM = new ICDCodeVersionModel();
                            this.iCDCodes = [];
                            this.iCDCodes = response['responseData'];
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

    onAddICDCVMPopupLoad() {
        this.versionsPopupLoadByServer();
        this.codesPopupLoadByServer();
    }

    getPageWiseICDs(page: number) {
        this.data = [];
        if (this.searched) {
            this.searchCodeVersionByVersionName(page);
        } else {
            this.getICDCVsFromServer(page);
        }
    }

    refreshCodeVersionTable() {
        this.searched = false;
        this.getICDCVsFromServer(0);
    }

    refreshICDsTable(page: number) {
        this.getICDCVsFromServer(page)
    }

    deleteCodeVersion(associateICDCVId: any) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.deleteRequest(
                '/setting/icd/codeVersion/delete?associateICDCVId=' + associateICDCVId,
                {})
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'ICD');
                            this.getPageWiseICDs(this.currPage);
                        } else {
                            this.getPageWiseICDs(this.currPage);
                            this.notificationService.error(response['responseMessage'], 'ICD');
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

    getICDCVsFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            '/setting/icd/codeVersions/' + page)
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

    saveCodeVersion() {
        if (this.iCDCVM.selectedICDVersionId === 0) {
            this.notificationService.error('Please select Version ', 'Association');
            return;
        }

        this.iCDCVM.iCDCodes = this.iCDCodes;
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(
                '/setting/icd/codeVersion/save',
                JSON.parse(JSON.stringify(this.iCDCVM))
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_ASSOCIATE_SUC_01') {
                        this.iCDCVM = new ICDCodeVersionModel();
                        this.notificationService.success(response['responseMessage'], 'ICD');
                        document.getElementById('close-btn').click();
                        this.refreshICDsTable(0);
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

    searchCodeVersionByVersionName(page: number) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.searched = true;
            this.requestsService.getRequest(
                '/setting/icd/codeVersion/search/' + page + '?versionName=' + this.searchVersion)
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
                            this.data = [];
                            this.notificationService.warn('Not found');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        }
    }

    versionChanged(associatedICDCVId: any, checkBoxId: any) {
        if (associatedICDCVId === 0) {
            for (let obj of this.iCDCodes) {
                obj.checkedCode = false;
            }
            return;
        }
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                '/setting/icd/version/codes/?versionId=' + associatedICDCVId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_ASSOCIATED_FOUND_SUC_02') {
                            this.iCDCVM.selectedICDCodes = [];
                            this.iCDCVM.selectedICDCodes = response['responseData'];
                            for (let obj of this.iCDCodes) {
                                obj.checkedCode = false;
                            }
                            for (let selectedICDCode  of this.iCDCVM.selectedICDCodes) {
                                for (let obj of this.iCDCodes) {
                                    if (obj.id === selectedICDCode.id) {
                                        obj.checkedCode = true;
                                    }
                                }
                            }

                        } else {
                            for (let obj of this.iCDCodes) obj.checkedCode = false;
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        }
    }
}
