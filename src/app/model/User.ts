import {IUser} from './IUser';
import {WorkingDays} from './WorkingDays';

export class User {

    userType?: string;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    homePhone: number;
    cellPhone: number;
    primaryBranch: string;
    interval: number;
    email: string;
    selectedVisitBranches: any[];
    otherDashboard: string;
    sendBillingReport: boolean;
    useReceptDashboard: boolean;
    otherDoctorDashBoard: boolean;
    accountExpiry: string;
    active: boolean;
    allowDiscount?: string;

    confirmPassword ?: string;
    dateFrom ?: string;
    dateTo ?: string;
    managePatientInvoices?: boolean;
    managePatientRecords ?: boolean;
    secondShiftFromTime ?: string;
    secondShiftToTime?: string;
    firstShiftFromTime?: string;
    shift2 ?: boolean;
    shift1 ?: boolean;
    vacation ?: boolean;
    firstShiftToTime?: string;

    selectedDepartment ?: any[];
    selectedServices ?: any[];
    selectedWorkingDays ?: WorkingDays[];
    selectedDoctors ?: any[];
    departmentControl ?: any[];
    dutyWithDoctors ?: any[];

    constructor(user: IUser) {
        this.userType = user.userType;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.userName = user.userName;
        this.email = user.email;
        this.password = user.password;
        this.confirmPassword = user.confirmPassword;
        this.primaryBranch = user.primaryBranch;
        this.allowDiscount = user.allowDiscount;
        this.managePatientInvoices = user.managePatientInvoices;
        this.managePatientRecords = user.managePatientRecords;
        this.cellPhone = user.cellPhone;
        this.homePhone = user.homePhone;
        this.sendBillingReport = user.sendBillingReport;
        this.useReceptDashboard = user.useReceptDashboard;
        this.otherDoctorDashBoard = user.otherDoctorDashBoard;
        this.otherDashboard = user.otherDashboard;
        this.accountExpiry = user.accountExpiry;
        this.active = user.active;
        this.interval = user.interval;
        this.dutyWithDoctors = user.dutyWithDoctors;

        this.selectedServices = user.selectedServices;
        this.selectedVisitBranches = user.selectedVisitBranches;
        this.selectedDoctors = user.selectedDoctors;
        this.firstShiftFromTime = user.firstShiftFromTime;
        this.firstShiftToTime = user.firstShiftToTime;
        this.secondShiftFromTime = user.secondShiftFromTime;
        this.secondShiftToTime = user.secondShiftToTime;

        this.vacation = user.vacation;
        this.selectedWorkingDays = user.selectedWorkingDays;
        this.selectedDepartment = user.selectedDepartment;
        this.shift1 = user.shift1;
        this.shift2 = user.shift2;

        this.dateFrom = user.dateFrom;
        this.dateTo = user.dateTo;


    }
}