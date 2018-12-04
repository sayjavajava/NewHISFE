import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {RequestsService} from "../../../services/requests.service";
import {Patient} from "../../../model/patient";
import {NotificationService} from "../../../services/notification.service";
import {HISUtilService} from "../../../services/his-util.service";
import {NgForm} from "@angular/forms";
import {UserTypeEnum} from "../../../enums/user-type-enum";
import {PatientSmokeStatus} from "../../../model/PatientSmokeStatus";
import {ConformationDialogService} from "../../../services/ConformationDialogService";
import {Invoice} from "../../../model/Invoice";
import {SelectItem} from "primeng/api";
import {DatePicker} from "angular2-datetimepicker";

@Component({
    selector: 'patient-history',
    templateUrl: '../../../templates/dashboard/patient/patient-demographic.template.html',
})
export class PatientDemographicComponent implements OnInit {
    date = new Date();
    id: Number;
    patient: Patient = new Patient();
    file: File;
    profileImg: File = null;
    photoFront: File = null;
    photoBack: File = null;
    doctors: any = [];
    titleList:any = [];
    pCommunication:any=[];
    genders:any=[];
    smokeStatus: PatientSmokeStatus = new PatientSmokeStatus();
    smokeStatusList: any = [];
    patientInvBal: Invoice = new Invoice();
    updateBtn :boolean =false;
    martialStatus:any = [];
    emergencyContactRelations:any = [];
    countryList: any[];
    countryListModified: SelectItem[] = [];
    selectedCountry: string = '';
    statesList: any[];
    statesListModified: SelectItem[] = [];
    selectedState: string = '';
    citiesList: any[];
    citiesListModified: SelectItem[] = [];
    selectedCity: string = '';
    patientGroupList: any[];
    patientGroupListModified: SelectItem[] = [];
    smokeStatusType :any;

    constructor(private router: Router, private route: ActivatedRoute, private HISUTilService: HISUtilService,
                private confirmationDialogService: ConformationDialogService, private  requestService: RequestsService,
                private notificationService: NotificationService) {

        DatePicker.prototype.ngOnInit = function() {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }
            this.settings.timePicker = false;
            this.settings.format = "E MMM dd yyyy";
            this.date = new Date();
        };

        if (this.patient.dob == undefined || this.patient.dob == null || this.patient.dob.toString().trim() == "") {
            this.patient.dob = new Date().toDateString();
        }
        if (this.patient.cardIssuedDate == undefined || this.patient.cardIssuedDate == null || this.patient.cardIssuedDate.toString().trim() == "") {
            this.patient.cardIssuedDate = new Date().toDateString();
        }
        if (this.patient.cardExpiryDate == undefined || this.patient.cardExpiryDate == null || this.patient.cardExpiryDate.toString().trim() == "") {
            this.patient.cardExpiryDate = new Date().toDateString();
        }
    }

    ngOnInit(): void {
        //throw new Error("Method not implemented.");
        this.route.params.subscribe(params => {
            this.id = params['id'];
            if (this.id <= 0) {
                this.notificationService.warn('Please select patient from dashboard again ');
                return;
            }
            this.loadRecord();
            this.smokeStatusType = [
                {label: 'Every Day ', value: 'Every Day '},
                {label: 'Every Week ', value: 'Every Week '},
                {label: 'Every Month ', value: 'Every Month '},
                {label: 'Every Year  ', value: 'Every Year'}

            ];
            this.titleList = [
                {label: 'Mr', value: 'Mr'},
                {label: 'Mrs', value: 'Mrs'},
                {label: 'Ms', value: 'Ms'},
                {label: 'Dr', value: 'dr'},
            ];
            this.pCommunication =[
                {label: 'CELL PHONE', value: 'CELL PHONE'},
                {label: 'HOME PHONE', value: 'HOME PHONE'},
                {label: 'OFFICE PHONE', value: 'OFFICE PHONE'},
                {label: 'EMAIL', value: 'EMAIL'},
            ];
            this.martialStatus =[
                {label: 'SINGLE', value: 'SINGLE'},
                {label: 'MARRIED', value: 'MARRIED'},
                {label: 'WIDOWED', value: 'WIDOWED'},
                {label: 'DIVORCED', value: 'DIVORCED'},
                {label: 'SEPARATED', value: 'SEPARATED'},
            ];
            this.genders = [
                {label: 'MALE', value: 'MALE'},
                {label: 'FEMALE', value: 'FEMALE'},
                {label: 'OTHER', value: 'OTHER'},
            ];
            this.emergencyContactRelations = [
                {label: 'FATHER', value: 'FATHER'},
                {label: 'MOTHER', value: 'MOTHER'},
                {label: 'HUSBAND', value: 'HUSBAND'},
                {label: 'WIFE', value: 'WIFE'},
                {label: 'BROTHER', value: 'BROTHER'},
                {label: 'SON', value: 'SON'},
                {label: 'OTHER', value: 'OTHER'},
            ];
        });

        this.createCountriesList();
        this.createPatientGroupList();
    }

    isValidPatientId() {
        if (this.id <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
    }

    loadRecord() {
        if (this.id <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
        this.requestService.getRequest(
            AppConstants.PATIENT_FETCH_URL + this.id
        ).subscribe(
            response => {
                if (response['responseCode'] === 'USER_SUC_01') {
                    this.patient = response['responseData'];
                    this.smokeStatusList = response['responseData'].smokingStatus;
                    this.selectedCountry = this.patient.country;
                    this.selectedState = this.patient.state;
                    this.selectedCity = this.patient.city;

                    if (this.patient.dob == undefined || this.patient.dob == null || this.patient.dob.toString().trim() == "") {
                        this.patient.dob = new Date().toDateString();
                    }
                    if (this.patient.cardIssuedDate == undefined || this.patient.cardIssuedDate == null || this.patient.cardIssuedDate.toString().trim() == "") {
                        this.patient.cardIssuedDate = new Date().toDateString();
                    }
                    if (this.patient.cardExpiryDate == undefined || this.patient.cardExpiryDate == null || this.patient.cardExpiryDate.toString().trim() == "") {
                        this.patient.cardExpiryDate = new Date().toDateString();
                    }
                } else {
                    this.notificationService.error(response['responseMessage'], 'Patient');
                }
            },
            (error: any) => {
                this.HISUTilService.tokenExpired(error.error.error);
            });
        this.requestService.getRequest(AppConstants.USER_BY_ROLE + '?name=' + UserTypeEnum.DOCTOR)
            .subscribe(
                (response: Response) => {
                    if (response['responseStatus'] === 'SUCCESS') {
                        this.doctors = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                });
        this.requestService.getRequest(AppConstants.PATIENT_ALLINVOICE_BALANCE + this.id).subscribe(
            (response: Response) => {
                if (response['responseStatus'] === 'SUCCESS') {
                    this.patientInvBal = response['responseData'];
                    console.log('Patient Invoices Bal:' + this.patientInvBal.advanceBalance);
                }

            }
        );

    }

    updatePatient(insuranceForm: NgForm, demographicForm: NgForm, patientForm: NgForm) {
        if (insuranceForm.invalid || demographicForm.invalid || patientForm.invalid) {
            /*if (this.patient.selectedDoctor <= 0) {
                this.notificationService.error('Please select primary doctor', 'Patient');
                document.getElementById('selectedDoctor').focus();
                return;
            } else if (this.patient.titlePrefix === '-1') {
                this.notificationService.error('Please select title', 'Patient');
                document.getElementById('titlePrefix').focus();
                return;
            } else*/
            if (this.patient.firstName == null || this.patient.firstName.toString().trim().length <= 0) {
                this.notificationService.error('Please enter first name.', 'Patient');
                document.getElementById('firstName').focus();
                return;
            } else if (this.patient.lastName == null || this.patient.lastName.toString().trim().length <= 0) {
                this.notificationService.error('Please enter last name.', 'Patient');
                document.getElementById('lastName').focus();
                return;
            } else if (this.patient.cellPhone == null || this.patient.cellPhone.toString().trim().length <= 0) {
                this.notificationService.error('Please provide cell phone number', 'Patient');
                document.getElementById('cellPhone').focus();
                return;
            }
            /*else if (this.patient.email.length <= 0) {
                this.notificationService.error('Please provide email', 'Patient');
                document.getElementById('email').focus();
                return;
            } else if (this.patient.userName.length <= 0) {
                this.notificationService.error('Please provide user name', 'Patient');
                document.getElementById('userName').focus();
                return;
            } else if (this.patient.dob.length<=0) {
             this.notificationService.error('Please provide user name', 'Patient');
             // document.getElementById("dob").style.color = "red";
             document.getElementById("dob").focus();
             return;
             }*/
            this.notificationService.error('Please provide required Values', 'Patient');
            return;
        } else {
            if (this.patient.dob.toString().length > 0) {
                this.patient.dob = this.patient.dob.toString().substring(0, 24);        // Wed Mar 17 1993 17:03:21 GMT+0500 (Pakistan Standard Time) -> Wed Mar 17 1993 17:03:21
            }
            if (this.patient.cardIssuedDate.toString().length > 0) {
                this.patient.cardIssuedDate = this.patient.cardIssuedDate.toString().substring(0, 24);
            }
            if (this.patient.cardExpiryDate.toString().length > 0) {
                this.patient.cardExpiryDate = this.patient.cardExpiryDate.toString().substring(0, 24);
            }
            if (localStorage.getItem(btoa('access_token'))) {
                this.patient.smokingStatus = null;
                this.requestService.postRequestMultipartFormAndData(
                    AppConstants.PATIENT_UPDATE_URL,
                    this.patient, this.profileImg,this.photoFront,this.photoBack
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PATIENT_SUC_08') {
                            this.patient = new Patient();
                            this.notificationService.success(response['responseMessage'], 'Patient');
                            this.loadRecord();
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Patient');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Error', 'Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
            } else {
                this.router.navigate(['/login']);
            }
        }
    }

    addSmokingStatusPopup() {
        this.smokeStatus = new PatientSmokeStatus();
    }


    updateBtnShow(flag: boolean) {
        this.updateBtn = flag;
    }

    addUpdateSmokeStatus(smokeStatusId: Number) {
        //console.log("Event Data Id:"+event.data.id);

        if (this.id <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }

        this.smokeStatus.patientId = this.id;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestService.postRequest(
                AppConstants.SMOKE_STATUS_URL,
                this.smokeStatus
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SMOKE_STATUS_SUC_04') {
                        this.patient = new Patient();
                        this.notificationService.success(response['responseMessage'], 'Smoke Status');
                        this.loadRecord();
                    } else {
                        this.notificationService.error(response['responseMessage'], 'Smoke Status');
                    }
                },
                (error: any) => {
                    this.notificationService.error('Error', 'Smoke Status');
                    this.HISUTilService.tokenExpired(error.error.error);
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }

    deleteSmokeStatus(smokingId: any) {
        if (this.id <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
        var that = this;
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(res => {
                if (res == true) {
                    this.requestService.deleteRequest(
                        AppConstants.SMOKE_STATUS_DEL_URL + smokingId
                    ).subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'SMOKE_STATUS_SUC_06') {
                                this.patient = new Patient();
                                this.notificationService.success(response['responseMessage'], 'Smoke Status');
                                //this.router.navigate(['/dashboard/patient/demographic/', that.id]);
                                this.loadRecord();
                            } else {
                                this.notificationService.error(response['responseMessage'], 'Smoke Status');
                            }
                        },
                        (error: any) => {
                            this.notificationService.error('Error', 'Smoke Status');
                            this.HISUTilService.tokenExpired(error.error.error);
                        }
                    );
                }
            });

    }

    uploadImgOnChange(event: any) {
        /*let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.file = fileList[0];
        }*/
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
            this.requestService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_IMAGE_URL + this.patient.id
                , this.profileImg)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.profileImg = null;
                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Profile Image uploading failed', 'Update Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }

    uploadFrontImg() {
        if (this.photoFront && this.photoFront.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_FRONT_IMAGE_URL + this.patient.id, this.photoFront)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.photoFront = null;
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Update Patient');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Patient insurance front photo uploading failed', 'Update Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }

    uploadBackImg() {
        if (this.photoBack && this.photoBack.size <= 1048000) {
            this.requestService.postRequestMultipartFormData(
                AppConstants.UPLOAD_PATIENT_BACK_IMAGE_URL + this.patient.id, this.photoBack)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'USR_SUC_03') {
                            this.notificationService.success(response['responseMessage'], 'Update Patient');
                            this.photoBack = null;
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Update Patient');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Patient insurance back photo uploading failed', 'Update Patient');
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.notificationService.error('File size must be less then 1 kb.', 'Update Patient');
        }
    }

    goToUserDashBoard() {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    }

    createCountriesList() {
        this.requestService.getRequest(AppConstants.FETCH_LIST_OF_COUNTRIES)
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

        this.requestService.getRequest(AppConstants.FETCH_LIST_OF_STATES_BY_CNTRY_ID + countryId)
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

        this.requestService.getRequest(AppConstants.FETCH_LIST_OF_CITIES_BY_STATE_ID + stateId)
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

    createPatientGroupList() {
        this.requestService.getRequest(AppConstants.PATIENT_GROUP_GET_ALL)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "PATGRP_SUC_6") {
                        this.patientGroupList = response["responseData"].data;
                        for (let patientGroup of this.patientGroupList) {
                            var pair: any = {label: patientGroup.name, value: patientGroup.id};
                            this.patientGroupListModified.push(pair);
                        }
                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "Patient Groups List is not available");
                });
    }
}

