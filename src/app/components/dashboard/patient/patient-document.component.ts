import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DocumentModel} from "../../../model/document";
import {NotificationService} from "../../../services/notification.service";
import {RequestsService} from "../../../services/requests.service";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {DataService} from "../../../services/DataService";
import {Subscription} from "rxjs/Subscription";


@Component({
    selector: 'patient-document',
    templateUrl: '../../../templates/dashboard/patient/patient-documents.template.html',
})
export class PatientDocumentsComponent implements OnInit {
    isUpdate: boolean;
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    documentData: DocumentModel[] = [];
    dm: DocumentModel = new DocumentModel();
    private selectedPatientId: number;
    private uploadedImage: File = null;
    private isRequestUnderProcess: boolean = false;
    private subscription: Subscription;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private dataService: DataService) {

        this.subscription = this.dataService.currentPatientId.subscribe(id => {
            this.selectedPatientId = id;
        });


        this.getPageWiseDocumentsFromServer(0);
    }


    ngOnInit(): void {
    }

    uploadImgOnChange(event: any) {
        let fileList: FileList = event.target.files;
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === "documentName") {
                if (fileList[0].size < 4000000) {
                    this.uploadedImage = fileList[0];
                    this.dm.name = this.uploadedImage.name;
                } else {
                    this.notificationService.warn('File size must be less than 4000000 bytes');
                }
            }
        }
    }

    saveDocumentByPatient() {
        if (localStorage.getItem(btoa('access_token'))) {
            if (this.uploadedImage === null) {
                this.notificationService.warn('Please upload Document');
                return;
            }

            if (this.selectedPatientId <= 0) {
                this.notificationService.warn('Please provide proper patient.');
                return;
            }

            if (!this.isRequestUnderProcess) {
                this.isRequestUnderProcess = true;
                this.dm.patientId = this.selectedPatientId;
                this.requestsService.postRequestMultipartFormAndDataWithOneFile(
                    AppConstants.DOCUMENT_SAVE_URL,
                    this.dm, this.uploadedImage
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'DOC_SUC_37') {
                            this.dm = new DocumentModel();
                            this.uploadedImage = null;
                            this.notificationService.success(response['responseMessage'], 'Document');
                            this.getPageWiseDocumentsFromServer(0);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Document');
                        }
                        this.isRequestUnderProcess = false;
                    },
                    (error: any) => {
                        this.notificationService.success(Response['responseMessage'], 'Document');
                        this.HISUtilService.tokenExpired(error.error.error);
                        this.isRequestUnderProcess = false;
                    }
                );
                console.log(this.isRequestUnderProcess);
            } else {
                this.notificationService.warn('Your first request is under process,Please wait...');
            }
        } else {
            this.router.navigate(['/login']);
        }
    }

    private getPageWiseDocumentsFromServer(page: number) {
        this.requestsService.getRequest(AppConstants.DOCUMENT_PAGINATED_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DOC_SUC_39') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.documentData = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    getPageWiseDocuments(page: number) {
        this.getPageWiseDocumentsFromServer(page);
    }

    editDocument(documentId: number) {
        this.dm = new DocumentModel();
        this.uploadedImage = null;
        if (documentId > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(AppConstants.DOCUMENT_GET_URL + 'documentId=' + documentId)
                    .subscribe(
                        response => {
                            if (response['responseCode'] === 'DOC_SUC_42') {
                                this.dm = response['responseData'];
                                this.notificationService.success(response['responseMessage'], 'Document of Patient');
                                this.isUpdate = true;
                            } else {
                                this.notificationService.error(response['responseMessage'], 'Document of Patient');
                                this.isUpdate = false;
                            }
                        },
                        (error: any) => {
                            this.HISUtilService.tokenExpired(error.error.error);
                            this.isUpdate = false;
                        });
            } else {
                this.router.navigate(['/login']);
            }
        } else {
            this.notificationService.error('Please select proper record', 'Document of Patient');
        }
    }

    updateDocumentByPatient() {
        if (localStorage.getItem(btoa('access_token'))) {

            if (this.uploadedImage === null) {
                this.notificationService.warn('Please upload Document');
                return;
            }

            this.dm.patientId = this.selectedPatientId;

            if (!this.isRequestUnderProcess) {
                this.isRequestUnderProcess = true;
                this.requestsService.postRequestMultipartFormAndDataWithOneFile(
                    AppConstants.DOCUMENT_UPDATE_URL,
                    this.dm, this.uploadedImage
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'DOC_SUC_44') {
                            this.dm = new DocumentModel();
                            this.uploadedImage = null;
                            this.isUpdate = false;
                            this.notificationService.success(response['responseMessage'], 'Document');
                            this.getPageWiseDocumentsFromServer(0);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Document');
                        }
                        this.isRequestUnderProcess = false;
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                        this.isRequestUnderProcess = false;
                    }
                );
                console.log(this.isRequestUnderProcess);
            } else {
                this.notificationService.warn('Your first request is under process,Please wait...');
            }
        } else {
            this.router.navigate(['/login']);
        }
    }


    deleteDocument(documentId: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are Your Source You Want To Delete")) return;
            this.requestsService.deleteRequest(
                AppConstants.DOCUMENT_DELETE_URI + documentId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'DOC_SUC_40') {
                            this.notificationService.success(response['responseMessage'], 'Document of Patient');
                            this.getPageWiseDocumentsFromServer(0);
                        } else {
                            this.getPageWiseDocumentsFromServer(0);
                            this.notificationService.error(response['responseMessage'], 'Document of Patient');
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


    goToUserDashBoard() {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    }
}