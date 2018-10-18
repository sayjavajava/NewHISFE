// Modules
import {NgModule, OnInit} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AmazingTimePickerModule} from "amazing-time-picker";
import {MatDatepickerModule} from "@angular/material/datepicker";
// App Components
import {AppComponent} from "./components/app.component";
import {MainComponent} from "./components/dashboard/main.component";
import {LoginComponent} from "./components/login.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {MenuComponent} from "./components/dashboard/menu.component";
import {PatientHistoryMenuComponent} from "./components/dashboard/patient/patient-history-menu.component";
// Dashboard Components
import {HeaderComponent} from "./components/dashboard/header.component";
import {NavigationComponent} from "./components/dashboard/navigation.component";
import {FooterComponent} from "./components/dashboard/footer.component";
import {ContentComponent} from "./components/dashboard/content.component";
// Errors
import {NotFound404Component} from "./components/errors/not-found-404.component";
// Routes
import {routes} from "./app.routes";
import {ColorPickerModule} from "ngx-color-picker";
// Services
import {RequestsService} from "./services/requests.service";
import {HISUtilService} from "./services/his-util.service";
import {PermissionsService} from "./services/permissions.service";

import {AppConfig} from "./configuration/app.config";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastOptions} from "ng2-toastr";
import {CustomOption} from "./configuration/CustomOption";
import {DoctorDashboardComponent} from "./components/dashboard/doctor/doctor-dashboard.component";
import {HttpClientModule} from "@angular/common/http";
import {UserSharedService} from "./services/user.shared.service";
import {SettingComponent} from "./components/dashboard/setting/setting.component";
import {SettingNavigationComponent} from "./components/dashboard/setting/setting-navigation.component";
import {StaffComponent} from "./components/dashboard/setting/staff.component";
import {CodeComponent} from "./components/dashboard/setting/code.component";
import {DepartmentComponent} from "./components/dashboard/setting/department.component";
import {CashierComponent} from "./components/dashboard/cashier/cashier.component";
import {PaymentComponent} from "./components/dashboard/cashier/payment.component";
import {MedicalServiceComponent} from "./components/dashboard/setting/medical-service.component";
import {NurseComponent} from "./components/dashboard/setting/nurse.component";

import {NurseDashboardComponent} from "./components/dashboard/nurse/nurse-dashboard.component";
import {ReceptionistDashboardComponent} from "./components/dashboard/receptionist/receptionist-dashboard.component";

import {ReceptionistComponent} from "./components/dashboard/setting/receptionist.component";
import {BranchComponent} from "./components/dashboard/setting/branch.component";
import {UpdateCashierComponent} from "./components/dashboard/setting/updatecashier.component";
import {RolePermissionsComponent} from "./components/dashboard/setting/role-permissions.component";
import {UpdatedoctorComponent} from "./components/dashboard/setting/updatedoctor.component";
import {UpdateNurseComponent} from "./components/dashboard/setting/updatenurse.component";
import {UpdateReceptionistComponent} from "./components/dashboard/setting/update-receptionist.component";
import {AddBranchComponent} from "./components/dashboard/setting/addbranch.component";
import {
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSnackBarModule
} from "@angular/material";
import {NotificationService} from "./services/notification.service";
import {OrganizationComponent} from "./components/dashboard/setting/organization.component";
import {AddOrganizationComponent} from "./components/dashboard/setting/add-organization.component";
import {AddStaffComponent} from "./components/dashboard/setting/addstaff.component";
import {ErrordisplayComponent} from "./components/dashboard/setting/errordisplay.component";
import {ConformationDialogService} from "./services/ConformationDialogService";
import {ConfirmationdialogComponent} from "./components/dashboard/confirmationdialog.component";
import {UpdateBranchComponent} from "./components/dashboard/setting/update-branch.component";


import {VersionComponent} from "./components/dashboard/setting/version.component";
import {CodeVersionComponent} from "./components/dashboard/setting/code-version.component";
import {AddMedicalServiceComponent} from "./components/dashboard/setting/add-medical-service.component";
import {ServiceTaxComponent} from "./components/dashboard/setting/service-tax.component";
import {EditMedicalServiceComponent} from "./components/dashboard/setting/edit-medical-service.component";
import {NotFound404SettingComponent} from "./components/dashboard/setting/not-found-404-setting.component";
import {EmailTemplateComponent} from "./components/dashboard/setting/email-template-component";
import {AddEmailTemplateComponent} from "./components/dashboard/setting/add-email-template.component";
import {EditEmailTemplateComponent} from "./components/dashboard/setting/edit-email-template.component";
import {UpdateOrganizationComponent} from "./components/dashboard/setting/update-organization.component";
import {ManagePatientComponent} from "./components/dashboard/patient/manage-patient.component";
import {PatientNavigationComponent} from "./components/dashboard/patient/patient-navigation.component";
import {PatientDashboardComponent} from "./components/dashboard/patient/patient-dashboard.component";
import {AddPatientComponent} from "./components/dashboard/patient/add-patient.component";
import {PatientReportsComponent} from "./components/dashboard/patient/patient-reports.component";
import {PatientComponent} from "./components/dashboard/patient/patient.component";
import {PatientInvoiceComponent} from "./components/dashboard/patient/patient-invoice.component";
import {PatientHistoryComponent} from "./components/dashboard/patient/patient-history.component";

import {PatientDemographicComponent} from "./components/dashboard/patient/patient-demographic.component";
import {PatientAppointmentComponent} from "./components/dashboard/patient/patient-appointment.component";

import {PatientDocumentsComponent} from "./components/dashboard/patient/patient-document.component";
import {PatientProblemListComponent} from "./components/dashboard/patient/patient-problem-list.component";
import {PatientMedicationListComponent} from "./components/dashboard/patient/patient-medication-list.component";
import {PatientAllergyListComponent} from "./components/dashboard/patient/patient-allergy-list.component";
import {PatientLabOrdersComponent} from "./components/dashboard/patient/patient-lab-orders.component";
import {PatientCommunicationComponent} from "./components/dashboard/patient/patient-communication.component";
import {PatientFamilyHistoryComponent} from "./components/dashboard/patient/patient-family-history.component";

import {EditPatientComponent} from "./components/dashboard/patient/edit-patient.component";
import {AppointmentComponent} from "./components/dashboard/appointment/appointment.component";
import {AppointmentDashboardComponent} from "./components/dashboard/appointment/appointment-dashboard.component";
import {ManageAppointmentComponent} from "./components/dashboard/appointment/manage-appointment.component";
import {AddAppointmentComponent} from "./components/dashboard/appointment/add-appointment.component";
import {AppointmentReportsComponent} from "./components/dashboard/appointment/appointment-reports.component";
import {AppointmentNavigationComponent} from "./components/dashboard/appointment/appointment-navigation.component";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {CalendarModule} from "angular-calendar";
import {DemoUtilsModule} from "../demo-utils/module";
import {EditAppointmentComponent} from "./components/dashboard/appointment/edit-appointment.component";
import {PatientAddLabOrdersComponent} from "./components/dashboard/patient/patient-add-lab-orders.component";
import {DataService} from "./services/DataService";
import {EmailConfigurationComponent} from "./components/dashboard/setting/email-configuration.component";
import {SmsTemplateComponent} from "./components/dashboard/setting/sms-template.component";
import {AddEditSmsTemplateComponent} from "./components/dashboard/setting/add-edit-sms-template.component";


@NgModule({
    providers: [
        // Services
        RequestsService,
        NotificationService,
        HISUtilService,
        AppConfig,
        PermissionsService,DataService,
        {provide: ToastOptions, useClass: CustomOption},
        UserSharedService, ConformationDialogService
    ], entryComponents: [ConfirmationdialogComponent],
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
        AmazingTimePickerModule,
        MatIconModule,
        MatDialogModule,
        AmazingTimePickerModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatIconModule,
        ColorPickerModule,
        NgbModalModule.forRoot(),
        CalendarModule.forRoot(),
        DemoUtilsModule
    ],
    declarations: [
        // App Components
        AppComponent,
        MainComponent,
        LoginComponent,
        DepartmentComponent,
        DashboardComponent,
        DoctorDashboardComponent,
        NurseDashboardComponent,
        ReceptionistDashboardComponent,
        // Dashboard Components
        HeaderComponent,
        NavigationComponent,
        FooterComponent,
        ContentComponent,
        NotFound404Component,
        ManagePatientComponent,
        PatientDashboardComponent,
        AddPatientComponent,
        PatientReportsComponent,
        PatientComponent,
        EditPatientComponent,
        PatientInvoiceComponent,

        PatientHistoryComponent,
        PatientDemographicComponent,
        PatientAppointmentComponent,
        PatientHistoryMenuComponent,
        PatientDocumentsComponent,
        PatientProblemListComponent,
        PatientMedicationListComponent,
        PatientAllergyListComponent,
        PatientLabOrdersComponent,
        PatientCommunicationComponent,
        PatientFamilyHistoryComponent,
        PatientAddLabOrdersComponent,

        AppointmentComponent,
        AppointmentDashboardComponent,
        ManageAppointmentComponent,
        AddAppointmentComponent,
        AppointmentReportsComponent,
        AppointmentNavigationComponent,

        //Setting Components
        SettingComponent,
        SettingNavigationComponent,
        PatientNavigationComponent,
        StaffComponent,
        CodeComponent,
        VersionComponent,
        CodeVersionComponent,
        DepartmentComponent,
        CashierComponent,
        PaymentComponent,
        MedicalServiceComponent,
        AddMedicalServiceComponent,
        EditMedicalServiceComponent,
        NurseComponent,
        ReceptionistComponent,
        BranchComponent,
        UpdateCashierComponent,
        RolePermissionsComponent,
        UpdatedoctorComponent,
        UpdateNurseComponent,
        UpdateReceptionistComponent,
        AddBranchComponent,
        OrganizationComponent,
        AddOrganizationComponent,
        AddStaffComponent,
        ConfirmationdialogComponent,
        UpdateBranchComponent,
        AddStaffComponent,
        ServiceTaxComponent,
        EmailTemplateComponent,
        EmailConfigurationComponent,
        SmsTemplateComponent,
        AddEditSmsTemplateComponent,

        AddEmailTemplateComponent,
        EditEmailTemplateComponent,
        NotFound404SettingComponent,
        AddStaffComponent,
        ErrordisplayComponent,
        ConfirmationdialogComponent,
        UpdateOrganizationComponent,
        EditAppointmentComponent,
        MenuComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule implements OnInit {
    ngOnInit() {
    }
}
