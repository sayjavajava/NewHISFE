export  class  GeneralLedgerModel{

    id: number;
    parentType: string = '';
    accountType: string = '-1';
    name: string = '';
    code: string = '';
    description: string = '';

    balance: number = 0.00;

    constructor() {
    }
}