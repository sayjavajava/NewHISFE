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
var patient_invoice_list_component_1 = require("../components/dashboard/patient/patient-invoice-list.component");
/*import {PatientImageOrderComponent} from "../components/dashboard/patient/PatientImageOrderComponent";*/
var PatientImageOrderComponent_1 = require("../components/dashboard/patient/PatientImageOrderComponent");
var patient_history_vital_component_1 = require("../components/dashboard/patient/patient-history-vital.component");
var import_patient_data_component_1 = require("../components/dashboard/patient/import-patient-data.component");
var import_patient_map_fields_component_1 = require("../components/dashboard/patient/import-patient-map-fields.component");
var import_patient_upload_import_component_1 = require("../components/dashboard/patient/import-patient-upload-import.component");
exports.PatientRoutes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: patient_dashboard_component_1.PatientDashboardComponent },
    { path: 'manage', component: manage_patient_component_1.ManagePatientComponent },
    { path: 'add', component: add_patient_component_1.AddPatientComponent },
    { path: 'invoice', component: patient_invoice_component_1.PatientInvoiceComponent },
    /*{path: 'history/:id', component: PatientHistoryComponent},*/
    { path: 'invoice/:id', component: patient_invoice_component_1.PatientInvoiceComponent },
    { path: 'invoice-list/:id', component: patient_invoice_list_component_1.PatientInvoiceListComponent },
    /* {path: 'history', component: PatientHistoryComponent}, */
    { path: 'history/:id/problem', component: patient_problem_list_component_1.PatientProblemListComponent },
    { path: ':id/history', component: patient_history_component_1.PatientHistoryComponent },
    { path: 'edit/:id', component: edit_patient_component_1.EditPatientComponent },
    { path: 'reports', component: patient_reports_component_1.PatientReportsComponent },
    { path: 'demographic/:id', component: patient_demographic_component_1.PatientDemographicComponent },
    { path: 'appointments/:id/history', component: patient_appointment_component_1.PatientAppointmentComponent },
    { path: ':id/documents', component: patient_document_component_1.PatientDocumentsComponent },
    { path: ':id/problems-list', component: patient_problem_list_component_1.PatientProblemListComponent },
    { path: ':id/medication-list', component: patient_medication_list_component_1.PatientMedicationListComponent },
    { path: ':id/allergy-list', component: patient_allergy_list_component_1.PatientAllergyListComponent },
    { path: 'lab-orders/:id/history', component: patient_lab_orders_component_1.PatientLabOrdersComponent },
    { path: 'create-order/:id/add/:orderId/order', component: patient_add_lab_orders_component_1.PatientAddLabOrdersComponent },
    { path: 'communication', component: patient_communication_component_1.PatientCommunicationComponent },
    { path: ':id/family-history', component: patient_family_history_component_1.PatientFamilyHistoryComponent },
    /*{path: 'image-order', component: PatientImageOrderComponent},*/
    { path: ':id/image-order', component: PatientImageOrderComponent_1.PatientImageOrderComponent },
    { path: ':id/patient-vital', component: patient_history_vital_component_1.PatientHistoryVitalComponent },
    { path: 'importPatientData', component: import_patient_data_component_1.ImportPatientDataComponent },
    { path: 'importPatientMapFields/:id', component: import_patient_map_fields_component_1.ImportPatientMapFieldsComponent },
    { path: 'importPatientSaveImport/:id', component: import_patient_upload_import_component_1.ImportPatientUploadImportComponent },
    { path: '**', redirectTo: '404' }
];
//# sourceMappingURL=patient.routes.js.map