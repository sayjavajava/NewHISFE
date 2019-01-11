import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';

import {AppConstants} from '../../../utils/app.constants';
import {Organization} from '../../../model/organization';
import {SelectItem} from "primeng/api";
import {DateFormatENUM} from "../../../enums/DateFormatEnum";
import {Country} from "../../../model/Country";
import {City} from "../../../model/City";
import {State} from "../../../model/State";
import 'rxjs/add/operator/toPromise';
import {async} from "@angular/core/testing";
import {count} from "rxjs/operators";
import any = jasmine.any;
import {isNullOrUndefined} from "util";
import {ChangeDetectorRef} from '@angular/core';

@Component({
    selector: 'addcashier-component',
    templateUrl: '../../../templates/dashboard/setting/update-organization.template.html',
})
export class UpdateOrganizationComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestsService,
                private fb: FormBuilder, private notificationService: NotificationService,private cd : ChangeDetectorRef) {

        this.allBranches();
        this.allTimezone();
        this.getOrganizationAccount();
    }

    private sub: any;
    private role: string;
    id: number;
    selectedSpecialty :string;
    responseUser: any[];
    error: any;
    proForm: FormGroup;
    generalForm: FormGroup;
    accountForm: FormGroup;
    timezoneList: any=[];
    branchesList: any = [];
    organizationACCOUNT :any =[];
    organization : Organization = new Organization();
    defaultBranch: string;
    specialtyList :any;
    countryLst:any=[];
    stateLst:any=[];
    cityLst:any=[];
    currency:string;
    dateFormat:DateFormatENUM[];
    dateFormatLst:SelectItem[] = [];
    dateType:any;
    timeType:any;
    zoneFormat:any;
    currencyCountryLst:any;
    countryListModified: SelectItem[] = [];
    statesListModified: SelectItem[] = [];
    citiesList: any[];
    citiesListModified: SelectItem[] = [];
    city: any;
    state: any;
    country: any;
    cityId: any;
    stateId: any;
    countryId: any;
    selectedCountry: SelectItem[] = [];
    selectedState: SelectItem[] = [];
    selectedCity: SelectItem[] = [];
    selectedTimeZoneFormat: SelectItem[] = [];
    timeZoneListModified: SelectItem[] = [];
    organizationDataList: any;
    branchesListModified:SelectItem[]=[];
    appointmentId:string;
    profileImg: File = null;
   // profileImg: File = null;
    private uploadedImage: File = null;
    currencyFormatList :any;
    urlOrganization:string;
    ngOnInit() {
        this.createProfileForm();
        this.createGenralForm();
        this.createAccountForm();
        this.allorganizationData();
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

        });
        this.patchData();
        this.accountForm.controls['userName'].disable();


        this.specialtyList = [
            {label: 'Anesthesiologists ', value: 'Anesthesiologists '},
            {label: 'Cardiologists ', value: 'Cardiologists '},
            {label: 'Dermatologists ', value: 'Dermatologists '},
            {label: 'Endocrinologists  ', value: 'Endocrinologists  '},
            {label: 'Gastroenterologists  ', value: 'Gastroenterologists  '}
        ];

       /* this.selectedCountry.push({label: "Please Select Country", value: -1});

        //     let pair: any = {label: "Please Select State", value: -1};
        this.selectedState.push({label: "Please Select State", value: -1});
        // let pair: any = {label: "Please Select City", value: -1};
        this.selectedCity.push({label: "Please Select City", value: -1});*/
        this.allCountries();
        this.getDateFormatList();
        this.dateType = [
            {label: 'dd MMMM yyyy[27 DEC 2018]',value:'dd MMMM yyyy'},
            {label:'MM dd yy[12 27 18]',value:'MM-dd-yy'},
            {label:'dd MM YY[27-12-18 ]',value:'dd-MM-yy'},
            {label: 'yyyy MM dd[2018-12-27]',value:'yyyy-MM-dd'},
            {label: 'MMMM dd, YYYY[DECEMBER-27-2018]',value:'MMMM dd, YYYY'},
            {label: 'EEEE, MMMM,DD, YYYY[thur,DECEMBER,27,2018]',value:'EEEE, MMMM,dd, yyyy'},
            {label: 'EEEEEE, MMMM,DD, YYYY[Thursday,DECEMBER,27,2018]',value:'EEEEEE, MMMM,dd, yyyy'},


        ];

        this.timeType = [
            {label: 'hh:mm',value:'hh:mm'},
            {label: 'hh:mm:ss',value:'hh:mm:ss'},
        ];

        this.currencyFormatList = [
            {label: '123,456.00 ', value: '123,456.00'},
            {label: '123456.00', value: '123456.00'},
            {label: '123,456 ', value: '123,456'},
            {label: '123456  ', value: '123456'},
        ];



    }

    createProfileForm() {
        this.proForm = this.fb.group({
                'companyEmail':  [null,Validators.compose([ Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
                'companyName': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
                'officePhone': [null, Validators.compose([Validators.required,Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
                'specialty': [],
                'selectedCountry': [null,Validators.compose([Validators.required])],
                'selectedState': [''],
                'selectedCity': [''],
                'fax': [null],
                'currency':[null],
                'formName': ['PROFILE'],
                'address': [null],
                'website': [null, Validators.pattern('^(http:\\/\\/|https:\\/\\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}.?([a-z]+)?$')],
                'profileImgUrl':[],
            }
        );
    }

    createGenralForm() {
        this.generalForm = this.fb.group({
            'defaultBranch': [null,Validators.compose([Validators.required])],
            'durationOfExam': [null],
            'durationFollowUp': [null],
            'prefixSerialPatient': [null],
            'prefixSerialUser': [null],
            'formName': ['GENERAL'],
            'prefixSerialDepartment': [null],
            'prefixSerialAppointment': [null],
            'prefixSerialInvoices': [null],
            'selectedTimeZoneFormat':[],
            'dateFormat':[],
            'timeFormat':[],
            'hoursFormat':[],
            'currencyFormat':[],
        });
    }

    createAccountForm() {
        this.accountForm = this.fb.group({
            'firstName': [null],
            'userId':[null],
            'lastName': [null],
            'userName': [null],
            'userEmail': [null,Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
            'cellPhone': [null,Validators.compose([Validators.required])],
            'userAddress': [null],
            'formName': ['ACCOUNT'],
            'homePhone': [null],
            'selectedCountry': [null,Validators.compose([Validators.required])],
            'selectedState': [''],
            'selectedCity': [''],
            'currency':[''],
        })
    }



    allBranches() {

        this.requestService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {

                        this.branchesList = response['responseData'];

                        for (let branch of this.branchesList) {
                            let pair: any = {label: branch.name, value: branch.id};
                            this.branchesListModified.push(pair);

                        }

                 //       this.branchesListModified.push(pair);

                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
    }


    allorganizationData() {

        this.requestService.getRequest(AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_01') {

                        this.organizationDataList = response['responseData'];

                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
    }


    allCountries() {

        this.requestService.getRequest(AppConstants.GET_ALL_COUNTRY)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'COUNTRY_SUC_11') {
                        this.countryLst = response['responseData'];
                        for (let country of this.countryLst) {
                            let pair: any = {label: country.name, value: country.id};
                            this.countryListModified.push(pair);

                        }

                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
    }


    getStatesById(id: any) {
        this.statesListModified=[];
        this.selectedState=[];
        this.citiesListModified=[];
        this.selectedCity=[];
        this.proForm.controls['selectedState'].patchValue('', {onlySelf: true});
        this.proForm.controls['selectedCity'].patchValue('', {onlySelf: true});
        let listOfCountry=this.countryLst.filter((listing: any) => listing.id === id);
        this.currency=listOfCountry[0].currency;
        this.requestService.getRequest(AppConstants.GET_STATE_BYCOUNTRYID + id)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "STATE_SUC_11") {

                        this.stateLst = response['responseData'];
                        if(this.stateLst.length>0){

                        for (let state of this.stateLst) {
                            var pair: any = {label: state.name, value: state.id};
                            this.statesListModified.push(pair);
                        }
                        if(this.statesListModified.length>0){
                        this.selectedState=this.statesListModified[0].value;
                        this.getCitiesById(this.statesListModified[0].value);
                        }
                    }else{
                            this.statesListModified.push({label: 'Not Applicable', value: -1});
                           // this.selectedState.push({label: 'Not Applicable', value: -1});
                            this.proForm.controls['selectedState'].patchValue('Not Applicable', {onlySelf: true});
                            this.proForm.controls['selectedCity'].patchValue('Not Applicable', {onlySelf: true});
                        }
                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "States List is not available");
                });
    }

    async getCountryById(id: any) {
        this.requestService.getRequest(AppConstants.GET_ALL_COUNTRYBYID + id)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] ==="COUNTRY_SUC_11") {

                        this.currencyCountryLst = response['responseData'];
                        this.currency=this.currencyCountryLst.currency;


                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "Country is not available");
                });
    }

    getCitiesById(id: any) {

        this.citiesListModified=[];
        this.citiesList=[];
        this.requestService.getRequest(AppConstants.GET_CITY_BYSTATEID + id)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "CITY_SUC_11") {
                        this.citiesList = response["responseData"];
                        if(this.citiesList.length>0){
                        for (let city of this.citiesList) {
                            var pair: any = {label: city.name, value: city.id};
                            this.citiesListModified.push(pair);
                        }
                    }else{
                            this.citiesListModified.push({label: 'Not Applicable', value: ''})
                           // this.selectedCity.push({label: 'Not Applicable', value: ''})
                            this.proForm.controls['selectedCity'].patchValue('Not Applicable', {onlySelf: true});
                        }
                     if(this.citiesListModified.length>0){
                            this.selectedCity=this.citiesListModified[0].value;
                     }
                    }else{
                        debugger;
                        this.citiesListModified.push({label: 'Not Applicable', value: ''})
                   //     this.selectedCity.push({label: 'Not Applicable', value: ''});
                        this.proForm.controls['selectedCity'].patchValue('Not Applicable', {onlySelf: true});
                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "Cities List is not available");
                });
    }





    getOrganizationAccount() {
        this.requestService.getRequest(AppConstants.FETCH_ORG_ACCOUNT_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_04') {
                        this.organization = response['responseData'];
                    }
                },
                (error: any) => {

                })
    }





    getDateFormatList() {
        this.requestService.getRequest(AppConstants.GET_ALL_DATEFORMAT)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DATEFORMAT_SUC_11') {
                        this. dateFormat= response['responseData'];
                        for (let dateFormatLst of this.dateFormat) {
                            var pair: any = {label: dateFormatLst.toString(), value: dateFormatLst.toString()};

                            this.dateFormatLst.push(pair);
                        }

                    }
                },
                (error: any) => {

                })
    }


    allTimezone() {
        this.requestService.getRequest(AppConstants.ZONE_FETCH_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'TZ_SUC_01') {
                        this.timezoneList = response['responseData'];

                        for (let zone of this.timezoneList) {
                     //       var disPlayName=;
                            let pair: any = {label:zone.name+''+zone.zoneTime, value: zone.zoneId};
                            this.timeZoneListModified.push(pair);

                        }
                        this.zoneFormat=this.timezoneList;

                    }
                },
                (error: any) => {

                })
    }

    public patchData() {

        if (this.id) {
            this.requestService.findById(AppConstants.FETCH_ORGANIZATION_BY_ID + this.id).subscribe(
                organization => {

                        this.proForm.patchValue({
                        userName: organization.userName,
                        companyEmail: organization.companyEmail,
                        fax: organization.fax,
                        countryName: organization.countryName,
                        homePhone: organization.homePhone,
                        officePhone: organization.officePhone,
                        address: organization.address,
                        website: organization.website,
                        companyName: organization.companyName,
                        specialty : organization.speciality,
                        selectedCountry:organization.addInfo.country,
                        selectedCity:organization.addInfo.city,
                        selectedState:organization.addInfo.state,
                        currency:organization.addInfo.Currency,
                        profileImgUrl:organization.profileImgUrl,

                    });
                    this.generalForm.patchValue({
                        defaultBranch: organization.defaultBranch,
                        durationOfExam: organization.durationOfExam,
                        durationFollowUp: organization.durationFollowUp,
                        dateFormat:organization.dateFormat,
                        timeFormat:organization.timeFormat,
                        selectedTimeZoneFormat:organization.addInfo.zoneFormat,
                        currencyFormat:organization.currencyFormat,
                        hoursFormat:organization.hoursFormat,


                    });
               //    this.B=organization.branchName;
                    console.log(organization);
                      //  this.appointmentId=organization.addInfo.serAppointId;
                        this.urlOrganization=organization.profileImgUrl;
                        this.defaultBranch= organization.branchName;
                }, (error: any) => {

                    this.error = error.error.error_description;

                });
        }

    }



    isFieldValid(field: string) {
        return !this.proForm.get(field).valid && this.proForm.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }


    /* prepareSaveOrganization(): Organization {
         const formModel = this.proForm.value;
         const generalModel = this.generalForm.value;
         const saveBranchModel: Organization = {
             firstName: formModel.firstName,
             lastName: formModel.lastName,
             userName: formModel.userName,
             email: formModel.email,
             companyName: formModel.companyName,
             password: formModel.password,
             confirmPassword: formModel.confirmPassword,
             officePhone: formModel.officePhone,
             homePhone: formModel.homePhone,
             cellPhone: formModel.cellPhone,
             appointmentSerial: formModel.appointmentSerial,
             website: formModel.website,
             timeZone: formModel.timeZone,
             specialty: formModel.specialty,

             defaultBranch: generalModel.defaultBranch,
             durationOfExam: generalModel.durationOfExam,
             followUpExam: generalModel.followUpExam,

         };
         return saveBranchModel;
     }
 */
    /*addOrganization(data: any, value?: string) {
        console.log('i m in');
        if (this.proForm.valid) {
            let orgObject = this.prepareSaveOrganization();
            if (value === 'done') {
                var self = this;
                this.requestService.putRequest(AppConstants.UPDATE_ORGANIZATION_URL + this.id, orgObject)
                    .subscribe(function (response) {
                        if (response['responseCode'] === 'ORG_SUC_03') {
                            self.notificationService.success('Organization has been Update Successfully');
                        }
                    }, function (error) {
                        self.notificationService.error('ERROR', 'Organization is not Updated');

                    });
            }

        } else {
            this.validateAllFormFields(this.proForm);
        }
    }
*/
    saveProfile(data: FormData) {
        if(this.proForm.valid) {
            var self = this;
            console.log(data);
            debugger;
            if((this.proForm.controls['selectedCity']).value!=undefined){
                if (this.proForm.controls['selectedCity'].value.length <= 0) {
                    //      data.selectedCity.toString("");
                    this.proForm.controls['selectedCity'].patchValue('', {onlySelf: true});
                }
            }
            if(this.proForm.controls['selectedState'].value != undefined){
            if(this.proForm.controls['selectedState'].value.length<=0){
           //     data.selectedState.toString("");
                this.proForm.controls['selectedState'].patchValue('', {onlySelf: true});
            }
            }
            /*if (this.uploadedImage === null) {
                this.notificationService.warn('Please upload Document');
                return;
            }*/
         //   postRequestMultipartFormAndDataWithOneFile
            //putRequest
            this.requestService.putRequest(AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
                .subscribe(function (response) {
                    if (response['responseCode'] === 'ORG_SUC_03') {
                        self.notificationService.success('Organization has been Updated Successfully');
                    }
                }, function (error) {
                    self.notificationService.error('ERROR', 'Organization is not Updated');

                });
        }else {
            this.validateAllFormFields(this.proForm);
        }
    }

    saveGeneralSettings(data: FormData) {

        var self = this;

        debugger;
        console.log(data);
     /*   if(data.defaultBranch.length>0){

        }*/
       // let listOfCountry=this.branchesList.filter((listing: any) => listing.name === data.defaultName);
        this.requestService.putRequest(AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
            .subscribe(function (response) {
                if (response['responseCode'] === 'ORG_SUC_03') {
                    self.notificationService.success('Organization has been Updated Successfully');
                }
            }, function (error) {
                self.notificationService.error('ERROR', 'Organization is not Updated');

            });

    }

    saveAccount(data: FormData) {
        var self = this;


        if(this.accountForm.valid) {
            this.requestService.putRequest(AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
                .subscribe(function (response) {
                    if (response['responseCode'] === 'ORG_SUC_03') {
                        self.notificationService.success('Organization has been Updated Successfully');
                    }
                }, function (error) {
                    self.notificationService.error('ERROR', 'Organization is not Updated');

                });
        }else {
            this.validateAllFormFields(this.accountForm);
        }

    }


    getSelected(value: any) {
        if (value) {
            this.organization.zoneId=value;

        }
    }

    /*getSelectedBranch(value: any) {
        if (value) {
            this.generalForm.controls['defaultBranch'].setValue(value);
        }
    }*/

    getDurationOfExam(value: any) {
        if (value) {
            this.generalForm.controls['durationOfExam'].setValue(value);
        }
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({onlySelf: true});
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    cancel() {
        this.router.navigate(['/dashboard/setting/organization']);
    }




    uploadImgOnChange(event: any) {

        let fileList: FileList = event.target.files;
        debugger
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === "profileImgUrl") {
                this.profileImg = fileList[0];
            }
        }
    }

    uploadProfileImg() {
        if (this.profileImg && this.profileImg.size <= 40000000) {
            this.requestService.postRequestMultipartFormData(
                AppConstants.UPLOAD_ORGNAIZATION_IMAGE_URL + this.id
                , this.profileImg)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ORG_SUC_02') {

                            this.urlOrganization=response['responseData'];
                            debugger;
                            this.cd.detectChanges();
                            alert(this.urlOrganization);
                            this.notificationService.success(response['responseMessage'], 'Update Organization');
                            this.profileImg = null;
                         //   this.urlOrganization=response['responseData'];
                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Profile Image uploading failed', 'Update Organization');

                    }
                );
        } else {
            this.notificationService.error('File size must be less then 4 mb.', 'Update Organization');
        }
    }

    isEmpty(val:string){
        return (val === undefined || val == null || val.length <= 0) ? true : false;
    }

}