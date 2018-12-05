import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DocumentModel} from '../../../model/document';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {AppConstants} from '../../../utils/app.constants';
import {HISUtilService} from '../../../services/his-util.service';
import {DataService} from '../../../services/DataService';
import {Subscription} from 'rxjs/Subscription';
import {Patient} from '../../../model/patient';
import {SelectItem} from "primeng/api";
import {PatientImageOrderModel} from "../../../model/PatientImageOrderModel";
import {PatientImageModel} from "../../../model/PatientImageModel";


@Component({
    selector: 'patient-document',
    templateUrl: '../../../templates/dashboard/patient/patient-order.template.html',
})
export class PatientImageOrderComponent implements OnInit {
    patient: Patient = new Patient();
    isUpdate: boolean;
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    orderData: PatientImageOrderModel[] = [];
    dm: DocumentModel = new DocumentModel();
    private selectedPatientId: number;
    private uploadedImage: File = null;
    private isRequestUnderProcess: boolean = false;
    private subscription: Subscription;
    reportType:any;
    orderListModified: SelectItem[] = [];
    data: PatientImageModel[];
    selectedOrder: SelectItem[] = [];
    statusType:any;
    uploadedFiles: any[] = [];
    patientImageTemplate: PatientImageOrderModel = new PatientImageOrderModel();
    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private dataService: DataService) {

        this.subscription = this.dataService.currentPatientId.subscribe(id => {
            this.selectedPatientId = id;
        });

        this.getPatientImageSetupList();
     //   this.getPageWiseOrderFromServer(0);
        this.getPatientByIdFromServer(this.selectedPatientId);
    }


    ngOnInit(): void {

        this.statusType = [
            {label: 'ACTIVE',value:'ACTIVE'},
            {label: 'IN-ACTIVE',value:'IN-ACTIVE'},
        ];

        this.reportType = [
            {label: 'Insurance',value:'Insurance'},
            {label: 'HEALTH_CERTIFICATE',value:'HEALTH_CERTIFICATE'},
            {label: 'REPORT',value:'REPORT'},
            {label: 'TEST',value:'TEST'},

        ];
        this.getPageWiseOrderFromServer(0);
    }


    addProblemPopupClick() {
        this.isUpdate = false;
    }


    uploadImgOnChange(event: any) {

        for (var i = 0; i < event.files.length; i++) {
            this.uploadedFiles.push(event.files[i]);

        }


    }

    saveOrder() {
        if (localStorage.getItem(btoa('access_token'))) {
            /*if (this.uploadedImage === null) {
                this.notificationService.warn('Please upload Document');
                return;
            }*/

            if (this.selectedPatientId <= 0) {
                this.notificationService.warn('Please provide proper patient.');
                return;
            }


                this.patientImageTemplate.patientId = this.selectedPatientId;
           //     this.patientImageTemplate.file=this.uploadedFiles;
           // this.patientImageTemplate.file[0].t='';


             //  this.patientImageTemplate.type=this.selectedOrder.toString();
               this.patientImageTemplate.patientImageId=this.selectedOrder.toString();
                console.log(this.patientImageTemplate);
                this.requestsService.postRequestMultipartFormAndDataWithMultipleFile(
                    AppConstants.PATIENT_IMAGE_SAVE_ORDER,
                    this.patientImageTemplate,this.uploadedFiles
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'DOC_SUC_37') {
                            this.notificationService.success(response['responseMessage'], 'Document');
                            this.getPageWiseOrderFromServer(0);
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
            this.router.navigate(['/login']);
        }
    }

    private getPageWiseOrderFromServer(page: number) {

        this.requestsService.getRequest(AppConstants.PATIENT_IMAGE_FETCH_ALL_PAGINATED_URI + page + '?patientId=' + this.selectedPatientId)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DOC_SUC_39') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.orderData = response['responseData']['data'];
                        debugger;
                        console.log(this.orderData);
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Document');
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    getPageWiseDocuments(page: number) {
        this.getPageWiseOrderFromServer(page);
    }

    editOrder(Id: number) {

        if (Id > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(AppConstants.FETCH_PATIENT_ORDER_ID + 'orderId=' + Id)
                    .subscribe(
                        response => {
                            if (response['responseCode'] === 'DOC_SUC_42') {
                                this.patientImageTemplate = response['responseData'];
                                debugger;

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
            this.notificationService.error('Please select proper record', 'Order Image of Patient');
        }
    }

    updateOrderByPatient() {
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
                            this.getPageWiseOrderFromServer(0);
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


    deleteOrder(orderId: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.DELETE_PATIENT_IMAGE_DELETE + orderId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'DOC_SUC_40') {
                            this.notificationService.success(response['responseMessage'], 'Order of Patient');
                            this.getPageWiseOrderFromServer(0);
                        } else {
                            this.getPageWiseOrderFromServer(0);
                            this.notificationService.error(response['responseMessage'], 'Order of Patient');
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

    getPatientByIdFromServer(patientId: number) {
        this.requestsService.getRequest(
            AppConstants.PATIENT_FETCH_URL + patientId
        ).subscribe(
            response => {
                if (response['responseCode'] === 'USER_SUC_01') {
                    this.patient = response['responseData'];
                    let apptId = response['responseData']['pastAppointments'];
                } else {
                    this.notificationService.error(response['responseMessage'], 'Patient');
                    // this.router.navigate(['404-not-found'])
                }
            },
            (error: any) => {
                this.HISUtilService.tokenExpired(error.error.error);
            });
    }


    downloadFile(data: Response) {
        console.log(data);
        // may be you need to use data._body to get data of body
        var blob = new Blob([data], {type: 'image/jpeg'});
        var url = window.URL.createObjectURL(blob);
        window.open(url);
    }


    getPatientImageSetupList() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(AppConstants.FETCH_PATIENT_IMAGE
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.data = response['responseData'];
                        for (let patientImg of this.data) {
                            let pair: any = {label: patientImg.name, value: patientImg.id};
                            this.orderListModified.push(pair);

                        }
                    } else {
                        this.notificationService.error(response['responseMessage'], ' Setup ');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], ' Setup ');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }
}