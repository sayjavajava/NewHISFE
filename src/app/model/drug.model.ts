/**
 * Created by jamal on 10/24/2018.
 */

export class DrugModel {

    id: number;
    name: string = '';
    notes: string = '';
    url: string = '';
    strengthMin: number = 0;
    strengthMax: number = 0;
    oral: string = '';
    frequency: string = '';
    duration: number = 0;
    refill: number = 0;
    days: number = 0;
    sig: boolean = false;
    active: boolean = true;
    hasChild: boolean = false;


    constructor() {
    }
}