export class RefundRequest{

    refundId: any ;
    date: any;
    patientId: any ;
    refundType : any ;      //  Advance , Invoice
    invoiceId : any ;
    selectedBalance: any=0.00;
    paymentTypeId : any ;
    description: any;
    refundAmount: any =0.00;

    constructor() {

    }
}
