import {Routes} from '@angular/router';
import {PatientDashboardComponent} from "../components/dashboard/patient/patient-dashboard.component";
import {ManagePatientComponent} from "../components/dashboard/patient/manage-patient.component";
import {AddPatientComponent} from "../components/dashboard/patient/add-patient.component";
import {PatientReportsComponent} from "../components/dashboard/patient/patient-reports.component";
import {EditPatientComponent} from "../components/dashboard/patient/edit-patient.component";
import {PatientInvoiceComponent} from "../components/dashboard/patient/patient-invoice.component";
import {PatientHistoryComponent} from "../components/dashboard/patient/patient-history.component";

import {PatientDemographicComponent} from "../components/dashboard/patient/patient-demographic.component";
import {PatientAppointmentComponent} from "../components/dashboard/patient/patient-appointment.component";



import {PatientDocumentsComponent} from "../components/dashboard/patient/patient-document.component";
import {PatientProblemListComponent} from "../components/dashboard/patient/patient-problem-list.component";
import {PatientMedicationListComponent} from "../components/dashboard/patient/patient-medication-list.component";
import {PatientAllergyListComponent} from "../components/dashboard/patient/patient-allergy-list.component";
import {PatientLabOrdersComponent} from "../components/dashboard/patient/patient-lab-orders.component";
import {PatientCommunicationComponent} from "../components/dashboard/patient/patient-communication.component";
import {PatientFamilyHistoryComponent} from "../components/dashboard/patient/patient-family-history.component";
import {PatientAddLabOrdersComponent} from "../components/dashboard/patient/patient-add-lab-orders.component";

export const PatientRoutes: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: PatientDashboardComponent},
    {path: 'manage', component: ManagePatientComponent},
    {path: 'add', component: AddPatientComponent},
    {path: 'invoice', component: PatientInvoiceComponent},
    /*{path: 'history/:id', component: PatientHistoryComponent},*/
    {path: 'invoice/:id', component: PatientInvoiceComponent},
    /* {path: 'history', component: PatientHistoryComponent}, */

    {path: 'history/:id/problem', component: PatientProblemListComponent},
    {path: ':id/history', component: PatientHistoryComponent},
    {path: 'edit/:id', component: EditPatientComponent},
    {path: 'reports', component: PatientReportsComponent},
    {path: 'demographic/:id', component: PatientDemographicComponent},
    {path: 'appointments/:id/history', component: PatientAppointmentComponent},
    {path: 'documents', component: PatientDocumentsComponent},
    {path: 'problems-list', component: PatientProblemListComponent},
    {path: 'medication-list', component: PatientMedicationListComponent},
    {path: 'allergy-list', component: PatientAllergyListComponent},
    {path: 'lab-orders/:id/history', component: PatientLabOrdersComponent},
    {path: 'create-order/:id/add/:orderId/order', component: PatientAddLabOrdersComponent},
    {path: 'communication', component: PatientCommunicationComponent},
    {path: 'family-history', component: PatientFamilyHistoryComponent},
    {path: '**', redirectTo: '404'}
];
