import {Component, OnInit} from '@angular/core';
import {HISUtilService} from '../../../services/his-util.service';
import {Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {UserSharedService} from '../../../services/user.shared.service';
import {AppConstants} from '../../../utils/app.constants';
import {NotificationService} from '../../../services/notification.service';
import {FormBuilder} from '@angular/forms';
import {DrugModel} from '../../../model/drug.model';
import {SelectItem} from "primeng/api";

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
    cols: any[];
    selectedCountry: SelectItem[] = [];
    countryListModified: SelectItem[] = [];
    countryLst: any = [];
    drugDataImport: File = null;

    /*searchDepart: string;
     searched: boolean = false;*/

    constructor(private requestsService: RequestsService,
                private router: Router,
                private userSharedService: UserSharedService,
                private HISUtilService: HISUtilService,
                private notificationService: NotificationService,private fb: FormBuilder) {
    }

    ngOnInit() {
        if (window.localStorage.getItem(btoa('access_token'))) {
            // this.getPageWiseDrugFromServer(0);
            this.getAllDrugsFromServer();
        } else {
            this.router.navigate(['/login']);
        }
        this.allCountries();

        this.cols = [
           { field: 'drugName', header: 'Drug Name' },
            { field: 'companyName', header: 'Company Name' },
            { field: 'genericName', header: 'GenericName' },
            { field: 'route', header: 'Route' },
            { field: 'strength', header: 'Strength' },
            { field: 'uOM', header: 'UoM' },
            { field: 'origin', header: 'Origin' },
            { field: 'status', header: 'Status' },
            { field: 'active', header: 'Action' }
        ];
    }

    getPageWiseDrug(page: number) {
        // this.data = [];
        // if (this.searched) {
        //     this.searchClinicalDepartment(page);
        // } else {
        this.getPageWiseDrugFromServer(page);
        // }
    }


    allCountries() {

        this.requestsService.getRequest(AppConstants.GET_ALL_COUNTRY)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'COUNTRY_SUC_11') {
                        this.countryLst = response['responseData'];
                        for (let country of this.countryLst) {
                            let pair: any = {label: country.name, value: country.id};
                            this.countryListModified.push(pair);

                        }

                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
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
                        console.log(this.data);

                    }
                },
                (error: any) => {
                    //console.log(error.json())
                    this.notificationService.error(error.error.error);
                }
            );
    }

    getAllDrugsFromServer() {
        this.requestsService.getRequest(AppConstants.DRUG_FETCH_ALL_PAGINATED_URI + "all")
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DRUG_SUC_10') {
                        this.data = response['responseData']['data'];
                        console.log(this.data);

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
                            // this.getPageWiseDrugFromServer(0);
                            this.getAllDrugsFromServer();
                        } else {
                            // this.getPageWiseDrugFromServer(0);
                            this.getAllDrugsFromServer();
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

  /*  createGenralForm() {
        this.generalForm = this.fb.group({

            'selectedCountry': [null],
            'uOM': [null],
            'strengths': [null],
            'route': [null],
            'companyName': [null],
            'genericName': [null],
            'drugName': [null],

        });
    }*/

    saveDrug(data: FormData) {

        if (this.drug.drugName == '') {
            this.notificationService.error('Please enter Drug name.', 'Drug');
            document.getElementById('drugName').focus();
            return;
        }
        if (this.drug.genericName == '') {
            this.notificationService.error('Please enter generic Name.', 'Drug');
            document.getElementById('genericName').focus();
            return;
        }
        if (this.drug.companyName == '') {
            this.notificationService.error('Please enter company Name.', 'Drug');
            document.getElementById('companyName').focus();
            return;
        }
        if (this.drug.route == '') {
            this.notificationService.error('Please enter  route name.', 'Drug');
            document.getElementById('route').focus();
            return;
        }

        if (this.drug.strengths.length == 0) {
            this.notificationService.error('Please enter  strength.', 'Drug');
            document.getElementById('strengths').focus();
            return;
        }

        /*if (this.drug.origin == '') {
            this.notificationService.error('Please enter origin.', 'Drug');
            document.getElementById('origin').focus();
            return;
        }*/
       if(this.selectedCountry.length==0){
            this.notificationService.error('Please Select Make.', 'Drug');
           document.getElementById('origin').focus();
            return;
        }
   //     this.drug.selectedCountry=this.selectedCountry;
    //    let listOfCountry=this.countryLst.filter((listing: any) => listing.id === this.drug.selectedCountry);
       // console.log(listOfCountry);
       this.drug.selectedCountry=this.selectedCountry;

        console.log(this.drug);
        this.requestsService.postRequest(
            AppConstants.DRUG_SAVE_URL,
            this.drug)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DRUG_SUC_1') {
                        this.notificationService.success(response['responseMessage'], 'Drug');
                        // this.getPageWiseDrugFromServer(0);
                        this.getAllDrugsFromServer();
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

        if (this.drug.drugName == '') {
            this.notificationService.error('Please enter Drug name.', 'Drug');
            document.getElementById('drugName').focus();
            return;
        }
        if (this.drug.genericName == '') {
            this.notificationService.error('Please enter generic Name.', 'Drug');
            document.getElementById('genericName').focus();
            return;
        }
        if (this.drug.companyName == '') {
            this.notificationService.error('Please enter company Name.', 'Drug');
            document.getElementById('companyName').focus();
            return;
        }
        if (this.drug.route == '') {
            this.notificationService.error('Please enter name.', 'Drug');
            document.getElementById('drugName').focus();
            return;
        }

       if (this.drug.strengths.length == 0) {
            this.notificationService.error('Please enter  strength.', 'Drug');
            document.getElementById('strengths').focus();
            return;
        }


        if(this.selectedCountry.length==0){
            this.notificationService.error('Please Select Make.', 'Drug');
            document.getElementById('origin').focus();
            return;
        }
        /*if (this.drug.origin == '') {
            this.notificationService.error('Please enter origin.', 'Drug');
            document.getElementById('origin').focus();
            return;
        }*/
        this.drug.selectedCountry=this.selectedCountry;

        console.log(this.drug);
        this.requestsService.putRequest(
            AppConstants.DRUG_UPDATE_URL,
            this.drug)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DRUG_SUC_11') {
                        this.notificationService.success(response['responseMessage'], 'Drug');
                        // this.getPageWiseDrugFromServer(0);
                        this.getAllDrugsFromServer();
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
                        let drug = new DrugModel();
                        this.drug.routes = drug.routes;
                        this.drug.UOMs = drug.UOMs;
                        this.selectedCountry=this.drug.addInfo.country;
                        console.log(this.drug);
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
        this.requestsService.getRequest(AppConstants.DRUG_GET_NATURAL_ID_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] == 'DRUG_SUC_15') {
                        this.drug.drugNaturalId = response['responseData'];
                    } else {
                        this.notificationService.error(response['responseMessage']);
                    }
                }
            ),
            (error: any) => {
                this.notificationService.error(error.error.error);
            };
    }

    importData(event: any) {
        console.log(event);
        console.log("Data import method is called");
        let fileList: FileList = event.target.files;
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === 'drugsDataImport') {
                if (fileList[0].size > 0 && fileList[0].size < 4000000) {         // if (fileList[0].size < 4000000) {
                    this.drugDataImport = fileList[0];
                    this.requestsService.postRequestMultipartForm(AppConstants.IMPORT_DRUGS_LIST_TO_SERVER, this.drugDataImport)
                        .subscribe(
                            (response: Response) => {
                                if (response['responseCode'] === 'SUCCESS') {
                                    this.notificationService.success(response['responseMessage'], 'Drug');
                                    // this.getPageWiseDrugFromServer(0);
                                    this.getAllDrugsFromServer();
                                } else {
                                    this.notificationService.error(response['responseMessage'], 'Drug');
                                }
                            }, (error: any) => {
                                //console.log(error.json())
                                this.HISUtilService.tokenExpired(error.error.error);
                                this.notificationService.error(error.error.responseMessage, 'Drug');
                            }
                        );
                } else {
                    this.notificationService.warn('File size must be more than 0 byte and less than 4 MB');
                }
            }
        }
    }
}