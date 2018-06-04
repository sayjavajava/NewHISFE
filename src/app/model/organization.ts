import {Validators} from '@angular/forms';

export class Organization{
    'firstName': string;
    'lastName': string;
    'userName':string;
    'companyName': string;
    'password': string;
    'confirmPassword': string;
    'homePhone': string;
    'cellPhone': string;
    'officePhone':string;
    'timeZone': string;
    'specialty': string;
    'appointmentSerial': string;
    'website': string;
    'defaultBranch':number;
    'durationOfExam': number;
    'followUpExam': string;
    'email':string;


    constructor(firstName :  string, userName: string, companyName: string, password:string, email: string, confirmPassword: string, appointmentSerial: string, lastName?: string, homePhone?: string, cellPhone?: string, officePhone?: string, timeZone?: string, specialty?:  string, website ?: string, defaultBranch?: number, durationOfExam?: number, followUpExam?: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.companyName = companyName;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.homePhone = homePhone;
        this.cellPhone = cellPhone;
        this.officePhone = officePhone;
        this.timeZone = timeZone;
        this.specialty = specialty;
        this.appointmentSerial = appointmentSerial;
        this.website = website;
        this.defaultBranch = defaultBranch;
        this.durationOfExam = durationOfExam;
        this.followUpExam = followUpExam;
        this.email=email;
    }
}