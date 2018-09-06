/**
 * Created by jamal on 9/3/2018.
 */

export class DocumentModel {

    id: number;
    patientId: number = -1;
    name: string;
    file: File;
    type:string = "REPORT";
    description:string;
    createdOn: string;
    updatedOn: string;
    url: string;


    constructor() {
    }


}
