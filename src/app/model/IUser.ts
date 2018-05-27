import {WorkingDays} from './WorkingDays';


export interface  IUser {


    userType?:string;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    homePhone: number;
    cellPhone: number;
    primaryBranch: string;
    email: string;
    selectedVisitBranches: any[];
    otherDashboard: string;
    sendBillingReport: boolean;
    useReceptDashboard: boolean;
    otherDoctorDashBoard: boolean;
    accountExpiry: string;
    active:boolean ;
    allowDiscount?: string;
    interval?: number;
    confirmPassword ?: string;
    dateFrom ?: string;
    dateTo ?: string;
    managePatientInvoices?:boolean;
    managePatientRecords ?:boolean;
    secondShiftFromTime ?: string;
    secondShiftToTime?: string;
    firstShiftFromTime?: string;
    shift2 ?: boolean;
    shift1 ?: boolean;
    vacation ?: boolean;
    firstShiftToTime?: string;

    selectedDepartment ?: any[];
    selectedServices ?: any[];
    selectedWorkingDays ?: any[];
    departmentControl ?:any[];
    selectedDoctors ?: any[];
    dutyWithDoctors ?:any[];

}