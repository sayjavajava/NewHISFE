import {Component} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {VitalSetupModel} from "../../../model/VitalSetupModel";

@Component({
    selector: 'vital-setup-template-component',
    templateUrl: '../../../templates/dashboard/setting/vital-setup.template.html',
})
export class VitalSetupComponent {

    data: VitalSetupModel[];
    vitalSetupTemplate: VitalSetupModel = new VitalSetupModel();
    id: number;
    cols:any;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Vital Setup Template';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getVitalSetupList();
        }
        this.cols = [
            {field: 'name', header: 'Name'},
            {field: 'unit', header: 'Unit'},
            {field: 'standardValue', header: 'Standard Value'},
            {field: 'status', header: 'Status'},
            {field: 'action', header: 'Action'},

        ];
    }
    onAddPopupLoadVital(){
        this.vitalSetupTemplate = new VitalSetupModel();
    }
    getVitalSetupList() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(AppConstants.FETCH_VITALS_CONFIGURATIONS
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.data = response['responseData'];
                        // console.log("Length : " + this.prefixTemplateList.length);
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Vital Setup Configurations');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], 'Vital Setup Configurations');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }


    editVitalSetup(formData: NgForm) {
        if (localStorage.getItem(btoa('access_token'))) {
            debugger;
            if (this.vitalSetupTemplate.name =="" || this.vitalSetupTemplate.name == null ) {
                this.notificationService.warn('Please enter Name.');
                return;
            }



            if (this.vitalSetupTemplate.unit == "" || this.vitalSetupTemplate.unit == null) {
                this.notificationService.warn('Please enter Unit');
                return;
            }
            this.requestsService.postRequest(AppConstants.VITALS_CONFIGURATION_SAVE , this.vitalSetupTemplate)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.data = response['responseData'];
                            document.getElementById('close-btn-Prefix').click();
                            this.notificationService.success(response['responseMessage'], 'Vital Setup Configurations');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Vital Setup Configurations');
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


    edit(editModule: any) {
        if (editModule) {
            this.vitalSetupTemplate = editModule;
        } else {
            this.vitalSetupTemplate = new VitalSetupModel();
        }
    }

    deleteVitalSetup(setupId: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are You Sure Want To Delete")) return;
            this.requestsService.deleteRequest(
                AppConstants.VITALS_CONFIGURATION_DELETE + setupId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success(response['responseMessage'], 'Vital Setup Configurations');
                            this.getVitalSetupList();
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Vital Setup Configurations');
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
}