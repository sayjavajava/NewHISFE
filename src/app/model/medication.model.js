"use strict";
/**
 * Created by jamal on 8/28/2018.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var MedicationModel = (function () {
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
    }
    return MedicationModel;
}());
exports.MedicationModel = MedicationModel;
//# sourceMappingURL=medication.model.js.map