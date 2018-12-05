
import {Appointment} from "./Appointment";
export  class  LabOrderProjectionModel {
    Id: number;
    status: string;
    Comments: string;
    DateTest: Date=new Date();
    appointment: Appointment[] = [];
    constructor() {
    }
}