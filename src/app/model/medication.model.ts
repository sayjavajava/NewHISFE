/**
 * Created by jamal on 8/28/2018.
 */

export class MedicationModel {

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


    constructor() {
    }


}
