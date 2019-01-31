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
    chiefComplaint: string;
    appointmentId:number = -1;

// patient:Patient=new Patient();
constructor() {
}
}