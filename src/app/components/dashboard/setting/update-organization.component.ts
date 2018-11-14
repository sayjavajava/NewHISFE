import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';

import {AppConstants} from '../../../utils/app.constants';
import {Organization} from '../../../model/organization';
import {SelectItem} from "primeng/api";
import {DateFormatENUM} from "../../../enums/DateFormatEnum";



@Component({
    selector: 'addcashier-component',
    templateUrl: '../../../templates/dashboard/setting/update-organization.template.html',
})
export class UpdateOrganizationComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestsService,
                private fb: FormBuilder, private notificationService: NotificationService) {
        this.allTimezone();
        this.allBranches();
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
    accountForm: FormGroup
    // timezoneList: any = [];
    timezoneList: any=[];
    branchesList: any = [];
    organizationACCOUNT :any =[];
    organization : Organization = new Organization();
    defaultBranch: string = 'primaryBranch';
    specialtyList :any;
    countryLst:any=[];
    countryListModified: SelectItem[] = [];
    stateLst:any=[];
    stateLstModified:SelectItem[] = [];
    cityLst:any=[];
    cityLstModified:SelectItem[] = [];
    currency:string;
    dateFormat:DateFormatENUM[];
    dateFormatLst:SelectItem[] = [];
    //{name:'',value:''}[];
    dateType:any;
    timeType:any;
    currencyLabel:string;
    zoneType:any;
    zoneFormat:any;
    countryList: any[];
    stateList:any[];
    citiesList:any[];
    // selectedCountry:any;
    selectedCountry:string;
    selectedCity:string;
    selectedState:string;
    StateList:any[];
    cityList:any[];
    countryObj :{value:''}[] =[];
    //  ctry:any=[];
    //  @ViewChild('ddEditor') ddEditor : FormControl;
    /*static getNamesAndValues<T extends number>(e: any) {
        return DateFormatENUM.getname(e).map(n => ({ name: n, value: e[n] as T }));
    }*/

    // dateFormatLstModified:any=[];



    ngOnInit() {
        this.createProfileForm();
        this.createGenralForm();
        this.createAccountForm();

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

        });
        this.patchData();
        this.accountForm.controls['userName'].disable();
        /*this.ctry=this.selectedCountry;
        this.cityLstModified=this.ctry;*/
        //   alert(this.selectedCountry);
        //  this.proForm.controls['country'].setValue(this.selectedCountry);

        this.specialtyList = [
            {label: 'Anesthesiologists ', value: 'Anesthesiologists '},
            {label: 'Cardiologists ', value: 'Cardiologists '},
            {label: 'Dermatologists ', value: 'Dermatologists '},
            {label: 'Endocrinologists  ', value: 'Endocrinologists  '},
            {label: 'Gastroenterologists  ', value: 'Gastroenterologists  '}
        ];
        this.allCountries();
        this.getDateFormatList();
        this.dateType = [
            {label: 'dd-MM-yyyy',value:'dd-MM-yyyy'},
            {label: 'yyyy-MM-dd',value:'yyyy-MM-dd'},
            {label: 'MM-dd',value:'MM-dd'},
            {label: 'yyyy/MM/dd',value:'yyyy/MM/dd'},
            {label: 'dd/MM/YYYY',value:'dd/MM/YYYY'},
            {label: 'MM/dd',value:'MM/dd'}

        ];

        this.timeType = [
            {label: 'HHmm',value:'HH:mm'},
            {label: 'HHmmss',value:'HH:mm:ss'},
            {label: 'mmss',value:'mm:ss'}


        ];
        //  this.getAllStates();
        //   this.getAllCities();

    }

    createProfileForm() {
        this.proForm = this.fb.group({
                'companyEmail':  [null,Validators.compose([ Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
                'companyName': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
                'officePhone': [null, Validators.compose([Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
                'specialty': [null],
                'country':[null],
                'state':[null],
                'city':[null],
                'fax': [null],
                'currency':[null],
                'formName': ['PROFILE'],
                'address': [null],
                'website': [null, Validators.pattern('^(http:\\/\\/|https:\\/\\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}.?([a-z]+)?$')],
            }
        );
    }

    createGenralForm() {
        this.generalForm = this.fb.group({
            'defaultBranch': [null],
            'durationOfExam': [null],
            'durationFollowUp': [null],
            'prefixSerialPatient': [null],
            'prefixSerialUser': [null],
            'formName': ['GENERAL'],
            'prefixSerialDepartment': [null],
            'prefixSerialAppointment': [null],
            'prefixSerialInvoices': [null],
            'zoneFormat':[null],
            'dateFormat':[null],
            'timeFormat':[null],
        });
    }

    createAccountForm() {
        this.accountForm = this.fb.group({
            'firstName': [null],
            'userId':[null],
            'lastName': [null],
            'userName': [null],
            'userEmail': [null,Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
            'cellPhone': [null],
            'userAddress': [null],
            'formName': ['ACCOUNT'],
            'homePhone': [null],
            'country':[null],
            'state':[null],
            'city':[null],
        })
    }



    allBranches() {
        this.requestService.getRequest(AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchesList = response['responseData'];
                    }
                },
                (error: any) => {

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


    getStatesByCountryId(id: number) {
        this.stateList = this.citiesList = this.cityLstModified = this.citiesList = [];
        this.requestService.getRequest(AppConstants.GET_STATE_BYCOUNTRYID +id)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'STATE_SUC_11') {
                        this.stateLst = response['responseData'];

                        for (let state of this.stateLst) {
                            var pair: any = {label: state.name, value: state.id};
                            this.stateLstModified.push(pair);
                        }
                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
    }

    getCitiesByStateId(id: number) {

        this.citiesList = this.cityLstModified = [];

        this.requestService.getRequest(AppConstants.GET_STATE_BYCITYID + id)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CITY_SUC_11') {
                        this.cityLst = response['responseData'];
                        for (let city of this.cityLst) {
                            var pair: any = {label: city.name, value: city.id};
                            this.cityLstModified.push(pair);
                        }
                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
    }

    getAllStates() {
        // this.stateList = this.citiesList = this.cityLstModified = this.citiesList = [];
        debugger;
        this.requestService.getRequest(AppConstants.GET_STATE_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'STATE_SUC_11') {
                        this.StateList = response['responseData'];
                        for (let state of this.StateList) {
                            var pair: any = {label: state.name, value: state.id};
                            this.stateLstModified.push(pair);
                        }
                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
    }

    getAllCities() {

        //    this.citiesList = this.cityLstModified = [];
        debugger;
        this.requestService.getRequest(AppConstants.GET_CITY_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CITY_SUC_11') {
                        this.cityList = response['responseData'];

                        for (let city of this.cityList) {
                            var pair: any = {label: city.name, value: city.id};
                            this.cityLstModified.push(pair);
                        }
                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
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
                    //  this.id = user.id;
                     this.countryObj.push(organization.country),

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
                        selectedCountry:organization.country,
                        selectedCity:organization.city,
                        selectedState:organization.state,
                        country :organization.country
                        //   specialty: organization.speciality,

                    });
                    this.generalForm.patchValue({
                        defaultBranch: organization.defaultBranch,
                        durationOfExam: organization.durationOfExam,
                        durationFollowUp: organization.durationFollowUp,
                        dateFormat:organization.dateFormat,
                        timeFormat:organization.timeFormat,
                        zoneFormat:organization.zoneFormat


                    });

                    //  alert(this.selectedCountry);


                }, (error: any) => {
                    //console.log(error.json());
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
            this.requestService.putRequest(AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
                .subscribe(function (response) {
                    if (response['responseCode'] === 'ORG_SUC_03') {
                        self.notificationService.success('Organization has been Update Successfully');
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
        this.requestService.putRequest(AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
            .subscribe(function (response) {
                if (response['responseCode'] === 'ORG_SUC_03') {
                    self.notificationService.success('Organization has been Update Successfully');
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
                        self.notificationService.success('Organization has been Update Successfully');
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

    getSelectedBranch(value: any) {
        if (value) {
            this.generalForm.controls['defaultBranch'].setValue(value);
        }
    }

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

}