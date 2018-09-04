import {Patient} from './patient';
import {Appointment} from './Appointment'

export class Invoice 
{
    id: number;
    
    code: string;
    serviceName: string;
    description: string;
    quantity : number;
    unitFee : number;
    taxRate : number;
    discountRate : number;
    invoiceId : number;

    patientId : string;
    appointmentId : string;

    constructor() {
    }
}