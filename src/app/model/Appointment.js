"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Appointment = (function () {
    function Appointment(id, title, branchId, doctorId, scheduleDateAndTime, scheduleDate, end, draggable, selectedRecurringDays, appointmentType, notes, patient, reason, status, duration, followUpDate, followUpReason, followUpReminder, recurringAppointment, recurseEvery, firstAppointment, lastAppointment, examRoom, age, cellPhone, gender, email, color, roomId) {
        this.id = id;
        this.title = title;
        this.branchId = branchId;
        this.doctorId = doctorId;
        this.scheduleDateAndTime = scheduleDateAndTime;
        this.scheduleDate = scheduleDate;
        this.selectedRecurringDays = selectedRecurringDays;
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
        this.followUpReminder = followUpReminder;
        this.recurringAppointment = recurringAppointment;
        this.recurseEvery = recurseEvery;
        this.firstAppointment = firstAppointment;
        this.lastAppointment = lastAppointment;
        this.examRoom = examRoom;
        this.gender = gender;
        this.age = age;
        this.cellPhone = cellPhone;
        this.email = email;
        this.color = color;
        this.roomId = roomId;
    }
    return Appointment;
}());
exports.Appointment = Appointment;
//# sourceMappingURL=Appointment.js.map