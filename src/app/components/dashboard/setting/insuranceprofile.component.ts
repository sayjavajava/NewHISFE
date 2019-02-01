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
    templateUrl: '../../../templates/dashboard/setting/insuranceProfile.template.html',
})
export class InsurranceprofileComponent implements OnInit {
    public iCDVersionModel: ICDVersionModel = new ICDVersionModel();
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: any[]=[];
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
        document.title = 'HIS | Manage Profile';
        if (localStorage.getItem(btoa('access_token'))) {
            this.cols = [
                {field: 'Sr', header: 'id'},
                {field: 'name', header: 'Name'},
                {field: 'description', header: 'Description'},
                {field: 'status', header: 'Status'},
                {field: 'Action', header: 'Action'}
            ];

            this.getAllProfilesFromServer();
        }

    }

    refreshVersionsTable() {
        this.searchVersion = '';
        this.searched = false;
        this.getAllProfilesFromServer();
    }


    getAllProfilesFromServer() {
        this.loading = true;

        this.requestsService.getRequest(
            AppConstants.INS_PROFILE_DATA_TABLE)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_SUC_16') {
                        this.data = response['responseData'];
                        console.log(this.data);
                    }
                    this.loading = false;
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                    this.loading = false;
                }
            );
    }

    editProfile(iCDVersion: any) {
        this.isVersionUpdate = true;
        this.iCDVersionModel = iCDVersion;
    }

    updateProfile(versionForm: NgForm) {
        if (versionForm.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(
                    AppConstants.INS_PROFILE_UPDATE_URL,
                    JSON.parse(JSON.stringify(this.iCDVersionModel))
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PROFILE_UPDATE_SUC_07') {
                            this.iCDVersionModel = new ICDVersionModel();
                            this.notificationService.success(response['responseMessage'], '');
                            document.getElementById('close-btn-profile').click();
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
            this.notificationService.error('Required Fields are missing', '');
        }
    }

    onAddPopupLoad() {
        this.isVersionUpdate = false;
        this.iCDVersionModel = new ICDVersionModel();
    }

    saveProfile(form: NgForm) {
        if (form.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(
                    AppConstants.INS_PROFILE_SAVE,
                    JSON.parse(JSON.stringify(this.iCDVersionModel))
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'INS_SAVE_SUC_01') {
                            this.iCDVersionModel = new ICDVersionModel();
                            this.notificationService.success('Insurance company Profile Saved Succesfully');
                            document.getElementById('close-btn-profile').click();
                            this.getAllProfilesFromServer();
                        } else {
                            this.notificationService.error('Insurance company Profile Not Saved Succesfully')
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
                this.notificationService.warn('Please enter value.');
                document.getElementById('nameNameId').focus();
                return;
            }
            this.notificationService.error('Required Fields are missing', '');
        }
    }

    deleteProfile(iCDVersionId: any) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.INS_PROFILE_DELETE_URL + iCDVersionId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PROFILE_SUC_03') {
                            this.notificationService.success(response['responseMessage'], '');
                            this.getAllProfilesFromServer();
                        } else {
                            this.getAllProfilesFromServer();
                            this.notificationService.error(response['responseMessage'], 'Insurance Profile');
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
        this.getAllProfilesFromServer();
    }

}
