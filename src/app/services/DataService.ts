import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService{

    private patientIdSource = new BehaviorSubject(0);
    currentPatientId = this.patientIdSource.asObservable();
    constructor() { }
    getPatientId(id: number) {
        this.patientIdSource.next(id);
    }

}