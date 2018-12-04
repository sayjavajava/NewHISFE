"use strict";
/**
 * Created by jamal on 8/13/2018.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var PatientProblemModel = (function () {
    function PatientProblemModel() {
        this.appointmentId = -1;
        this.selectedICDVersionId = -1;
        this.selectedCodeId = -1;
        this.dateDiagnosis = "";
        this.status = "ACTIVE";
        this.datePrescribedDate = new Date();
    }
    return PatientProblemModel;
}());
exports.PatientProblemModel = PatientProblemModel;
//# sourceMappingURL=patient.problem.model.js.map