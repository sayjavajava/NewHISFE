import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService{

    private patientIdSource = new BehaviorSubject(0);
    currentPatientId = this.patientIdSource.asObservable();

    private staffSource = new BehaviorSubject(0);
    currentStaffServiceId = this.staffSource.asObservable();

    private apptBranchIdSource = new BehaviorSubject(0);
    cuurentApptBranchId = this.apptBranchIdSource.asObservable();

    private apptDoctorIdSource = new BehaviorSubject(0);
    cuurentApptDoctorId = this.apptDoctorIdSource.asObservable();

    constructor() { }
    getPatientId(id: number) {
        this.patientIdSource.next(id);

    }
    updateStaffId(id:number){
          this.staffSource.next(id);
    }

    updateApptBranchId(id:any){
        console.log('Branch:' + id)
        this.apptBranchIdSource.next(id);
    }
    updateApptDoctorId(id:any){
        console.log('pun:' + id)
        this.apptDoctorIdSource.next(id);
    }



}