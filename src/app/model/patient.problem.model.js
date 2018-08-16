"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Appointment_1 = require("./Appointment");
/**
 * Created by jamal on 8/13/2018.
 */
var PatientProblemModel = (function () {
    function PatientProblemModel() {
        this.selectedICDVersionId = -1;
        this.selectedCodeId = -1;
        this.dateDiagnosis = "";
        this.status = "ACTIVE";
        this.appointmentWrapper = new Appointment_1.Appointment();
    }
    return PatientProblemModel;
}());
exports.PatientProblemModel = PatientProblemModel;
//# sourceMappingURL=patient.problem.model.js.map