/**
 * Created by jamal on 8/1/2018.
 */
export class Tax{
    id:number;
    name:string;
    description:string;
    rate:number = 0.0;
    fromDate:string;
    toDate:string;
    active:boolean;
    /**
     * we decided if child record found then we should not update status
     * */
    hasChild: boolean = false;

    constructor(){

    }

}
