export  class ServiceComission{

    id?:number;
    checked ?:boolean;
    comission ?:string;

    constructor(id ?: number, checked ?: boolean, comission ?: string) {
        this.id = id;
        this.checked = checked;
        this.comission = comission;
    }
}