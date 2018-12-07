import {Patient} from './patient';
import {Appointment} from './Appointment'

export class PaymentRequest 
{
    id: number;
    invoiceId: string;
    description: string;
    paidAmount : number;
    invoiceAmount : number;
    patientAdvanceDeposit : number; // Patient Advanced amount/balance
    usedAdvanceDeposit : number;    // use from advanced amount
    discountAmount : number;
    paymentTypeId: any;

    useAdvancedBal:boolean ;

    constructor() {
    }
}