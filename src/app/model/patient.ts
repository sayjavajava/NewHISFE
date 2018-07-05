import {Race} from "./race-model";
/**
 * Created by jamal on 6/7/2018.
 */
export class Patient {
    //////IMPORTANT INFORMATION
    userId: number;
    selectedDoctor: number = -1;
    titlePrefix: string = "-1";
    firstName: string = "";
    middleName: string = "";
    lastName: string = "";
    foreignName: string = "";
    profileImgURL: string;
    profileImg: File;
    profileImgByteArray: any[];
    homePhone: string = "";
    cellPhone: string = "";
    disableSMSTxt: boolean = false;
    officePhone: string = "";
    officeExtension: string = "";
    email: string = "";
    userName: string = "";
    preferredCommunication: string = "ENGLISH";
    reminderLanguage: string = "ENGLISH";
    statusUser: boolean = true;
    /////// DEMOGRAPHY
    profileId: number;
    patientSSN: string = "";
    dob: string = "";
    gender: string = "MALE";
    races: Race[] = [
        {id: 1, nameRace: 'American Indian or Alaska Native', selected: false},
        {id: 2, nameRace: 'Asian', selected: false},
        {id: 3, nameRace: 'Black or African American', selected: false},
        {id: 4, nameRace: 'Native Hawaiian or Other Pacific Islam', selected: false},
        {id: 5, nameRace: 'White', selected: false},
        {id: 6, nameRace: 'Other Race', selected: false}
    ];
    country: string = "SAUDI ARAB";
    streetAddress: string = "";
    zipCode: string = "";
    city: string = "";
    state: string = "SAUDI ARAB";
    formattedAddress: string = "";
    martial: string = "SINGLE";
    emergencyContactName: string = "";
    emergencyContactPhone: string = "";
    emergencyContactRelation: string = "";
    signatureOnFile: boolean = false;

    ///////////////// INSURANCE
    insuranceId: number;
    company: string = "";
    insuranceIdNumber: string = "";
    groupNumber: string = "";
    planName: string = "";
    planType: string = "";
    cardIssuedDate: string = "";
    cardExpiryDate: string = "";
    primaryInsuranceNotes: string = "";
    photoBackURL:string
    photoFrontURL:string
    photoFront: File;
    photoFrontByteArray:any[];
    photoBack: File;
    photoBackByteArray:any[];


    constructor() {
        /*this.races = [
            {id: 1, nameRace: 'American Indian or Alaska Native', selected: false},
            {id: 2, nameRace: 'Asian', selected: false},
            {id: 3, nameRace: 'Black or African American', selected: false},
            {id: 4, nameRace: 'Native Hawaiian or Other Pacific Islam', selected: false},
            {id: 5, nameRace: 'White', selected: false},
            {id: 6, nameRace: 'Other RAce', selected: false}
        ];*/
    }
}