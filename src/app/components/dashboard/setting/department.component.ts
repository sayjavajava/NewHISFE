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
import {Family} from "../../../model/Family";
import {OverlayPanel} from "primeng/primeng";

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
    error: any;
    selectedBranches: any = [];
    selectedDepartment: Department = new Department();
    cols: any;
    branchesInDepartment: any = [];
    branchesListResponse: any = [];
    selectedFamily = new Family();

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
            {field: 'name', header: 'Name'},
            {field: 'description', header: 'Description'},
            {field: 'listOfBranches', header: 'Branch'},
            {field: 'action', header: 'Action'},
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
                },
                (error: any) => {
                    this.error = error.error.error;
                })
    }

    getPageWiseDepartmentFromServer(page: number) {
        this.searchDepart = '';
        /*if (page > 0) {
            page = page;
        }*/
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                        /*                        this.nextPage = response['responseData']['nextPage'];
                                                this.prePage = response['responseData']['prePage'];
                                                this.currPage = response['responseData']['currPage'];
                                                this.pages = response['responseData']['pages'];*/
                        this.data = response['responseData'];
                        // this.branchesListResponse = this.data.listOfBranches;


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

    getBranchesWithDepartment(id?: number, overlaypanel?: OverlayPanel,event?:any) {
        this.branchesInDepartment =[];
        this.branchesListResponse = this.data.filter((x:any)=>x.id == id);
        this.branchesListResponse.forEach((x:any)=>{
        if(x.listOfBranches != null){
            this.branchesInDepartment = x.listOfBranches;

        };

      });
       overlaypanel.toggle(event);
    }

    saveClinicalDepartment(form: NgForm) {
        if (form.valid) {
           this.selectedDepartment.selectedBranches =[...this.selectedBranches];
            this.requestsService.postRequest(
            AppConstants.SAVE_CLINICAL_DEPARTMENT_URL,
            this.selectedDepartment)
                //    , this.selectedDepartment
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
            this.selectedDepartment.selectedBranches =[...this.selectedBranches];
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

    onUpdatePopupLoad(department: Department,id:number) {
        this.selectedDepartment = department;
         let brList = this.data.filter((x:any)=>x.id == id);
        this.selectedBranches =[];
         brList.forEach((x:any)=> {
            if (x.listOfBranches != null)
                x.listOfBranches.forEach((x:any)=>{
                   this.selectedBranches.push(x.id)
            });

         });

    }

    onAddPopupLoad() {
        this.selectedDepartment = new Department();

    }
}