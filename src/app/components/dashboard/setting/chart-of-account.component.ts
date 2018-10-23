import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {GeneralLedgerModel} from "../../../model/GeneralLedgerModel";

@Component({
    selector: 'chart-of-account-template-component',
    templateUrl: '../../../templates/dashboard/setting/chart-of-account.template.html',
})
export class ChartOfAccountComponent {

    chartOfAccountList: GeneralLedgerModel[];
    chartOfAccount: GeneralLedgerModel = new GeneralLedgerModel();
    id: number;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Chart Of Account Template';
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
                        this.notificationService.error(response['responseMessage'], 'Chart of Accounts Configurations');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], 'Chart of Accounts Configurations');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }


    editAccountSetUp(formData: NgForm) {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(AppConstants.ACCOUNTS_CONFIGURATION_SAVE , this.chartOfAccount)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.chartOfAccountList = response['responseData'];
                            document.getElementById('close-btn-Prefix').click();
                            this.notificationService.success(response['responseMessage'], 'Chart of Account');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Chart of Accounts');
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


    edit(editConfiguration: any){
        if(editConfiguration){
            this.chartOfAccount = editConfiguration;
        }else{
            this.chartOfAccount = new GeneralLedgerModel();
        }
    }

    parentTypeSelected(parentType : any){
        this.chartOfAccount.parentType = parentType;
    }

    accountTypeSelected(accountType : any){
        this.chartOfAccount.accountType = accountType;
    }
}