import {ExamRooms} from './ExamRooms';

export class BranchDoctors {
    id?: number;
    branchName: string;
    doctorId :number;
    firstName:string;
    lastName:string;
    examRooms: ExamRooms;
    label?:string;
    value?:number;

constructor(id?:number,lastName?:string ){
     this.id=id;
    // this.branchName =branchName;
    this.label = lastName;
    this.lastName =lastName;

}

}