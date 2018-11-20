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
    templateUrl: '../../../templates/dashboard/setting/version.template.html',
})
export class VersionComponent implements OnInit {
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

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Manage ICD';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getAllVersionsFromServer();
        }

        this.cols = [
            {field: 'name', header: 'name'},
            {field: 'description', header: 'description'},
            {field: 'status', header: 'status'},
            {field: 'Action', header: 'Action'}
        ];
    }

    refreshVersionsTable() {
        this.searchVersion = '';
        this.searched = false;
        this.getAllVersionsFromServer();
    }


    getAllVersionsFromServer() {
        this.requestsService.getRequest(
            AppConstants.ICD_VERSIONS_DATA_TABLE)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_VERSIONS_FOUND_03') {
                        this.data = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    editICDVersion(iCDVersion: any) {
        this.isVersionUpdate = true;
        this.iCDVersionModel = iCDVersion;
    }

    updateICDVersion(versionForm: NgForm) {
        if (versionForm.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(
                    AppConstants.ICD_VERSION_UPDATE_URL,
                    JSON.parse(JSON.stringify(this.iCDVersionModel))
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_VERSION_UPDATE_SUC_07') {
                            this.iCDVersionModel = new ICDVersionModel();
                            this.notificationService.success(response['responseMessage'], 'ICD Version');
                            document.getElementById('close-btn-ICDVersion').click();
                        } else {
                            this.notificationService.error(response['responseMessage'], 'ICD Version')
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

    onAddICDVersionPopupLoad() {
        this.isVersionUpdate = false;
        this.iCDVersionModel = new ICDVersionModel();
    }

    saveICDVersion(form: NgForm) {
        if (form.valid) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.postRequest(
                    AppConstants.ICD_VERSION_SAVE_URL,
                    JSON.parse(JSON.stringify(this.iCDVersionModel))
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_VERSION_SUC_08') {
                            this.iCDVersionModel = new ICDVersionModel();
                            this.notificationService.success('ICD Version', response['responseMessage']);
                            document.getElementById('close-btn-ICDVersion').click();
                            this.refreshICDsVersionTable(0);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'ICD Version')
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
                this.notificationService.warn('Please enter Version value.');
                document.getElementById('nameNameId').focus();
                return;
            }
            this.notificationService.error('Required Fields are missing', 'ICD Version');
        }
    }

    deleteICDVersion(iCDVersionId: any) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.ICD_VERSION_DELETE_URL + iCDVersionId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_VERSION_DEL_SUC_11') {
                            this.notificationService.success(response['responseMessage'], 'ICD Version');
                            this.getAllVersionsFromServer();
                        } else {
                            this.getAllVersionsFromServer();
                            this.notificationService.error(response['responseMessage'], 'ICD Version');
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

    refreshICDsVersionTable(page: number) {
        this.getAllVersionsFromServer();
    }

}
