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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var requests_service_1 = require("../../../services/requests.service");
var notification_service_1 = require("../../../services/notification.service");
var app_constants_1 = require("../../../utils/app.constants");
var organization_1 = require("../../../model/organization");
require("rxjs/add/operator/toPromise");
var UpdateOrganizationComponent = (function () {
    function UpdateOrganizationComponent(route, router, requestService, fb, notificationService) {
        this.route = route;
        this.router = router;
        this.requestService = requestService;
        this.fb = fb;
        this.notificationService = notificationService;
        this.timezoneList = [];
        this.branchesList = [];
        this.organizationACCOUNT = [];
        this.organization = new organization_1.Organization();
        this.defaultBranch = 'primaryBranch';
        this.countryLst = [];
        this.stateLst = [];
        this.cityLst = [];
        this.dateFormatLst = [];
        this.countryListModified = [];
        this.statesListModified = [];
        this.citiesListModified = [];
        this.selectedCountry = [];
        this.selectedState = [];
        this.selectedCity = [];
        this.selectedTimeZoneFormat = [];
        this.timeZoneListModified = [];
        this.allTimezone();
        this.allBranches();
        this.getOrganizationAccount();
    }
    UpdateOrganizationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createProfileForm();
        this.createGenralForm();
        this.createAccountForm();
        this.allorganizationData();
        this.sub = this.route.params.subscribe(function (params) {
            _this.id = params['id'];
        });
        this.patchData();
        this.accountForm.controls['userName'].disable();
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
            { label: 'yyyy-dd-MM', value: 'yyyy-dd-MM' },
            { label: 'yyyy/MM/dd', value: 'yyyy/MM/dd' },
            { label: 'dd/MM/YYYY', value: 'dd/MM/YYYY' },
            { label: 'YYYY/dd/MM', value: 'YYYY/dd/MM' },
        ];
        this.timeType = [
            { label: 'HH:mm', value: 'HH:mm' },
            { label: 'HH:mm:ss a', value: 'HH:mm:ss a' },
            { label: 'HH:mm:ss', value: 'HH:mm:ss' },
        ];
    };
    UpdateOrganizationComponent.prototype.createProfileForm = function () {
        this.proForm = this.fb.group({
            'companyEmail': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
            'companyName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4)])],
            'officePhone': [null, forms_1.Validators.compose([forms_1.Validators.pattern('^[0-9+\\(\\)#\\.\\s\\/ext-]+$')])],
            'specialty': [null],
            'selectedCountry': [null],
            'selectedState': [null],
            'selectedCity': [null],
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
            'selectedTimeZoneFormat': [null],
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
            'selectedCountry': [null],
            'selectedState': [null],
            'selectedCity': [null],
            'currency': [null],
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
            _this.notificationService.error(error.error.error);
        });
    };
    UpdateOrganizationComponent.prototype.allorganizationData = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ORG_SUC_01') {
                _this.organizationDataList = response['responseData'];
            }
        }, function (error) {
            _this.notificationService.error(error.error.error);
        });
    };
    UpdateOrganizationComponent.prototype.allCountries = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.GET_ALL_COUNTRY)
            .subscribe(function (response) {
            if (response['responseCode'] === 'COUNTRY_SUC_11') {
                _this.countryLst = response['responseData'];
                for (var _i = 0, _a = _this.countryLst; _i < _a.length; _i++) {
                    var country = _a[_i];
                    var pair = { label: country.name, value: country.id };
                    _this.countryListModified.push(pair);
                }
            }
        }, function (error) {
            _this.notificationService.error(error.error.error);
        });
    };
    UpdateOrganizationComponent.prototype.getStatesById = function (id) {
        var _this = this;
        var listOfCountry = this.countryLst.filter(function (listing) { return listing.id === id; });
        this.currency = listOfCountry[0].currency;
        this.requestService.getRequest(app_constants_1.AppConstants.GET_STATE_BYCOUNTRYID + id)
            .subscribe(function (response) {
            if (response["responseCode"] === "STATE_SUC_11") {
                _this.stateLst = response['responseData'];
                for (var _i = 0, _a = _this.stateLst; _i < _a.length; _i++) {
                    var state = _a[_i];
                    var pair = { label: state.name, value: state.id };
                    _this.statesListModified.push(pair);
                }
            }
        }, function (error) {
            this.notificationService.error("ERROR", "States List is not available");
        });
    };
    UpdateOrganizationComponent.prototype.getCountryById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.requestService.getRequest(app_constants_1.AppConstants.GET_ALL_COUNTRYBYID + id)
                    .subscribe(function (response) {
                    if (response["responseCode"] === "COUNTRY_SUC_11") {
                        _this.currencyCountryLst = response['responseData'];
                        _this.currency = _this.currencyCountryLst.currency;
                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "Country is not available");
                });
                return [2 /*return*/];
            });
        });
    };
    UpdateOrganizationComponent.prototype.getCitiesById = function (id) {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.GET_CITY_BYSTATEID + id)
            .subscribe(function (response) {
            if (response["responseCode"] === "CITY_SUC_11") {
                _this.citiesList = response["responseData"];
                for (var _i = 0, _a = _this.citiesList; _i < _a.length; _i++) {
                    var city = _a[_i];
                    var pair = { label: city.name, value: city.id };
                    _this.citiesListModified.push(pair);
                }
            }
        }, function (error) {
            this.notificationService.error("ERROR", "Cities List is not available");
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
                _this.timezoneList = response['responseData'];
                for (var _i = 0, _a = _this.timezoneList; _i < _a.length; _i++) {
                    var zone = _a[_i];
                    //       var disPlayName=;
                    var pair = { label: zone.name + '' + zone.zoneTime, value: zone.zoneId };
                    _this.timeZoneListModified.push(pair);
                }
                _this.zoneFormat = _this.timezoneList;
            }
        }, function (error) {
        });
    };
    UpdateOrganizationComponent.prototype.patchData = function () {
        var _this = this;
        if (this.id) {
            this.requestService.findById(app_constants_1.AppConstants.FETCH_ORGANIZATION_BY_ID + this.id).subscribe(function (organization) {
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
                    selectedCountry: organization.addInfo.country,
                    selectedCity: organization.addInfo.city,
                    selectedState: organization.addInfo.state,
                    currency: organization.addInfo.Currency
                });
                _this.generalForm.patchValue({
                    defaultBranch: organization.defaultBranch,
                    durationOfExam: organization.durationOfExam,
                    durationFollowUp: organization.durationFollowUp,
                    dateFormat: organization.dateFormat,
                    timeFormat: organization.timeFormat,
                    selectedTimeZoneFormat: organization.addInfo.zoneFormat
                });
            }, function (error) {
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