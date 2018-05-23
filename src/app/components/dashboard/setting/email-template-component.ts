import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {EmailTemplateModel} from "../../../models/EmailTemplateModel";
import {Router} from "@angular/router";


@Component({
    selector: 'service-tax-component',
    templateUrl: '../../../templates/dashboard/setting/email-template.template.html',

})
export class EmailTemplateComponent implements OnInit {

    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    dataEmailTemplate: EmailTemplateModel[] = [];
    searchTitle: string = "";
    searched: boolean = false;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {

    }

    ngOnInit() {
        document.title = 'HIS | Email Template';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getEmailTemplateFromServer(0);
        }
    }

    getEmailTemplateFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.EMAIL_TEMPLATE_FETCH_ALL_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'EMAIL_TEMP_SUC_02') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.dataEmailTemplate = response['responseData']['data'];
                        // this.notificationService.success(response['responseData'],'Email Template');
                    } else {
                        this.nextPage = "";
                        this.prePage = "";
                        this.currPage = '';
                        this.pages = [];
                        // this.dataEmailTemplate = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }


    deleteEmailTemplate(id: any) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are you source.")) return;
            this.requestsService.deleteRequest(
                AppConstants.EMAIL_TEMPLATE_DELETE_URL + id)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'EMAIL_TEMP_SUC_06') {
                            this.notificationService.success(response['responseMessage'], 'Email Template');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Email Template');
                        }
                        this.getPageWiseEmailTemplate(this.currPage);
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }

    refreshEmailTemplate() {
        this.dataEmailTemplate = [];
        this.searched = false;
        this.getEmailTemplateFromServer(0);
    }

    getPageWiseEmailTemplate(page: number) {
        this.dataEmailTemplate = [];
        if (this.searched) {
            this.searchByTitle(page);
        } else {
            this.getEmailTemplateFromServer(page);
        }
    }

    searchByTitle(page: any) {
        if (localStorage.getItem(btoa('access_token'))) {
            this.searched = true;
            this.requestsService.getRequest(
                AppConstants.EMAIL_TEMPLATE_SEARCH_URL + page + '?title=' + this.searchTitle)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'EMAIL_TEMP_SUC_10') {
                            this.nextPage = response['responseData']['nextPage'];
                            this.prePage = response['responseData']['prePage'];
                            this.currPage = response['responseData']['currPage'];
                            this.pages = response['responseData']['pages'];
                            this.dataEmailTemplate = response['responseData']['data'];
                            this.notificationService.success(response['responseMessage'], 'Email Template')
                        } else {
                            this.nextPage = 0;
                            this.prePage = 0;
                            this.currPage = 0;
                            this.pages = [];
                            this.dataEmailTemplate = [];
                            this.notificationService.error(response['responseMessage'], 'Email Template');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        }
    }

}
