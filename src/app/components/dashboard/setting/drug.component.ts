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
import {DrugModel} from '../../../model/drug.model';

@Component({
    selector: 'drug',
    templateUrl: '../../../templates/dashboard/setting/drug.template.html',
})
export class DrugComponent implements OnInit {

    drug: DrugModel = new DrugModel();
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: DrugModel [] = [];
    /*searchDepart: string;
     searched: boolean = false;*/

    constructor(private requestsService: RequestsService,
                private router: Router,
                private userSharedService: UserSharedService,
                private HISUtilService: HISUtilService,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.getPageWiseDrugFromServer(0);
        } else {
            this.router.navigate(['/login']);
        }
    }

    getPageWiseDrug(page: number) {
        // this.data = [];
        // if (this.searched) {
        //     this.searchClinicalDepartment(page);
        // } else {
        this.getPageWiseDrugFromServer(page);
        // }
    }

    // refreshPage() {
    //     this.searched = false;
    //     this.searchDepart = '';
    //     this.getPageWiseDepartmentFromServer(0);
    // }

    getPageWiseDrugFromServer(page: number) {
        // this.searchDepart = '';

        this.requestsService.getRequest(
            AppConstants.DRUG_FETCH_ALL_PAGINATED_URI + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DRUG_SUC_8') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    //console.log(error.json())
                    this.notificationService.error(error.error.error);
                }
            );
    }

    deleteDrug(drugId: number) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.DRUG_DELETE_URI + drugId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'DRUG_SUC_6') {
                            this.notificationService.success(response['responseMessage'], 'Drug');
                            this.getPageWiseDrugFromServer(0);
                        } else {
                            this.getPageWiseDrugFromServer(0);
                            this.notificationService.error(response['responseMessage'], 'Drug');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error(error.error, 'Drug')
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }

    /*    searchClinicalDepartment(page: any) {
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
     }*/

    saveDrug() {

        if (this.drug.name == '') {
            this.notificationService.error('Please enter name.', 'Drug');
            document.getElementById('drugName').focus();
            return;
        }

        if (this.drug.url == '') {
            this.notificationService.error('Please enter url of drug, mean , find drug details from google and past url of that drug.', 'Drug');
            document.getElementById('url').focus();
            return;
        }

        this.requestsService.postRequest(
            AppConstants.DRUG_SAVE_URL,
            this.drug)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DRUG_SUC_1') {
                        this.notificationService.success(response['responseMessage'], 'Drug');
                        this.getPageWiseDrugFromServer(0);
                        this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Drug');
                    }
                },
                (error: any) => {
                    //console.log(error.json())
                    this.notificationService.error(error.error.error);
                }
            );
    }

    updateDrug() {

        if (this.drug.name == '') {
            this.notificationService.error('Please enter name.', 'Drug');
            document.getElementById('drugName').focus();
            return;
        }

        if (this.drug.url == '') {
            this.notificationService.error('Please enter url of drug, mean , find drug details from google and past url of that drug.', 'Drug');
            document.getElementById('url').focus();
            return;
        }

        this.requestsService.putRequest(
            AppConstants.DRUG_UPDATE_URL,
            this.drug)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DRUG_SUC_11') {
                        this.notificationService.success(response['responseMessage'], 'Drug');
                        this.getPageWiseDrugFromServer(0);
                        this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Drug');
                    }
                },
                (error: any) => {
                    //console.log(error.json())
                    this.notificationService.error(error.error.error);

                }
            );
    }

    onUpdatePopupDrug(id: any) {
        this.requestsService.getRequest(AppConstants.DRUG_GET_URL + id)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DRUG_SUC_10') {
                        this.drug = response['responseData'];
                    } else {
                        this.notificationService.error(response['responseMessage']);
                    }
                }
            ),
            (error: any) => {
                this.notificationService.error(error.error.error);
            }
    }

    onAddDrug() {
        this.drug = new DrugModel();
    }
}