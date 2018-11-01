import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {ActivatedRoute, Router} from "@angular/router";
import {GeneralLedgerModel} from "../../../model/GeneralLedgerModel";
import {AccountConfigModel} from "../../../model/AccountConfigModel";


@Component({
    selector: 'account-setup-component',
    templateUrl: '../../../templates/dashboard/setting/account-setup.template.html',
})
export class AccountSetupComponent{

    chartOfAccountList: GeneralLedgerModel[];
    chartOfAccount: GeneralLedgerModel = new GeneralLedgerModel();
    accountConfig: AccountConfigModel = new AccountConfigModel();

    id: number;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS |Account Setup Template';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getAllAccountsList();
        }
    }

    getAllAccountsList() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(AppConstants.FETCH_ACCOUNTS_CONFIGURATIONS
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.chartOfAccountList = response['responseData'];
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Account Setup');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], 'Account Setup');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }


    updateAssetsConfig() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(AppConstants.ASSETS_CONFIG_SAVE , this.accountConfig)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success(response['responseMessage'], 'Asset Account Setup');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Asset Account Setup');
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


    updateLiabilityConfig() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(AppConstants.LIABILTY_CONFIG_SAVE , this.accountConfig)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success(response['responseMessage'], 'Liability Account Setup');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Liability Account Setup');
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


    updateRevenueConfig() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(AppConstants.REVENUE_CONFIG_SAVE , this.accountConfig)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success(response['responseMessage'], 'Revenue Account Setup');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Revenue Account Setup');
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


    updateCOSConfig() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(AppConstants.COS_CONFIG_SAVE , this.accountConfig)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success(response['responseMessage'], 'COGS Account Setup');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'COGS Account Setup');
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


    updateExpenseConfig() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(AppConstants.EXPENSE_CONFIG_SAVE , this.accountConfig)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success(response['responseMessage'], 'Expense Account Setup');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Expense Account Setup');
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