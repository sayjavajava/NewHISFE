import {Component, OnInit} from '@angular/core';
import {HISUtilService} from '../../../services/his-util.service';
import {Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {UserSharedService} from '../../../services/user.shared.service';
import {AppConstants} from '../../../utils/app.constants';
import {NotificationService} from '../../../services/notification.service';
import {NgForm} from '@angular/forms';
import {ClinicalDepartment} from '../../../models/clinical-department';
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
    selectedDepartment: ClinicalDepartment = new ClinicalDepartment();

    constructor(private requestsService: RequestsService,
                private router: Router,
                private userSharedService: UserSharedService,
                private HISUtilService: HISUtilService,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.getPageWiseDepartmentFromServer(0);
        } else {
            this.router.navigate(['/login']);
        }
    }

    getPageWiseDepartmentFromServer(page: number) {
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
            this.requestsService.deleteRequest(
                AppConstants.DELETE_CLINICAL_DEPARTMENTS_URI + dptId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'CLI_DPT_SUC_02') {
                            this.getPageWiseDepartmentFromServer(this.currPage);
                            this.notificationService.success(response['responseMessage'], 'Clinical Department')
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Clinical Department')
                        }
                    },
                    (error: any) => {
                        //console.log(error.json())
                        this.notificationService.error(error.error, 'Clinical Department')
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }


    searchClinicalDepartment() {
        this.requestsService.getRequest(
            AppConstants.SEARCH_CLINICAL_DEPARTMENT_URL + '0?name=' + this.searchDepart)
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

    saveClinicalDepartment(form: NgForm) {
        _.each(form.form.controls, function (control) {
            control['_touched'] = true
        });

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
                            this.notificationService.success(response['responseMessage'], '');
                            this.getPageWiseDepartmentFromServer(0);
                            this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                        } else {
                            this.notificationService.error(response['responseMessage'], '');
                        }
                    },
                    (error: any) => {
                        //console.log(error.json())
                        this.HISUtilService.tokenExpired(error.error.error);

                    }
                );
        }
    }

    onUpdatePopupLoad(department: ClinicalDepartment) {
        this.selectedDepartment = department;
    }

    onAddPopupLoad() {
        this.selectedDepartment = new ClinicalDepartment();
    }
}