import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {NotificationService} from "../../../services/notification.service";
import {UserTypeEnum} from "../../../enums/user-type-enum";
import {Patient} from "../../../model/patient";
import {DataService} from "../../../services/DataService";


@Component({
    selector: 'manage-patient',
    templateUrl: '../../../templates/dashboard/patient/manage-patient.template.html',
})
export class ManagePatientComponent implements OnInit {
    patient: Patient = new Patient();
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: any;
    searchString:string="";
    searched:boolean=false;
    cols: any[];

    patientDataImport: File = null;

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title,
                private HISUtilService: HISUtilService,
                private dataService: DataService,
                private notificationService: NotificationService) {
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Patient');
        // this.getAllPaginatedPatientFromServer(0);
        this.getAllPatientsFromServer();
        this.cols = [
            {field: "id", header: "S.No."},
            {field: "patientId", header: "EMR No."},
            {field: "firstName", header: "Patient Name"},
            {field: "email", header: "Email"},
            {field: 'gender', header: 'Gender'},
            {field: 'cellPhone', header: 'Cell No.'},
            {field: 'pastAppointments', header: 'Last Appt.'},
            {field: 'futureAppointments', header: 'Next Appt.'},
            {field: "status", header: "Status"},
            {field: "action", header: "Action"}
        ];
    }

    getPageWisePatients(page: number) {
        /*if (this.searched){
            this.searchPatient(page);
        } else {
            this.getAllPaginatedPatientFromServer(page);
        }*/
        this.getAllPatientsFromServer();
    }

    getAllPaginatedPatientFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_PATIENT_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATIENT_SUC_11') {
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

    getAllPatientsFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_PATIENT_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATIENT_SUC_11') {
                        this.data = response['responseData'];
                        console.log(this.data);
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    deletePatient(patientId: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are You Sure Want To Delete?")) return;
            this.requestsService.deleteRequest(
                AppConstants.PATIENT_DELETE_URI + patientId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PATIENT_SUC_06') {
                            this.notificationService.success(response['responseMessage'], 'Patient');
                            // this.getAllPaginatedPatientFromServer(0);
                            this.getAllPatientsFromServer();
                        } else {
                            // this.getAllPaginatedPatientFromServer(0);
                            this.getAllPatientsFromServer();
                            this.notificationService.error(response['responseMessage'], 'Patient');
                        }
                    },
                    (error: any) => {
                        //console.log(error.json())
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }

    searchPatient(page: number) {
        this.searched = true;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.SEARCH_ALL_PATIENT_URL + page + '?searchString=' + this.searchString)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATIENT_SUC_11') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                        this.notificationService.success(response['responseMessage'], 'Patient');
                    }else {
                        this.data = null;
                        this.notificationService.warn(response['responseMessage']);
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    refreshPatient(){
        this.searched = false;
        this.searchString = "";
        // this.getAllPaginatedPatientFromServer(0);
        this.getAllPatientsFromServer();
    }


    importData(event: any) {
        console.log(event);
        console.log("Data import method is called");
        let fileList: FileList = event.target.files;
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === 'patientDataImport') {
                // if (fileList[0].size < 4000000) {
                    this.patientDataImport = fileList[0];
                // } else {
                    // this.notificationService.warn('File size must be less than 4000000 bytes');
                // }

                this.requestsService.postRequestMultipartForm(AppConstants.IMPORT_PATIENTS_LIST_TO_SERVER, this.patientDataImport)
                    .subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'SUCCESS') {
                                this.notificationService.success(response['responseMessage'], 'Patient');
                                this.getAllPatientsFromServer();
                            } else {
                                this.notificationService.error(response['responseMessage'], 'Patient');
                            }
                        },
                        (error: any) => {
                            //console.log(error.json())
                            this.HISUtilService.tokenExpired(error.error.error);
                            this.notificationService.error(error.error.responseMessage, 'Patient');
                        }
                    );
            }
        }
    }

    // printReport(patientId: any) {
    //     console.log(patientId);
    //     this.requestsService.getRequest(AppConstants.PRINT_PATIENT_PAYMENT_INVOICE + "/" + patientId)
    //         .subscribe(
    //             (response: Response) => {
    //                 console.log(" Added : " + response);
    //                 if (response['responseCode'] === 'SUCCESS') {
    //                     this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
    //                     this.notificationService.success('Patient Payment Invoice Downloaded Successfully' + response["responseData"]);
    //                     // this.refundList = response["responseData"];
    //                 } else {
    //                     this.notificationService.error('ERROR', 'Failed to generate Invoice: '+response["responseData"]);
    //                 }
    //             }, function (error) {
    //                    this.notificationService.error('ERROR', 'Error occurred while getting invoice date ');
    //             });
    // }

    patientHistory(id:any){
        console.log('patient history'+ id);
        this.dataService.getPatientId(id);
        this.router.navigate(['/dashboard/patient/',id,'history']);
    }


}
