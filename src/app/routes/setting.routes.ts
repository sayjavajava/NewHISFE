import {Routes} from '@angular/router';
import {StaffComponent} from '../components/dashboard/setting/staff.component';
import {ICDComponent} from '../components/dashboard/setting/icd.component';
import {DepartmentComponent} from '../components/dashboard/setting/department.component';
import {CashierComponent} from '../components/dashboard/setting/cashier.component';
import {MedicalServiceComponent} from '../components/dashboard/setting/medical-service.component';
import {NurseComponent} from '../components/dashboard/setting/nurse.component';
import {ReceptionistComponent} from '../components/dashboard/setting/receptionist.component';
import {BranchComponent} from '../components/dashboard/setting/branch.component';
import {RolePermissionsComponent} from '../components/dashboard/setting/role-permissions.component';
import {UpdateCashierComponent} from '../components/dashboard/setting/updatecashier.component';
import {UpdatedoctorComponent} from '../components/dashboard/setting/updatedoctor.component';
import {UpdateNurseComponent} from '../components/dashboard/setting/updatenurse.component';
import {AddReceptionistComponent} from '../components/dashboard/setting/addreceptionist.component';
import {AddBranchComponent} from '../components/dashboard/setting/addbranch.component';
import {OrganizationComponent} from '../components/dashboard/setting/organization.component';
import {AddOrganizationComponent} from '../components/dashboard/setting/addorganization.component';
import {AddStaffComponent} from '../components/dashboard/setting/addstaff.component';


export const SettingRoutes: Routes = [
    // Setting Pages
    {path: '', redirectTo: 'organization', pathMatch: 'full'},
    {path: 'organization', component: OrganizationComponent},
    {path: 'organization/add', component: AddOrganizationComponent},
    {path: 'branch', component: BranchComponent},
    {path: 'branch/add', component: AddBranchComponent},
    {path: 'staff', component: StaffComponent},
    {path: 'staff/add', component: AddStaffComponent},
    {path:'doctor/edit/:id',component: UpdatedoctorComponent},
    {path:'nurse',component:NurseComponent},
    {path:'nurse/edit/:id',component:UpdateNurseComponent},
    {path:'department',component:DepartmentComponent},
    {path:'cashier',component:CashierComponent},
    {path:'cashier/edit/:id',component: UpdateCashierComponent},
    {path: 'receptionist', component: ReceptionistComponent},
    {path: 'receptionist/edit/:id', component: AddReceptionistComponent},
    {path: 'icd', component: ICDComponent},
    {path:'medicalservices',component:MedicalServiceComponent},
    {path:'role-permissions',component:RolePermissionsComponent},
    {path: '**', redirectTo: '404'}
];
