import DateTimeFormat = Intl.DateTimeFormat;



export class Appointment{
    id:number;
    appointmentId:string;
    title:string;
    branchId:number;
    scheduleDate :string;
    appointmentStartedOn : string;
    appointmentEndedOn :string;
    scheduleDateAndTime : string | DateTimeFormat
    end:string;
    draggable:boolean;
    appointmentType:any[];
    selectedRecurringDays:any[];
    notes:string;
    patientId:number;
    reason:string;
    status:string;
    duration:number;
    followUpDate:Date | string;
    followUpReason:string;
    followUpReminder:boolean;
    recurringAppointment:boolean;
    recurseEvery:string;
    firstAppointment:string;
    lastAppointment:string;
    examRoom:number;
    gender:string;
    cellPhone:string;
    age:string;
    email:string;
    color:string;
    startedOn:Date | number | string;
    roomId:number;
    doctorId:number;
    dob:Date;
    newPatient :string;
    serviceId:number;

    constructor(id?:number,appointmentId?:string,title ?: string, branchId ?: number, doctorId ?: number,scheduleDateAndTime ?:DateTimeFormat, scheduleDate?: string, end?: string, draggable?: boolean,selectedRecurringDays ?:any[], appointmentType?: any[], notes?: string, patient?: number, reason?:
         string, status?: string, duration?: number, followUpDate?: Date, followUpReason?: string ,followUpReminder?:boolean,recurringAppointment?:boolean,recurseEvery?:string
        ,firstAppointment?:string,lastAppointment?:string,examRoom?:number,age?:string,cellPhone?:string,gender?:string,email?:string,color ?:string,roomId?:number,newPatient ?:string,dob?:Date,serviceId?:number
    ) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.title = title;
        this.branchId = branchId;
        this.doctorId=doctorId;
        this.scheduleDateAndTime = scheduleDateAndTime;
        this.scheduleDate = scheduleDate;
        this.selectedRecurringDays=selectedRecurringDays;
        this.end = end;
        this.draggable = draggable;
        this.appointmentType = appointmentType;
        this.notes = notes;
        this.patientId = patient;
        this.reason = reason;
        this.status = status;
        this.duration = duration;
        this.followUpDate = followUpDate;
        this.followUpReason = followUpReason;
        this.followUpReminder=followUpReminder;
        this.recurringAppointment=recurringAppointment;
        this.recurseEvery=recurseEvery;
        this.firstAppointment=firstAppointment;
        this.lastAppointment=lastAppointment;
        this.examRoom=examRoom;
        this.gender=gender;
        this.age=age;
        this.cellPhone=cellPhone;
        this.email=email;
        this.color=color;
        this.roomId=roomId;
        this.serviceId=serviceId;
        this.newPatient=newPatient;
        this.dob=dob;

    }
}
