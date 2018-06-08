import {Routes} from "@angular/router";
import {AppointmentDashboardComponent} from "../components/dashboard/appointment/appointment-dashboard.component";
import {ManageAppointmentComponent} from "../components/dashboard/appointment/manage-appointment.component";
import {AddAppointmentComponent} from "../components/dashboard/appointment/add-appointment.component";
import {AppointmentReportsComponent} from "../components/dashboard/appointment/appointment-reports.component";

export const AppointmentRoutes: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: AppointmentDashboardComponent},
    {path: 'manage', component: ManageAppointmentComponent},
    {path: 'add', component: AddAppointmentComponent},
    {path: 'reports', component: AppointmentReportsComponent},
    {path: '**', redirectTo: '404'}
];
