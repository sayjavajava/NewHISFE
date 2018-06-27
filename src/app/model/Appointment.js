"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Appointment = (function () {
    function Appointment(title, branchId, start, end, draggable, selectedRecurringDays, appointmentType, notes, patient, reason, status, duration, followUpDate, followUpReason, followUpReminder, recurringAppointment, recurseEvery, firstAppointment, lastAppointment, examRoom, age, cellPhone, gender, email, color) {
        this.title = title;
        this.branchId = branchId;
        this.start = start;
        this.selectedRecurringDays = selectedRecurringDays;
        this.end = end;
        this.draggable = draggable;
        this.appointmentType = appointmentType;
        this.notes = notes;
        this.patient = patient;
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
    }
    return Appointment;
}());
exports.Appointment = Appointment;
//# sourceMappingURL=Appointment.js.map