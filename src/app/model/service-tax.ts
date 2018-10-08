export class ServiceTax {
    id: number = 0;
    name: string = '';
    description: string = '';
    rate: number = 0.0;
    fromDate: string = '';
    toDate: string = '';
    active: boolean = true;
    deleted: boolean = false;

    hasChild: boolean = false;

    constructor() {
    }
}
