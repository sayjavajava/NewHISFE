import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {VitalSetupModel} from "../../../model/VitalSetupModel";
import {PatientImageModel} from "../../../model/PatientImageModel";

@Component({
    selector: 'patient-image.template',
    templateUrl: '../../../templates/dashboard/setting/patient-image.template.html',
})
export class PatientImageComponent {

    data: PatientImageModel[];
    patientImageSetupTemplate: PatientImageModel = new PatientImageModel();
    id: number;
    cols:any;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Patient Image Process Template';
        if (localStorage.getItem(btoa('access_token'))) {
            this. getPatientImageSetupList();
        };
        this.cols = [
            {field: 'code', header: 'Code'},
            {field: 'name', header: 'Name'},
            {field: 'description', header: 'Description'},
            {field: 'status', header: 'Status'},
            {field: 'Action', header: 'Action'},

        ];
    }

    getPatientImageSetupList() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(AppConstants.FETCH_PATIENT_IMAGE
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.data = response['responseData'];

                    } else {
                        this.notificationService.error(response['responseMessage'], '   ');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], '  ');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }

    onAddPopupLoadImage(){
        this.patientImageSetupTemplate = new PatientImageModel();
    }
    savesetup(formData: NgForm) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (this.patientImageSetupTemplate.code == null || this.patientImageSetupTemplate.code=="") {
                this.notificationService.warn('Please enter Order.');
                return;
            }

            if (this.patientImageSetupTemplate.name == "" || this.patientImageSetupTemplate.name == null) {
                this.notificationService.warn('Please provide Name ');
                return;
            }

            this.requestsService.postRequest(AppConstants.PATIENT_IMAGE_SAVE , this.patientImageSetupTemplate)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.data = response['responseData'];
                            document.getElementById('close-btn-Prefix').click();
                            this.notificationService.success(response['responseMessage'], '');
                        } else {
                            this.notificationService.error(response['responseMessage'], '');
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


    edit(editModule: any){
        if(editModule) {
            this.patientImageSetupTemplate = editModule;
        }else{
            this.patientImageSetupTemplate = new PatientImageModel();
        }
    }


    deleteImage(Id: number) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Sure You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.DELETE_PATIENT_IMAGE + Id)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success(response['responseMessage'], 'Patient Image Delete');
                            this.getPatientImageSetupList();
                            this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                        } else {
                           // this.getPaymentTypeList();
                            this.notificationService.error(response['responseMessage'], 'Patient Image Delete');
                        }
                    },
                    (error: any) => {

                        this.notificationService.error(error.error, 'Patient Image  Delete ')
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );

        } else {
            this.router.navigate(['/login']);
        }
    }

    updateImage(form: NgForm) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            if (form.valid) {
                this.requestsService.putRequest(
                    AppConstants.UPDATE_PATIENT_IMAGE,
                    this.patientImageSetupTemplate)
                    .subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'SUCCESS') {
                                this.notificationService.success(response['responseMessage'], 'Patient Image Update');
                                this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                                this.getPatientImageSetupList();

                            } else {
                             //   this.getPaymentTypeList();
                                this.notificationService.error(response['responseMessage'], 'Patient Image Error');
                            }
                        },
                        (error: any) => {
                            this.notificationService.error(error.error, 'Patient Image Error')
                            this.HISUtilService.tokenExpired(error.error.error);


                        }
                    );
            } else {
                this.notificationService.error('Required fields missing', 'Patient Image Error');
            }
        }else {
            this.router.navigate(['/login']);
        }}
}
