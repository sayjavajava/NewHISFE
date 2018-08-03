export class ServiceTax {
    id: number = 0;
    name: string = "";
    description: string = "";
    rate: number = 0.0;
    fromDate: string;
    toDate: string;
    active: boolean = false;
    deleted: boolean = false;

    constructor() {
    }
}
