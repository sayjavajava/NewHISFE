/**
 * Created by jamal on 10/24/2018.
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {ConformationDialogService} from '../../../services/ConformationDialogService';
import {DataService} from '../../../services/DataService';
import {NotificationService} from '../../../services/notification.service';
import {PatientGroupModel} from '../../../model/patient-group.model';
import {AppConstants} from '../../../utils/app.constants';
import {CurrencyModel} from '../../../model/currency.model';


@Component({
    selector: 'patient-group',
    templateUrl: '../../../templates/dashboard/setting/currency.template.html',
})

export class CurrencyComponent implements OnInit, OnDestroy {

    currency: CurrencyModel = new CurrencyModel();
    nextPage: number;
    prePage: number;
    currPage: number;
    pages: number[] = [];
    data: CurrencyModel[] = [];

    constructor(private router: Router, private requestsService: RequestsService,
                private HISUtilService: HISUtilService, private dataService: DataService,
                private notificationService: NotificationService, private confirmationDialogService: ConformationDialogService) {
    }

    ngOnInit(): void {

        if (window.localStorage.getItem(btoa('access_token'))) {
            this.getPageWiseCurrencyFromServer(0);
        } else {
            this.router.navigate(['/login']);
        }
    }

    ngOnDestroy(): void {
    }

    addCurrency() {
        this.currency = new CurrencyModel();
    }

    saveCurrency() {

        if (this.currency.ios == '') {
            this.notificationService.error('Currency', 'Please enter ios.');
            document.getElementById('ios').focus();
            return;
        }
        this.requestsService.postRequest(AppConstants.CURRENCY_SAVE_URL, this.currency)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CURRENCY_SUC_1') {
                        this.notificationService.success(response['responseMessage'], 'Currency');
                        this.getPageWiseCurrencyFromServer(0);
                        this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Currency');
                    }
                },
                (error: any) => {
                    //console.log(error.json())
                    this.notificationService.error(error.error.error);
                }
            );
    }

    getPageWiseCurrencyFromServer(page: number) {

        this.requestsService.getRequest(AppConstants.CURRENCY_FETCH_ALL_PAGINATED_URI + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CURRENCY_SUC_12') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    console.log(error.error.error);
                    this.notificationService.error(error.error.error);
                }
            );
    }

    editPopupCurrencyLoad(c: CurrencyModel) {
        this.requestsService.getRequest(AppConstants.CURRENCY_GET_URL + c.id)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CURRENCY_SUC_5') {
                        this.currency = response['responseData'];
                    } else {
                        this.notificationService.error(response['responseMessage']);
                    }
                }
            ),
            (error: any) => {
                this.notificationService.error(error.error.error);
            }
    }

    updateCurrency() {

        if (this.currency.ios == '') {
            this.notificationService.error('Please enter ios.', 'Currency');
            document.getElementById('ios').focus();
            return;
        }

        if (this.currency.id <= 0) {
            this.notificationService.error('Please select proper record again.', 'Currency');
            this.getPageWiseCurrencyFromServer(0);
            return;
        }

        this.requestsService.putRequest(AppConstants.CURRENCY_UPDATE_URL, this.currency)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CURRENCY_SUC_7') {
                        this.notificationService.success(response['responseMessage'], 'Currency');
                        this.getPageWiseCurrencyFromServer(0);
                        this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Currency');
                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                }
            );
    }


    getPageWiseCurrency(page: any) {

        this.getPageWiseCurrencyFromServer(page);
    }

    deleteCurrency(id: any) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.CURRENCY_DELETE_URI + id)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'CURRENCY_SUC_10') {
                            this.notificationService.success(response['responseMessage'], 'Currency');
                            this.getPageWiseCurrencyFromServer(0);
                        } else {
                            this.getPageWiseCurrencyFromServer(0);
                            this.notificationService.error(response['responseMessage'], 'Currency');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error(Response['responseMessage'], 'Currency');
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }


}
