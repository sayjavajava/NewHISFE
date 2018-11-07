export class PaymentTypeRequest {
    constructor(public page: number,
                public size: number,
                paymentTitle:string,
                paymentGlAccounts:string,
                maxCardCharges:string,
                serviceCharges:string,
                active:string

                ) {
    }
}