/**
 * Created by jamal on 10/24/2018.
 */

export class PatientGroupModel {

    id: number = 0;
    name: string = '';
    description: string = '';
    status: boolean = true;
    hasChild: boolean = false;
    patientCount: number = 0;


    constructor() {
    }
}