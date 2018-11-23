import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {Patient} from "../../../model/patient";
import {NotificationService} from "../../../services/notification.service";
import {NgForm} from "@angular/forms";
import {UserTypeEnum} from "../../../enums/user-type-enum";
import {ImageModel} from "../../../model/image-model";
import {SelectItem} from "primeng/api";
import {Country} from "../../../model/Country";

@Component({
    selector: 'add-patient',
    templateUrl: '../../../templates/dashboard/patient/edit-patient.template.html',
})
export class EditPatientComponent implements OnInit {
    patient: Patient = new Patient();
    imageModel: ImageModel = new ImageModel();
    selectedPatientId: any;
    doctors: any = [];
    titleList:any;
    pCommunication :any;
    emergencyContactRelations: any = [];
    maritalStatus: any = [];
    file: File;
    profileImg: File = null;
    photoFront: File = null;
    photoBack: File = null;
    show: boolean = false;
    countryList: any[];
    countryListModified: SelectItem[] = [];
    selectedCountry: string = '';
    statesList: any[];
    statesListModified: SelectItem[] = [];
    selectedState: string = '';
    citiesList: any[];
    citiesListModified: SelectItem[] = [];
    selectedCity: string = '';

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title,
                private HISUTilService: HISUtilService,
                private notificationService: NotificationService,
                private activatedRoute: ActivatedRoute) {
        this.populatePatient();
        this.createCountriesList();
    };

    populatePatient() {
        this.requestsService.getRequest(AppConstants.USER_BY_ROLE + "?name=" + UserTypeEnum.DOCTOR)
            .subscribe(
                (response: Response) => {
                    if (response["responseStatus"] === "SUCCESS") {
                        this.doctors = response["responseData"];
                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                });

        this.activatedRoute.params.subscribe(
            params => {
                this.selectedPatientId = Number(params["id"]);
                this.requestsService.getRequest(
                    AppConstants.PATIENT_FETCH_URL + this.selectedPatientId
                ).subscribe(
                    response => {
                        if (response["responseCode"] === "USER_SUC_01") {
                            this.patient = response["responseData"];
                            this.selectedCountry = this.patient.country;
                            this.selectedState = this.patient.state;
                            this.selectedCity = this.patient.city;
                        } else {
                            this.notificationService.error(response["responseMessage"], "Patient");
                            // this.router.navigate(['404-not-found'])
                        }
                    },
                    (error: any) => {
                        this.HISUTilService.tokenExpired(error.error.error);
                    });
            });
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Update Patient');

        this.titleList = [
            {label: 'Mr', value: 'Mr'},
            {label: 'Mrs', value: 'Mrs'},
            {label: 'Ms', value: 'Ms'},
            {label: 'Dr', value: 'dr'},
        ];
        this.pCommunication =[
            {label: 'ENGLISH', value: 'ENGLISH'},
            {label: 'URDU', value: 'URDU'},
            {label: 'ARABIC', value: 'ARABIC'},
            {label: 'CHINESE', value: 'CHINESE'},
        ];
        this.maritalStatus =[
            {label: 'SINGLE', value: 'SINGLE'},
            {label: 'MARRIED', value: 'MARRIED'},
            {label: 'WIDOWED', value: 'WIDOWED'},
            {label: 'DIVORCED', value: 'DIVORCED'},
            {label: 'SEPERATED', value: 'SEPERATED'},
        ];
        this.emergencyContactRelations = [
            {label: 'Father', value: 'F'},
            {label: 'Mother', value: 'M'},
            {label: 'Husband', value: 'H'},
            {label: 'Wife', value: 'W'},
            {label: 'Brother', value: 'B'},
            {label: 'Son', value: 'S'},
            {label: 'Other', value: 'O'},
        ];
    }

    updatePatient(insuranceForm: NgForm, demographicForm: NgForm, patientForm: NgForm, contactForm: NgForm) {
        if (insuranceForm.invalid || demographicForm.invalid || patientForm.invalid || contactForm.invalid) {
            if (this.patient.firstName == null || this.patient.firstName.toString().trim().length <= 0) {
                this.notificationService.error('Please enter first name.', 'Patient');
                document.getElementById('firstName').focus();
                return;
            }

            if (this.patient.lastName == null || this.patient.lastName.toString().trim().length <= 0) {
                this.notificationService.error('Please enter last name.', 'Patient');
                document.getElementById('lastName').focus();
                return;
            }

            if (this.patient.cellPhone == null || this.patient.cellPhone.toString().trim().length <= 0) {
                this.notificationService.error('Please provide cell phone number', 'Patient');
                document.getElementById('cellPhone').focus();
                return;
            }
            this.notificationService.error('Please provide required Values', 'Patient');
            return;
        } else {
            if (localStorage.getItem(btoa('access_token'))) {
                this.patient.smokingStatus = null;

                if (this.patient.firstName.toString().trim().length <= 0) {
                    this.notificationService.warn('Please enter first name.');
                    document.getElementById('firstName').focus();
                    return;
                }

                if (this.patient.lastName.toString().trim().length <= 0) {
                    this.notificationService.warn('Please enter last name.');
                    document.getElementById('lastName').focus();
                    return;
                }

                if (this.patient.cellPhone.toString().trim().length <= 0) {
                    this.notificationService.warn('Please provide cell phone number');
                    document.getElementById('cellPhone').focus();
                    return;
                }

                this.requestsService.postRequestMultipartFormAndData(
                    AppConstants.PATIENT_UPDATE_URL,
                    this.patient, this.profileImg,this.photoFront,this.photoBack
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PATIENT_SUC_08') {
                            this.patient = new Patient();
                            this.notificationService.success(response['responseMessage'], 'Patient');
                            this.router.navigate(['/dashboard/patient/manage']);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Patient');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error("Error", 'Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
            } else {
                this.router.navigate(['/login']);
            }
        }
    }

    uploadImgOnChange(event: any) {
        /*let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.file = fileList[0];
        }
*/
        let fileList: FileList = event.target.files;

        if (fileList != null && fileList.length > 0) {
            if (event.target.name === "profileImgURL") {
                this.profileImg = fileList[0];
            } else if (event.target.name === "photoFrontURL") {
                this.photoFront = fileList[0];
            } else if (event.target.name === "photoBackURL") {
                this.photoBack = fileList[0];
            }
        }
    }

    uploadProfileImg() {
        if (this.profileImg && this.profileImg.size <= 1048000) {
            this.show = true;
            this.requestsService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_IMAGE_URL + this.patient.id
                , this.profileImg)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_SUC_02') {
                            this.patient.profileImgURL = "/public/images/processing.gif";
                            this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.profileImg = null;
                            this.show = false;
                            this.populatePatient();
                        }else{
                            this.show = false;
                            this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                        }
                    },
                    (error: any) => {
                        this.show = false;
                        this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                        //this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.show = false;
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }

    uploadFrontImg() {
        this.show = true;
        if (this.photoFront && this.photoFront.size <= 1048000) {
            this.requestsService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_FRONT_IMAGE_URL + this.patient.id +"/" +this.patient.insuranceId, this.photoFront)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'INS_IMG_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.photoFront = null;
                            this.show = false;
                            this.populatePatient();
                        } else {
                            this.show = false;
                            this.notificationService.error(response['responseMessage'], 'Update Patient');
                        }
                    },
                    (error: any) => {
                        this.show = false;
                        this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.show = false;
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }

    uploadBackImg() {
        this.show = true;
        if (this.photoBack && this.photoBack.size <= 1048000) {
            this.requestsService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_BACK_IMAGE_URL + this.patient.id +"/" +this.patient.insuranceId, this.photoBack)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'INS_IMG_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.file = null;
                            this.populatePatient();
                            this.show = false;
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Update Patient');
                        }
                    },
                    (error: any) => {
                        this.show = false;
                        this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                        //this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.show = false;
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }

    createCountriesList() {
        this.requestsService.getRequest(AppConstants.FETCH_LIST_OF_COUNTRIES)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "BRANCH_SUC_01") {
                        this.countryList = response["responseData"].data;
                        for (let country of this.countryList) {
                            var pair: any = {label: country.name, value: country.id};
                            this.countryListModified.push(pair);
                        }
                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "Countries List is not available");
                });
    }

    getStatesByCountryId(countryId: any) {
        this.statesList = this.citiesList = this.statesListModified = this.citiesListModified = [];

        this.requestsService.getRequest(AppConstants.FETCH_LIST_OF_STATES_BY_CNTRY_ID + countryId)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "BRANCH_SUC_01") {
                        this.statesList = response["responseData"].data;
                        for (let state of this.statesList) {
                            var pair: any = {label: state.name, value: state.id};
                            this.statesListModified.push(pair);
                        }
                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "States List is not available");
                });
    }

    getCitiesByStateId(stateId: any) {
        this.citiesList = this.citiesListModified = [];

        this.requestsService.getRequest(AppConstants.FETCH_LIST_OF_CITIES_BY_STATE_ID + stateId)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "BRANCH_SUC_01") {
                        this.citiesList = response["responseData"].data;
                        for (let city of this.citiesList) {
                            var pair: any = {label: city.name, value: city.id};
                            this.citiesListModified.push(pair);
                        }
                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "Cities List is not available");
                });
    }

    selectPatientCity(cityId: any) {
        // this.patient.cityId = cityId;
        // console.log("Branch City ID: " + this.branchCity);

        console.log("Country -> "+this.patient.countryId + " : "+this.patient.country);
        console.log("State -> "+this.patient.stateId+ " : "+this.patient.state);
        console.log("City -> "+this.patient.cityId + " : "+this.patient.city);
        console.log("\n");
    }
}
