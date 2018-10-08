/**
 * Created by jamal on 8/1/2018.
 */
export class Tax{
    id:number = -1;
    name:string;
    description:string;
    rate:number = 0.0;
    fromDate:string;
    toDate:string;
    active:boolean;

    hasChild: boolean = false;

    constructor(){

    }

}
