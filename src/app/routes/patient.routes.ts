import {Routes} from '@angular/router';
import {PatientDashboardComponent} from "../components/dashboard/patient/patient-dashboard.component";
import {ManagePatientComponent} from "../components/dashboard/patient/manage-patient.component";
import {AddPatientComponent} from "../components/dashboard/patient/add-patient.component";
import {PatientReportsComponent} from "../components/dashboard/patient/patient-reports.component";
import {EditPatientComponent} from "../components/dashboard/patient/edit-patient.component";
import {PatientInvoiceComponent} from "../components/dashboard/patient/patient-invoice.component";
import {PatientHistoryComponent} from "../components/dashboard/patient/patient-history.component";

export const PatientRoutes: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: PatientDashboardComponent},
    {path: 'manage', component: ManagePatientComponent},
    {path: 'add', component: AddPatientComponent},
    {path: 'invoice', component: PatientInvoiceComponent},
    {path: 'history', component: PatientHistoryComponent},
    {path: 'edit/:id', component: EditPatientComponent},
    {path: 'reports', component: PatientReportsComponent},
    {path: '**', redirectTo: '404'}
];
