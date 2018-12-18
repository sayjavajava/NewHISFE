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
var requests_service_1 = require("../../../services/requests.service");
var router_1 = require("@angular/router");
var notification_service_1 = require("../../../services/notification.service");
var amazing_time_picker_1 = require("amazing-time-picker");
var app_constants_1 = require("../../../utils/app.constants");
var organization_1 = require("../../../model/organization");
var AddBranchComponent = (function () {
    function AddBranchComponent(router, requestService, fb, notificationService, amazingTimePickerService) {
        var _this = this;
        this.router = router;
        this.requestService = requestService;
        this.fb = fb;
        this.notificationService = notificationService;
        this.amazingTimePickerService = amazingTimePickerService;
        this.examRooms = [];
        this.officeHoursStart = "07:00:00 AM";
        this.officeHoursEnd = "17:00:00 PM";
        this.userSelected = "doctor";
        this.organization = new organization_1.Organization();
        this.branchesList = [];
        // defaultDoctor:string='primarydoctor';
        this.defaultBranch = "primaryBranch";
        this.noOfRoom = 1;
        this.countryListModified = [];
        this.statesListModified = [];
        this.citiesListModified = [];
        this.createCountriesList();
        this.requestService.getRequest(app_constants_1.AppConstants.BRANCH_ORGANIZATION)
            .subscribe(function (response) {
            if (response["responseStatus"] === "SUCCESS") {
                _this.organization = response["responseData"];
            }
        }, function (error) {
            _this.error = error.error.error;
        });
        // this.allBranches();
    }
    AddBranchComponent.prototype.ngOnInit = function () {
        this.createBranchMandatoryForm();
        this.createBranchForm();
        this.createScheduleForm();
        this.allorganizationData();
        this.branchForm.controls["companyName"].disable();
        this.noOfRoomsList = [
            { label: "1", value: 1 },
            { label: "2", value: 2 },
            { label: "3", value: 3 },
            { label: "4", value: 4 },
            { label: "5", value: 5 },
            { label: "6", value: 6 },
            { label: "7", value: 7 },
            { label: "8", value: 8 },
            { label: "9", value: 9 },
            { label: "10", value: 10 },
            { label: "15", value: 15 },
            { label: "20", value: 20 },
            { label: "25", value: 25 },
            { label: "30", value: 30 },
            { label: "35", value: 35 },
            { label: "40", value: 40 },
        ];
        this.flowList = [
            { label: "RCND", value: "RCND" },
            { label: "2", value: 2 },
            { label: "3", value: 3 },
            { label: "4", value: 4 },
        ];
    };
    AddBranchComponent.prototype.createBranchForm = function () {
        this.billingForm = this.fb.group({
            "billingBranch": [null],
            "billingName": [null],
            "billingTaxID": [null],
        });
    };
    AddBranchComponent.prototype.createScheduleForm = function () {
        this.scheduleForm = this.fb.group({
            "showBranchOnline": "",
            "allowOnlineSchedulingInBranch": "",
        });
    };
    AddBranchComponent.prototype.allorganizationData = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ORG_SUC_01') {
                _this.organizationDataList = response['responseData'];
                console.log(_this.organizationDataList);
                _this.timeFormat = _this.organizationDataList.timeFormat;
            }
        }, function (error) {
            _this.notificationService.error(error.error.error);
        });
    };
    AddBranchComponent.prototype.createBranchMandatoryForm = function () {
        this.branchForm = this.fb.group({
            "companyName": [null],
            "flow": [null, forms_1.Validators.compose([forms_1.Validators.required])],
            "branchName": [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4)])],
            "countryId": [null],
            "stateId": [null],
            "cityId": [null],
            "primaryDoctor": [null],
            "zipCode": [null],
            "address": [null],
            "officePhone": [null],
            "fax": [null],
            "formattedAddress": [null],
            "officeHoursStart": [this.officeHoursStart, forms_1.Validators.compose([forms_1.Validators.required])],
            "officeHoursEnd": [this.officeHoursEnd, forms_1.Validators.compose([forms_1.Validators.required])],
            "noOfExamRooms": [null, forms_1.Validators.compose([forms_1.Validators.required])],
            "examRooms": this.fb.array([this.createExamRoom()]),
        });
        this.examRooms.push(this.createExamRoom());
    };
    /*    removeDoctor(){
            this.pDoctor.forEach( (item: any, index :any) => {
                if(item.userName === this.defaultDoctor) this.pDoctor.splice(index,1);
            });
        }*/
    AddBranchComponent.prototype.getSelectedStates = function (countryObj) {
        var country = countryObj.value;
        // this.cities = this.countryList.find((x: any) => x.name == country).cities;
        this.branchForm.controls["country"].setValue(country);
    };
    AddBranchComponent.prototype.removeBranch = function () {
        var _this = this;
        this.branchesList.forEach(function (item, index) {
            if (item === _this.defaultBranch)
                _this.branchesList.splice(index, 1);
        });
    };
    AddBranchComponent.prototype.prepareSaveBranch = function () {
        var formModel = this.branchForm.value;
        var billingModel = this.billingForm.value;
        var scheduleModel = this.scheduleForm.value;
        var secretLairsDeepCopy = formModel.examRooms.map(function (examRooms) { return Object.assign({}, examRooms); });
        var saveBranchModel = {
            branchName: formModel.branchName,
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
        return saveBranchModel;
    };
    /* allBranches() {
         this.requestService.getRequest(AppConstants.BRANCHES_NAME)
             .subscribe(
                 (response: Response) => {
                     if (response["responseCode"] === "BRANCH_SUC_01") {
                         this.branchesList = response["responseData"];
                         if (this.branchesList.length > 1) {
                             this.removeBranch();
                         }
 
                     }
                 },
                 (error: any) => {
                     this.error = error.error.error;
                 })
     }*/
    AddBranchComponent.prototype.addBranch = function (data) {
        var _this = this;
        if (this.branchForm.valid) {
            // let branchObject = this.prepareSaveBranch();
            this.requestService.postRequest(app_constants_1.AppConstants.ADD_BRANCH, data)
                .subscribe(function (response) {
                if (response["responseCode"] === "BRANCH_ADD_SUCCESS_01") {
                    _this.notificationService.success("Branch is Created Successfully");
                    _this.router.navigate(["/dashboard/setting/branch"]);
                }
                else if (response["responseCode"] === "BR_ALREADY_EXISTS_01") {
                    _this.notificationService.warn("Branch already Exists");
                    //  this.router.navigate(['/dashboard/setting/branch'])
                }
            }, function () {
                console.clear();
                this.notificationService.error("ERROR", "Branch is not Created");
            });
        }
        else {
            this.validateAllFormFields(this.branchForm);
            if (this.examRooms.length == 0) {
                /*let examRoomLen = this.examRooms.length;
                for (var i = 0; i < examRoomLen; i++) {
                   console.log(this.examRooms.controls(i).controls['roomName'].value);
                }*/
                this.notificationService.error("Fill Form Properly");
            }
            if (this.officeHoursStart.length == 0) {
                this.notificationService.error("Please provide branch start time");
            }
            if (this.officeHoursEnd.length == 0) {
                this.notificationService.error("Please provide branch closing time");
            }
        }
    };
    AddBranchComponent.prototype.validateAllFormFields = function (formGroup) {
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
    AddBranchComponent.prototype.createExamRoom = function () {
        return this.fb.group({
            "roomName": [null, forms_1.Validators.compose([forms_1.Validators.required])],
            "allowOnlineScheduling": "",
        });
    };
    AddBranchComponent.prototype.addFields = function (no) {
        this.removeAllFields();
        this.examRooms = this.branchForm.get("examRooms");
        for (var i = 0; i < no; i++) {
            this.examRooms.push(this.createExamRoom());
        }
    };
    AddBranchComponent.prototype.removeAllFields = function () {
        this.examRooms = this.branchForm.get("examRooms");
        var examRoomLen = this.examRooms.length;
        for (var i = 0; i < examRoomLen; i++) {
            this.examRooms.removeAt(0);
        }
    };
    AddBranchComponent.prototype.deleteField = function (index) {
        this.examRooms = this.branchForm.get("examRooms");
        this.noOfRoom = this.noOfRoom - 1;
        this.examRooms.removeAt(index);
    };
    AddBranchComponent.prototype.getOfficeHoursStart = function () {
        var _this = this;
        var amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(function (time) {
            _this.officeHoursStart = time;
            _this.branchForm.controls["officeHoursStart"].setValue(time);
        });
    };
    AddBranchComponent.prototype.getOfficeHoursEnd = function () {
        var _this = this;
        var amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(function (time) {
            _this.officeHoursEnd = time;
            _this.branchForm.controls["officeHoursEnd"].setValue(time);
        });
    };
    AddBranchComponent.prototype.getDoctor = function (value) {
        if (value) {
            this.branchForm.controls["primaryDoctor"].setValue(value);
        }
    };
    AddBranchComponent.prototype.getState = function (value) {
        if (value) {
            this.branchForm.controls["state"].setValue(value);
        }
    };
    AddBranchComponent.prototype.getZipCode = function (value) {
        if (value) {
            this.branchForm.controls["zipCode"].setValue(value);
        }
    };
    AddBranchComponent.prototype.getNoOfExamRooms = function (room) {
        var value = room.value;
        if (value) {
            this.noOfRoom = value;
            this.branchForm.controls["noOfExamRooms"].setValue(value);
            //  this.noOfExamRooms=value;
            this.addFields(value);
        }
    };
    AddBranchComponent.prototype.getSelectedBranch = function (value) {
        if (value) {
            this.billingForm.controls["billingBranch"].setValue(value);
        }
    };
    AddBranchComponent.prototype.createCountriesList = function () {
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
    AddBranchComponent.prototype.getStatesByCountryId = function (countryId) {
        var _this = this;
        this.statesList = this.citiesList = this.statesListModified = this.citiesListModified = [];
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
        }, function (error) {
            this.notificationService.error("ERROR", "States List is not available");
        });
    };
    AddBranchComponent.prototype.getCitiesByStateId = function (stateId) {
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
        }, function (error) {
            this.notificationService.error("ERROR", "Cities List is not available");
        });
    };
    AddBranchComponent.prototype.selectBranchCity = function (cityId) {
        this.branchCity = cityId;
        // console.log("Branch City ID: " + this.branchCity);
    };
    AddBranchComponent.prototype.cancel = function () {
        this.router.navigate(["/dashboard/setting/branch"]);
    };
    AddBranchComponent = __decorate([
        core_1.Component({
            selector: "addbranch-component",
            templateUrl: "../../../templates/dashboard/setting/addbranch.template.html",
        }),
        __metadata("design:paramtypes", [router_1.Router, requests_service_1.RequestsService,
            forms_1.FormBuilder, notification_service_1.NotificationService,
            amazing_time_picker_1.AmazingTimePickerService])
    ], AddBranchComponent);
    return AddBranchComponent;
}());
exports.AddBranchComponent = AddBranchComponent;
//# sourceMappingURL=addbranch.component.js.map