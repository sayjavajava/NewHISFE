import {GeneralLedgerModel} from "./GeneralLedgerModel";

export class PaymentType {
    id: number;
    paymentTitle: string;
    paymentGlAccount:GeneralLedgerModel = new GeneralLedgerModel();
    paymentMode: string;
    paymentPurpose: string;
    active: boolean;
    serviceCharges: number;
    maxCardCharges: number;
    payCredit:string='';
    bankGlCharges:GeneralLedgerModel = new GeneralLedgerModel();
    isPatient: boolean;
    patient:boolean;
    patientRefunds:any[];
    staffPayment:any[];
    ReceiptPaymentType:any[];
    hasChild:boolean;
    constructor() {

    }

}