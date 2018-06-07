import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";

@Component({
    selector: 'add-patient',
    templateUrl: '../../../templates/dashboard/patient/add-patient.html',
})
export class AddPatientComponent implements OnInit {

    doctors: any = [];
    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title,
    private HISUTilService: HISUtilService) {

        this.requestsService.getRequest(AppConstants.USER_BY_ROLE + '?name=' + 'DOCTOR')
            .subscribe(
                (response: Response) => {
                    if (response['responseStatus'] === 'SUCCESS') {
                        this.doctors = response['responseData'];

                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                });
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Add Patient');
    }




}
