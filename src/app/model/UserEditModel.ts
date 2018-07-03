import {Profile} from './Profile';
import {DutyShift} from './DutyShift';
import {Vacation} from './Vacation';
import {BranchResponse} from './BranchResponse';
export class UserEditModel {
    profile: Profile;
    dutyShift :DutyShift;
    vacation:Vacation;
    branch:BranchResponse;
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    primaryBranch: string;
    checkUpInterval: number;
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