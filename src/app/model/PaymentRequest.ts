import {Patient} from './patient';
import {Appointment} from './Appointment'

export class PaymentRequest 
{
    id: number;
    invoiceId: string;
    description: string;
    paidAmount : number;
    invoiceAmount : number;
    patientAdvanceDeposit : number;

    useAdvancedBal:boolean ;

    constructor() {
    }
}