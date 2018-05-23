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
import {AddCashierComponent} from '../components/dashboard/setting/addcashier.component';
import {AdddoctorComponent} from '../components/dashboard/setting/adddoctor.component';
import {AddNurseComponent} from '../components/dashboard/setting/addnurse.component';
import {AddReceptionistComponent} from '../components/dashboard/setting/addreceptionist.component';
import {AddBranchComponent} from '../components/dashboard/setting/addbranch.component';
import {OrganizationComponent} from '../components/dashboard/setting/organization.component';
import {AddOrganizationComponent} from '../components/dashboard/setting/addorganization.component';
import {AddStaffComponent} from '../components/dashboard/setting/addstaff.component';
import {UpdateBranchComponent} from '../components/dashboard/setting/update-branch.component';


export const SettingRoutes: Routes = [
    // Setting Pages
    {path: '', redirectTo: 'organization', pathMatch: 'full'},
    {path: 'organization', component: OrganizationComponent},
    {path: 'organization/add', component: AddOrganizationComponent},
    {path: 'branch', component: BranchComponent},
    {path: 'branch/add', component: AddBranchComponent},
    {path: 'staff', component: StaffComponent},
    {path: 'staff/add', component: AddStaffComponent},
    {path:'doctor/add',component: AdddoctorComponent},
    {path:'nurse',component:NurseComponent},
    {path:'nurse/add',component:AddNurseComponent},
    {path:'department',component:DepartmentComponent},
    {path:'cashier',component:CashierComponent},
    {path:'cashier/add',component: AddCashierComponent},
    {path: 'receptionist', component: ReceptionistComponent},
    {path: 'receptionist/add', component: AddReceptionistComponent},
    {path: 'icd', component: ICDComponent},
    {path:'medicalservices',component:MedicalServiceComponent},
    {path:'role-permissions',component:RolePermissionsComponent},
    {path: '**', redirectTo: '404'},
    {path:'branch/edit/:id',component: UpdateBranchComponent},
];
