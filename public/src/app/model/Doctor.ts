import {Profile} from './Profile';
export class Doctor {
    profile: Profile;
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    primaryBranch: string;
    checkUpInterval: number;
    selectedRestrictBranch: any[];
    accountExpiry: string;
    active: boolean;
    allowDiscount: string;
    confirmPassword : string;
    dateFrom : string;
    dateTo : string;
    managePatientInvoices: boolean;
    managePatientRecords : boolean;
    secondShiftFromTime : string;
    secondShiftToTime: string;
    firstShiftFromTime: string;
}