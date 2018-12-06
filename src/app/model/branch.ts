import {ExamRooms} from './ExamRooms';
import {City} from "./City";
import {State} from "./State";
import {Country} from "./Country";

export class Branch {
    id?: number;
    branchName: string;
    officeHoursStart: number;
    officeHoursEnd: number;
    noOfExamRooms: number;
    state?: State;
    city?: City;
    primaryDoctor: string;
    zipCode: number;
    address: string;
    officePhone: number;
    fax: string;
    formattedAddress: string;
    examRooms: ExamRooms;
    country?: Country;
    billingName ?: string;
    billingBranch ?: string;
    billingTaxID ?: string;
    showBranchOnline ?: boolean;
    allowOnlineSchedulingInBranch ?: boolean;
    checkedBranch?: boolean;
    label?:string;
    value?:number;


    constructor(id?: number, branchName?: string, officeHoursStart?: number, officeHoursEnd?: number, noOfExamRooms?: number, state ?: State, city?: City, primaryDoctor ?: string, zipCode?: number, address?: string, country?: Country, officePhone?: number, fax?: string, formattedAddress?: string, checked?: boolean) {
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
        this.country = country;
        this.officePhone = officePhone;
        this.fax = fax;
        this.formattedAddress = formattedAddress;
        this.checkedBranch = checked;
        this.label = branchName;
        this.value = id;
    }
}