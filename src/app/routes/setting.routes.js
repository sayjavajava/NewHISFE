"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var staff_component_1 = require("../components/dashboard/setting/staff.component");
var icd_component_1 = require("../components/dashboard/setting/icd.component");
var department_component_1 = require("../components/dashboard/setting/department.component");
var cashier_component_1 = require("../components/dashboard/setting/cashier.component");
var medical_service_component_1 = require("../components/dashboard/setting/medical-service.component");
var nurse_component_1 = require("../components/dashboard/setting/nurse.component");
var receptionist_component_1 = require("../components/dashboard/setting/receptionist.component");
var branch_component_1 = require("../components/dashboard/setting/branch.component");
var role_permissions_component_1 = require("../components/dashboard/setting/role-permissions.component");
var updatecashier_component_1 = require("../components/dashboard/setting/updatecashier.component");
var updatedoctor_component_1 = require("../components/dashboard/setting/updatedoctor.component");
var updatenurse_component_1 = require("../components/dashboard/setting/updatenurse.component");
var addreceptionist_component_1 = require("../components/dashboard/setting/addreceptionist.component");
var addbranch_component_1 = require("../components/dashboard/setting/addbranch.component");
var organization_component_1 = require("../components/dashboard/setting/organization.component");
var addorganization_component_1 = require("../components/dashboard/setting/addorganization.component");
var addstaff_component_1 = require("../components/dashboard/setting/addstaff.component");
exports.SettingRoutes = [
    // Setting Pages
    { path: '', redirectTo: 'organization', pathMatch: 'full' },
    { path: 'organization', component: organization_component_1.OrganizationComponent },
    { path: 'organization/add', component: addorganization_component_1.AddOrganizationComponent },
    { path: 'branch', component: branch_component_1.BranchComponent },
    { path: 'branch/add', component: addbranch_component_1.AddBranchComponent },
    { path: 'staff', component: staff_component_1.StaffComponent },
    { path: 'staff/add', component: addstaff_component_1.AddStaffComponent },
    { path: 'doctor/edit/:id', component: updatedoctor_component_1.UpdatedoctorComponent },
    { path: 'nurse', component: nurse_component_1.NurseComponent },
    { path: 'nurse/edit/:id', component: updatenurse_component_1.UpdateNurseComponent },
    { path: 'department', component: department_component_1.DepartmentComponent },
    { path: 'cashier', component: cashier_component_1.CashierComponent },
    { path: 'cashier/edit/:id', component: updatecashier_component_1.UpdateCashierComponent },
    { path: 'receptionist', component: receptionist_component_1.ReceptionistComponent },
    { path: 'receptionist/edit/:id', component: addreceptionist_component_1.AddReceptionistComponent },
    { path: 'icd', component: icd_component_1.ICDComponent },
    { path: 'medicalservices', component: medical_service_component_1.MedicalServiceComponent },
    { path: 'role-permissions', component: role_permissions_component_1.RolePermissionsComponent },
    { path: '**', redirectTo: '404' }
];
//# sourceMappingURL=setting.routes.js.map