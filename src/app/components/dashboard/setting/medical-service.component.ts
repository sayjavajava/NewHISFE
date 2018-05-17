import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {MedicalService} from '../../../models/medical-service';
import {Router} from "@angular/router";


@Component({
    selector: 'medical-services-component',
    templateUrl: '../../../templates/dashboard/setting/medical-services.template.html',
})
export class MedicalServiceComponent implements OnInit {

    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: MedicalService[] = [];

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router:Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Medical Services';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getPageWiseMedicalServicesFromServer(0);
        }
    }

    getPageWiseMedicalServicesFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'MED_SER_SUC_01') {
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

    deleteMedicalServices(msId: number, dptId: number, branchId: number) {
        if (msId > 0) {
            this.requestsService.deleteRequest(
                AppConstants.DELETE_MEDICAL_SERVICES_URL + 'msId=' + msId + '&dptId=' + dptId + '&branchId=' + branchId,
                {})
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MED_SER_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Medical Service');
                            this.getPageWiseMedicalServicesFromServer(this.currPage);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Medical Service');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        }
    }
}
