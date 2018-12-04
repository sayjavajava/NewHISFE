"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MedicationModel = (function () {
    // appoint:Appointment=new Appointment();
    function MedicationModel() {
        this.drugName = "";
        this.prn = false;
        this.sigNote = "";
        this.indication = "";
        this.status = "ACTIVE";
        this.appointmentId = -1;
        this.datePrescribedString = "";
        this.dateStartedTakingString = "";
        this.dateStoppedTakingString = "";
        this.daw = false;
        this.pharmacyNote = "";
        this.note = "";
        this.orderStatus = "";
        this.updatedOn = "";
        this.datePrescribedDate = new Date();
        this.dateStartedTakingDate = new Date();
        this.dateStoppedTakingDate = new Date();
    }
    return MedicationModel;
}());
exports.MedicationModel = MedicationModel;
//# sourceMappingURL=medication.model.js.map