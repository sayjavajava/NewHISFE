import {ExamRooms} from './ExamRooms';

export class BranchDoctors {
    id?: number;
    branchName: string;
    doctorId :number;
    firstName:string;
    lastName:string;
    examRooms: ExamRooms;

constructor(id?:number,branchName?:string ){
     this.id=id;
     this.branchName =branchName;
}

}