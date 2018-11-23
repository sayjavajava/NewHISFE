import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {Patient} from "../../../model/patient";
import {NotificationService} from "../../../services/notification.service";
import {NgForm} from "@angular/forms";
import {UserTypeEnum} from "../../../enums/user-type-enum";
import {SelectItem} from "primeng/api";

@Component({
    selector: 'add-patient',
    templateUrl: '../../../templates/dashboard/patient/add-patient.template.html',
})
export class AddPatientComponent implements OnInit {
    patient: Patient = new Patient();
    profileImg: File = null;
    photoFront: File = null;
    photoBack: File = null;
    doctors: any = [];
    titleList:any;
    // rLanguage:any;
    pCommunication :any;
    emergencyContactRelations: any = [];
    maritalStatus: any = [];
    countryList: any[];
    countryListModified: SelectItem[] = [];
    statesList: any[];
    statesListModified: SelectItem[] = [];
    citiesList: any[];
    citiesListModified: SelectItem[] = [];
    col: any[];

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title,
                private HISUTilService: HISUtilService,
                private notificationService: NotificationService) {
        this.requestsService.getRequest(AppConstants.USER_BY_ROLE + '?name=' + UserTypeEnum.DOCTOR)
            .subscribe(
                (response: Response) => {
                    if (response['responseStatus'] === 'SUCCESS') {
                        this.doctors = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                });
    }

    /*search = (text$: Observable<string>) =>
     text$.pipe(
     debounceTime(200),
     distinctUntilChanged(),
     map(term => term.length < 2 ? []
     : this.title.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
     );*/

    ngOnInit() {
        this.titleService.setTitle('HIS | Add Patient');
        this.titleList = [
            {label: 'Mr', value: 'Mr'},
            {label: 'Mrs', value: 'Mrs'},
            {label: 'Ms', value: 'Ms'},
            {label: 'Dr', value: 'dr'},
        ];
        /* this.rLanguage = [
             {label: 'ENGLISH', value: 'ENGLISH'},
             {label: 'URDU', value: 'URDU'},
             {label: 'ARABIC', value: 'ARABIC'},
             {label: 'CHINESE', value: 'CHINESE'},
         ];*/
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
        this.createCountriesList();

    }

    uploadImgOnChange(event: any) {
        let fileList: FileList = event.target.files;

        if (fileList != null && fileList.length > 0) {
            if (event.target.name === 'profileImg') {
                this.profileImg = fileList[0];
            } else if (event.target.name === 'photoFront') {
                this.photoFront = fileList[0];
            } else if (event.target.name === 'photoBack') {
                this.photoBack = fileList[0];
            }
        }
    }

    savePatient(insuranceForm: NgForm, demographicForm: NgForm, patientForm: NgForm, contactForm: NgForm) {
        if (insuranceForm.invalid || demographicForm.invalid || patientForm.invalid || contactForm.invalid) {
            /*if (this.patient.selectedDoctor <= 0) {
                this.notificationService.error('Please select primary doctor', 'Patient');
                document.getElementById('selectedDoctor').focus();
                return;
            } else
            if (this.patient.titlePrefix === '-1') {
                this.notificationService.error('Please select title', 'Patient');
                document.getElementById('titlePrefix').focus();
                return;
            } else */

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
            /*else if (this.patient.email.length <= 0) {
             this.notificationService.error('Please provide email', 'Patient');
             document.getElementById("email").focus();
             return;
             } else if (this.patient.userName.length <= 0) {
             this.notificationService.error('Please provide user name', 'Patient');
             document.getElementById("userName").focus();
             return;
             }*/
            this.notificationService.error('Please provide required values', 'Patient');
            return;
        } else {
            if (localStorage.getItem(btoa('access_token'))) {
                this.patient.smokingStatus = null;

                /** **
                ** going to check the first name, last name and cellphone values are present
                ** **/
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

                /***
                 * going to check , if any one value available of insurance then company name must be presented
                 * **/
                /*if (this.patient.insuranceIdNumber != '' && this.patient.company === '') {
                    this.notificationService.warn('Please enter insurance company name.');
                    document.getElementById('company').focus();
                    return;
                }

                if (this.patient.groupNumber != '' && this.patient.company === '') {
                    this.notificationService.warn('Please enter insurance company name.');
                    document.getElementById('company').focus();
                    return;
                }

                if (this.patient.planName != '' && this.patient.company === '') {
                    this.notificationService.warn('Please enter insurance company name.');
                    document.getElementById('company').focus();
                    return;
                }

                if (this.patient.planType != '' && this.patient.company === '') {
                    this.notificationService.warn('Please enter insurance company name.');
                    document.getElementById('company').focus();
                    return;
                }

                if (this.patient.cardIssuedDate != '' && this.patient.company === '') {
                    this.notificationService.warn('Please enter insurance company name.');
                    document.getElementById('company').focus();
                    return;
                }

                if (this.patient.cardExpiryDate != '' && this.patient.company === '') {
                    this.notificationService.warn('Please enter insurance company name.');
                    document.getElementById('company').focus();
                    return;
                }

                if (this.patient.primaryInsuranceNotes != '' && this.patient.company === '') {
                    this.notificationService.warn('Please enter insurance company name.');
                    document.getElementById('company').focus();
                    return;
                }

                if (this.photoFront != null && this.patient.company === '') {
                    this.notificationService.warn('Please enter insurance company name.');
                    document.getElementById('company').focus();
                    return;
                }

                if (this.photoBack != null && this.patient.company === '') {
                    this.notificationService.warn('Please enter insurance company name.');
                    document.getElementById('company').focus();
                    return;
                }*/

                this.requestsService.postRequestMultipartFormAndData(
                    AppConstants.PATIENT_SAVE_URL,
                    this.patient, this.profileImg, this.photoFront, this.photoBack
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PATIENT_SUC_04') {
                            this.patient = new Patient();
                            this.profileImg = null;
                            this.photoFront = null;
                            this.photoBack = null;
                            this.notificationService.success(response['responseMessage'], 'Patient');
                            this.router.navigate(['/dashboard/patient/manage']);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Patient');
                        }
                    },
                    (error: any) => {
                        this.notificationService.success(Response['responseMessage'], 'Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
            } else {
                this.router.navigate(['/login']);
            }
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
        this.patient.city = cityId;
        // console.log("Branch City ID: " + this.branchCity);
    }

}
