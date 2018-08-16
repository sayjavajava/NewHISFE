import {Appointment} from "./Appointment";
/**
 * Created by jamal on 8/13/2018.
 */

export class PatientProblemModel {
    id: number;
    selectedICDVersionId: number = -1;
    codeName: string;
    codeTitle: string;
    selectedCodeId: number = -1;
    versionName: string;
    dateDiagnosis: string = "";
    note: string;
    status: string = "ACTIVE";
    appointmentWrapper: Appointment = new Appointment();


    constructor() {
    }

}