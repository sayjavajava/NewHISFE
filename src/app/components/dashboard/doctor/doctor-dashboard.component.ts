import {Component, TemplateRef} from '@angular/core';
import {Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {Title} from '@angular/platform-browser';
import {AppConstants} from '../../../utils/app.constants';
import {UserTypeEnum} from '../../../enums/user-type-enum';
import {Dashboard} from '../../../model/Dashboard';
import {NotificationService} from "../../../services/notification.service";
import {MatSnackBar} from "@angular/material";
import {ConformationDialogService} from "../../../services/ConformationDialogService";
import {DataService} from "../../../services/DataService";

@Component({
    selector: 'doctor-dashboard-component',
    templateUrl: '../../../templates/dashboard/doctor/doctor-dashboard.template.html',
    styleUrls: [],
})
export class DoctorDashboardComponent {

    title: string = 'Doctor Dashboard';
    error: any;
    dashboardList: Dashboard[] = [];
    branches: any = [];
    doctorsList: any = [];
    dashboardListModified: any[] = [];
    public loading = false;
    roomId: number;
    allRooms:RoomFilter[] = [];
    showRoom :boolean =false;
    showRoomBtn:any = 'Show';
    showRoomDrop :boolean =false;
    roomSelected : any[] = [];
    statusesList :any[]=[];
    constructor(private requestService: RequestsService,
                private router: Router,
                private snackBar: MatSnackBar,
                private notificationService: NotificationService,
                private confirmationDialogService: ConformationDialogService,
                private  dataService:DataService,
                private titleService: Title,
                private requestsService: RequestsService
                ) {
        this.showDashboard();
        this.allStatusesOfOrganization();

    };
    ngOnInit() {
        this.getBranchesFromServer();
        this.getDoctorsFromServer();

    }

    showDashboard() {
        this.loading =true;
        this.requestService.getRequest(AppConstants.FETCH_DASHBOARD_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DASHBOARD_SUC_01') {
                        let dashboardListTemp = response['responseData'];
                        /*this.dashboardList = dashboardListTemp.filter((x:any)=>x.status =="COMPLETE" || x.status=="IN_SESSION" || x.status=="CHECK_IN" ); un-comment 2 lines for
                        this.dashboardListModified = this.dashboardList;*/
                        this.dashboardList = dashboardListTemp;
                        this.dashboardListModified = this.dashboardList;
                        this.loading =false
                    }else {
                      this.loading =false

                    }
                },
                (error: any) => {
                    setTimeout(function(){ this.loading=false }, 3000);
                    this.loading=false;
                    this.error = error.error.error

                })
    }

    getBranchesFromServer() {
        this.requestService.getRequest(
            AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branches = response['responseData'];

                    }
                },
                (error: any) => {

                }
            );
    }

    getDoctorsFromServer() {
        this.requestService.getRequest(
            AppConstants.USER_BY_ROLE + '?name=' + UserTypeEnum.DOCTOR)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'USER_SUC_01') {
                        this.doctorsList = response['responseData'];
                    }
                },
                (error: any) => {

                }
            );
    }
    allStatusesOfOrganization() {
        this.requestsService.getRequest(AppConstants.FETCH_ALL_STATUSES)
            .subscribe(
                (response: Response) => {
                    //console.log('i am branch call');
                    if (response['responseCode'] === 'STATUS_SUC_05') {
                        this.statusesList = response['responseData'];
                        //console.log(this.servicesList);
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })

    }

    getFilteredBranch(value: any) {
       this.dashboardListModified =this.dashboardList;
        if(value == 'All'){
            this.dashboardListModified = this.dashboardList;
        }else {
            const arr = this.dashboardListModified.filter(x => x.branch === value);
            this.dashboardListModified = arr;

        }
    }

    getfilteredDoctor(value: any) {
        this.dashboardListModified = this.dashboardList;
        if (value == 'All') {
            this.dashboardListModified = this.dashboardList;
        } else {
            const arr = this.dashboardListModified.filter(x => x.doctorLastName == value);
            this.dashboardListModified = arr;
        }
    }

    getfilteredStatus(value: any) {
        this.dashboardListModified = this.dashboardList;
        if (value == 'All') {
            this.dashboardListModified = this.dashboardList;
        } else {
            const arr = this.dashboardListModified.filter(x => x.status == value);
            this.dashboardListModified = arr;
        }
    }
    showRoomWithBranch(bId:number,roomIdd:number){
        this.showRoom =!this.showRoom;
        this.showRoomDrop = this.showRoom;
        this.allRooms.length=0;
        this.roomSelected.length =0;
        let roomList :any[] =[];
        let roomFiltered  = this.branches.filter((x:any)=>x.id == bId);
        this.roomSelected.push(roomIdd)
        roomFiltered.forEach((x:any)=>{
            x.examRooms.forEach((y:any)=>{
                let roomObj = new RoomFilter(y.label,y.value);
                //let foot = {label:y.label,value:y.value}
                this.allRooms.push(roomObj);
                let {label} =roomObj;
               // console.log(label)
            })

        })
        if(this.showRoom) {
            this.showRoomBtn = 'HIDE';
        }else{
            this.showRoomBtn='SHOW'   }
    }

    getUpdatedStatus(statusValue: number, apptId: any, pmID:number) {
        var that = this;
       /* if(statusValue === 'IN_SESSION' || statusValue === 'COMPLETE' ){*/
            this.confirmationDialogService
                .confirm('Update Status', 'Are you sure?')
                .subscribe(res => {
                    if (res == true) {
                        this.requestService.putRequestWithParam(AppConstants.CHANGE_APPT_STATUS + apptId, statusValue)
                            .subscribe((res: Response) => {
                                if (res['responseCode'] === "STATUS_SUC_01") {
                                    this.snackBar.open('Status Updated', `Status has been Changed   Successfully`, {duration: 3000});
                                }
                            }, (error: any) => {
                                this.error = error.error.error;
                            });
                    }
                });
      /*  }*/


    }
    getExamRoom(roomId :any,apptId:number){
        this.confirmationDialogService
            .confirm('Update Room', 'Are you sure ?')
            .subscribe(res => {
                if (res == true) {
                    this.requestService.putRequestWithParam(AppConstants.UPDATE_APPOINTMENT_ROOM + apptId,
                        roomId)
                        .subscribe((res: Response) => {
                            if (res['responseCode'] === "APPT_SUC_03") {
                                //  this.roomSelected.push(roomId);
                                this.snackBar.open('Status Updated', `Room has been changed`, {duration: 3000});
                            }
                        }, (error: any) => {
                            this.error = error.error.error;
                        });
                }
            });
    }

    patientHistory(id:any){
        console.log('patient history'+ id);
        this.dataService.getPatientId(id);
        this.router.navigate(['/dashboard/patient/',id,'history']);
    }

    updateAppointmentData(id: any) {
        this.requestService.getRequest(AppConstants.INVOICE_CHECK_IN + id)
            .subscribe((res: Response) => {
                if (res['responseCode'] === "INVOICE_ERR_01") {
                    this.snackBar.open('Error', `Invoice Not Generated`, {duration: 3000});
                } else {
                    this.router.navigate(['/dashboard/patient/invoice', id]);
                }
            }, (error: any) => {
                this.error = error.error.error;
            });


    }

}
class RoomFilter{
    label : string;
    value : number;
    id:number;
    branchName:string;
    constructor(label ?:string,value?: number){
        this.label = label;
        this.value = value;
        this.branchName=label;
        this.id=value;
    }
}


