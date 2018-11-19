import {Component, OnInit} from '@angular/core';
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
    cols:any;
    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Lab Test Speciman Template';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getAllTestSpecimanList();
        };
        this.cols = [
            { field: 'testCode', header: 'Test Code' },
            { field: 'testName', header: 'Name' },
            { field: 'minNormalRange', header: 'MIN Range' },
            { field: 'maxNormalRange', header: 'MAX RANGE' },
            { field: 'description', header: 'Description' },
            {field: 'Action', header: 'Action'},

        ];

    }



    getAllTestSpecimanList() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(AppConstants.FETCH_LAB_TEST_SPECIMAN_CONFIGURATIONS
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.data = response['responseData'];
                       // this.cars = response['responseData'];
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Lab Test Speciman Configurations');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], 'Lab Test Speciman Configurations');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }


    editLabSpeciman(formData: NgForm) {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(AppConstants.LAB_TEST_SPECIMAN_CONFIGURATION_SAVE , this.labTestSpeciman)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.data = response['responseData'];
                            document.getElementById('close-btn-Prefix').click();
                            this.notificationService.success(response['responseMessage'], 'Lab Test Speciman');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Lab Test Speciman');
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


    edit(editConfiguration: any){
        if(editConfiguration){
            this.labTestSpeciman = editConfiguration;
        }else{
            this.labTestSpeciman = new LabTestSpecimanModel();
        }
    }


}