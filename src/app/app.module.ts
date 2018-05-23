// Modules
import {NgModule, OnInit} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// App Components
import {AppComponent} from './components/app.component';
import {MainComponent} from './components/dashboard/main.component';
import {LoginComponent} from './components/login.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
// Dashboard Components
import {HeaderComponent} from './components/dashboard/header.component';
import {NavigationComponent} from './components/dashboard/navigation.component';
import {FooterComponent} from './components/dashboard/footer.component';
import {ContentComponent} from './components/dashboard/content.component';
// Errors
import {NotFound404Component} from './components/errors/not-found-404.component';
// Routes
import {routes} from './app.routes';
// Services
import {RequestsService} from './services/requests.service';
import {HISUtilService} from './services/his-util.service';
import {PermissionsService} from './services/permissions.service';

import {AppConfig} from './configuration/app.config';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastOptions} from 'ng2-toastr';
import {CustomOption} from './configuration/CustomOption';
import {DoctorDashboardComponent} from './components/dashboard/doctor/doctor-dashboard.component';
import {HttpClientModule} from '@angular/common/http';
import {UserSharedService} from './services/user.shared.service';
import {SettingComponent} from './components/dashboard/setting/setting.component';
import {SettingNavigationComponent} from './components/dashboard/setting/setting-navigation.component';
import {StaffComponent} from './components/dashboard/setting/staff.component';
import {CodeComponent} from './components/dashboard/setting/code.component';
import {DepartmentComponent} from './components/dashboard/setting/department.component';
import {CashierComponent} from './components/dashboard/setting/cashier.component';
import {MedicalServiceComponent} from './components/dashboard/setting/medical-service.component';
import {NurseComponent} from './components/dashboard/setting/nurse.component';
import {ReceptionistComponent} from './components/dashboard/setting/receptionist.component';
import {BranchComponent} from './components/dashboard/setting/branch.component';
import {AddCashierComponent} from './components/dashboard/setting/addcashier.component';
import {RolePermissionsComponent} from './components/dashboard/setting/role-permissions.component';
import {AdddoctorComponent} from './components/dashboard/setting/adddoctor.component';
import {AddNurseComponent} from './components/dashboard/setting/addnurse.component';
import {AddReceptionistComponent} from './components/dashboard/setting/addreceptionist.component';
import {AddBranchComponent} from './components/dashboard/setting/addbranch.component';
import {MatButtonModule, MatSnackBarModule} from '@angular/material';
import {NotificationService} from './services/notification.service';
import {OrganizationComponent} from './components/dashboard/setting/organization.component';
import {AddOrganizationComponent} from './components/dashboard/setting/addorganization.component';
import {AddStaffComponent} from './components/dashboard/setting/addstaff.component';
import {VersionComponent} from './components/dashboard/setting/version.component';
import {CodeVersionComponent} from './components/dashboard/setting/code-version.component';
import {AddMedicalServiceComponent} from './components/dashboard/setting/add-medical-service.component';
import {ServiceTaxComponent} from './components/dashboard/setting/service-tax.component';
import {EditMedicalServiceComponent} from "./components/dashboard/setting/edit-medical-service.component";
import {NotFound404SettingComponent} from "./components/dashboard/setting/not-found-404-setting.component";

@NgModule({
    providers: [
        // Services
        RequestsService,
        NotificationService,
        HISUtilService,
        AppConfig,
        PermissionsService,
        {provide: ToastOptions, useClass: CustomOption},
        UserSharedService
    ],
    imports: [
        // Modules
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        routes,
        BrowserAnimationsModule,
        MatButtonModule,
        HttpClientModule,
        MatSnackBarModule,
    ],
    declarations: [
        // App Components
        AppComponent,
        MainComponent,
        LoginComponent,
        DepartmentComponent,
        DashboardComponent,
        DoctorDashboardComponent,


        // Dashboard Components
        HeaderComponent,
        NavigationComponent,
        FooterComponent,
        ContentComponent,
        NotFound404Component,

        //Setting Components
        SettingComponent,
        SettingNavigationComponent,
        StaffComponent,
        CodeComponent,
        VersionComponent,
        CodeVersionComponent,
        DepartmentComponent,
        CashierComponent,
        MedicalServiceComponent,
        AddMedicalServiceComponent,
        EditMedicalServiceComponent,
        NurseComponent,
        ReceptionistComponent,
        BranchComponent,
        AddCashierComponent,
        RolePermissionsComponent,
        AdddoctorComponent,
        AddNurseComponent,
        AddReceptionistComponent,
        AddBranchComponent,
        OrganizationComponent,
        AddOrganizationComponent,
        AddStaffComponent,
        ServiceTaxComponent,
        NotFound404SettingComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule implements OnInit {
    ngOnInit() {
    }
}
