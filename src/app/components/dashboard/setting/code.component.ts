import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {ICDCodeModel} from '../../../model/ICDCodeModel';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {AppConstants} from '../../../utils/app.constants';
import {ICDVersionModel} from '../../../model/ICDVersionModel';
import any = jasmine.any;

@Component({
    selector: 'icd-code-component',
    templateUrl: '../../../templates/dashboard/setting/code.template.html',
})
export class CodeComponent implements OnInit {
    iCDModel: ICDCodeModel = new ICDCodeModel();
    iCDData: any;
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: any;
    searchCode: string = '';
    searched: boolean = false;
    isCodeUpdate: boolean = false;
    icdVersions: any = [];
    checkedVersions: ICDVersionModel [] = [];
    selectAll: boolean = false;
    clientCheckedVersions: ICDVersionModel [] = [];
    cols: any = [
        {field: 'code', header: 'code'},
        {field: 'problem', header: 'problem'},
        {field: 'version', header: 'version'},
        {field: 'description', header: 'description'},
        {field: 'status', header: 'status'},
        {field: 'Action', header: 'Action'},
    ];

    loading:boolean = false;
    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {

    }

    ngOnInit() {
        document.title = 'HIS | ICD Code';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getAllCodesFromServer();
        }
    }

    refreshCodesTable() {
        this.searched = false;
        this.searchCode = '';
        this.getAllCodesFromServer();
    }

    refreshICDsTable(page: number) {
        this.getAllCodesFromServer();
    }

    deleteICD(codeId: any) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.ICD_CODE_DELETE_URL + codeId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_SUC_03') {
                            this.notificationService.success('ICD Code', response['responseMessage']);
                            this.getAllCodesFromServer();
                        } else {
                            this.getAllCodesFromServer();
                            this.notificationService.error(response['responseMessage'], 'ICD Code');
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

    getAllCodesFromServer() {
        this.loading = true;
        this.requestsService.getRequest(
            AppConstants.ICD_CODES_DATA_TABLE)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_SUC_16') {
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

    saveICDCode(form: NgForm) {
        if (form.valid) {
            // if (localStorage.getItem(btoa('access_token'))) {
            let versionFound = 0;
            for (let version of this.clientCheckedVersions) {
                if (version) {
                    versionFound++;
                    break;
                }
            }

            if (versionFound == 0) {
                this.notificationService.warn('Please select at least one version.');
                return;
            }


            for (let checkedVer of this.clientCheckedVersions) {
                for (let chckedVsn of this.icdVersions) {
                    if (checkedVer == chckedVsn.id) {
                        chckedVsn.selectedVersion = true;
                        break;
                    }
                }
            }

            this.iCDModel.selectedVersions = this.icdVersions;
            this.requestsService.postRequest(
                AppConstants.ICD_CODE_SAVE_URL,
                JSON.parse(JSON.stringify(this.iCDModel))
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_SAVE_SUC_01') {
                        this.iCDModel = new ICDCodeModel();
                        this.iCDData = response['responseData'];
                        this.notificationService.success('ICD Code', response['responseMessage']);
                        document.getElementById('close-btn').click();
                        this.refreshICDsTable(0);
                    } else {
                        this.iCDData = response['responseData'];
                        this.notificationService.error('ICD Code', response['responseMessage'])
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
        }
        else {

            this.notificationService.error('ICD Code', 'Required Fields are missing');
        }
    }

    updateICDCode(updateCodeForm: NgForm) {
        if (updateCodeForm.valid) {
            if (localStorage.getItem(btoa('access_token'))) {


                let versionFound = 0;
                for (let version of this.clientCheckedVersions) {
                    if (version) {
                        versionFound++;
                        break;
                    }
                }

                if (versionFound == 0) {
                    this.notificationService.warn('Please select at least one version.');
                    return;
                }


                for (let checkedVer of this.clientCheckedVersions) {
                    for (let chckedVsn of this.icdVersions) {
                        if (checkedVer == chckedVsn.id) {
                            chckedVsn.selectedVersion = true;
                            break;
                        }
                    }
                }


                this.iCDModel.selectedVersions = this.icdVersions;
                this.requestsService.putRequest(
                    AppConstants.ICD_CODE_UPDATE_URL,
                    JSON.parse(JSON.stringify(this.iCDModel))
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_CODE_UPDATE_SUC_07') {
                            this.iCDModel = new ICDCodeModel();
                            this.iCDData = response['responseData'];
                            this.notificationService.success('ICD Code', response['responseMessage']);
                            document.getElementById('close-btn').click();
                            this.refreshICDsTable(0);
                        } else {
                            this.iCDData = response['responseData'];
                            this.notificationService.error('ICD Code', response['responseMessage'])
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
            if (this.iCDModel.code === '') {
                this.notificationService.warn('Please enter Code value.');
                document.getElementById('codeId').focus();
                return;
            }
            this.notificationService.error('ICD Code', 'Required Fields are missing');
        }
    }

    editICDCode(iCDCode: any) {
        this.isCodeUpdate = true;
        this.selectAll = false;

        this.requestsService.getRequest(AppConstants.ICD_CODE_GET + iCDCode.id)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_SUC_02') {

                        this.iCDModel = response['responseData'];
                        this.icdVersions = [];
                        this.icdVersions = this.iCDModel.selectedVersions;
                        this.clientCheckedVersions = [];
                        for (let checked of this.icdVersions) {
                            if (checked.selectedVersion) {
                                this.clientCheckedVersions.push(checked.id);
                            }
                        }

                    } else {
                        this.notificationService.error('ICD Code', response['responseMessage']);
                    }
                },
                (error: any) => {
                    this.notificationService.warn(error.error.error);
                }
            );

    }

    onAddICDCodePopupLoad() {
        this.clientCheckedVersions = [];
        this.isCodeUpdate = false;
        this.iCDModel = new ICDCodeModel();
        this.selectAll = false;
        this.getICDVersionsFromServer();
    }

    private getICDVersionsFromServer() {

        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(
                AppConstants.ICD_VERSIONS)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_VERSIONS_FOUND_03') {
                            this.icdVersions = [];
                            this.icdVersions = response['responseData'];
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

    getCheckedVersionsByCodeId(id: number) {
        if (id > 0) {
            this.requestsService.getRequest(
                AppConstants.ICD_VERSIONS_BY_CODE_URL + id)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_VERSIONS_SUC_14') {
                            this.checkedVersions = response['responseData'];
                        } else {
                            this.checkedVersions = [];
                        }
                    },
                    (error: any) => {
                        this.notificationService.error(error.error.error);
                    }
                );
        }
    }

    changeSelectedChecked() {
        for (let selectedVersion of this.icdVersions) {
            selectedVersion.selectedVersion = false;
        }
        for (let checked of this.clientCheckedVersions) {
            for (let selectedVersion of this.icdVersions) {
                if (checked == selectedVersion.id) {
                    selectedVersion.selectedVersion = true;
                }
            }

        }
    }


}
