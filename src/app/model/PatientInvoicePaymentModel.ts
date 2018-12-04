
export class PatientInvoicePaymentModel{

    id: any;
    patientId: number;
    paymentId: number;
    invoiceId: number = null;
    paymentMode: string = 'CASH';

    constructor() {
    }
}