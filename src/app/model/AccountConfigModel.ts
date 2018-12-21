export  class  AccountConfigModel{
//ASSETS
    cash: any = -1;
    bank: any= -1;
    inventory: any = -1;
    accountReceivable: any = -1;
    palntEquipment: any = -1;
    furnitureFixture: any = -1;

//Liabilities
    accountPayable: any = -1;
    taxPayable: any = -1;
    accuredSalary: any = -1;
    loan: any = -1;
    otherPayable: any = -1;
    parentType: any = -1;
//INCOME
    income: any = -1;
    otherIncome: any = -1;
//COGS
    costOfSale: any = -1;
//EXPENSE
    generalExpense: any = -1;
    doctorExpense: any = -1;

    constructor() {
    }
}