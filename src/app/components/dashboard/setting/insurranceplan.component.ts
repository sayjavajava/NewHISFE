import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {Router} from '@angular/router';
import {ICDVersionModel} from '../../../model/ICDVersionModel';
import {NgForm} from '@angular/forms';
import {AppConstants} from '../../../utils/app.constants';

@Component({
    selector: 'icd-version-component',
    templateUrl: '../../../templates/dashboard/setting/inssuranceplan.template.html',
})
export class InsurranceplanComponent implements OnInit {
    public iCDVersionModel: ICDVersionModel = new ICDVersionModel();
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: any;
    searchVersion: string = '';
    private searched: boolean;
    private isVersionUpdate: boolean;
    cols: any;
    public loading: boolean = false;


    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Manage Insurance Plan';
        if (localStorage.getItem(btoa('access_token'))) {
            this.cols = [
                {field: 'name', header: 'Name'},
                {field: 'description', header: 'Description'},
                {field: 'status', header: 'Sstatus'},
                {field: 'Action', header: 'Action'}
            ];

            this.getAllPlanFromServer();
        }

    }

    refreshPlanTable() {
        this.searchVersion = '';
        this.searched = false;
        this.getAllPlanFromServer();
    }


    getAllPlanFromServer() {
        this.loading = true;

        this.requestsService.getRequest(
            AppConstants.INS_PLAN_DATA_TABLE)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_VERSIONS_FOUND_03') {
                        this.data = response['responseData'];
                    }
                    this.loading = false;
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                    this.loading = false;
                }
            );
    }

    editPlan(iCDVersion: any) {
        this.isVersionUpdate = true;
        this.iCDVersionModel = iCDVersion;
    }

    updatePlan(versionForm: NgForm) {
        if (versionForm.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(
                    AppConstants.INS_PLAN_UPDATE_URL,
                    JSON.parse(JSON.stringify(this.iCDVersionModel))
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PLAN_UPDATE_SUC_07') {
                            this.iCDVersionModel = new ICDVersionModel();
                            this.notificationService.success(response['responseMessage'], '');
                            document.getElementById('close-btn-Plan').click();
                            this.refreshTable(0);
                        } else {
                            this.notificationService.error(response['responseMessage'], '')
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
            } else {
                this.router.navigate(['/login']);
            }
        } else {
            this.notificationService.error('Required Fields are missing', 'ICD Version');
        }
    }

    onAddPlanPopupLoad() {
        this.isVersionUpdate = false;
        this.iCDVersionModel = new ICDVersionModel();
    }

    savePlan(form: NgForm) {
        if (form.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(
                    AppConstants.INS_PLAN_SAVE_URL,
                    JSON.parse(JSON.stringify(this.iCDVersionModel))
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PLAN_SAVE_SUC_01') {
                            this.iCDVersionModel = new ICDVersionModel();
                            this.notificationService.success('Insurance Plan Saved Succesfully');
                            document.getElementById('close-btn-Plan').click();
                            this.refreshTable(0);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Insurance Plan')
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
            } else {
                this.router.navigate(['/login']);
            }
        } else {
            if (this.iCDVersionModel.name === '') {
                this.notificationService.warn('Please enter Name.');
                document.getElementById('nameNameId').focus();
                return;
            }
            this.notificationService.error('Required Fields are missing', 'Insurance Plan');
        }
    }

    deletePlan(iCDVersionId: any) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.PLAN_DELETE_URL + iCDVersionId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PLAN_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'Insurance Plan');
                            this.getAllPlanFromServer();
                        } else {

                            this.notificationService.error(response['responseMessage'], 'Insurance Plan');
                            this.getAllPlanFromServer();
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }

    refreshTable(page: number) {
        this.getAllPlanFromServer();
    }

}
