export class BulkReceitRequest {

    patientId: any ;
    date: any;
    paymentId : any;
    paymentTypeId : any ;
    paymentAmount : any;
    useAdvanceTotal : any;
    useAdvance : boolean = false;
    invoiceListPaymentRequest:  any = [];


    constructor() {

    }
}