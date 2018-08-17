import {Component, OnChanges} from '@angular/core';
import {Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {Title} from '@angular/platform-browser';
import {AppConstants} from '../../../utils/app.constants';
import {UserTypeEnum} from '../../../enums/user-type-enum';
import {Dashboard} from '../../../model/Dashboard';

@Component({
    selector: 'doctor-dashboard-component',
    templateUrl: '../../../templates/dashboard/doctor/doctor-dashboard.template.html',
    styleUrls: [],
})
export class DoctorDashboardComponent{

    title: string = 'Doctor Dashboard';
    filteredBranch: Number;
    filteredDocotr: Number;
    error: any;
    dashboardList : Dashboard[] = [];
    branches: any = [];
    doctorsList: any = [];
    dashboardListModified : any[] = [];


    constructor(private requestService: RequestsService,
                private router: Router,
                private titleService: Title) {
                this.showDashboard();

    };
    ngOnInit() {

        this.getBranchesFromServer();
        this.getDoctorsFromServer();

    }

    showDashboard() {
        this.requestService.getRequest(AppConstants.FETCH_DASHBOARD_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DASHBOARD_SUC_01') {
                        this.dashboardList = response['responseData'];
                        this.dashboardListModified = this.dashboardList;
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })
    }

    getBranchesFromServer() {
        this.requestService.getRequest(
            AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branches = response['responseData'];
                    }
                },
                (error: any) => {

                }
            );
    }

    getDoctorsFromServer() {
        this.requestService.getRequest(
            AppConstants.USER_BY_ROLE + '?name=' + UserTypeEnum.DOCTOR)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'USER_SUC_01') {
                        this.doctorsList = response['responseData'];
                    }
                },
                (error: any) => {

                }
            );
    }
    getFilteredBranch(value: any) {

       this.dashboardListModified =this.dashboardList;
        if(value == 'All'){
            this.dashboardListModified = this.dashboardList;
        }else {
            const arr = this.dashboardListModified.filter(x => x.branch === value);
            this.dashboardListModified = arr;
        }
    }
    getfilteredDoctor(value: any) {
        this.dashboardListModified =this.dashboardList;
        console.log('val:'+ value);
        if(value == 'All'){
            this.dashboardListModified = this.dashboardList;
        }else {
            const arr = this.dashboardListModified.filter(x => x.doctorLastName == value);
            this.dashboardListModified = arr;
        }
    }

    getfilteredStatus(value: any) {
        this.dashboardListModified =this.dashboardList;
        console.log('val:'+ value);
        if(value == 'All'){
            this.dashboardListModified = this.dashboardList;
        }else {
            const arr = this.dashboardListModified.filter(x => x.status == value);
            this.dashboardListModified = arr;
        }
    }


}
