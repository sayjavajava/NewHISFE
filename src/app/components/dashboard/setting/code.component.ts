import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {ICDCodeModel} from "../../../models/ICDCodeModel";
import {RequestsService} from "../../../services/requests.service";
import {HISUtilService} from "../../../services/his-util.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'icd-code-component',
    templateUrl: '../../../templates/dashboard/setting/code.template.html',
})
export class CodeComponent implements OnInit {
    public iCDModel: ICDCodeModel = new ICDCodeModel();
    private iCDData: any;
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: any;
    searchCode: string = "";
    searched: boolean = false;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | ICD Code';
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.getICDsFromServer(0);
        }
    }

    getPageWiseICDs(page: number) {
        this.data = [];
        if (this.searched) {
            this.searchByCode(page);
        } else {
            this.getICDsFromServer(page);
        }
    }

    refreshCodesTable() {
        this.searched = false;
        this.getICDsFromServer(0);
    }

    refreshICDsTable(page: number) {
        this.getICDsFromServer(page)
    }

    deleteICD(iCDId: any) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.deleteRequest(
                '/setting/icd/code/delete?icdId=' + iCDId,
                {})
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'ICD Code');
                            this.getPageWiseICDs(this.currPage);
                        } else {
                            this.getPageWiseICDs(this.currPage);
                            this.notificationService.error(response['responseMessage'], 'ICD Code');
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

    getICDsFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            '/setting/icd/codes/' + page)
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

    saveICDCode(form: NgForm) {
        if (form.valid) {
            if (window.localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(
                    '/setting/icd/code/save',
                    JSON.parse(JSON.stringify(this.iCDModel))
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_SAVE_SUC_01') {
                            this.iCDModel = new ICDCodeModel();
                            this.iCDData = response['responseData'];
                            this.notificationService.success(response['responseMessage'], 'ICD Code');
                            document.getElementById('close-btn').click();
                            this.refreshICDsTable(0);
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
        } else {
            this.notificationService.error('Required Fields are missing', 'ICD Code');
        }
    }

    updateICDCode() {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.requestsService.putRequest(
                '/setting/icd/code/update',
                JSON.parse(JSON.stringify(this.iCDModel))
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_CODE_UPDATE_SUC_07') {
                        this.iCDModel = new ICDCodeModel();
                        this.iCDData = response['responseData'];
                        this.notificationService.success(response['responseMessage'], 'ICD Code');
                        document.getElementById('close-btn-update').click();
                        this.refreshICDsTable(0);
                    } else {
                        this.iCDData = response['responseData'];
                        this.notificationService.error(response['responseMessage'], 'ICD Code')
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

    editICDCode(iCDCode: any) {
        this.iCDModel = iCDCode;
    }

    onAddICDCodePopupLoad() {
        this.iCDModel = new ICDCodeModel();
    }

    searchByCode(pageNo: number) {

        if (window.localStorage.getItem(btoa('access_token'))) {
            this.searched = true;
            this.requestsService.getRequest(
                '/setting/icd/code/search/' + pageNo + '?code=' + this.searchCode)
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
                            this.notificationService.warn('ICD Code not found');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        }
    }
}
