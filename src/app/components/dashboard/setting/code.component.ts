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
    public iCDModel: ICDCodeModel = new ICDCodeModel();
    private iCDData: any;
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
    //selectedVersion:ICDVersionModel[];
    selectedVersion :any =[
        {'label':'waqas','value':'waqas'},
        {'label':'kamran','value':'kamran'}
    ]
    selectedScope:any=[];

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | ICD Code';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getICDCodesFromServer(0);
        }
        this.getCheckedVersionsByCodeId(null);
    }

    getPageWiseICDs(page: number) {
        this.data = [];
        if (this.searched) {
            this.searchByCode(page);
        } else {
            this.getICDCodesFromServer(page);
        }
    }

    refreshCodesTable() {
        this.searched = false;
        this.searchCode = '';
        this.getICDCodesFromServer(0);
    }

    refreshICDsTable(page: number) {
        this.getICDCodesFromServer(page)
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
                            this.getICDCodesFromServer(0);
                        } else {
                            this.getICDCodesFromServer(0);
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

    getICDCodesFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.ICD_CODES + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_SUC_02') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    saveICDCode(form: NgForm) {
        if (form.valid) {
         /*   if (localStorage.getItem(btoa('access_token'))) {
                let versionFound = 0;
                for (let version of this.icdVersions) {
                    if (version.selectedVersion) {
                        versionFound++;
                        break;
                    }
                }

                if (versionFound == 0) {
                    this.notificationService.warn('Please select at least one version.');
                    return;
                }*/

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
            } /*else {
                this.router.navigate(['/login']);
            }
            }*/
         else {
            /*if (this.iCDModel.code === '') {
                this.notificationService.warn('Please enter Code value.');
                document.getElementById('codeId').focus();
                return;
            }*/
            this.notificationService.error('ICD Code', 'Required Fields are missing');
        }
    }

    updateICDCode(updateCodeForm: NgForm) {
        if (updateCodeForm.valid) {
            if (localStorage.getItem(btoa('access_token'))) {


                let versionFound = 0;
                for (let version of this.icdVersions) {
                    if (version.selectedVersion) {
                        versionFound++;
                        break;
                    }
                }

                if (versionFound == 0) {
                    this.notificationService.warn('Please select at least one version.');
                    return;
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
        // this.iCDModel = iCDCode;
        this.selectAll = false;

        this.requestsService.getRequest(AppConstants.ICD_CODE_GET + iCDCode.id)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ICD_SUC_02') {

                        this.selectedScope.length =0;

                        this.iCDModel = response['responseData'];
                        this.icdVersions = [];
                        this.icdVersions = this.iCDModel.selectedVersions;
                        this.icdVersions.map((x:any)=>{this.selectedScope.push(x.value)})
                    //    this.selectedVersion = this.iCDModel.selectedVersions;

                        /*for (let version of this.icdVersions) {
                            if (version.selectedVersion) {
                                this.selectAll = true;
                                break;
                            }
                        }*/

                    } else {
                        this.notificationService.error('ICD Code', response['responseMessage']);
                    }
                },
                (error: any) => {
                    this.notificationService.warn(error.error.error);
                }
            )

    }

    onAddICDCodePopupLoad() {
        this.isCodeUpdate = false;
        this.iCDModel = new ICDCodeModel();
        this.selectAll = false;
        this.getICDVersionsFromServer();
    }

    searchByCode(pageNo: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            this.searched = true;
            this.requestsService.getRequest(
                AppConstants.ICD_CODE_SEARCH + pageNo + '?code=' + this.searchCode)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ICD_SUC_02') {
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
                            this.data = [];
                            this.notificationService.warn('ICD Code not found');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        }
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

    checkedAllVersion() {
        for (let version of this.icdVersions) {
            version.selectedVersion = this.selectAll;
        }
    }

    /***
     * if one , version found true then true otherwise false
     * */
    checkedVersion() {
        let checkedFound = false;

        for (let version of this.icdVersions) {
            if (version.selectedVersion) {
                checkedFound = true;
                break;
            }
        }

        if (checkedFound) {
            this.selectAll = true;
            console.log(this.selectAll);
        } else {
            this.selectAll = false;
            console.log(this.selectAll);
        }

    }

}
