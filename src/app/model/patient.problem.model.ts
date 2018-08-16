import {StatusEnum} from "../enums/StatusEnum";
/**
 * Created by jamal on 8/13/2018.
 */

export class PatientProblemModel {
    id: number;
    selectedICDVersionId: number = -1;
    selectedAppointmentId: number = -1;
    codeName: string;
    codeTitle: string;
    selectedCodeId: number = -1;
    versionName: string;
    dateDiagnosis: string = "";
    note: string;
    status: string = "ACTIVE";


    constructor() {
    }

}