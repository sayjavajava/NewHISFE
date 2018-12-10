"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="components/dashboard/patient/invoice-listing.component.ts"/>
// Modules
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var amazing_time_picker_1 = require("amazing-time-picker");
var datepicker_1 = require("@angular/material/datepicker");
// App Components
var app_component_1 = require("./components/app.component");
var main_component_1 = require("./components/dashboard/main.component");
var login_component_1 = require("./components/login.component");
var dashboard_component_1 = require("./components/dashboard/dashboard.component");
var menu_component_1 = require("./components/dashboard/menu.component");
var patient_history_menu_component_1 = require("./components/dashboard/patient/patient-history-menu.component");
// Dashboard Components
var header_component_1 = require("./components/dashboard/header.component");
var navigation_component_1 = require("./components/dashboard/navigation.component");
var footer_component_1 = require("./components/dashboard/footer.component");
var content_component_1 = require("./components/dashboard/content.component");
// Errors
var not_found_404_component_1 = require("./components/errors/not-found-404.component");
// Routes
var app_routes_1 = require("./app.routes");
var ngx_color_picker_1 = require("ngx-color-picker");
var ng2_ckeditor_1 = require("ng2-ckeditor");
// Services
var requests_service_1 = require("./services/requests.service");
var his_util_service_1 = require("./services/his-util.service");
var permissions_service_1 = require("./services/permissions.service");
var app_config_1 = require("./configuration/app.config");
var animations_1 = require("@angular/platform-browser/animations");
var ng2_toastr_1 = require("ng2-toastr");
var CustomOption_1 = require("./configuration/CustomOption");
var doctor_dashboard_component_1 = require("./components/dashboard/doctor/doctor-dashboard.component");
var http_1 = require("@angular/common/http");
var user_shared_service_1 = require("./services/user.shared.service");
var setting_component_1 = require("./components/dashboard/setting/setting.component");
var setting_navigation_component_1 = require("./components/dashboard/setting/setting-navigation.component");
var staff_component_1 = require("./components/dashboard/setting/staff.component");
var code_component_1 = require("./components/dashboard/setting/code.component");
var department_component_1 = require("./components/dashboard/setting/department.component");
var cashier_component_1 = require("./components/dashboard/cashier/cashier.component");
var payment_component_1 = require("./components/dashboard/cashier/payment.component");
var medical_service_component_1 = require("./components/dashboard/setting/medical-service.component");
var nurse_component_1 = require("./components/dashboard/setting/nurse.component");
var nurse_dashboard_component_1 = require("./components/dashboard/nurse/nurse-dashboard.component");
var receptionist_dashboard_component_1 = require("./components/dashboard/receptionist/receptionist-dashboard.component");
var receptionist_component_1 = require("./components/dashboard/setting/receptionist.component");
var branch_component_1 = require("./components/dashboard/setting/branch.component");
var updatecashier_component_1 = require("./components/dashboard/setting/updatecashier.component");
var role_permissions_component_1 = require("./components/dashboard/setting/role-permissions.component");
var updatedoctor_component_1 = require("./components/dashboard/setting/updatedoctor.component");
var updatenurse_component_1 = require("./components/dashboard/setting/updatenurse.component");
var update_receptionist_component_1 = require("./components/dashboard/setting/update-receptionist.component");
var addbranch_component_1 = require("./components/dashboard/setting/addbranch.component");
var user_permissions_component_1 = require("./components/dashboard/setting/user-permissions.component");
var material_1 = require("@angular/material");
var notification_service_1 = require("./services/notification.service");
var organization_component_1 = require("./components/dashboard/setting/organization.component");
var add_organization_component_1 = require("./components/dashboard/setting/add-organization.component");
var addstaff_component_1 = require("./components/dashboard/setting/addstaff.component");
var errordisplay_component_1 = require("./components/dashboard/setting/errordisplay.component");
var ConformationDialogService_1 = require("./services/ConformationDialogService");
var confirmationdialog_component_1 = require("./components/dashboard/confirmationdialog.component");
var update_branch_component_1 = require("./components/dashboard/setting/update-branch.component");
var version_component_1 = require("./components/dashboard/setting/version.component");
var code_version_component_1 = require("./components/dashboard/setting/code-version.component");
var add_medical_service_component_1 = require("./components/dashboard/setting/add-medical-service.component");
var tax_component_1 = require("./components/dashboard/setting/tax.component");
var edit_medical_service_component_1 = require("./components/dashboard/setting/edit-medical-service.component");
var not_found_404_setting_component_1 = require("./components/dashboard/setting/not-found-404-setting.component");
var email_template_component_1 = require("./components/dashboard/setting/email-template-component");
var add_email_template_component_1 = require("./components/dashboard/setting/add-email-template.component");
var edit_email_template_component_1 = require("./components/dashboard/setting/edit-email-template.component");
var update_organization_component_1 = require("./components/dashboard/setting/update-organization.component");
var manage_patient_component_1 = require("./components/dashboard/patient/manage-patient.component");
var patient_navigation_component_1 = require("./components/dashboard/patient/patient-navigation.component");
var patient_dashboard_component_1 = require("./components/dashboard/patient/patient-dashboard.component");
var add_patient_component_1 = require("./components/dashboard/patient/add-patient.component");
var patient_reports_component_1 = require("./components/dashboard/patient/patient-reports.component");
var patient_component_1 = require("./components/dashboard/patient/patient.component");
var patient_invoice_component_1 = require("./components/dashboard/patient/patient-invoice.component");
var patient_history_component_1 = require("./components/dashboard/patient/patient-history.component");
var patient_demographic_component_1 = require("./components/dashboard/patient/patient-demographic.component");
var patient_appointment_component_1 = require("./components/dashboard/patient/patient-appointment.component");
var patient_document_component_1 = require("./components/dashboard/patient/patient-document.component");
var patient_problem_list_component_1 = require("./components/dashboard/patient/patient-problem-list.component");
var patient_medication_list_component_1 = require("./components/dashboard/patient/patient-medication-list.component");
var patient_allergy_list_component_1 = require("./components/dashboard/patient/patient-allergy-list.component");
var patient_lab_orders_component_1 = require("./components/dashboard/patient/patient-lab-orders.component");
var patient_communication_component_1 = require("./components/dashboard/patient/patient-communication.component");
var patient_family_history_component_1 = require("./components/dashboard/patient/patient-family-history.component");
var edit_patient_component_1 = require("./components/dashboard/patient/edit-patient.component");
var appointment_component_1 = require("./components/dashboard/appointment/appointment.component");
var appointment_dashboard_component_1 = require("./components/dashboard/appointment/appointment-dashboard.component");
var manage_appointment_component_1 = require("./components/dashboard/appointment/manage-appointment.component");
var add_appointment_component_1 = require("./components/dashboard/appointment/add-appointment.component");
var appointment_reports_component_1 = require("./components/dashboard/appointment/appointment-reports.component");
var appointment_navigation_component_1 = require("./components/dashboard/appointment/appointment-navigation.component");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var angular_calendar_1 = require("angular-calendar");
var module_1 = require("../demo-utils/module");
var edit_appointment_component_1 = require("./components/dashboard/appointment/edit-appointment.component");
var patient_add_lab_orders_component_1 = require("./components/dashboard/patient/patient-add-lab-orders.component");
var DataService_1 = require("./services/DataService");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var fileupload_1 = require("primeng/fileupload");
var primeng_1 = require("primeng/primeng");
var togglebutton_1 = require("primeng/togglebutton");
var admin_profile_component_1 = require("./components/dashboard/setting/admin-profile.component");
var prime_schedular_component_1 = require("./components/dashboard/primeschedular/prime-schedular.component");
var inputswitch_1 = require("primeng/inputswitch");
var angular2_datetimepicker_1 = require("angular2-datetimepicker");
var dropdown_1 = require("primeng/dropdown");
var multiselect_1 = require("primeng/multiselect");
var email_configuration_component_1 = require("./components/dashboard/setting/email-configuration.component");
var sms_template_component_1 = require("./components/dashboard/setting/sms-template.component");
var add_edit_sms_template_component_1 = require("./components/dashboard/setting/add-edit-sms-template.component");
var prefix_template_component_1 = require("./components/dashboard/setting/prefix-template.component");
var chart_of_account_component_1 = require("./components/dashboard/setting/chart-of-account.component");
var vital_setup_component_1 = require("./components/dashboard/setting/vital-setup.component");
var account_setup_component_1 = require("./components/dashboard/setting/account-setup.component");
var lab_test_component_1 = require("./components/dashboard/setting/lab-test.component");
var patient_group_component_1 = require("./components/dashboard/patient/patient-group.component");
var drug_component_1 = require("./components/dashboard/setting/drug.component");
var currency_component_1 = require("./components/dashboard/setting/currency.component");
var autocomplete_1 = require("primeng/autocomplete");
var shared_1 = require("primeng/shared");
var table_1 = require("primeng/table");
var slider_1 = require("primeng/slider");
var ngx_loading_1 = require("ngx-loading");
var chips_1 = require("primeng/chips");
var PaymentType_component_1 = require("./components/dashboard/setting/PaymentType.component");
var statuses_component_1 = require("./components/dashboard/setting/statuses.component");
var editor_1 = require("primeng/editor");
var chart_1 = require("primeng/chart");
var invoice_listing_component_1 = require("./components/dashboard/patient/invoice-listing.component");
var receipt_listing_component_1 = require("./components/dashboard/patient/receipt-listing.component");
var refund_listing_component_1 = require("./components/dashboard/patient/refund-listing.component");
var patient_invoice_list_component_1 = require("./components/dashboard/patient/patient-invoice-list.component");
var PatientImageComponent_1 = require("./components/dashboard/setting/PatientImageComponent");
/*import {PatientImageOrderComponent} from "./components/dashboard/patient/PatientImageOrderComponent";*/
var PatientImageOrderComponent_1 = require("./components/dashboard/patient/PatientImageOrderComponent");
var patient_history_vital_component_1 = require("./components/dashboard/patient/patient-history-vital.component");
var panel_1 = require("primeng/panel");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule.prototype.ngOnInit = function () {
    };
    AppModule = __decorate([
        core_1.NgModule({
            providers: [
                // Services
                requests_service_1.RequestsService,
                notification_service_1.NotificationService,
                his_util_service_1.HISUtilService,
                app_config_1.AppConfig,
                permissions_service_1.PermissionsService, DataService_1.DataService,
                { provide: ng2_toastr_1.ToastOptions, useClass: CustomOption_1.CustomOption },
                user_shared_service_1.UserSharedService, ConformationDialogService_1.ConformationDialogService
            ], entryComponents: [confirmationdialog_component_1.ConfirmationdialogComponent],
            imports: [
                // Modules
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                app_routes_1.routes,
                animations_1.BrowserAnimationsModule,
                material_1.MatButtonModule,
                http_1.HttpClientModule,
                material_1.MatSnackBarModule,
                amazing_time_picker_1.AmazingTimePickerModule,
                material_1.MatIconModule,
                material_1.MatDialogModule,
                amazing_time_picker_1.AmazingTimePickerModule,
                material_1.MatFormFieldModule,
                datepicker_1.MatDatepickerModule,
                material_1.MatNativeDateModule,
                material_1.MatInputModule,
                material_1.MatIconModule,
                material_1.MatButtonToggleModule,
                ngx_color_picker_1.ColorPickerModule,
                ng_bootstrap_1.NgbModalModule.forRoot(),
                angular_calendar_1.CalendarModule.forRoot(),
                ngx_loading_1.NgxLoadingModule.forRoot({
                    animationType: ngx_loading_1.ngxLoadingAnimationTypes.wanderingCubes,
                    backdropBackgroundColour: 'rgba(0,0,0,0.1)',
                    backdropBorderRadius: '4px',
                    primaryColour: '#ff0000',
                    secondaryColour: '#008000',
                    tertiaryColour: '#008000'
                }),
                module_1.DemoUtilsModule,
                [ngx_bootstrap_1.ModalModule.forRoot()],
                dropdown_1.DropdownModule,
                multiselect_1.MultiSelectModule,
                togglebutton_1.ToggleButtonModule,
                primeng_1.CheckboxModule,
                primeng_1.ScheduleModule,
                material_1.MatCheckboxModule,
                material_1.MatRadioModule,
                inputswitch_1.InputSwitchModule,
                angular2_datetimepicker_1.AngularDateTimePickerModule,
                multiselect_1.MultiSelectModule,
                autocomplete_1.AutoCompleteModule,
                primeng_1.DataTableModule,
                primeng_1.PaginatorModule, panel_1.PanelModule,
                primeng_1.PanelMenuModule, primeng_1.MegaMenuModule, chips_1.ChipsModule, slider_1.SliderModule, table_1.TableModule,
                shared_1.SharedModule,
                editor_1.EditorModule,
                primeng_1.OverlayPanelModule,
                primeng_1.PasswordModule,
                editor_1.EditorModule,
                ng2_ckeditor_1.CKEditorModule,
                chart_1.ChartModule,
                fileupload_1.FileUploadModule,
            ],
            declarations: [
                // App Components
                app_component_1.AppComponent,
                main_component_1.MainComponent,
                login_component_1.LoginComponent,
                department_component_1.DepartmentComponent,
                dashboard_component_1.DashboardComponent,
                doctor_dashboard_component_1.DoctorDashboardComponent,
                nurse_dashboard_component_1.NurseDashboardComponent,
                receptionist_dashboard_component_1.ReceptionistDashboardComponent,
                // Dashboard Components
                header_component_1.HeaderComponent,
                navigation_component_1.NavigationComponent,
                footer_component_1.FooterComponent,
                content_component_1.ContentComponent,
                not_found_404_component_1.NotFound404Component,
                manage_patient_component_1.ManagePatientComponent,
                patient_dashboard_component_1.PatientDashboardComponent,
                add_patient_component_1.AddPatientComponent,
                patient_reports_component_1.PatientReportsComponent,
                patient_component_1.PatientComponent,
                edit_patient_component_1.EditPatientComponent,
                patient_invoice_component_1.PatientInvoiceComponent,
                patient_history_component_1.PatientHistoryComponent,
                patient_demographic_component_1.PatientDemographicComponent,
                patient_appointment_component_1.PatientAppointmentComponent,
                patient_history_menu_component_1.PatientHistoryMenuComponent,
                patient_document_component_1.PatientDocumentsComponent,
                patient_problem_list_component_1.PatientProblemListComponent,
                patient_medication_list_component_1.PatientMedicationListComponent,
                patient_allergy_list_component_1.PatientAllergyListComponent,
                patient_lab_orders_component_1.PatientLabOrdersComponent,
                patient_communication_component_1.PatientCommunicationComponent,
                patient_family_history_component_1.PatientFamilyHistoryComponent,
                patient_add_lab_orders_component_1.PatientAddLabOrdersComponent,
                appointment_component_1.AppointmentComponent,
                appointment_dashboard_component_1.AppointmentDashboardComponent,
                manage_appointment_component_1.ManageAppointmentComponent,
                add_appointment_component_1.AddAppointmentComponent,
                appointment_reports_component_1.AppointmentReportsComponent,
                appointment_navigation_component_1.AppointmentNavigationComponent,
                //Setting Components
                setting_component_1.SettingComponent,
                setting_navigation_component_1.SettingNavigationComponent,
                patient_navigation_component_1.PatientNavigationComponent,
                staff_component_1.StaffComponent,
                code_component_1.CodeComponent,
                version_component_1.VersionComponent,
                code_version_component_1.CodeVersionComponent,
                department_component_1.DepartmentComponent,
                cashier_component_1.CashierComponent,
                payment_component_1.PaymentComponent,
                medical_service_component_1.MedicalServiceComponent,
                add_medical_service_component_1.AddMedicalServiceComponent,
                edit_medical_service_component_1.EditMedicalServiceComponent,
                nurse_component_1.NurseComponent,
                receptionist_component_1.ReceptionistComponent,
                branch_component_1.BranchComponent,
                updatecashier_component_1.UpdateCashierComponent,
                role_permissions_component_1.RolePermissionsComponent,
                user_permissions_component_1.UserPermissionsComponent,
                updatedoctor_component_1.UpdatedoctorComponent,
                updatenurse_component_1.UpdateNurseComponent,
                update_receptionist_component_1.UpdateReceptionistComponent,
                addbranch_component_1.AddBranchComponent,
                organization_component_1.OrganizationComponent,
                add_organization_component_1.AddOrganizationComponent,
                addstaff_component_1.AddStaffComponent,
                confirmationdialog_component_1.ConfirmationdialogComponent,
                update_branch_component_1.UpdateBranchComponent,
                addstaff_component_1.AddStaffComponent,
                tax_component_1.TaxComponent,
                email_template_component_1.EmailTemplateComponent,
                email_configuration_component_1.EmailConfigurationComponent,
                sms_template_component_1.SmsTemplateComponent,
                add_edit_sms_template_component_1.AddEditSmsTemplateComponent,
                prefix_template_component_1.PrefixTemplateComponent,
                chart_of_account_component_1.ChartOfAccountComponent,
                vital_setup_component_1.VitalSetupComponent,
                account_setup_component_1.AccountSetupComponent,
                lab_test_component_1.LabTestComponent,
                add_email_template_component_1.AddEmailTemplateComponent,
                edit_email_template_component_1.EditEmailTemplateComponent,
                not_found_404_setting_component_1.NotFound404SettingComponent,
                addstaff_component_1.AddStaffComponent,
                errordisplay_component_1.ErrordisplayComponent,
                confirmationdialog_component_1.ConfirmationdialogComponent,
                update_organization_component_1.UpdateOrganizationComponent,
                edit_appointment_component_1.EditAppointmentComponent,
                menu_component_1.MenuComponent,
                statuses_component_1.StatusesComponent,
                admin_profile_component_1.AdminProfileComponent,
                prime_schedular_component_1.PrimeSchedularComponent,
                patient_group_component_1.PatientGroupComponent,
                drug_component_1.DrugComponent,
                menu_component_1.MenuComponent,
                PaymentType_component_1.PaymentTypeComponent,
                drug_component_1.DrugComponent,
                currency_component_1.CurrencyComponent,
                invoice_listing_component_1.InvoiceListingComponent,
                receipt_listing_component_1.ReceiptListingComponent,
                refund_listing_component_1.RefundListingComponent,
                patient_invoice_list_component_1.PatientInvoiceListComponent,
                currency_component_1.CurrencyComponent,
                PatientImageComponent_1.PatientImageComponent,
                /*PatientImageOrderComponent,*/
                PatientImageComponent_1.PatientImageComponent,
                PatientImageOrderComponent_1.PatientImageOrderComponent,
                patient_history_vital_component_1.PatientHistoryVitalComponent
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map