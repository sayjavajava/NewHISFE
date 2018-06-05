"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var content_component_1 = require("../components/dashboard/content.component");
var not_found_404_component_1 = require("../components/errors/not-found-404.component");
var doctor_dashboard_component_1 = require("../components/dashboard/doctor/doctor-dashboard.component");
var setting_component_1 = require("../components/dashboard/setting/setting.component");
var setting_routes_1 = require("./setting.routes");
exports.DashboardRoutes = [
    // Dashboard Pages
    { path: '', component: content_component_1.ContentComponent },
    { path: 'doctor', component: doctor_dashboard_component_1.DoctorDashboardComponent },
    { path: 'setting', component: setting_component_1.SettingComponent, children: setting_routes_1.SettingRoutes },
    { path: 'patient', component: setting_component_1.SettingComponent, children: setting_routes_1.SettingRoutes },
    { path: 'customer/404-not-found', component: not_found_404_component_1.NotFound404Component },
    { path: '404-not-found', component: not_found_404_component_1.NotFound404Component },
    { path: '**', redirectTo: '404' }
];
//# sourceMappingURL=dashboard.routes.js.map