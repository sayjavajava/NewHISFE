import {BankAccountModel} from "./BankAccountModel";

export  class  GeneralLedgerModel{

    id: any;
    parentType: string = '';
    accountType: string = '-1';
    name: string = '';
    code: string = '';
    description: string = '';

    balance: number = 0.00;

    bankAccount: BankAccountModel;

    constructor() {
    }
}
