"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var patient_dashboard_component_1 = require("../components/dashboard/patient/patient-dashboard.component");
var manage_patient_component_1 = require("../components/dashboard/patient/manage-patient.component");
var add_patient_component_1 = require("../components/dashboard/patient/add-patient.component");
var patient_reports_component_1 = require("../components/dashboard/patient/patient-reports.component");
var edit_patient_component_1 = require("../components/dashboard/patient/edit-patient.component");
var patient_invoice_component_1 = require("../components/dashboard/patient/patient-invoice.component");
var patient_history_component_1 = require("../components/dashboard/patient/patient-history.component");
var patient_demographic_component_1 = require("../components/dashboard/patient/patient-demographic.component");
var patient_appointment_component_1 = require("../components/dashboard/patient/patient-appointment.component");
var patient_document_component_1 = require("../components/dashboard/patient/patient-document.component");
var patient_problem_list_component_1 = require("../components/dashboard/patient/patient-problem-list.component");
var patient_medication_list_component_1 = require("../components/dashboard/patient/patient-medication-list.component");
var patient_allergy_list_component_1 = require("../components/dashboard/patient/patient-allergy-list.component");
var patient_lab_orders_component_1 = require("../components/dashboard/patient/patient-lab-orders.component");
var patient_communication_component_1 = require("../components/dashboard/patient/patient-communication.component");
var patient_family_history_component_1 = require("../components/dashboard/patient/patient-family-history.component");
var patient_add_lab_orders_component_1 = require("../components/dashboard/patient/patient-add-lab-orders.component");
var PatientImageOrderComponent_1 = require("../components/dashboard/patient/PatientImageOrderComponent");
var patient_history_vital_component_1 = require("../components/dashboard/patient/patient-history-vital.component");
exports.PatientRoutes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: patient_dashboard_component_1.PatientDashboardComponent },
    { path: 'manage', component: manage_patient_component_1.ManagePatientComponent },
    { path: 'add', component: add_patient_component_1.AddPatientComponent },
    { path: 'invoice', component: patient_invoice_component_1.PatientInvoiceComponent },
    /*{path: 'history/:id', component: PatientHistoryComponent},*/
    { path: 'invoice/:id', component: patient_invoice_component_1.PatientInvoiceComponent },
    /* {path: 'history', component: PatientHistoryComponent}, */
    { path: 'history/:id/problem', component: patient_problem_list_component_1.PatientProblemListComponent },
    { path: ':id/history', component: patient_history_component_1.PatientHistoryComponent },
    { path: 'edit/:id', component: edit_patient_component_1.EditPatientComponent },
    { path: 'reports', component: patient_reports_component_1.PatientReportsComponent },
    { path: 'demographic/:id', component: patient_demographic_component_1.PatientDemographicComponent },
    { path: 'appointments/:id/history', component: patient_appointment_component_1.PatientAppointmentComponent },
    { path: 'documents', component: patient_document_component_1.PatientDocumentsComponent },
    { path: 'problems-list', component: patient_problem_list_component_1.PatientProblemListComponent },
    { path: 'medication-list', component: patient_medication_list_component_1.PatientMedicationListComponent },
    { path: 'allergy-list', component: patient_allergy_list_component_1.PatientAllergyListComponent },
    { path: 'lab-orders/:id/history', component: patient_lab_orders_component_1.PatientLabOrdersComponent },
    { path: 'create-order/:id/add/:orderId/order', component: patient_add_lab_orders_component_1.PatientAddLabOrdersComponent },
    { path: 'communication', component: patient_communication_component_1.PatientCommunicationComponent },
    { path: 'family-history', component: patient_family_history_component_1.PatientFamilyHistoryComponent },
    { path: 'image-order', component: PatientImageOrderComponent_1.PatientImageOrderComponent },
    { path: 'patient-vital', component: patient_history_vital_component_1.PatientHistoryVitalComponent },
    { path: '**', redirectTo: '404' }
];
//# sourceMappingURL=patient.routes.js.map