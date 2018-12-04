export class BulkReceitRequest {

    patientId: any ;
    date: any;
    paymentTypeId : any ;
    paymentAmount : any;
    useAdvance : boolean = false;
    invoiceListPaymentRequest:  any = [];


    constructor() {

    }
}
