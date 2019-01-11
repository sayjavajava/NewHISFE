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
import {ConformationDialogService} from "../../../services/ConformationDialogService";

@Component({
    selector: "chart-of-account-template-component",
    templateUrl: "../../../templates/dashboard/setting/chart-of-account.template.html",
})
export class ChartOfAccountComponent {

    chartOfAccountList: GeneralLedgerModel[];
    chartOfAccount: GeneralLedgerModel = new GeneralLedgerModel();
    id: number;code: any;

    accountConfig: AccountConfigModel = new AccountConfigModel();
    /*accountConfigUpdate: AccountConfigModel = new AccountConfigModel();*/
    showBankDetailsDiv: boolean;
    selectedParentType: any = "";
    selectedAccountType: any = "";
    element: any;
    elementByDiv: any[];
    elementByClass: any[];
    // parentTypesList: string[] = ["Assets", "Bank", "Liabilities", "Revenue", "Cost of Goods Sold", "Expense"];
    cols: any[];
    parentTypes: any = [];
    accountTypes: any = [];
    isUpdate: boolean = false;
    isNew: boolean = true;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                /*private route: ActivatedRoute,*/
                private router: Router,
                @Inject(DOCUMENT) document: any,
                private confirmationDialogService: ConformationDialogService) {
        this.chartOfAccount.bankAccount = new BankAccountModel;
        this.showBankDetailsDiv = false;
        this.cols = [
            {field: "code", header: "Account Code"},
            {field: "name", header: "Account Name"},
            {field: "parentType", header: "Parent Type"},
            {field: "description", header: "Description"},
            {field: "balance", header: "Balance"},
            {field: "action", header: "Action"}
        ];
        this.parentTypes = [
            {label: 'Assets', value: 'Assets'},
            // {label: 'Bank', value: 'Bank'},
            {label: 'Liabilities', value: 'Liabilities'},
            {label: 'Revenue', value: 'Revenue'},
            {label: 'Cost of Goods Sold', value: 'Cost of Goods Sold'},
            {label: 'Expense', value: 'Expense'},
        ];
        this.accountTypes = [];
    }

    ngOnInit() {
        document.title = "HIS | Chart Of Account Template";

        if (localStorage.getItem(btoa("access_token"))) {
            // this.getAllAccountsList();
            this.getAllLedgers();
        }

        this.element = document.getElementById("addAccDiv") as HTMLElement;
        this.element.style.height = "220px";
        this.elementByClass = Array.from(document.getElementsByClassName("scroller"));
    }

    getAllAccountsList() {
        if (localStorage.getItem(btoa("access_token"))) {
            this.requestsService.getRequest(AppConstants.FETCH_ACCOUNTS_CONFIGURATIONS
            ).subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "SUCCESS") {
                        // this.chartOfAccountList = response["responseData"].accountList;
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

    getAllLedgers(){
        if (localStorage.getItem(btoa("access_token"))) {
            this.requestsService.getRequest(AppConstants.FETCH_ALL_LEDGERS)
                .subscribe((response: Response) => {
                    if (response["responseCode"] === "SUCCESS") {
                        this.chartOfAccountList = response["responseData"].accountList;
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


    editAccountSetUp(accountForm: NgForm) {
        if (accountForm.invalid) {
            if (this.chartOfAccount.name == null || this.chartOfAccount.name.trim().length <= 0) {
                this.notificationService.error("Please provide account name", "Chart Of Account");
                document.getElementById("accountName").focus();
                return;
            }
            if (this.chartOfAccount.accountType == "Bank") {
                if (this.chartOfAccount.bankAccount.title == null || this.chartOfAccount.bankAccount.title.trim().length <= 0) {
                    this.notificationService.error('Please provide Bank Account Title', "Chart Of Account");
                    document.getElementById('title').focus();
                    return;
                }
                if (this.chartOfAccount.bankAccount.accountNumber == null || this.chartOfAccount.bankAccount.accountNumber.trim().length <= 0) {
                    this.notificationService.error('Please provide Bank Account Number', "Chart Of Account");
                    document.getElementById('accountNumber').focus();
                    return;
                }
            }
        } else {
            if (this.chartOfAccount.name.trim().length <= 0) {
                this.notificationService.warn('Please provide account name');
                document.getElementById('accountName').focus();
                return;
            }
            if (this.chartOfAccount.accountType == "Bank") {
                if (this.chartOfAccount.bankAccount.title == null || this.chartOfAccount.bankAccount.title.trim().length <= 0) {
                    this.notificationService.warn('Please provide Bank Account Title');
                    document.getElementById('title').focus();
                    return;
                }
                if (this.chartOfAccount.bankAccount.accountNumber == null || this.chartOfAccount.bankAccount.accountNumber.trim().length <= 0) {
                    this.notificationService.warn('Please provide Bank Account Number');
                    document.getElementById('accountNumber').focus();
                    return;
                }
            }
            if (localStorage.getItem(btoa("access_token"))) {
                this.chartOfAccount.code = this.code;
                if (this.chartOfAccount.accountType != "Bank" && !isNullOrUndefined(this.chartOfAccount.accountType)) {
                    this.chartOfAccount.bankAccount = null;
                }
                this.requestsService.postRequest(AppConstants.ACCOUNTS_CONFIGURATION_SAVE, this.chartOfAccount)
                    .subscribe(
                        (response: Response) => {
                            if (response["responseCode"] === "SUCCESS") {
                                // this.chartOfAccountList = response["responseData"];
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
        this.getAllLedgers();
        this.chartOfAccount.parentType = "";
        this.setWidthOfElements();
    }


    edit(editConfiguration: any) {
        if (editConfiguration) {
            this.chartOfAccount = editConfiguration;
            this.selectedParentType = this.chartOfAccount.parentType;
            this.selectedAccountType = this.chartOfAccount.accountType;
            this.code = this.chartOfAccount.code;
            this.parentAndAccountTypeSelected(this.selectedParentType, this.selectedAccountType);
            this.isUpdate = true;
            this.isNew = false;
        } else {
            this.chartOfAccount = new GeneralLedgerModel();
            this.selectedParentType = "";
            this.selectedAccountType = "";
            this.requestsService.getRequest(AppConstants.FETCH_ACCOUNT_CODE)
                .subscribe((response: Response) => {
                    if (response["responseCode"] === "SUCCESS") {
                        this.code = response["responseData"].data;
                        // this.notificationService.success(response["responseMessage"], "Chart of Account");
                    } else {
                        this.notificationService.error(response["responseMessage"], "Chart of Accounts");
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
            this.chartOfAccount.code = this.code;
            this.isUpdate = false;
            this.isNew = true;
        }
    }

    deleteAccount(id: number) {
        this.confirmationDialogService
            .confirm("Delete", "Are you sure you want to do this?")
            .subscribe(res => {
                if (res == true) {
                    this.requestsService.deleteRequest(AppConstants.DELETE_ACCOUNT_URL + id).subscribe((data: Response) => {
                        if (data["responseCode"] === "GL_DEL_SUC_01") {
                            this.notificationService.success("Account has been Deleted Successfully");
                            // this.getAllAccountsList();
                            this.getAllLedgers();
                        }
                    }, error => {
                        // this.error = error.error.error_description;
                        this.notificationService.error("ERROR", "Unable to Delete Account");
                    });
                    // this.router.navigate(['/home']);
                }
            });
    }

    parentTypeSelected(parentType: any) {
        this.chartOfAccount.parentType = parentType;
        this.selectedParentType = parentType;
        this.chartOfAccount.accountType = "";
        this.selectedAccountType = "";
        this.setWidthOfElements();
        this.generateAccountTypesList();
    }

    accountTypeSelected(accountType: any) {
        this.chartOfAccount.accountType = accountType;
        this.selectedAccountType = accountType;
        this.setWidthOfElements();
    }

    parentAndAccountTypeSelected(parentType:any, accountType:any){
        console.log(parentType + " : " + accountType);
        this.chartOfAccount.parentType = parentType;
        this.selectedParentType = parentType;
        this.chartOfAccount.accountType = accountType;
        this.selectedAccountType = accountType;
        this.setWidthOfElements();
        this.generateAccountTypesList();
    }

    generateAccountTypesList(){
        if(this.selectedParentType == 'Assets'){
            this.accountTypes = [
                {label: 'Fixed Assets', value: 'Fixed Assets'},
                {label: 'Current Assets', value: 'Current Assets'},
                {label: 'Bank', value: 'Bank'},
            ];
        } else if(this.selectedParentType == 'Liabilities'){
            this.accountTypes = [
                {label: 'Current Liabilities', value: 'Current Liabilities'},
                {label: 'Long Term Liabilities', value: 'Long Term Liabilities'},
            ];
        } else if(this.selectedParentType == 'Revenue'){
            this.accountTypes = [
                {label: 'Revenue', value: 'Revenue'},
                {label: 'Other Income', value: 'Other Income'},
            ];
        } else if(this.selectedParentType == 'Cost of Goods Sold'){
            this.accountTypes = [
                {label: 'Cost of Goods Sold', value: 'Cost of Goods Sold'},
            ];
        } else if(this.selectedParentType == 'Expense') {
            this.accountTypes = [
                {label: 'Operational Expense', value: 'Operational Expense'},
                {label: 'Non Operational Expense', value: 'Non Operational Expense'},
            ];
        }
        //  else if(this.selectedParentType == 'Bank'){
        //     this.accountTypes = [
        //         {label: 'Bank', value: 'Bank'},
        //     ];
        // }
    }

    setWidthOfElements() {
        this.elementByDiv = Array.from(document.getElementsByClassName("slimScrollDiv"));

        if (isNullOrUndefined(this.chartOfAccount.bankAccount)) {
            this.chartOfAccount.bankAccount = new BankAccountModel;
        }

        if (this.chartOfAccount.accountType === "Bank") {
            this.showBankDetailsDiv = true;
            this.element.style.height = "380px";

            for (let i = 0; i < this.elementByClass.length; i++) {
                if (this.elementByClass[i].style.height == "220px") {
                    this.elementByClass[i].style.height = "350px";
                }
            }

            for (let i = 0; i < this.elementByDiv.length; i++) {
                if (this.elementByDiv[i].style.height == "220px") {
                    this.elementByDiv[i].style.height = "350px";
                }
            }
        } else {
            this.showBankDetailsDiv = false;
            this.element.style.height = "220px";

            for (let i = 0; i < this.elementByClass.length; i++) {
                if (this.elementByClass[i].style.height == "350px") {
                    this.elementByClass[i].style.height = "220px";
                }
            }

            for (let i = 0; i < this.elementByDiv.length; i++) {
                if (this.elementByDiv[i].style.height == "350px") {
                    this.elementByDiv[i].style.height = "220px";
                }
            }
        }
    }

    clearAccountSetUp() {
        this.selectedAccountType = '';
        this.selectedParentType = '';
        this.chartOfAccount = new GeneralLedgerModel();
        this.setWidthOfElements();
    }
}
