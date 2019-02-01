/**
 * Created by jamal on 8/28/2018.
 */
import {Appointment} from "./Appointment";

export class MedicationModel {

    id:number;
    drugName: string = "";
    prn: boolean = false;
    sigNote: string = "";
    indication: string = "";
    status: string = "ACTIVE";
    patientId: number;
    appointmentId: number = -1;

    datePrescribedString: string = "";
    dateStartedTakingString: string = "";
    dateStoppedTakingString: string = "";

    dispenseQuantity: number;
    dispensePackage: number;
    numberRefill: number;
    daw = false;
    pharmacyNote: string = "";
    note: string = "";
    orderStatus: string = "";
    updatedOn: string = "";
    /// New Changes add
    frequency:string;
    route:string;
    strengths:any;
    duration:string;
    durationPeriod:string;
    datePrescribedDate: Date = new Date();
    dateStartedTakingDate: Date = new Date();
    dateStoppedTakingDate: Date = new Date();
    appointmentDate:string;
    dteAppointment:string;
    appointment:Appointment=new Appointment();
    constructor() {
    }


}
