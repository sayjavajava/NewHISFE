"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var staff_component_1 = require("../components/dashboard/setting/staff.component");
var code_component_1 = require("../components/dashboard/setting/code.component");
var department_component_1 = require("../components/dashboard/setting/department.component");
var cashier_component_1 = require("../components/dashboard/cashier/cashier.component");
var medical_service_component_1 = require("../components/dashboard/setting/medical-service.component");
var nurse_component_1 = require("../components/dashboard/setting/nurse.component");
var receptionist_component_1 = require("../components/dashboard/setting/receptionist.component");
var branch_component_1 = require("../components/dashboard/setting/branch.component");
var role_permissions_component_1 = require("../components/dashboard/setting/role-permissions.component");
var update_receptionist_component_1 = require("../components/dashboard/setting/update-receptionist.component");
var addbranch_component_1 = require("../components/dashboard/setting/addbranch.component");
var organization_component_1 = require("../components/dashboard/setting/organization.component");
var add_organization_component_1 = require("../components/dashboard/setting/add-organization.component");
var addstaff_component_1 = require("../components/dashboard/setting/addstaff.component");
var update_branch_component_1 = require("../components/dashboard/setting/update-branch.component");
var version_component_1 = require("../components/dashboard/setting/version.component");
var code_version_component_1 = require("../components/dashboard/setting/code-version.component");
var add_medical_service_component_1 = require("../components/dashboard/setting/add-medical-service.component");
var service_tax_component_1 = require("../components/dashboard/setting/service-tax.component");
var email_template_component_1 = require("../components/dashboard/setting/email-template-component");
var add_email_template_component_1 = require("../components/dashboard/setting/add-email-template.component");
var edit_email_template_component_1 = require("../components/dashboard/setting/edit-email-template.component");
var edit_medical_service_component_1 = require("../components/dashboard/setting/edit-medical-service.component");
var not_found_404_setting_component_1 = require("../components/dashboard/setting/not-found-404-setting.component");
var updatenurse_component_1 = require("../components/dashboard/setting/updatenurse.component");
var updatedoctor_component_1 = require("../components/dashboard/setting/updatedoctor.component");
var updatecashier_component_1 = require("../components/dashboard/setting/updatecashier.component");
var update_organization_component_1 = require("../components/dashboard/setting/update-organization.component");
var statuses_component_1 = require("../components/dashboard/setting/statuses.component");
var admin_profile_component_1 = require("../components/dashboard/setting/admin-profile.component");
exports.SettingRoutes = [
    // Setting Pages
    { path: '', redirectTo: 'organization', pathMatch: 'full' },
    { path: 'organization', component: organization_component_1.OrganizationComponent },
    { path: 'organization/add', component: add_organization_component_1.AddOrganizationComponent },
    { path: 'organization/edit/:id', component: update_organization_component_1.UpdateOrganizationComponent },
    { path: 'branch', component: branch_component_1.BranchComponent },
    { path: 'admin/profile', component: admin_profile_component_1.AdminProfileComponent },
    { path: 'branch/add', component: addbranch_component_1.AddBranchComponent },
    { path: 'staff', component: staff_component_1.StaffComponent },
    { path: 'staff/add', component: addstaff_component_1.AddStaffComponent },
    { path: 'nurse', component: nurse_component_1.NurseComponent },
    { path: 'department', component: department_component_1.DepartmentComponent },
    { path: 'cashier', component: cashier_component_1.CashierComponent },
    { path: 'receptionist', component: receptionist_component_1.ReceptionistComponent },
    { path: 'nurse/edit/:id', component: updatenurse_component_1.UpdateNurseComponent },
    { path: 'doctor/edit/:id', component: updatedoctor_component_1.UpdatedoctorComponent },
    { path: 'cashier/edit/:id', component: updatecashier_component_1.UpdateCashierComponent },
    { path: 'receptionist/edit/:id', component: update_receptionist_component_1.UpdateReceptionistComponent },
    { path: 'branch/edit/:id', component: update_branch_component_1.UpdateBranchComponent },
    { path: 'code', component: code_component_1.CodeComponent },
    { path: 'version', component: version_component_1.VersionComponent },
    { path: 'codeVersion', component: code_version_component_1.CodeVersionComponent },
    { path: 'medicalServices', component: medical_service_component_1.MedicalServiceComponent },
    { path: 'medicalServices/add', component: add_medical_service_component_1.AddMedicalServiceComponent },
    { path: 'medicalServices/edit/:id', component: edit_medical_service_component_1.EditMedicalServiceComponent },
    { path: 'role-permissions', component: role_permissions_component_1.RolePermissionsComponent },
    { path: 'service-tax', component: service_tax_component_1.ServiceTaxComponent },
    { path: 'status', component: statuses_component_1.StatusesComponent },
    { path: '404-not-found', component: not_found_404_setting_component_1.NotFound404SettingComponent },
    { path: 'branch/edit/:id', component: update_branch_component_1.UpdateBranchComponent },
    { path: 'email-template', component: email_template_component_1.EmailTemplateComponent },
    { path: 'email-template/add', component: add_email_template_component_1.AddEmailTemplateComponent },
    { path: 'email-template/edit/:id', component: edit_email_template_component_1.EditEmailTemplateComponent },
    { path: '**', redirectTo: '404' }
];
//# sourceMappingURL=setting.routes.js.map