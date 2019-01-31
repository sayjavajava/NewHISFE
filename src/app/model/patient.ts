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
    profileImgURL: string;
    profileImg: File;
    homePhone: string = "";
    cellPhone: string = "";
    disableSMSTxt: boolean = false;
    officePhone: string = "";
    email: string = "";
    userName: string = "";
    preferredCommunication: string = "";
    status: boolean = false;
    primaryDoctorFirstName: string = "";
    primaryDoctorLastName: string = "";
    patientGroup: string = "";
    patientGroupId: number;
    foreignName:string;
    ////////Appointment
    pastAppointments: any = [];
    futureAppointments: any[];
    lastAppointment: string = "";
    nextAppointment: string = "";
    /////// DEMOGRAPHY
    patientId: string;
    patientSSN: string = "";
    dob: any;
    gender: string = "";
    country: string = "";
    countryId: number;
    streetAddress: string = "";
    city: string = "";
    cityId: number;
    state: string = "";
    stateId: number;
    marital: string = "";
    emergencyContactName: string = "";
    emergencyContactPhone: string = "";
    emergencyContactRelation: string = "";

    ///////////////// INSURANCE
    insuranceId: number;// PK
    company: string = "";
    insuranceIdNumber: string = "";
    groupNumber: string = "";
    planName: string = "";
    planType: string = "";
    cardIssuedDate: string = "";
    cardExpiryDate: string = "";
    primaryInsuranceNotes: string = "";
    photoBackURL: string;
    photoFrontURL: string;
    photoFront: File;
    photoBack: File;
    age:number;
    createDate:string;
    dobStr:string;
    insurancePlan:string;
    insuranceProfile:string;
    ////////////Smoking Status
    smokingStatus: any [];

    hasChild: boolean = false;

    constructor() {

    }
}

