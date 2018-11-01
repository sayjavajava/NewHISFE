import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {Family} from "../../../model/Family";
import {NgForm} from "@angular/forms";
import {RequestsService} from "../../../services/requests.service";
import {AppConstants} from "../../../utils/app.constants";
import {NotificationService} from "../../../services/notification.service";
import {HISUtilService} from "../../../services/his-util.service";
import {Subscription} from "rxjs/Subscription";
import {DataService} from "../../../services/DataService";
import {ConformationDialogService} from "../../../services/ConformationDialogService";
import {Patient} from "../../../model/patient";
import {Status} from "../../../model/status";
import {ModalDirective} from "ngx-bootstrap";


@Component({
    selector: 'patient-family-history',
    templateUrl: '../../../templates/dashboard/setting/statuses.template.html',
})
export class StatusesComponent implements OnInit {
    nextPage: number;
    prePage: number;
    currPage: number;
    pages: number[] = [];

    status:Status = new Status();
    color:string;
    @ViewChild('statusModal') addModal: ModalDirective;
    data : Status[];
    selectedStatus = new Status();
    patientId: number;
    searchStatus:any;
    error: any;
    pageNo:number =0;
    patient :Patient =new Patient();
    constructor(private router: Router, private requestsService: RequestsService,
                private notificationService: NotificationService, private confirmationDialogService: ConformationDialogService) {
    }

    ngOnInit(): void {
        this.getAllStatusesFromServer(0);

    }

    getAllStatusesFromServer(page: number) {
        if (page > 0) {
            page = page;}
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_PAGINATED_STATUS + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'STATUS_SUC_02') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data= response['responseData']['data'];

                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                }
            );
    }

    saveStatus(data: NgForm) {

        if (data.valid) {
            this.status.colorHash =this.color;
            this.requestsService.postRequest(
                AppConstants.STATUS_CREATE,
                this.status)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'STATUS_SUC_01') {
                            this.addModal.hide();
                            this.getAllStatusesFromServer(this.currPage);
                            this.notificationService.success(response['responseMessage'], 'Status');
                        }
                        if (response['responseCode'] === 'STATUS_ERR_05') {
                            this.notificationService.warn('Status already Exists');
                            //  this.router.navigate(['/dashboard/setting/branch'])
                        }
                    },
                    (error: any) => {

                    }
                );
        } else {
            this.notificationService.error('Form Invalid', '');
        }
    }

    onUpdatePopupLoad(status: Status) {
        this.status = status;
        this.addModal.show();
    }

    updateStatus(form: NgForm) {
        if (form.valid) {
            this.status.colorHash =this.color;
            this.requestsService.putRequest(
                AppConstants.UPDATE_FAMILY_HISTORY_URL + this.selectedStatus.id,
                this.selectedStatus)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'FAM_HISTORY_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'Family History');
                            this.getAllStatusesFromServer(this.currPage);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Family History');
                        }
                    },
                    (error: any) => {

                    }
                );
        } else {
            this.notificationService.error('Required fields missing', 'Clinical Department');
        }
    }



    deleteStatus(id: number) {
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to delete?')
            .subscribe(res => {
                if (res ==true) {
                    this.requestsService.deleteRequest(AppConstants.STATUS_DELETE + id).subscribe((data: Response) => {
                        if (data['responseCode'] === 'STATUS_SUC_04') {
                            this.notificationService.success('Status has been Deleted Successfully');
                            this.getAllStatusesFromServer(this.currPage);
                        }
                    }, error => {
                        this.notificationService.error('ERROR', 'Status is not deleted ');

                    });
                }
            });
    }
    closeAddStatusModal(){
        this.addModal.hide();
    }


    addStatus() {
        this.addModal.show();
        this.status = new Status();
    }
    searchSatatusesFromServer(){
        this.requestsService.getRequest(AppConstants.STATUS_SEARCH + this.pageNo + '?statusName=' + this.searchStatus)
            .subscribe(//branch search
                (response: Response) => {

                    if (response['responseCode'] === 'STATUS_SUC_02') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];

                    }
                },
                (error: any) => {

                    this.error = error.error.error;
                })

    }

}