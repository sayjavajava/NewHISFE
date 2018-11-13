import {Component, OnInit} from '@angular/core';
import {HISUtilService} from '../../../services/his-util.service';
import {Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {UserSharedService} from '../../../services/user.shared.service';
import {AppConstants} from '../../../utils/app.constants';
import {NotificationService} from '../../../services/notification.service';
import {NgForm} from '@angular/forms';
import {Department} from '../../../model/department';
import * as _ from 'lodash'

@Component({
    selector: 'department-component',
    templateUrl: '../../../templates/dashboard/setting/department.template.html',
})
export class DepartmentComponent implements OnInit {

    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: any;
    searchDepart: string;
    searched: boolean = false;
    branchesList: any = [];
    error:any;
    selectedDepartment: Department = new Department();
    cols:any;


    brands:any;
    colors:any;
    cars:any;
    constructor(private requestsService: RequestsService,
                private router: Router,
                private userSharedService: UserSharedService,
                private HISUtilService: HISUtilService,
                private notificationService: NotificationService) {
        this.allBranches();
    }

    ngOnInit() {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.getPageWiseDepartmentFromServer(0);
        } else {
            this.router.navigate(['/login']);
        };
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'status', header: 'Status' },
            { field: 'Action', header: 'Action' },

        ];


/*this.cars =[
    {"brand": "VW", "year": 2012, "color": "Orange", "vin": "dsad231ff"},
    {"brand": "Audi", "year": 2011, "color": "Black", "vin": "gwregre345"},
    {"brand": "Renault", "year": 2005, "color": "Gray", "vin": "h354htr"},
    {"brand": "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh"},
    {"brand": "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34"},
    {"brand": "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj"},
    {"brand": "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr"},
    {"brand": "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34"},
    {"brand": "Ford", "year": 2000, "color": "Black", "vin": "h54hw5"},
    {"brand": "Fiat", "year": 2013, "color": "Red", "vin": "245t2s"}
]*/


        //
        this.brands = [
            { label: 'All Brands', value: null },
            { label: 'Audi', value: 'Audi' },
            { label: 'BMW', value: 'BMW' },
            { label: 'Fiat', value: 'Fiat' },
            { label: 'Honda', value: 'Honda' },
            { label: 'Jaguar', value: 'Jaguar' },
            { label: 'Mercedes', value: 'Mercedes' },
            { label: 'Renault', value: 'Renault' },
            { label: 'VW', value: 'VW' },
            { label: 'Volvo', value: 'Volvo' }
        ];

        this.colors = [
            { label: 'White', value: 'White' },
            { label: 'Green', value: 'Green' },
            { label: 'Silver', value: 'Silver' },
            { label: 'Black', value: 'Black' },
            { label: 'Red', value: 'Red' },
            { label: 'Maroon', value: 'Maroon' },
            { label: 'Brown', value: 'Brown' },
            { label: 'Orange', value: 'Orange' },
            { label: 'Blue', value: 'Blue' }
        ];


    }

    getPageWiseDepartment(page: number) {
        this.data = [];
        if (this.searched) {
            this.searchClinicalDepartment(page);
        } else {
            this.getPageWiseDepartmentFromServer(page);
        }
    }

    refreshPage() {
        this.searched = false;
        this.searchDepart = '';
        this.getPageWiseDepartmentFromServer(0);
    }
    allBranches() {
        this.requestsService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchesList = response['responseData'];
                    }
                    // this.userForm.controls['primaryBranch'].setValue(this.branchesList[0].id)
                },
                (error: any) => {
                    this.error = error.error.error;
                })
    }

    getPageWiseDepartmentFromServer(page: number) {
        this.searchDepart = '';
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    //console.log(error.json())
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    deleteDepartment(dptId: number) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.DELETE_CLINICAL_DEPARTMENTS_URI + dptId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'CLI_DPT_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Clinical Department');
                            this.getPageWiseDepartmentFromServer(0);
                        } else {
                            this.getPageWiseDepartmentFromServer(0);
                            this.notificationService.error(response['responseMessage'], 'Clinical Department');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error(error.error, 'Clinical Department')
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }

    searchClinicalDepartment(page: any) {
        this.searched = true;
        this.requestsService.getRequest(
            AppConstants.SEARCH_CLINICAL_DEPARTMENT_URL + page + '?name=' + this.searchDepart)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                    } else {
                        this.nextPage = 0;
                        this.prePage = 0;
                        this.currPage = 0;
                        this.pages = [];
                        this.data = null;
                    }
                },
                (error: any) => {
                    //console.log(error.json())
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    saveClinicalDepartment(form: NgForm) {
        if (form.valid) {
            this.requestsService.postRequest(
                AppConstants.SAVE_CLINICAL_DEPARTMENT_URL,
                this.selectedDepartment)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'CLI_DPT_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Clinical Department');
                            this.getPageWiseDepartmentFromServer(0);
                            this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Clinical Department');
                        }
                    },
                    (error: any) => {
                        //console.log(error.json())
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.notificationService.error('Required fields missing', 'Clinical Department');
        }
    }

    updateClinicalDepartment(form: NgForm) {
        _.each(form.form.controls, function (control) {
            control['_touched'] = true
        });
        if (form.valid) {
            this.requestsService.putRequest(
                AppConstants.UPDATE_CLINICAL_DEPARTMENT_URL,
                this.selectedDepartment)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'CLI_DPT_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Clinical Department');
                            this.getPageWiseDepartmentFromServer(0);
                            this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Clinical Department');
                        }
                    },
                    (error: any) => {
                        //console.log(error.json())
                        this.HISUtilService.tokenExpired(error.error.error);

                    }
                );
        } else {
            this.notificationService.error('Required fields missing', 'Clinical Department');
        }
    }

    onUpdatePopupLoad(department: Department) {
        this.selectedDepartment = department;
    }

    onAddPopupLoad() {
        this.selectedDepartment = new Department();
    }
}