import {Component, Inject} from "@angular/core";
import {NotificationService} from "../../../services/notification.service";
import {RequestsService} from "../../../services/requests.service";
import {HISUtilService} from "../../../services/his-util.service";
import {AppConstants} from "../../../utils/app.constants";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {GeneralLedgerModel} from "../../../model/GeneralLedgerModel";
import {AccountConfigModel} from "../../../model/AccountConfigModel";
import {BankAccountModel} from "../../../model/BankAccountModel";
import {DOCUMENT} from "@angular/common";
import {isNullOrUndefined} from "util";

@Component({
    selector: "chart-of-account-template-component",
    templateUrl: "../../../templates/dashboard/setting/chart-of-account.template.html",
})
export class ChartOfAccountComponent {

    chartOfAccountList: GeneralLedgerModel[];
    chartOfAccount: GeneralLedgerModel = new GeneralLedgerModel();
    id: number;
    accountType :any ;

    accountConfig: AccountConfigModel = new AccountConfigModel();
    /*accountConfigUpdate: AccountConfigModel = new AccountConfigModel();*/

    showBankDetailsDiv: boolean;

    selectedParentType: any = "";
    element: any;
    elementByDiv: any;
    elementByClass: any[];

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                /*private route: ActivatedRoute,*/
                private router: Router
        , @Inject(DOCUMENT) document: any) {
      //  this.chartOfAccount.bankAccount = new BankAccountModel;
        this.showBankDetailsDiv = false;
    }

    ngOnInit() {
        document.title = 'HIS | Chart Of Account Template';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getAllAccountsList();
        }
        this.accountType = [
            {label: 'Assets', value: 'Assets'},
            {label: 'Liabilities', value: 'Liabilities'},
            {label: 'Revenue', value: 'Revenue'},
            {label: 'Cost of Goods Sold', value: 'Cost of Goods Sold'},
            {label: 'Expense', value: 'Expense'}
        ];

        this.element = document.getElementById("addAccDiv") as HTMLElement;
        this.element.style.height = "190px";

        this.elementByClass = Array.from(document.getElementsByClassName("scroller"));

        this.elementByDiv = document.getElementById("slimScrollDiv");
        if (!isNullOrUndefined(this.elementByDiv)) {
            this.elementByDiv.style.height = "180px";
        }
    }

    getAllAccountsList() {
        if (localStorage.getItem(btoa("access_token"))) {
            this.requestsService.getRequest(AppConstants.FETCH_ACCOUNTS_CONFIGURATIONS
            ).subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "SUCCESS") {
                        this.chartOfAccountList = response["responseData"].accountList;
                        this.accountConfig = response["responseData"].accountConfig;
                    } else {
                        this.notificationService.error(response["responseMessage"], "Chart of Accounts Configurations");
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response["responseMessage"], "Chart of Accounts Configurations");
                }
            );
        } else {
            this.router.navigate(["/login"]);
        }
    }


    editAccountSetUp(formData: NgForm) {
        if (localStorage.getItem(btoa("access_token"))) {
            console.log(this.chartOfAccount);
            this.requestsService.postRequest(AppConstants.ACCOUNTS_CONFIGURATION_SAVE, this.chartOfAccount)
                .subscribe(
                    (response: Response) => {
                        if (response["responseCode"] === "SUCCESS") {
                            this.chartOfAccountList = response["responseData"];
                            document.getElementById("close-btn-Prefix").click();
                            this.notificationService.success(response["responseMessage"], "Chart of Account");
                        } else {
                            this.notificationService.error(response["responseMessage"], "Chart of Accounts");
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(["/login"]);
        }
    }


    edit(editConfiguration: any) {
        if (editConfiguration) {
            this.selectedParentType = this.chartOfAccount = editConfiguration;
        } else {
            this.chartOfAccount = new GeneralLedgerModel();
        }
    }

    parentTypeSelected(parentTypeObj : any){
        let parentType = parentTypeObj.value;
        this.chartOfAccount.parentType = parentType;
    //parentTypeSelected(parentType: any) {
        this.selectedParentType = parentType;
        this.elementByDiv = document.getElementById("slimScrollDiv");

        if (this.chartOfAccount.parentType === "Bank") {
            this.showBankDetailsDiv = true;
            this.chartOfAccount.bankAccount = new BankAccountModel();
            this.element.style.height = "380px";

            for (let i = 0; i < this.elementByClass.length; i++) {
                if (this.elementByClass[i].style.height == "180px") {
                   this.elementByClass[i].style.height = '350px';
                }
            }

            if (this.elementByDiv) {
                this.elementByDiv.style.height = "350px";
            }
        } else {
            this.showBankDetailsDiv = false;
            this.chartOfAccount.bankAccount = null;
            this.element.style.height = "190px";

            for (let i = 0; i < this.elementByClass.length; i++) {
                if (this.elementByClass[i].style.height == "350px") {
                    this.elementByClass[i].style.height = '180px';
                }
            }

            if (this.elementByDiv) {
                this.elementByDiv.style.height = "180px";
            }
        }
    }

    accountTypeSelected(accountType: any) {
        this.chartOfAccount.accountType = accountType;
    }
}