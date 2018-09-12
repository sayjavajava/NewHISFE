import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService{

    private patientIdSource = new BehaviorSubject(0);
    currentPatientId = this.patientIdSource.asObservable();

    private staffSource = new BehaviorSubject(0);
    currentStaffServiceId = this.staffSource.asObservable();

    constructor() { }
    getPatientId(id: number) {
        this.patientIdSource.next(id);

    }
    updateStaffId(id:number){
          this.staffSource.next(id);
    }

}