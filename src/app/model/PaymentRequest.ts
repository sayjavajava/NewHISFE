import {Patient} from './patient';
import {Appointment} from './Appointment'

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

    useAdvancedBal:boolean ;

    constructor() {
    }
}