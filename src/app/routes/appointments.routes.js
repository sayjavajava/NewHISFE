"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var appointment_dashboard_component_1 = require("../components/dashboard/appointment/appointment-dashboard.component");
var manage_appointment_component_1 = require("../components/dashboard/appointment/manage-appointment.component");
var add_appointment_component_1 = require("../components/dashboard/appointment/add-appointment.component");
var appointment_reports_component_1 = require("../components/dashboard/appointment/appointment-reports.component");
var edit_appointment_component_1 = require("../components/dashboard/appointment/edit-appointment.component");
var prime_schedular_component_1 = require("../components/dashboard/primeschedular/prime-schedular.component");
exports.AppointmentRoutes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: appointment_dashboard_component_1.AppointmentDashboardComponent },
    { path: 'manage', component: manage_appointment_component_1.ManageAppointmentComponent },
    { path: 'add', component: add_appointment_component_1.AddAppointmentComponent },
    { path: 'schedule', component: prime_schedular_component_1.PrimeSchedularComponent },
    { path: 'edit/:id', component: edit_appointment_component_1.EditAppointmentComponent },
    { path: 'reports', component: appointment_reports_component_1.AppointmentReportsComponent },
    { path: '**', redirectTo: '404' }
];
//# sourceMappingURL=appointments.routes.js.map