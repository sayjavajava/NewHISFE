import {Race} from "./race-model";
import {Appointment} from './Appointment';
/**
 * Created by jamal on 6/7/2018.
 */
export class PatientSmokeStatus {
    patientId: Number;
    smokingId: Number;
    smokingStatus: string = "";
    startDate: string = "";
    endDate: string = "";
    recordedDate: string = "";

    constructor(){
    }
}