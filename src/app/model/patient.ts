import {Race} from "./race-model";
import {Appointment} from './Appointment';
import {PatientSmokeStatus} from "./PatientSmokeStatus";
/**
 * Created by jamal on 6/7/2018.
 */
export class Patient {
    //////IMPORTANT INFORMATION
    id: number;
    selectedDoctor: number = -1;
    titlePrefix: string = "-1";
    firstName: string = "";
    middleName: string = "";
    lastName: string = "";
    foreignName: string = "";
    profileImgURL: string;
    profileImg: File;
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
    primaryDoctorFirstName: string = "";
    primaryDoctorLastName: string = "";
    ////////Appointment
    pastAppointments: any = [];
    futureAppointments: any[];
    /////// DEMOGRAPHY
    patientId: number;
    patientSSN: string = "";
    dob: string = "";
    gender: string = "MALE";
   /* races: Race[] = [
        {id: 1, nameRace: 'American Indian or Alaska Native', selected: false},
        {id: 2, nameRace: 'Asian', selected: false},
        {id: 3, nameRace: 'Black or African American', selected: false},
        {id: 4, nameRace: 'Native Hawaiian or Other Pacific Islam', selected: false},
        {id: 5, nameRace: 'White', selected: false},
        {id: 6, nameRace: 'Other Race', selected: false}
    ];*/

    races = [
        {label: 'American Indian or Alaska Native', value: 'American Indian or Alaska Native',selected:false},
        {label: 'Americian', value: 'Americian',selected:false},
        {label: 'Asian', value: 'Asian',selected:false},
        {label: 'Black or African American', value: 'Black or African American',selected:false},
        {label: 'White', value: 'White',selected:false},
        {label: 'Other Race', value: 'Other Race',selected:false},

    ];
    country: string = "SAUDI ARAB";
    streetAddress: string = "";
    zipCode: string = "";
    city: string = "";
    state: string = "SAUDI ARAB";
    formattedAddress: string = "";
    marital: string = "SINGLE";
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
    photoBackURL: string
    photoFrontURL: string
    photoFront: File;
    photoBack: File;

    ////////////Smoking Status
    smokingStatus: any [];

    constructor() {
        
    }
}