import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {NotificationService} from "../../../services/notification.service";

@Component({
    selector: 'manage-appointment-component',
    templateUrl: '../../../templates/dashboard/appointment/manage-appointment.template.html',
})
export class ManageAppointmentComponent implements OnInit {
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: any;

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title,
                private hisUtilService: HISUtilService,
                private notificationService: NotificationService) {
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Manage Appointments');
        this.getAllPaginatedAppointmentsFromServer(0);
    }

    getPageWisePatients(page: number) {
        this.getAllPaginatedAppointmentsFromServer(page);
    }

    getAllPaginatedAppointmentsFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.FETCH_PAGINATED_PATIENTS_URL + page)
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
                    this.hisUtilService.tokenExpired(error.error.error);
                }
            );
    }
}
