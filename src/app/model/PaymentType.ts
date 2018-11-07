import {GeneralLedgerModel} from './GeneralLedgerModel';
export class PaymentType{
    id:number;
    paymentTitle:string;
    paymentGlAccount:GeneralLedgerModel = new GeneralLedgerModel();
    paymentMode:string;
    paymentPurpose:string;
    active:boolean;
    serviceCharges:string;
    maxCardCharges:String
    payCredit:boolean;
    bankGlCharges:GeneralLedgerModel = new GeneralLedgerModel();

    constructor() {

    }

    paymentType(){}
}