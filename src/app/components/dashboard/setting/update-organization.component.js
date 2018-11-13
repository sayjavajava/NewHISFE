"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var requests_service_1 = require("../../../services/requests.service");
var notification_service_1 = require("../../../services/notification.service");
var app_constants_1 = require("../../../utils/app.constants");
var organization_1 = require("../../../model/organization");
var UpdateOrganizationComponent = (function () {
    function UpdateOrganizationComponent(route, router, requestService, fb, notificationService) {
        this.route = route;
        this.router = router;
        this.requestService = requestService;
        this.fb = fb;
        this.notificationService = notificationService;
        // timezoneList: any = [];
        this.timezoneList = [];
        this.branchesList = [];
        this.organizationACCOUNT = [];
        this.organization = new organization_1.Organization();
        this.defaultBranch = 'primaryBranch';
        this.countryLst = [];
        this.countryListModified = [];
        this.stateLst = [];
        this.stateLstModified = [];
        this.cityLst = [];
        this.cityLstModified = [];
        this.dateFormatLst = [];
        this.allTimezone();
        this.allBranches();
        this.getOrganizationAccount();
    }
    //  ctry:any=[];
    //  @ViewChild('ddEditor') ddEditor : FormControl;
    /*static getNamesAndValues<T extends number>(e: any) {
        return DateFormatENUM.getname(e).map(n => ({ name: n, value: e[n] as T }));
    }*/
    // dateFormatLstModified:any=[];
    UpdateOrganizationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createProfileForm();
        this.createGenralForm();
        this.createAccountForm();
        this.sub = this.route.params.subscribe(function (params) {
            _this.id = params['id'];
        });
        this.patchData();
        this.accountForm.controls['userName'].disable();
        /*this.ctry=this.selectedCountry;
        this.cityLstModified=this.ctry;*/
        //   alert(this.selectedCountry);
        //  this.proForm.controls['country'].setValue(this.selectedCountry);
        this.specialtyList = [
            { label: 'Anesthesiologists ', value: 'Anesthesiologists ' },
            { label: 'Cardiologists ', value: 'Cardiologists ' },
            { label: 'Dermatologists ', value: 'Dermatologists ' },
            { label: 'Endocrinologists  ', value: 'Endocrinologists  ' },
            { label: 'Gastroenterologists  ', value: 'Gastroenterologists  ' }
        ];
        this.allCountries();
        this.getDateFormatList();
        this.dateType = [
            { label: 'dd-MM-yyyy', value: 'dd-MM-yyyy' },
            { label: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
            { label: 'MM-dd', value: 'MM-dd' },
            { label: 'yyyy/MM/dd', value: 'yyyy/MM/dd' },
            { label: 'dd/MM/YYYY', value: 'dd/MM/YYYY' },
            { label: 'MM/dd', value: 'MM/dd' }
        ];
        this.timeType = [
            { label: 'HHmm', value: 'HH:mm' },
            { label: 'HHmmss', value: 'HH:mm:ss' },
            { label: 'mmss', value: 'mm:ss' }
        ];
        //  this.getAllStates();
        //   this.getAllCities();
    };
    UpdateOrganizationComponent.prototype.createProfileForm = function () {
        this.proForm = this.fb.group({
            'companyEmail': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
            'companyName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4)])],
            'officePhone': [null, forms_1.Validators.compose([forms_1.Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
            'specialty': [null],
            'country': [null],
            'state': [null],
            'city': [null],
            'fax': [null],
            'currency': [null],
            'formName': ['PROFILE'],
            'address': [null],
            'website': [null, forms_1.Validators.pattern('^(http:\\/\\/|https:\\/\\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}.?([a-z]+)?$')],
        });
    };
    UpdateOrganizationComponent.prototype.createGenralForm = function () {
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
            'zoneFormat': [null],
            'dateFormat': [null],
            'timeFormat': [null],
        });
    };
    UpdateOrganizationComponent.prototype.createAccountForm = function () {
        this.accountForm = this.fb.group({
            'firstName': [null],
            'userId': [null],
            'lastName': [null],
            'userName': [null],
            'userEmail': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
            'cellPhone': [null],
            'userAddress': [null],
            'formName': ['ACCOUNT'],
            'homePhone': [null],
            'country': [null],
            'state': [null],
            'city': [null],
        });
    };
    UpdateOrganizationComponent.prototype.allBranches = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branchesList = response['responseData'];
            }
        }, function (error) {
        });
    };
    UpdateOrganizationComponent.prototype.allCountries = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.GET_ALL_COUNTRY)
            .subscribe(function (response) {
            debugger;
            if (response['responseCode'] === 'COUNTRY_SUC_11') {
                debugger;
                _this.countryLst = response['responseData'];
                debugger;
                for (var _i = 0, _a = _this.countryLst; _i < _a.length; _i++) {
                    var country = _a[_i];
                    var pair = { label: country.name, value: country.id };
                    _this.countryListModified.push(pair);
                }
                debugger;
            }
        }, function (error) {
            _this.notificationService.error(error.error.error);
        });
    };
    UpdateOrganizationComponent.prototype.getStatesByCountryId = function (id) {
        var _this = this;
        this.stateList = this.citiesList = this.cityLstModified = this.citiesList = [];
        debugger;
        this.requestService.getRequest(app_constants_1.AppConstants.GET_STATE_BYCOUNTRYID + id)
            .subscribe(function (response) {
            debugger;
            if (response['responseCode'] === 'STATE_SUC_11') {
                _this.stateLst = response['responseData'];
                debugger;
                for (var _i = 0, _a = _this.stateLst; _i < _a.length; _i++) {
                    var state = _a[_i];
                    var pair = { label: state.name, value: state.id };
                    _this.stateLstModified.push(pair);
                }
            }
        }, function (error) {
            _this.notificationService.error(error.error.error);
        });
    };
    UpdateOrganizationComponent.prototype.getCitiesByStateId = function (id) {
        var _this = this;
        this.citiesList = this.cityLstModified = [];
        debugger;
        this.requestService.getRequest(app_constants_1.AppConstants.GET_STATE_BYCITYID + id)
            .subscribe(function (response) {
            if (response['responseCode'] === 'CITY_SUC_11') {
                debugger;
                _this.cityLst = response['responseData'];
                for (var _i = 0, _a = _this.cityLst; _i < _a.length; _i++) {
                    var city = _a[_i];
                    var pair = { label: city.name, value: city.id };
                    _this.cityLstModified.push(pair);
                }
            }
        }, function (error) {
            _this.notificationService.error(error.error.error);
        });
    };
    UpdateOrganizationComponent.prototype.getAllStates = function () {
        var _this = this;
        // this.stateList = this.citiesList = this.cityLstModified = this.citiesList = [];
        debugger;
        this.requestService.getRequest(app_constants_1.AppConstants.GET_STATE_URL)
            .subscribe(function (response) {
            debugger;
            if (response['responseCode'] === 'STATE_SUC_11') {
                _this.StateList = response['responseData'];
                debugger;
                for (var _i = 0, _a = _this.StateList; _i < _a.length; _i++) {
                    var state = _a[_i];
                    var pair = { label: state.name, value: state.id };
                    _this.stateLstModified.push(pair);
                }
            }
        }, function (error) {
            _this.notificationService.error(error.error.error);
        });
    };
    UpdateOrganizationComponent.prototype.getAllCities = function () {
        var _this = this;
        //    this.citiesList = this.cityLstModified = [];
        debugger;
        this.requestService.getRequest(app_constants_1.AppConstants.GET_CITY_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'CITY_SUC_11') {
                debugger;
                _this.cityList = response['responseData'];
                for (var _i = 0, _a = _this.cityList; _i < _a.length; _i++) {
                    var city = _a[_i];
                    var pair = { label: city.name, value: city.id };
                    _this.cityLstModified.push(pair);
                }
            }
        }, function (error) {
            _this.notificationService.error(error.error.error);
        });
    };
    UpdateOrganizationComponent.prototype.getOrganizationAccount = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ORG_ACCOUNT_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ORG_SUC_04') {
                _this.organization = response['responseData'];
            }
        }, function (error) {
        });
    };
    UpdateOrganizationComponent.prototype.getDateFormatList = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.GET_ALL_DATEFORMAT)
            .subscribe(function (response) {
            if (response['responseCode'] === 'DATEFORMAT_SUC_11') {
                debugger;
                _this.dateFormat = response['responseData'];
                for (var _i = 0, _a = _this.dateFormat; _i < _a.length; _i++) {
                    var dateFormatLst = _a[_i];
                    var pair = { label: dateFormatLst.toString(), value: dateFormatLst.toString() };
                    _this.dateFormatLst.push(pair);
                }
            }
        }, function (error) {
        });
    };
    UpdateOrganizationComponent.prototype.allTimezone = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.ZONE_FETCH_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'TZ_SUC_01') {
                debugger;
                _this.timezoneList = response['responseData'];
                debugger;
                _this.zoneFormat = _this.timezoneList;
                console.log(_this.zoneFormat);
                debugger;
            }
        }, function (error) {
        });
    };
    UpdateOrganizationComponent.prototype.patchData = function () {
        var _this = this;
        if (this.id) {
            this.requestService.findById(app_constants_1.AppConstants.FETCH_ORGANIZATION_BY_ID + this.id).subscribe(function (organization) {
                //  this.id = user.id;
                _this.proForm.patchValue({
                    userName: organization.userName,
                    companyEmail: organization.companyEmail,
                    fax: organization.fax,
                    countryName: organization.countryName,
                    homePhone: organization.homePhone,
                    officePhone: organization.officePhone,
                    address: organization.address,
                    website: organization.website,
                    companyName: organization.companyName,
                    specialty: organization.speciality,
                    selectedCountry: organization.country,
                    selectedCity: organization.city,
                    selectedState: organization.state
                    //   specialty: organization.speciality,
                });
                _this.generalForm.patchValue({
                    defaultBranch: organization.defaultBranch,
                    durationOfExam: organization.durationOfExam,
                    durationFollowUp: organization.durationFollowUp,
                    dateFormat: organization.dateFormat,
                    timeFormat: organization.timeFormat,
                    zoneFormat: organization.zoneFormat
                });
                //  alert(this.selectedCountry);
            }, function (error) {
                //console.log(error.json());
                _this.error = error.error.error_description;
            });
        }
    };
    UpdateOrganizationComponent.prototype.isFieldValid = function (field) {
        return !this.proForm.get(field).valid && this.proForm.get(field).touched;
    };
    UpdateOrganizationComponent.prototype.displayFieldCss = function (field) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    };
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
    UpdateOrganizationComponent.prototype.saveProfile = function (data) {
        if (this.proForm.valid) {
            var self = this;
            this.requestService.putRequest(app_constants_1.AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ORG_SUC_03') {
                    self.notificationService.success('Organization has been Update Successfully');
                }
            }, function (error) {
                self.notificationService.error('ERROR', 'Organization is not Updated');
            });
        }
        else {
            this.validateAllFormFields(this.proForm);
        }
    };
    UpdateOrganizationComponent.prototype.saveGeneralSettings = function (data) {
        var self = this;
        this.requestService.putRequest(app_constants_1.AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ORG_SUC_03') {
                self.notificationService.success('Organization has been Update Successfully');
            }
        }, function (error) {
            self.notificationService.error('ERROR', 'Organization is not Updated');
        });
    };
    UpdateOrganizationComponent.prototype.saveAccount = function (data) {
        var self = this;
        if (this.accountForm.valid) {
            //account url can be change
            this.requestService.putRequest(app_constants_1.AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ORG_SUC_03') {
                    self.notificationService.success('Organization has been Update Successfully');
                }
            }, function (error) {
                self.notificationService.error('ERROR', 'Organization is not Updated');
            });
        }
        else {
            this.validateAllFormFields(this.accountForm);
        }
    };
    UpdateOrganizationComponent.prototype.getSelected = function (value) {
        if (value) {
            this.organization.zoneId = value;
            console.log(value);
        }
    };
    UpdateOrganizationComponent.prototype.getSelectedBranch = function (value) {
        if (value) {
            this.generalForm.controls['defaultBranch'].setValue(value);
        }
    };
    UpdateOrganizationComponent.prototype.getDurationOfExam = function (value) {
        if (value) {
            this.generalForm.controls['durationOfExam'].setValue(value);
        }
    };
    UpdateOrganizationComponent.prototype.validateAllFormFields = function (formGroup) {
        var _this = this;
        //console.log(field);
        Object.keys(formGroup.controls).forEach(function (field) {
            var control = formGroup.get(field);
            if (control instanceof forms_1.FormControl) {
                control.markAsTouched({ onlySelf: true });
            }
            else if (control instanceof forms_1.FormGroup) {
                _this.validateAllFormFields(control);
            }
        });
    };
    UpdateOrganizationComponent.prototype.cancel = function () {
        this.router.navigate(['/dashboard/setting/organization']);
    };
    UpdateOrganizationComponent = __decorate([
        core_1.Component({
            selector: 'addcashier-component',
            templateUrl: '../../../templates/dashboard/setting/update-organization.template.html',
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, requests_service_1.RequestsService,
            forms_1.FormBuilder, notification_service_1.NotificationService])
    ], UpdateOrganizationComponent);
    return UpdateOrganizationComponent;
}());
exports.UpdateOrganizationComponent = UpdateOrganizationComponent;
//# sourceMappingURL=update-organization.component.js.map