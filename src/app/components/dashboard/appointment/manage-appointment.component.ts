import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {NotificationService} from "../../../services/notification.service";
import {MedicalService} from '../../../model/medical-service';
import {ConfirmationdialogComponent} from '../confirmationdialog.component';
import {ConformationDialogService} from '../../../services/ConformationDialogService';

@Component({
    selector: 'manage-appointment-component',
    templateUrl: '../../../templates/dashboard/appointment/manage-appointment.template.html',
})
export class ManageAppointmentComponent implements OnInit {
    nextPage:any;
    prePage: any;
    currPage:any;
    pages: number[] = [];
    data: any;
    searchData:string;
    searchFlag:boolean=false;
    selectedMedicalService: MedicalService = new MedicalService();
    appointmentDataImport: File = null;

    @ViewChild('fileInput')
    fileInputVariable: ElementRef;

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title,
                private hisUtilService: HISUtilService,
                private confirmationDialogService:ConformationDialogService,
                private notificationService: NotificationService) {
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Manage Appointments');
        //this.getAllPaginatedAppointmentsFromServer(0);
        this.getAllAppointmentsFromServer();
    }

    getPageWisePatients(page: number) {
        this.getAllPaginatedAppointmentsFromServer(page);
    }

    getAllPaginatedAppointmentsFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.FETCH_PAGINATED_APPOINTMENTS_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'APPT_SUC_01') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    //  this.hisUtilService.tokenExpired(error.error.error);
                }
            );
    }

    getAllAppointmentsFromServer() {
        this.requestsService.getRequest(AppConstants.FETCH_PAGINATED_APPOINTMENTS_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'APPT_SUC_01') {
                        this.data = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.notificationService.error('ERROR', 'Unable to fetch appointments from Server');
                    //  this.hisUtilService.tokenExpired(error.error.error);
                }
            );
    }

    searchAppointment(page: any) {
        this.searchFlag = true;
        this.requestsService.getRequest(
            AppConstants.SEARCH_APPOINTMENTS_BY_PATIENT + page + '?patientName=' + this.searchData)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'APPT_SUC_01') {
                        /*     this.nextPage = response['responseData']['nextPage'];
                             this.prePage  = response['responseData']['prePage'];
                             this.currPage = response['responseData']['currPage'];
                             this.pages    = response['responseData']['pages'];
                             this.data     = response['responseData']['data'];
                         } else {
                             this.nextPage = 0;
                             this.prePage = 0;
                             this.currPage = 0;
                             this.pages = [];
                             this.data = null;
                         }*/
                        this.data = response['responseData'];
                    }
                },
                (error: any) => {
                }
            );
    }
    updateAppointment(id: any) {
        this.router.navigate(['/dashboard/appointment/edit/', id]);
    }

    deleteAppointment(id: number) {
        var self=this;
        console.log('idd'+id);
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(res => {
                if (id) {
                    this.requestsService.deleteRequest(AppConstants.DELETE_APPOINTMENT_URI + id).subscribe((data: Response) => {
                        if (data['responseCode'] === 'APPT_SUC_05') {
                            self.notificationService.success('Appointment has been Deleted Successfully');
                            self.getAllPaginatedAppointmentsFromServer(0);

                        }
                    }, error => {
                        self.notificationService.error('ERROR', 'Appointment Unable to Delete ');

                    });
                    // this.router.navigate(['/home']);
                }
            });
    }

    importData(event: any) {
        console.log(event);
        console.log("Data import method is called");
        let fileList: FileList = event.target.files;
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === 'appointmentDataImport') {
                if (fileList[0].size > 0 && fileList[0].size < 4000000) {         // if (fileList[0].size < 4000000) {
                    this.appointmentDataImport = fileList[0];
                    this.requestsService.postRequestMultipartForm(AppConstants.IMPORT_APPOINTMENT_LIST_TO_SERVER, this.appointmentDataImport)
                        .subscribe(
                            (response: Response) => {
                                if (response['responseCode'] === 'SUCCESS') {
                                    this.notificationService.success(response['responseMessage'], 'Manage Appointments');
                                    // (<HTMLInputElement> document.getElementById("appointmentDataImport")).value = "";
                                    (this.fileInputVariable.nativeElement as HTMLInputElement).files = null;
                                    //this.getAllPaginatedAppointmentsFromServer(0);
                                    this.getAllAppointmentsFromServer();
                                } else {
                                    this.notificationService.error(response['responseMessage'], 'Manage Appointments');
                                }
                            }, (error: any) => {
                                //console.log(error.json())
                                // this.HISUtilService.tokenExpired(error.error.error);
                                this.notificationService.error(error.error.responseMessage, 'Manage Appointments');
                            }
                        );
                } else {
                    this.notificationService.warn('File size must be more than 0 byte and less than 4 MB');
                }
            }
        }
    }

}
