import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from "../../../services/requests.service";
import {HISUtilService} from "../../../services/his-util.service";
import {Router} from "@angular/router";
import {ICDVersionModel} from "../../../model/ICDVersionModel";
import {ICDCodeVersionModel} from "../../../model/ICDCodeVersionModel";
import {ICDCodeModel} from "../../../model/ICDCodeModel";
import {AppConstants} from "../../../utils/app.constants";

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
    searchCodeVersion: string = "";
    searched: boolean;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | ICD Code Version';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getCodeVersionsFromServer(0);
        }
    }

    versionsPopupLoadByServer() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                AppConstants.ICD_VERSIONS)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_VERSIONS_FOUND_03') {
                            this.iCDCVM = new ICDCodeVersionModel();
                            this.iCDVersions = [];
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

    codesPopupLoadByServer() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                AppConstants.ICD_CODES)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_SUC_16') {
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
            this.getCodeVersionsFromServer(page);
        }
    }

    refreshCodeVersionTable() {
        this.searched = false;
        this.searchCodeVersion = "";
        this.getCodeVersionsFromServer(0);
    }

    refreshICDsTable(page: number) {
        this.getCodeVersionsFromServer(page)
    }

    deleteCodeVersion(associateICDCVId: any) {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.deleteRequest(
                AppConstants.ICD_CODE_VERSION_DELETE_URL + associateICDCVId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_CODE_VERSION_DEL_SUC_17') {
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

    getCodeVersionsFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.ICD_CODE_VERSIONS + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_SUC_16') {
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
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(
                AppConstants.ICD_CODE_VERSION_SAVE_URL,
                JSON.parse(JSON.stringify(this.iCDCVM))
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_ASSOCIATE_SUC_18') {
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
        if (localStorage.getItem(btoa('access_token'))) {
            this.searched = true;
            this.requestsService.getRequest(
                AppConstants.ICD_CODE_VERSION_SEARCH + page + '?versionName=' + this.searchCodeVersion)
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

    versionChanged(associatedICDCVId: any) {
        if (associatedICDCVId === 0) {
            for (let obj of this.iCDCodes) {
                obj.checkedCode = false;
            }
            return;
        }
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                AppConstants.ICD_VERSION_CODES_VERSION + associatedICDCVId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_ASSOCIATED_FOUND_SUC_02') {
                            this.iCDCVM.selectedICDCodes = [];
                            this.iCDCVM.selectedICDCodes = response['responseData'];
                            this.iCDCVM.description = response['responseData'][0].descriptionCodeVersion;
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
