import {Patient} from "./patient";

export class PatientVitalModel{
    patientId:number;
    id: number;
    name: string = '';
    unit: string = '';
    standardValue: string ;
    status: boolean = true;
    currentValue:string;
    listofVital:PatientVitalModel[];
    updatedOn: string;
    // patient:Patient=new Patient();
    constructor() {
    }
}