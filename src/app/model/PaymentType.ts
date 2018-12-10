import {GeneralLedgerModel} from "./GeneralLedgerModel";

export class PaymentType {
    id: number;
    paymentTitle: string;
    paymentGlAccount:GeneralLedgerModel = new GeneralLedgerModel();
    paymentGlAccountId: number;
    paymentGlAccountName: string;
    paymentMode: string;
    paymentPurpose: string;
    active: boolean;
    serviceCharges: string;
    maxCardCharges: string;
    payCredit: boolean;
    bankGlCharges:GeneralLedgerModel = new GeneralLedgerModel();
    isPatient: boolean;

    constructor() {

    }

    paymentType() {
    }
}