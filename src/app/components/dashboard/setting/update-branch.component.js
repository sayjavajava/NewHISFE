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
var amazing_time_picker_1 = require("amazing-time-picker");
var app_constants_1 = require("../../../utils/app.constants");
var util_1 = require("util");
var UpdateBranchComponent = (function () {
    function UpdateBranchComponent(route, router, requestService, fb, notificationService, amazingTimePickerService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.requestService = requestService;
        this.fb = fb;
        this.notificationService = notificationService;
        this.amazingTimePickerService = amazingTimePickerService;
        this.branchesList = [];
        this.userSelected = "DOCTOR";
        this.pDoctor = [];
        this.defaultBranch = "primary";
        this.noOfRoom = 1;
        this.disable = true;
        this.countryListModified = [];
        this.statesListModified = [];
        this.citiesListModified = [];
        this.selectedCountry = [];
        this.selectedState = [];
        this.selectedCity = [];
        this.formattedAddress_Address = "";
        this.formattedAddress_ZipCode = "";
        this.formattedAddress_State = "";
        this.formattedAddress_City = "";
        this.formattedAddress_Country = "";
        this.formattedAddress = "";
        this.allRoomCount = function () {
            _this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ROOM_COUNT_OF_BRANCH + _this.id)
                .subscribe(function (response) {
                if (response["responseCode"] === "BRANCH_SUC_01") {
                    if (!util_1.isNullOrUndefined(response["responseData"])) {
                        _this.noOfRoom = response["responseData"].data;
                    }
                    if (_this.noOfRoom < 1) {
                        _this.noOfRoom = 1;
                    }
                    console.log("No of rooms: " + _this.noOfRoom);
                }
            }, function (error) {
                _this.error = error.error.error;
            });
        };
        this.requestService.getRequest(app_constants_1.AppConstants.USER_BY_ROLE + "?name=" + this.userSelected)
            .subscribe(function (response) {
            if (response["responseCode"] === "USER_SUC_01") {
                _this.pDoctor = response["responseData"];
            }
        }, function (error) {
            _this.error = error.error.error;
        });
        // this.allBranches();
    }
    UpdateBranchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createBranchForm();
        this.sub = this.route.params.subscribe(function (params) {
            _this.id = params["id"];
            console.log(_this.id);
        });
        this.createBillingForm();
        this.createScheduleForm();
        this.patchData();
        this.flowList = [
            { label: "RCND", value: "RCND" },
            { label: "2", value: 2 },
            { label: "3", value: 3 },
            { label: "4", value: 4 },
        ];
        this.getCityStateCntryByBranchId();
        this.createFormattedAddress();
    };
    UpdateBranchComponent.prototype.createBranchForm = function () {
        this.branchForm = this.fb.group({
            "branchName": [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4)])],
            "country": [null],
            "state": [null],
            "city": [null],
            "flow": [null],
            "countryId": [null],
            "stateId": [null],
            "cityId": [null],
            "primaryDoctor": [null],
            "zipCode": [null],
            "address": [null],
            "formattedAddress": [{ disabled: true }, forms_1.Validators.required],
            "officePhone": [null],
            "fax": [null],
            "officeHoursStart": [null, forms_1.Validators.required],
            "officeHoursEnd": [null, forms_1.Validators.required],
            "noOfExamRooms": [null],
            "examRooms": this.fb.array([this.createExamRoom()]),
            "selectedCountry": [null],
            "selectedState": [null],
            "selectedCity": [null],
        });
        // console.log(this.branchForm.controls);
        // console.log( ((this.branchForm.controls.examRooms as FormArray).controls[0] as FormGroup).controls.roomName.value );
    };
    UpdateBranchComponent.prototype.createBillingForm = function () {
        this.billingForm = this.fb.group({
            "billingBranch": [null],
            "billingName": [null],
            "billingTaxID": [null],
        });
    };
    UpdateBranchComponent.prototype.createScheduleForm = function () {
        this.scheduleForm = this.fb.group({
            "showBranchOnline": "",
            "allowOnlineSchedulingInBranch": "",
        });
    };
    UpdateBranchComponent.prototype.createExamRoom = function () {
        return this.fb.group({
            "roomName": "",
            "allowOnlineScheduling": "",
        });
    };
    UpdateBranchComponent.prototype.allBranches = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.BRANCHES_NAME)
            .subscribe(function (response) {
            if (response["responseCode"] === "BRANCH_SUC_01") {
                _this.branchesList = response["responseData"];
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    UpdateBranchComponent.prototype.patchData = function () {
        var _this = this;
        if (this.id) {
            this.requestService.findById(app_constants_1.AppConstants.FETCH_BRANCHES_BY_ID + this.id).subscribe(function (branch) {
                _this.branchForm.patchValue({
                    branchName: branch.branchName,
                    officeHoursStart: branch.officeHoursStart,
                    officeHoursEnd: branch.officeHoursEnd,
                    noOfExamRooms: branch.examRooms.length,
                    examRooms: branch.examRooms,
                    city: branch.city,
                    state: branch.city,
                    country: branch.city,
                    cityId: branch.cityId,
                    stateId: branch.stateId,
                    countryId: branch.countryId,
                    selectedCity: branch.city,
                    selectedState: branch.state,
                    selectedCountry: branch.country,
                    // primaryDoctor: branch.user.id,
                    fax: branch.fax,
                    address: branch.address,
                    formattedAddress: branch.formattedAddress,
                    zipCode: branch.zipCode,
                    officePhone: branch.officePhone,
                    flow: branch.flow,
                });
                _this.cityId = branch.cityId;
                _this.stateId = branch.stateId;
                _this.countryId = branch.countryId;
                _this.formattedAddress_Address = _this.checkFormattedAddressForNullOrEmpty(branch.address);
                _this.formattedAddress_ZipCode = _this.checkFormattedAddressForNullOrEmpty(branch.zipCode);
                _this.formattedAddress_City = _this.checkFormattedAddressForNullOrEmpty(branch.city);
                _this.formattedAddress_State = _this.checkFormattedAddressForNullOrEmpty(branch.state);
                _this.formattedAddress_Country = _this.checkFormattedAddressForNullOrEmpty(branch.country, true);
                _this.examRooms = branch.examRooms;
                _this.createFormattedAddress();
                /*     this.billingForm.patchValue({
                         billingBranch: branch.billingBranch,
                         billingName: branch.billingName,
                         billingTaxID: branch.billingTaxID

                     });

                     this.scheduleForm.patchValue({
                             showBranchOnline: branch.showBranchOnline,
                             allowOnlineSchedulingInBranch: branch.allowOnlineSchedulingInBranch,
                         }
                     );
                this.branchForm.controls["zipCode"].patchValue(branch.zipCode);
                this.branchForm.controls["formattedAddress"].patchValue(branch.formattedAddress);
                this.allRoomCount();
                this.branchForm.controls['examRooms'].patchValue(branch.examRooms);
                  branch.examRooms = this.noOfRoom;
                  */
                // this.addFields(branch.rooms);
                // console.log( this.branchForm.controls );
                // console.log( this.branchForm.controls.examRooms );
                // console.log( (this.branchForm.controls.examRooms as FormArray).controls[0] );
                // console.log( ((this.branchForm.controls.examRooms as FormArray).controls[0] as FormGroup).controls );
                // console.log( ((this.branchForm.controls.examRooms as FormArray).controls[0] as FormGroup).controls.roomName );
                // console.log( ((this.branchForm.controls.examRooms as FormArray).controls[0] as FormGroup).controls.roomName.value );
            }, function (error) {
                //console.log(error.json());
                _this.error = error.error.error_description;
            });
        }
    };
    UpdateBranchComponent.prototype.removeBranch = function () {
        var _this = this;
        this.branchesList.forEach(function (item, index) {
            if (item === _this.defaultBranch)
                _this.branchesList.splice(index, 1);
        });
    };
    UpdateBranchComponent.prototype.deleteField = function (index) {
        this.examRooms = this.branchForm.get("examRooms");
        this.noOfRoom = this.noOfRoom - 1;
        this.examRooms.removeAt(index);
    };
    UpdateBranchComponent.prototype.prepareSaveBranch = function () {
        var formModel = this.branchForm.value;
        var billingModel = this.billingForm.value;
        var scheduleModel = this.scheduleForm.value;
        var secretLairsDeepCopy = formModel.examRooms.map(function (examRooms) { return Object.assign({}, examRooms); });
        console.log(secretLairsDeepCopy);
        var saveBranchModel = {
            branchName: formModel.branchName,
            name: formModel.branchName,
            officeHoursStart: formModel.officeHoursStart,
            officeHoursEnd: formModel.officeHoursEnd,
            noOfExamRooms: formModel.noOfExamRooms,
            state: formModel.state,
            city: formModel.city,
            country: formModel.country,
            primaryDoctor: formModel.primaryDoctor,
            zipCode: formModel.zipCode,
            address: formModel.address,
            officePhone: formModel.officePhone,
            fax: formModel.fax,
            formattedAddress: formModel.formattedAddress,
            examRooms: secretLairsDeepCopy,
            billingBranch: billingModel.billingBranch,
            billingName: billingModel.billingName,
            billingTaxID: billingModel.billingTaxID,
            showBranchOnline: scheduleModel.showBranchOnline,
            allowOnlineSchedulingInBranch: scheduleModel.allowOnlineSchedulingInBranch
        };
        console.log(saveBranchModel);
        return saveBranchModel;
    };
    UpdateBranchComponent.prototype.addBranch = function (data) {
        var _this = this;
        // data["cityId"] = this.selectedCity;
        if (this.branchForm.valid) {
            //  let branchObject = this.prepareSaveBranch();
            var that = this;
            this.branchForm.value.cityId = this.branchForm.value.city;
            // data = this.branchForm;
            // data.set("cityId", data.get("city"));
            this.requestService.postRequest(app_constants_1.AppConstants.UPDATE_BRANCH + this.id, this.branchForm.value)
                .subscribe(function (response) {
                //that.router.navigate(["/dashboard/setting/branch"]);
                if (response["responseCode"] == "BRANCH_UPDATE_SUC_01") {
                    console.log("updated...");
                    that.notificationService.success(" Branch has been Updated Successfully");
                    that.router.navigate(["/dashboard/setting/branch"]);
                }
                if (response["responseCode"] === "BR_ALREADY_EXISTS_01") {
                    _this.notificationService.warn("Branch already Exists");
                    //  this.router.navigate(['/dashboard/setting/branch'])
                }
            }, function (error) {
                this.error = error.error.error_description;
                this.notificationService.error("ERROR", "Branch is not updated ");
            });
        }
        else {
            this.validateAllFormFields(this.branchForm);
            if (this.examRooms.length != 0) {
                /*let examRoomLen = this.examRooms.length;
                for (var i = 0; i < examRoomLen; i++) {
                   console.log(this.examRooms.controls(i).controls['roomName'].value);
                }*/
                this.notificationService.error("Fill exam room Properly");
            }
        }
    };
    UpdateBranchComponent.prototype.isFieldValid = function (field) {
        return !this.branchForm.get(field).valid && this.branchForm.get(field).touched;
    };
    UpdateBranchComponent.prototype.displayFieldCss = function (field) {
        return {
            "has-error": this.isFieldValid(field),
            "has-feedback": this.isFieldValid(field)
        };
    };
    UpdateBranchComponent.prototype.validateAllFormFields = function (formGroup) {
        var _this = this;
        Object.keys(formGroup.controls).forEach(function (field) {
            //console.log(field);
            var control = formGroup.get(field);
            if (control instanceof forms_1.FormControl) {
                control.markAsTouched({ onlySelf: true });
            }
            else if (control instanceof forms_1.FormGroup) {
                _this.validateAllFormFields(control);
            }
        });
    };
    UpdateBranchComponent.prototype.getOfficeHoursStart = function () {
        var _this = this;
        var amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(function (time) {
            _this.officeHoursStart = time;
            _this.branchForm.controls["officeHoursStart"].setValue(time);
        });
    };
    UpdateBranchComponent.prototype.getOfficeHoursEnd = function () {
        var _this = this;
        var amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(function (time) {
            _this.officeHoursEnd = time;
            _this.branchForm.controls["officeHoursEnd"].setValue(time);
        });
    };
    UpdateBranchComponent.prototype.getDoctor = function (value) {
        if (value) {
            this.branchForm.controls["primaryDoctor"].setValue(value);
        }
    };
    UpdateBranchComponent.prototype.getState = function (value) {
        if (value) {
            this.branchForm.controls["state"].setValue(value);
        }
    };
    UpdateBranchComponent.prototype.getBillingBranch = function (value) {
        if (value) {
            this.billingForm.controls["billingBranch"].setValue(value);
        }
    };
    UpdateBranchComponent.prototype.getZipCode = function (value) {
        if (value) {
            this.branchForm.controls["zipCode"].setValue(value);
        }
    };
    UpdateBranchComponent.prototype.getFormattedAddress = function (value) {
        if (value) {
            this.branchForm.controls["formattedAddress"].setValue(value);
        }
    };
    UpdateBranchComponent.prototype.getNoOfExamRooms = function (value) {
        if (value) {
            this.branchForm.controls["noOfExamRooms"].setValue(value);
            //  this.noOfExamRooms=value;
            this.addFields(value);
        }
    };
    UpdateBranchComponent.prototype.addFields = function (no) {
        this.removeAllFields();
        this.examRooms = this.branchForm.get("examRooms");
        for (var i = 0; i < no; i++) {
            this.examRooms.push(this.createExamRoom());
        }
    };
    UpdateBranchComponent.prototype.addValuesFields = function (no) {
        this.removeAllFields();
        this.examRooms = this.branchForm.get("examRooms");
        for (var i = 0; i < no; i++) {
            this.examRooms.push(this.createExamRoom());
        }
    };
    UpdateBranchComponent.prototype.removeAllFields = function () {
        this.examRooms = this.branchForm.get("examRooms");
        var examRoomLen = this.examRooms.length;
        for (var i = 0; i < examRoomLen; i++) {
            this.examRooms.removeAt(0);
        }
    };
    UpdateBranchComponent.prototype.createCountriesList = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_LIST_OF_COUNTRIES)
            .subscribe(function (response) {
            if (response["responseCode"] === "BRANCH_SUC_01") {
                _this.countryList = response["responseData"].data;
                for (var _i = 0, _a = _this.countryList; _i < _a.length; _i++) {
                    var country = _a[_i];
                    var pair = { label: country.name, value: country.id };
                    _this.countryListModified.push(pair);
                }
            }
        }, function (error) {
            this.notificationService.error("ERROR", "Countries List is not available");
        });
    };
    UpdateBranchComponent.prototype.getStatesByCountryId = function (countryId) {
        var _this = this;
        this.statesList = this.citiesList = this.statesListModified = this.citiesListModified = [];
        // this.cityId = this.selectedCity;
        this.cityId = !(util_1.isNullOrUndefined(this.city)) ? this.city.id : null;
        this.stateId = !(util_1.isNullOrUndefined(this.state)) ? this.state.id : null;
        this.countryId = countryId;
        // this.countryId = !(isNullOrUndefined(this.country)) ? this.country.id : null;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_LIST_OF_STATES_BY_CNTRY_ID + countryId)
            .subscribe(function (response) {
            if (response["responseCode"] === "BRANCH_SUC_01") {
                _this.statesList = response["responseData"].data;
                for (var _i = 0, _a = _this.statesList; _i < _a.length; _i++) {
                    var state = _a[_i];
                    var pair = { label: state.name, value: state.id };
                    _this.statesListModified.push(pair);
                }
            }
            else {
                _this.formattedAddress_City = _this.checkFormattedAddressForNullOrEmpty("N/A");
                _this.formattedAddress_State = _this.checkFormattedAddressForNullOrEmpty("N/A");
            }
        }, function (error) {
            this.notificationService.error("ERROR", "States List is not available");
        });
        this.countryChange(countryId);
    };
    UpdateBranchComponent.prototype.getCitiesByStateId = function (stateId) {
        var _this = this;
        this.citiesList = this.citiesListModified = [];
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_LIST_OF_CITIES_BY_STATE_ID + stateId)
            .subscribe(function (response) {
            if (response["responseCode"] === "BRANCH_SUC_01") {
                _this.citiesList = response["responseData"].data;
                for (var _i = 0, _a = _this.citiesList; _i < _a.length; _i++) {
                    var city = _a[_i];
                    var pair = { label: city.name, value: city.id };
                    _this.citiesListModified.push(pair);
                }
            }
            else {
                _this.formattedAddress_City = _this.checkFormattedAddressForNullOrEmpty("N/A");
            }
        }, function (error) {
            this.notificationService.error("ERROR", "Cities List is not available");
        });
        this.stateChange(stateId);
    };
    UpdateBranchComponent.prototype.selectBranchCity = function (city) {
        this.city = city;
        this.cityId = city;
        this.cityChange(city);
    };
    UpdateBranchComponent.prototype.getCityStateCntryByBranchId = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_CITY_STATE_CNTRY_BY_BR_ID + this.id)
            .subscribe(function (response) {
            if (response["responseCode"] === "BRANCH_SUC_01") {
                _this.city = response["responseData"].data.city;
                _this.state = response["responseData"].data.state;
                _this.country = response["responseData"].data.country;
                _this.createCountriesList();
                if (!util_1.isNullOrUndefined(_this.country)) {
                    _this.selectedCountry = _this.country.name;
                    _this.countryId = _this.country.id;
                    _this.getStatesByCountryId(_this.countryId);
                    _this.formattedAddress_Country = _this.checkFormattedAddressForNullOrEmpty(_this.country.name, true);
                }
                if (!util_1.isNullOrUndefined(_this.state)) {
                    _this.selectedState = _this.state.name;
                    _this.stateId = _this.state.id;
                    _this.getCitiesByStateId(_this.stateId);
                    _this.formattedAddress_State = _this.checkFormattedAddressForNullOrEmpty(_this.state.name);
                }
                if (!util_1.isNullOrUndefined(_this.city)) {
                    _this.selectedCity = _this.city.name;
                    _this.cityId = _this.city.id;
                    _this.formattedAddress_City = _this.checkFormattedAddressForNullOrEmpty(_this.city.name);
                }
                _this.createFormattedAddress();
            }
        }, function (error) {
            this.notificationService.error("ERROR", "CIty State Country for branch is/are not available");
        });
    };
    UpdateBranchComponent.prototype.cancel = function () {
        this.router.navigate(["/dashboard/setting/branch"]);
    };
    UpdateBranchComponent.prototype.addressChange = function (value) {
        // console.log(value);
        this.formattedAddress_Address = this.checkFormattedAddressForNullOrEmpty(value);
        this.createFormattedAddress();
    };
    UpdateBranchComponent.prototype.zipCodeChange = function (value) {
        this.formattedAddress_ZipCode = this.checkFormattedAddressForNullOrEmpty(value);
        this.createFormattedAddress();
    };
    UpdateBranchComponent.prototype.stateChange = function (stateId) {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.GET_STATE_BY_ID + stateId)
            .subscribe(function (response) {
            if (response["responseCode"] === "STATE_SUC_11") {
                _this.state = response["responseData"];
                _this.formattedAddress_State = _this.checkFormattedAddressForNullOrEmpty(_this.state.name);
                _this.createFormattedAddress();
            }
            else {
                _this.formattedAddress_State = "N/A";
            }
        }, function (error) {
            this.notificationService.error("ERROR", "State is not available");
            this.formattedAddress_State = "N/A";
        });
    };
    UpdateBranchComponent.prototype.cityChange = function (cityId) {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.GET_CITY_BY_ID + cityId)
            .subscribe(function (response) {
            if (response["responseCode"] === "CITY_SUC_11") {
                _this.city = response["responseData"];
                console.log(_this.state);
                _this.formattedAddress_City = _this.checkFormattedAddressForNullOrEmpty(_this.city.name);
                _this.createFormattedAddress();
            }
            else {
                _this.formattedAddress_City = "N/A";
            }
        }, function (error) {
            this.notificationService.error("ERROR", "City is not available");
            this.formattedAddress_City = "N/A";
        });
    };
    UpdateBranchComponent.prototype.countryChange = function (countryId) {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.GET_COUNTRY_BY_ID + countryId)
            .subscribe(function (response) {
            if (response["responseCode"] === "COUNTRY_SUC_11") {
                _this.country = response["responseData"];
                // console.log(this.country);
                _this.formattedAddress_Country = _this.checkFormattedAddressForNullOrEmpty(_this.country.name, true);
            }
            else {
                _this.formattedAddress_City = "N/A";
                _this.formattedAddress_State = "N/A";
            }
        }, function (error) {
            this.notificationService.error("ERROR", "Country is not available");
            this.formattedAddress_City = "N/A";
            this.formattedAddress_State = "N/A";
        });
        this.createFormattedAddress();
    };
    UpdateBranchComponent.prototype.checkFormattedAddressForNullOrEmpty = function (value, isCountry) {
        if (!util_1.isNullOrUndefined(value) && value.trim() != "") {
            if (isCountry) {
                return value;
            }
            else {
                return value + ", ";
            }
        }
        return "";
    };
    UpdateBranchComponent.prototype.createFormattedAddress = function () {
        this.formattedAddress = this.formattedAddress_Address + this.formattedAddress_ZipCode + this.formattedAddress_State
            + this.formattedAddress_City + this.formattedAddress_Country;
        this.branchForm.controls["formattedAddress"].setValue(this.formattedAddress);
    };
    UpdateBranchComponent = __decorate([
        core_1.Component({
            selector: "update-branch-component",
            templateUrl: "../../../templates/dashboard/setting/update-branch.template.html",
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            router_1.Router,
            requests_service_1.RequestsService,
            forms_1.FormBuilder,
            notification_service_1.NotificationService,
            amazing_time_picker_1.AmazingTimePickerService])
    ], UpdateBranchComponent);
    return UpdateBranchComponent;
}());
exports.UpdateBranchComponent = UpdateBranchComponent;
//# sourceMappingURL=update-branch.component.js.map