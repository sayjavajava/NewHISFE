import {Component} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {LabTestSpecimanModel} from "../../../model/LabTestSpecimanModel";

@Component({
    selector: 'lab-test-template-component',
    templateUrl: '../../../templates/dashboard/setting/lab-test.template.html',
})
export class LabTestComponent {

    data: LabTestSpecimanModel[];
    labTestSpeciman: LabTestSpecimanModel = new LabTestSpecimanModel();
    id: number;
    cols: any;
    labTestDataImport: File = null;
    code: any
    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Lab Test Specimen Template';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getAllTestSpecimanList();
        }
        this.cols = [
            { field: 'specimanId', header: 'Lab Code'},
            { field: 'testCode', header: 'Test Code' },
            { field: 'testName', header: 'Test Name' },
            { field: 'minNormalRange', header: 'MIN Range' },
            { field: 'maxNormalRange', header: 'MAX Range' },
            { field: 'unit', header: 'Unit' },
            { field: 'description', header: 'Description' },
            { field: 'action', header: 'Action' },

        ];

    }

    getAllTestSpecimanList() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(AppConstants.FETCH_LAB_TEST_SPECIMAN_CONFIGURATIONS
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.data = response['responseData'];

                        console.log(this.data);
                       // this.cars = response['responseData'];
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Lab Test Specimen Configurations');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], 'Lab Test Specimen Configurations');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }


    editLabSpeciman(formData: NgForm) {
        if (localStorage.getItem(btoa('access_token'))) {


                if (this.labTestSpeciman.testName == null || this.labTestSpeciman.testName.trim().length <= 0) {
                    this.notificationService.error("Please provide Test name");
                    return;
                }
                if (this.labTestSpeciman.maxNormalRange == "" || this.labTestSpeciman.maxNormalRange == null) {

                        this.notificationService.error('Please provide Max Normal Range');

                        return;
                    }

                if (this.labTestSpeciman.minNormalRange == "" || this.labTestSpeciman.minNormalRange == null) {

                    this.notificationService.error('Please provide Min Normal Range');

                    return;
                }
                if (this.labTestSpeciman.unit == "" || this.labTestSpeciman.unit == null) {

                    this.notificationService.error('Please provide Unit');

                    return;
                }
                this.requestsService.postRequest(AppConstants.LAB_TEST_SPECIMAN_CONFIGURATION_SAVE, this.labTestSpeciman)
                    .subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'SUCCESS') {
                                this.data = response['responseData'];
                                document.getElementById('close-btn-Prefix').click();
                                this.notificationService.success(response['responseMessage'], 'Lab Test Specimen');
                            } else {
                                this.notificationService.error(response['responseMessage'], 'Lab Test Specimen');
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


    editLab(editConfiguration: any){
        if(editConfiguration){
            this.labTestSpeciman = editConfiguration;
        } else {
            this.labTestSpeciman = new LabTestSpecimanModel();
        }
    }

    importData(event: any) {
        console.log(event);
        console.log("Data import method is called");
        let fileList: FileList = event.target.files;
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === 'labTestDataImport') {
                if (fileList[0].size > 0 && fileList[0].size < 4000000) {         // if (fileList[0].size < 4000000) {
                    this.labTestDataImport = fileList[0];
                    this.requestsService.postRequestMultipartForm(AppConstants.IMPORT_LAB_TEST_LIST_TO_SERVER, this.labTestDataImport)
                        .subscribe(
                            (response: Response) => {
                                if (response['responseCode'] === 'SUCCESS') {
                                    this.notificationService.success(response['responseMessage'], 'Lab Test Specimen');
                                    this.getAllTestSpecimanList();
                                } else {
                                    this.notificationService.error(response['responseMessage'], 'Lab Test Specimen');
                                }
                            }, (error: any) => {
                                //console.log(error.json())
                                this.HISUtilService.tokenExpired(error.error.error);
                                this.notificationService.error(error.error.responseMessage, 'Lab Test Specimen');
                            }
                        );
                } else {
                    this.notificationService.warn('File size must be more than 0 byte and less than 4 MB');
                }
            }
        }
    }



    deleteLab(Id: number) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.LAB_TEST_SPECIMAN_CONFIGURATION_DELETE + Id)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success('LAB Test Speciman has been Deleted Successfully');

                            this.getAllTestSpecimanList();
                        } else {

                            this.notificationService.error('ERROR', 'LAB Test Speciman is not deleted ');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error(error.error, error)
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }

    addPopupClick(){
        this.labTestSpeciman = new LabTestSpecimanModel();
    }
    updateLab() {

        this.requestsService.putRequest(
            AppConstants.LAB_TEST_UPDATE_URL,
            this.labTestSpeciman)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.notificationService.success('Lab Test Speciman has been Updated Successfully');
                        this.getAllTestSpecimanList();
                        document.getElementById('close-btn-Prefix').click();
                     //   this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                    } else {
                        this.notificationService.error('Lab Test Speciman is not Updated ');
                    }
                },
                (error: any) => {
                    //console.log(error.json())
                    this.notificationService.error(error.error.error);

                }
            );
    }

}