import {ExamRooms} from './ExamRooms';

export class Branch {
    id?: number;
    branchName: string;
    officeHoursStart: number;
    officeHoursEnd: number;
    noOfExamRooms: number;
    state: string;
    city: string;
    primaryDoctor: string;
    zipCode: number;
    address: string;
    officePhone: number;
    fax: string;
    formattedAddress: string;
    examRooms: ExamRooms;
    country: string;
    billingName ?: string;
    billingBranch ?: string;
    billingTaxID ?: string;
    showBranchOnline ?: boolean;
    allowOnlineSchedulingInBranch ?: boolean;
    checkedBranch?: boolean;


    constructor(id?: number, branchName?: string, officeHoursStart?: number, officeHoursEnd?: number, noOfExamRooms?: number, state ?: string, city?: string, primaryDoctor ?: string, zipCode?: number, address?: string, officePhone?: number, fax?: string, formattedAddress?: string, checked?: boolean) {
        this.id = id;
        this.branchName = branchName;
        this.officeHoursStart = officeHoursStart;
        this.officeHoursEnd = officeHoursEnd;
        this.noOfExamRooms = noOfExamRooms;
        this.state = state;
        this.city = city;
        this.primaryDoctor = primaryDoctor;
        this.zipCode = zipCode;
        this.address = address;
        this.officePhone = officePhone;
        this.fax = fax;
        this.formattedAddress = formattedAddress;
        this.checkedBranch = checked;
    }
}