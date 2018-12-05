export class PatientImageOrderModel {

    id: number;
    patientId: number = -1;
    name: string;
    file: File[];
    type:string = "";
    description:string;
    createdOn: string;
    updatedOn: string;
    url: string;
    doctorComment:string;
    status: string = "ACTIVE";
    patientImageId:string;


    constructor() {
    }


}