import {Component} from "@angular/core";
import {NotificationService} from "../../../services/notification.service";
import {RequestsService} from "../../../services/requests.service";
import {HISUtilService} from "../../../services/his-util.service";
import {AppConstants} from "../../../utils/app.constants";
import {ActivatedRoute, Router} from "@angular/router";
import {GeneralLedgerModel} from "../../../model/GeneralLedgerModel";
import {AccountConfigModel} from "../../../model/AccountConfigModel";


@Component({
    selector: "account-setup-component",
    templateUrl: "../../../templates/dashboard/setting/account-setup.template.html",
})
export class AccountSetupComponent {

    chartOfAccountList: GeneralLedgerModel[];
    chartOfAccount: GeneralLedgerModel = new GeneralLedgerModel();
    accountConfig: AccountConfigModel = new AccountConfigModel();

    id: number;

    assetsAccountList: GeneralLedgerModel[];
    liabilitiesAccountList: GeneralLedgerModel[];
    revenueAccountList: GeneralLedgerModel[];
    cogsAccountList: GeneralLedgerModel[];
    expensesAccountList: GeneralLedgerModel[];

    typesArray: Array<string> = ["undefined", "string", "number"];

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        document.title = "HIS |Account Setup Template";
        if (localStorage.getItem(btoa("access_token"))) {
            this.getAllAccountsList();
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
                        // console.log(this.accountConfig.cash.id + " : " + typeof this.accountConfig.cash.id);
                        this.assetsAccountList = this.chartOfAccountList.filter(value => {
                            if (value.parentType === "Assets") {
                                return value;
                            }
                        });
                        this.revenueAccountList = this.chartOfAccountList.filter(value => {
                            if (value.parentType === "Revenue") {
                                return value;
                            }
                        });
                        this.liabilitiesAccountList = this.chartOfAccountList.filter(value => {
                            if (value.parentType === "Liabilities") {
                                return value;
                            }
                        });
                        this.cogsAccountList = this.chartOfAccountList.filter(value => {
                            if (value.parentType === "Cost of Goods Sold") {
                                return value;
                            }
                        });
                        this.expensesAccountList = this.chartOfAccountList.filter(value => {
                            if (value.parentType === "Expense") {
                                return value;
                            }
                        });
                        this.setAccountIds();
                    } else {
                        this.notificationService.error(response["responseMessage"], "Account Setup");
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response["responseMessage"], "Account Setup");
                }
            );
        } else {
            this.router.navigate(["/login"]);
        }
    }

    updateAssetsConfig() {
        if (localStorage.getItem(btoa("access_token"))) {
            this.setAccountIds();
            // console.log(this.accountConfig);
            this.requestsService.postRequest(AppConstants.ASSETS_CONFIG_SAVE, this.accountConfig)
                .subscribe(
                    (response: Response) => {
                        if (response["responseCode"] === "SUCCESS") {
                            this.notificationService.success(response["responseMessage"], "Asset Account Setup");
                        } else {
                            this.notificationService.error(response["responseMessage"], "Asset Account Setup");
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

    updateLiabilityConfig() {
        if (localStorage.getItem(btoa("access_token"))) {
            this.setAccountIds();
            // console.log(this.accountConfig);
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
            this.router.navigate(["/login"]);
        }
    }

    updateRevenueConfig() {
        if (localStorage.getItem(btoa("access_token"))) {
            this.setAccountIds();
            this.requestsService.postRequest(AppConstants.REVENUE_CONFIG_SAVE, this.accountConfig)
                .subscribe(
                    (response: Response) => {
                        if (response["responseCode"] === "SUCCESS") {
                            this.notificationService.success(response["responseMessage"], "Revenue Account Setup");
                        } else {
                            this.notificationService.error(response["responseMessage"], "Revenue Account Setup");
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

    updateCOSConfig() {
        if (localStorage.getItem(btoa("access_token"))) {
            this.setAccountIds();
            this.requestsService.postRequest(AppConstants.COS_CONFIG_SAVE, this.accountConfig)
                .subscribe(
                    (response: Response) => {
                        if (response["responseCode"] === "SUCCESS") {
                            this.notificationService.success(response["responseMessage"], "COGS Account Setup");
                        } else {
                            this.notificationService.error(response["responseMessage"], "COGS Account Setup");
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

    updateExpenseConfig() {
        if (localStorage.getItem(btoa("access_token"))) {
            this.setAccountIds();
            this.requestsService.postRequest(AppConstants.EXPENSE_CONFIG_SAVE, this.accountConfig)
                .subscribe(
                    (response: Response) => {
                        if (response["responseCode"] === "SUCCESS") {
                            this.notificationService.success(response["responseMessage"], "Expense Account Setup");
                        } else {
                            this.notificationService.error(response["responseMessage"], "Expense Account Setup");
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

    setAccountIds(){
        // console.log("Inside set Ids");
        // ASSETS
        if (this.accountConfig.cash != null && this.typesArray.indexOf(typeof this.accountConfig.cash) == -1) {
            this.accountConfig.cash = this.accountConfig.cash.parentType == "Assets" ? this.accountConfig.cash.id : "";
        }
        if (this.accountConfig.bank != null && this.typesArray.indexOf(typeof this.accountConfig.bank) == -1) {
            this.accountConfig.bank = this.accountConfig.bank.parentType == "Assets" ? this.accountConfig.bank.id : "";
        }
        if (this.accountConfig.inventory != null && this.typesArray.indexOf(typeof this.accountConfig.inventory) == -1) {
            this.accountConfig.inventory = this.accountConfig.inventory.parentType == "Assets" ? this.accountConfig.inventory.id : "";
        }
        if (this.accountConfig.accountReceivable != null && this.typesArray.indexOf(typeof this.accountConfig.accountReceivable) == -1) {
            this.accountConfig.accountReceivable = this.accountConfig.accountReceivable.parentType == "Assets" ? this.accountConfig.accountReceivable.id : "";
        }
        if (this.accountConfig.palntEquipment != null && this.typesArray.indexOf(typeof this.accountConfig.palntEquipment) == -1) {
            this.accountConfig.palntEquipment = this.accountConfig.palntEquipment.parentType == "Assets" ? this.accountConfig.palntEquipment.id : "";
        }
        if (this.accountConfig.furnitureFixture != null && this.typesArray.indexOf(typeof this.accountConfig.furnitureFixture) == -1) {
            this.accountConfig.furnitureFixture = this.accountConfig.furnitureFixture.parentType == "Assets" ? this.accountConfig.furnitureFixture.id : "";
        }

        // LIABILITIES
        if (this.accountConfig.accountPayable != null && this.typesArray.indexOf(typeof this.accountConfig.accountPayable) == -1) {
            this.accountConfig.accountPayable = this.accountConfig.accountPayable.parentType == "Liabilities" ? this.accountConfig.accountPayable.id : "";
        }
        if (this.accountConfig.taxPayable != null && this.typesArray.indexOf(typeof this.accountConfig.taxPayable) == -1) {
            this.accountConfig.taxPayable = this.accountConfig.taxPayable.parentType == "Liabilities" ? this.accountConfig.taxPayable.id : "";
        }
        if (this.accountConfig.accuredSalary != null && this.typesArray.indexOf(typeof this.accountConfig.accuredSalary) == -1) {
            this.accountConfig.accuredSalary = this.accountConfig.accuredSalary.parentType == "Liabilities" ? this.accountConfig.accuredSalary.id : "";
        }
        if (this.accountConfig.loan != null && this.typesArray.indexOf(typeof this.accountConfig.loan) == -1) {
            this.accountConfig.loan = this.accountConfig.loan.parentType == "Liabilities" ? this.accountConfig.loan.id : "";
        }
        if (this.accountConfig.otherPayable != null && this.typesArray.indexOf(typeof this.accountConfig.otherPayable) == -1) {
            this.accountConfig.otherPayable = this.accountConfig.otherPayable.parentType == "Liabilities" ? this.accountConfig.otherPayable.id : "";
        }

        // INCOME (Revenue)

        if (this.accountConfig.income != null && this.typesArray.indexOf(typeof this.accountConfig.income) == -1) {
            this.accountConfig.income = this.accountConfig.income.parentType == "Revenue" ? this.accountConfig.income.id : "";
        }
        if (this.accountConfig.otherIncome != null && this.typesArray.indexOf(typeof this.accountConfig.otherIncome) == -1) {
            this.accountConfig.otherIncome = this.accountConfig.otherIncome.parentType == "Revenue" ? this.accountConfig.otherIncome.id : "";
        }

        // COGS
        if (this.accountConfig.costOfSale != null && this.typesArray.indexOf(typeof this.accountConfig.costOfSale) == -1) {
            this.accountConfig.costOfSale = this.accountConfig.costOfSale.parentType == "Cost of Goods Sold" ? this.accountConfig.costOfSale.id : "";
        }

        // EXPENSE
        if (this.accountConfig.generalExpense != null && this.typesArray.indexOf(typeof this.accountConfig.generalExpense) == -1) {
            this.accountConfig.generalExpense = this.accountConfig.generalExpense.parentType == "Expense" ? this.accountConfig.generalExpense.id : "";
        }
    }
}
