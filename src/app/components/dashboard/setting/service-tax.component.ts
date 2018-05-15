import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {ServiceTax} from '../../../models/service-tax';


@Component({
    selector: 'service-tax-component',
    templateUrl: '../../../templates/dashboard/setting/service-tax.template.html',

})
export class ServiceTaxComponent implements OnInit {

    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: ServiceTax[] = [];

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService) {

    }

    ngOnInit() {
        document.title = 'HIS | Service Tax';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getCodeVersionsFromServer(0);
        }
    }

    getCodeVersionsFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_TAX_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SER_TAX_SUC_01') {
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

    // deleteTax(taxId: any) {
    //     if (localStorage.getItem(btoa('access_token'))) {
    //         this.requestsService.deleteRequest(
    //             AppConstants.ICD_CODE_VERSION_DELETE + associateICDCVId,
    //             {})
    //             .subscribe(
    //                 (response: Response) => {
    //                     if (response['responseCode'] === 'ICD_CODE_VERSION_DEL_SUC_17') {
    //                         this.notificationService.success(response['responseMessage'], 'ICD');
    //                         this.getPageWiseICDs(this.currPage);
    //                     } else {
    //                         this.getPageWiseICDs(this.currPage);
    //                         this.notificationService.error(response['responseMessage'], 'ICD');
    //                     }
    //                 },
    //                 (error: any) => {
    //                     this.HISUtilService.tokenExpired(error.error.error);
    //                 }
    //             );
    //     } else {
    //         this.router.navigate(['/login']);
    //     }
    // }

}
