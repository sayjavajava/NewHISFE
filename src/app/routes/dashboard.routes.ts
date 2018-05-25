import {Routes} from '@angular/router';
import {ContentComponent} from '../components/dashboard/content.component';
import {NotFound404Component} from '../components/errors/not-found-404.component';
import {DoctorDashboardComponent} from '../components/dashboard/doctor/doctor-dashboard.component';
import {SettingComponent} from '../components/dashboard/setting/setting.component';
import {SettingRoutes} from './setting.routes';


export const DashboardRoutes: Routes = [
    // Dashboard Pages
    {path: '', component: ContentComponent},
    {path: 'doctor', component: DoctorDashboardComponent},
    {path: 'setting', component: SettingComponent, children: SettingRoutes},
    {path: 'customer/404-not-found', component: NotFound404Component},
    {path: '404-not-found', component: NotFound404Component},
    {path: '**', redirectTo: '404'}
];
