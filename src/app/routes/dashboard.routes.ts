import {Routes} from "@angular/router";
import {ContentComponent} from "../components/dashboard/content.component";
import {NotFound404Component} from "../components/errors/not-found-404.component";
import {DoctorDashboardComponent} from "../components/dashboard/doctor/doctor-dashboard.component";
import {SettingComponent} from "../components/dashboard/setting/setting.component";
import {SettingRoutes} from "./setting.routes";
import {PatientRoutes} from "./patient.routes";
import {PatientComponent} from "../components/dashboard/patient/patient.component";
import {AppointmentComponent} from "../components/dashboard/appointment/appointment.component";
import {AppointmentRoutes} from "./appointments.routes";
import {NurseDashboardComponent} from "../components/dashboard/nurse/nurse-dashboard.component";
import {ReceptionistDashboardComponent} from "../components/dashboard/receptionist/receptionist-dashboard.component";

import { CashierComponent } from "../components/dashboard/cashier/cashier.component";
import { PaymentComponent } from "../components/dashboard/cashier/payment.component";
import {PrimeSchedularComponent} from "../components/dashboard/primeschedular/prime-schedular.component";
import {PatientInvoiceComponent} from "../components/dashboard/patient/patient-invoice.component";
import {InvoiceListingComponent} from "../components/dashboard/patient/invoice-listing.component";
import {ReceiptListingComponent} from "../components/dashboard/patient/receipt-listing.component";
import {RefundListingComponent} from "../components/dashboard/patient/refund-listing.component";


export const DashboardRoutes: Routes = [      
    // Dashboard Pages
    {path: '', component: ContentComponent},
    {path: 'admin', component: ContentComponent},
    {path: 'doctor', component: DoctorDashboardComponent},
    {path: 'cashier', component: CashierComponent },
    {path: 'payment/:id', component: PaymentComponent },
    {path: 'invoice', component: PatientInvoiceComponent },
    {path: 'invoice-listing', component: InvoiceListingComponent },
    {path: 'receipt-listing', component: ReceiptListingComponent },
    {path: 'refund', component: RefundListingComponent },

    {path: 'nurse', component: NurseDashboardComponent},
    {path: 'receptionist', component: ReceptionistDashboardComponent},
    {path: 'setting', component: SettingComponent, children: SettingRoutes},
    {path: 'patient', component: PatientComponent, children: PatientRoutes},
    {path: 'appointment', component: AppointmentComponent, children: AppointmentRoutes},
    {path: 'customer/404-not-found', component: NotFound404Component},
    {path: '404-not-found', component: NotFound404Component},
    {path: '**', redirectTo: '404'}
];
