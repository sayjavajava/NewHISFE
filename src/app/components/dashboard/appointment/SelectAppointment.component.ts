import {Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {Title} from '@angular/platform-browser';
import {UserTypeEnum} from '../../../enums/user-type-enum';
import {AppConstants} from '../../../utils/app.constants';
import {Dashboard} from '../../../model/Dashboard';
import {ConformationDialogService} from "../../../services/ConformationDialogService";
import {MatSnackBar} from "@angular/material";
import {Component} from "@angular/core";
import {DataService} from "../../../services/DataService";
import {isDateSelectable} from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker-tools";
import {isNumeric} from "rxjs/util/isNumeric"
@Component({
    selector: 'nurse-dashboard-component',
    templateUrl: '../../../templates/dashboard/appointment/select-appointment.template.html',
    styleUrls: [],
})
export class SelectAppointmentComponent {
    branchesList: any;
    error: any;
    doctorsList: any = [];
    roomId: number;

    constructor(private requestService: RequestsService,
                private router: Router, private dataService : DataService
               ) {
        this.allBranches();
        this.allDoctors();

    };

    ngOnInit() {
        this.dataService.updateApptDoctorId(0);
        this.dataService.updateApptBranchId(0);
    }
    allBranches() {
        this.requestService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL+'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchesList = response['responseData'];
                        /*if(this.branchesList.length >1){
                            this.removeBranch();
                        }*/
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })
    }

    allDoctors() {
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

    getBranchId(branchId: any){
        let isNumber = isNumeric(branchId.value)
        if(isNumber){
            console.log('branch id..' + branchId.value);
            this.dataService.updateApptBranchId(branchId.value);
        }else
        this.dataService.updateApptBranchId(0);
    }

    getDoctorId(doctorId:any){
        let isNumber = isNumeric(doctorId.value)
        if(isNumber){
            console.log('doc id..' + doctorId.value);
            this.dataService.updateApptDoctorId(doctorId.value);
        }else
        this.dataService.updateApptDoctorId(0);
    }


}