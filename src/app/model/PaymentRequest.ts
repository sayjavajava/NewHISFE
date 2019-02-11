import {Patient} from './patient';
import {Appointment} from './Appointment'
import {PaymentInvoiceMode} from "./PaymentInvoiceMode";

export class PaymentRequest 
{
    id: number;
    invoiceId: string;
    description: string;
    paidAmount : number=0.00;
    invoiceAmount : number=0.00;
    patientAdvanceDeposit : number=0.00; // Patient Advanced amount/balance
    usedAdvanceDeposit : number=0.00;    // use from advanced amount
    discountAmount : number=0.00;
    paymentTypeId: any;
    patientInvoiceModeWrapperList:PaymentInvoiceMode[]=[];
    useAdvancedBal:boolean ;
    useReceiveBal:boolean ;
    usedReceiveDeposit : number=0.00;
    completed:boolean;
    constructor() {
    }
}