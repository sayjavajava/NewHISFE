"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var patient_dashboard_component_1 = require("../components/dashboard/patient/patient-dashboard.component");
var manage_patient_component_1 = require("../components/dashboard/patient/manage-patient.component");
var add_patient_component_1 = require("../components/dashboard/patient/add-patient.component");
var patient_reports_component_1 = require("../components/dashboard/patient/patient-reports.component");
var edit_patient_component_1 = require("../components/dashboard/patient/edit-patient.component");
var patient_invoice_component_1 = require("../components/dashboard/patient/patient-invoice.component");
var patient_history_component_1 = require("../components/dashboard/patient/patient-history.component");
exports.PatientRoutes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: patient_dashboard_component_1.PatientDashboardComponent },
    { path: 'manage', component: manage_patient_component_1.ManagePatientComponent },
    { path: 'add', component: add_patient_component_1.AddPatientComponent },
    { path: 'invoice', component: patient_invoice_component_1.PatientInvoiceComponent },
    { path: 'history', component: patient_history_component_1.PatientHistoryComponent },
    { path: 'edit/:id', component: edit_patient_component_1.EditPatientComponent },
    { path: 'reports', component: patient_reports_component_1.PatientReportsComponent },
    { path: '**', redirectTo: '404' }
];
//# sourceMappingURL=patient.routes.js.map