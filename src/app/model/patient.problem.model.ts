/**
 * Created by jamal on 8/13/2018.
 */

export class PatientProblemModel {
    id: number;
    patientId:number;
    appointmentId:number = -1;
    selectedICDVersionId: number = -1;
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