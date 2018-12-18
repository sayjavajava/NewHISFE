import {Patient} from "./patient";

export class PatientVitalModel{
    patientId:number;
    id: number;
    name: string = '';
    unit: string = '';
    standardValue: string ;
    status: boolean = false;
    currentValue:string;
    listofVital:PatientVitalModel[];
    // patient:Patient=new Patient();
    constructor() {
    }
}