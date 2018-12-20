export class InvoicesList 
{
    id: number;
    invoiceId : string;
    patientName: string;
    paidAmount : number;
    invoiceAmount : number;
    status : string;
    taxAmount: number;
    discountAmount: number;
    totalInvoiceAmount: number;

    constructor() {
        // this.totalAmount = this.invoiceAmount + this.taxAmount - this.discountAmount;
    }
}