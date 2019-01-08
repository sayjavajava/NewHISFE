export class TaxService {
    id: number = 0;
    name: string = '';
    description: string = '';
    rate: number = 0.0;
    fromDate:  Date = new Date();
    toDate: Date = new Date();
    active: boolean = true;
    deleted: boolean = false;
    strtoDate:string='';
    strfromDate:string='';
    hasChild: boolean = false;

    constructor() {
    }
}
