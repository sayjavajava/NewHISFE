/**
 * Created by jamal on 8/27/2018.
 */
export class PatientAllergyModel {

    appointmentId: number = -1;
    patientId: number;
    id: number;
    name: string;
    allergyType: string = "-1";
    reaction: string;
    status: string = "ACTIVE";
    note: string;
    updatedOn: string;

    constructor() {
    }
}
