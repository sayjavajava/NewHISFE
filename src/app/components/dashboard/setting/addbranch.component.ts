import {Component, OnInit} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";
import {Branch} from "../../../model/branch";
import {AmazingTimePickerService} from "amazing-time-picker";
import {AppConstants} from "../../../utils/app.constants";
import {ExamRooms} from "../../../model/ExamRooms";
import {Organization} from "../../../model/organization";
import {SelectItem} from "primeng/components/common/selectitem";
import {isNullOrUndefined} from "util";
import {Country} from "../../../model/Country";
import {State} from "../../../model/State";
import {City} from "../../../model/City";

@Component({
    selector: "addbranch-component",
    templateUrl: "../../../templates/dashboard/setting/addbranch.template.html",
})
export class AddBranchComponent implements OnInit {
    error: any;
    branchForm: FormGroup;
    examRooms: any = [];
    officeHoursStart: string = "07:00:00 AM";
    officeHoursEnd: string = "17:00:00 PM";
    userSelected: string = "doctor";
    organization: Organization = new Organization();
    branchesList: any = [];
    // defaultDoctor:string='primarydoctor';
    defaultBranch: string = "primaryBranch";
    billingForm: FormGroup;
    scheduleForm: FormGroup;
    noOfRoom: number = 1;
    noOfRoomsList: any;
    countryList: any[];
    countryListModified: SelectItem[] = [];
    statesList: any[];
    statesListModified: SelectItem[] = [];
    citiesList: any[];
    citiesListModified: SelectItem[] = [];
    branchCity: number;
    flowList: any;
    flow: any;
    organizationDataList: any;
    currency:string;
    timeFormat:string;

    formattedAddress_Address: string = "";
    formattedAddress_ZipCode: string = "";
    formattedAddress_State: string = "";
    formattedAddress_City: string = "";
    formattedAddress_Country: string = "";
    formattedAddress: string = "";
    country: Country = new Country;
    state: State = new State;
    city: City = new City;

    constructor(private router: Router, private requestService: RequestsService,
                private fb: FormBuilder, private notificationService: NotificationService,
                private amazingTimePickerService?: AmazingTimePickerService) {
        this.createCountriesList();
        this.requestService.getRequest(AppConstants.BRANCH_ORGANIZATION)
            .subscribe(
                (response: Response) => {
                    if (response["responseStatus"] === "SUCCESS") {
                        this.organization = response["responseData"];

                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                });
        // this.allBranches();
    }

    ngOnInit() {
        this.createBranchMandatoryForm();
        this.createBranchForm();
        this.createScheduleForm();
        this.allorganizationData();
        this.branchForm.controls["companyName"].disable();
        this.noOfRoomsList = [
            {label: "1", value: 1},
            {label: "2", value: 2},
            {label: "3", value: 3},
            {label: "4", value: 4},
            {label: "5", value: 5},
            {label: "6", value: 6},
            {label: "7", value: 7},
            {label: "8", value: 8},
            {label: "9", value: 9},
            {label: "10", value: 10},
            {label: "15", value: 15},
            {label: "20", value: 20},
            {label: "25", value: 25},
            {label: "30", value: 30},
            {label: "35", value: 35},
            {label: "40", value: 40},
        ];
        this.flowList = [
            {label: "RCND", value: "RCND"},
            {label: "2", value: 2},
            {label: "3", value: 3},
            {label: "4", value: 4},

        ];

    }

    createBranchForm() {
        this.billingForm = this.fb.group({
            "billingBranch": [null],
            "billingName": [null],
            "billingTaxID": [null],
        })
    }

    createScheduleForm() {
        this.scheduleForm = this.fb.group({
            "showBranchOnline": "",
            "allowOnlineSchedulingInBranch": "",
        })
    }

    allorganizationData() {

        this.requestService.getRequest(AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_01') {

                        this.organizationDataList = response['responseData'];
                        console.log(this.organizationDataList);
                        this.timeFormat=this.organizationDataList.timeFormat;

                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
    }

    createBranchMandatoryForm() {
        this.branchForm = this.fb.group({
            "companyName": [null],
            "flow": [null,Validators.compose([Validators.required])],
            "branchName": [null, Validators.compose([Validators.required, Validators.minLength(4)])],
            "countryId": [null],
            "stateId": [null],
            "cityId": [null],
            "primaryDoctor": [null],
            "zipCode": [null],
            "address": [null],
            "officePhone": [null],
            "fax": [null],
            "formattedAddress": [{value: "", disabled: true}, Validators.required],
            "officeHoursStart": [this.officeHoursStart, Validators.compose([Validators.required])],
            "officeHoursEnd": [this.officeHoursEnd, Validators.compose([Validators.required])],
            "noOfExamRooms": [null, Validators.compose([Validators.required])],
            "examRooms": this.fb.array([this.createExamRoom()]),
        });
        this.examRooms.push(this.createExamRoom());
    }

    /*    removeDoctor(){
            this.pDoctor.forEach( (item: any, index :any) => {
                if(item.userName === this.defaultDoctor) this.pDoctor.splice(index,1);
            });
        }*/
    getSelectedStates(countryObj: any) {
        const country = countryObj.value;
        // this.cities = this.countryList.find((x: any) => x.name == country).cities;
        this.branchForm.controls["country"].setValue(country);
    }

    removeBranch() {
        this.branchesList.forEach((item: any, index: any) => {
            if (item === this.defaultBranch) this.branchesList.splice(index, 1);
        });
    }

    prepareSaveBranch(): Branch {
        const formModel = this.branchForm.value;
        const billingModel = this.billingForm.value;
        const scheduleModel = this.scheduleForm.value;

        const secretLairsDeepCopy: ExamRooms = formModel.examRooms.map(
            (examRooms: ExamRooms) => Object.assign({}, examRooms)
        );

        const saveBranchModel: Branch = {
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
        return saveBranchModel;
    }

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

    addBranch(data: FormData) {
        if (this.branchForm.valid) {
            // let branchObject = this.prepareSaveBranch();
            this.requestService.postRequest(AppConstants.ADD_BRANCH, data)
                .subscribe((response: Response) => {//BRANCH_ADD_SUCCESS_01
                    if (response["responseCode"] === "BRANCH_ADD_SUCCESS_01") {
                        this.notificationService.success("Branch is Created Successfully");
                        this.router.navigate(["/dashboard/setting/branch"])
                    }
                     else if (response["responseCode"] === "BR_ALREADY_EXISTS_01") {
                        this.notificationService.warn("Branch already Exists");
                        //  this.router.navigate(['/dashboard/setting/branch'])
                    }
                }, function () {
                    console.clear();
                    this.notificationService.error("ERROR", "Branch is not Created");
                }
            );
        } else {
            this.validateAllFormFields(this.branchForm);
            let errors:number = 0;
            if (this.examRooms.length == 0) {
                /*let examRoomLen = this.examRooms.length;
                for (var i = 0; i < examRoomLen; i++) {
                   console.log(this.examRooms.controls(i).controls['roomName'].value);
                }*/
                this.notificationService.error("Fill Form Properly");
                errors++;
            }
            if (this.officeHoursStart.length == 0) {
                this.notificationService.error("Please provide branch start time");
                errors++;
            }
            if (this.officeHoursEnd.length == 0) {
                this.notificationService.error("Please provide branch closing time");
                errors++;
            }
            if (errors == 0) {
                this.notificationService.error("Please provide data in all required fields");
            }
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

    createExamRoom(): FormGroup {

        return this.fb.group({
            "roomName": [null, Validators.compose([Validators.required])],
            "allowOnlineScheduling": "",
        });
    }

    addFields(no: number): void {
        this.removeAllFields();
        this.examRooms = this.branchForm.get("examRooms") as FormArray;
        for (var i = 0; i < no; i++) {
            this.examRooms.push(this.createExamRoom());
        }
    }

    removeAllFields() {
        this.examRooms = this.branchForm.get("examRooms") as FormArray;
        let examRoomLen = this.examRooms.length;
        for (var i = 0; i < examRoomLen; i++) {
            this.examRooms.removeAt(0);
        }
    }

    deleteField(index: number) {
        this.examRooms = this.branchForm.get("examRooms") as FormArray;
        this.noOfRoom = this.noOfRoom - 1;
        this.examRooms.removeAt(index);
    }

    getOfficeHoursStart() {
        const amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(time => {
            this.officeHoursStart = time;
            this.branchForm.controls["officeHoursStart"].setValue(time);
        })
    }

    getOfficeHoursEnd() {
        const amazingTimePicker = this.amazingTimePickerService.open();
        amazingTimePicker.afterClose().subscribe(time => {
            this.officeHoursEnd = time;
            this.branchForm.controls["officeHoursEnd"].setValue(time);

        })
    }

    getDoctor(value: any) {
        if (value) {
            this.branchForm.controls["primaryDoctor"].setValue(value);
        }
    }


    getState(value: any) {
        if (value) {
            this.branchForm.controls["state"].setValue(value);
        }
    }

    getZipCode(value: any) {
        if (value) {
            this.branchForm.controls["zipCode"].setValue(value);
        }
    }

    getFormattedAddress(value: any) {
        if (value) {
            this.branchForm.controls["formattedAddress"].setValue(value);
        }
    }

    getNoOfExamRooms(room: any) {
        const value = room.value;
        if (value) {
            this.noOfRoom = value;
            this.branchForm.controls["noOfExamRooms"].setValue(value);
            //  this.noOfExamRooms=value;
            this.addFields(value);
        }
    }

    getSelectedBranch(value: any) {
        if (value) {
            this.billingForm.controls["billingBranch"].setValue(value);
        }
    }

    createCountriesList() {
        this.requestService.getRequest(AppConstants.FETCH_LIST_OF_COUNTRIES)
            .subscribe((response: Response) => {
                if (response["responseCode"] === "BRANCH_SUC_01") {
                    this.countryList = response["responseData"].data;
                    for (let country of this.countryList) {
                        let pair: any = {label: country.name, value: country.id};
                        this.countryListModified.push(pair);
                    }
                }
            }, function (error) {
                this.notificationService.error("ERROR", "Countries List is not available");
            }
        );
    }

    getStatesByCountryId(countryId: any) {
        this.statesList = this.citiesList = this.statesListModified = this.citiesListModified = [];

        let pair: any;
        if (countryId == -1) {
            pair = {label: "Not Applicable", value: -1};
            this.statesListModified.push(pair);
            this.citiesListModified.push(pair);

        } else {
            this.requestService.getRequest(AppConstants.FETCH_LIST_OF_STATES_BY_CNTRY_ID + countryId)
                .subscribe((response: Response) => {
                    if (response["responseCode"] === "BRANCH_SUC_01") {
                        this.statesList = response["responseData"].statesList;
                        this.country = response["responseData"].country;

                        if (this.statesList.length > 0) {
                            for (let state of this.statesList) {
                                pair = {label: state.name, value: state.id};
                                this.statesListModified.push(pair);
                            }
                        } else {
                            pair = {label: "Not Applicable", value: -1};
                            this.statesListModified.push(pair);
                            this.citiesListModified.push(pair);
                        }

                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "States List is not available");
                }
            );
        }
        this.countryChange(countryId);
    }

    getCitiesByStateId(stateId: any) {
        this.citiesList = this.citiesListModified = [];

        let pair: any;
        if (stateId == -1) {
            pair = {label: "Not Applicable", value: -1};
            this.citiesListModified.push(pair);

        } else {
            this.requestService.getRequest(AppConstants.FETCH_LIST_OF_CITIES_BY_STATE_ID + stateId)
                .subscribe((response: Response) => {
                    if (response["responseCode"] === "BRANCH_SUC_01") {
                        this.citiesList = response["responseData"].cityList;
                        this.state = response["responseData"].state;

                        if (this.citiesList.length > 0) {
                            for (let city of this.citiesList) {
                                pair = {label: city.name, value: city.id};
                                this.citiesListModified.push(pair);
                            }
                        } else {
                            pair = {label: "Not Applicable", value: -1};
                            this.citiesListModified.push(pair);
                        }
                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "Cities List is not available");
                }
            );
        }
        this.stateChange(stateId);
    }

    selectBranchCity(cityId: any) {
        this.branchCity = cityId;
        // console.log("Branch City ID: " + this.branchCity);
        this.cityChange(cityId);
    }

    cancel() {
        this.router.navigate(["/dashboard/setting/branch"]);
    }

    addressChange(value: any) {
        // console.log(value);
        this.formattedAddress_Address = this.checkFormattedAddressForNullOrEmpty(value);
        this.createFormattedAddress();
    }

    zipCodeChange(value: any) {
        this.formattedAddress_ZipCode = this.checkFormattedAddressForNullOrEmpty(value);
        this.createFormattedAddress();
    }

    stateChange(stateId: any) {
        this.requestService.getRequest(AppConstants.GET_STATE_BY_ID + stateId)
            .subscribe((response: Response) => {
                if (response["responseCode"] === "STATE_SUC_11") {
                    this.state = response["responseData"];
                    console.log(this.state);
                    this.formattedAddress_State = this.checkFormattedAddressForNullOrEmpty(this.state.name);
                    this.createFormattedAddress();
                }
            }, function (error) {
                this.notificationService.error("ERROR", "State is not available");
                this.formattedAddress_State = "N/A";
            }
        );
    }

    cityChange(cityId: any) {
        this.requestService.getRequest(AppConstants.GET_CITY_BY_ID + cityId)
            .subscribe((response: Response) => {
                if (response["responseCode"] === "CITY_SUC_11") {
                    this.city = response["responseData"];
                    console.log(this.state);
                    this.formattedAddress_City = this.checkFormattedAddressForNullOrEmpty(this.city.name);
                    this.createFormattedAddress();
                }
            }, function (error) {
                this.notificationService.error("ERROR", "City is not available");
                this.formattedAddress_City = "N/A";
            }
        );
    }

    countryChange(countryId: any) {
        this.requestService.getRequest(AppConstants.GET_COUNTRY_BY_ID + countryId)
            .subscribe((response: Response) => {
                if (response["responseCode"] === "COUNTRY_SUC_11") {
                    this.country = response["responseData"];
                    console.log(this.country);
                    this.formattedAddress_Country = this.checkFormattedAddressForNullOrEmpty(this.country.name, true);
                    this.createFormattedAddress();
                }
            }, function (error) {
                this.notificationService.error("ERROR", "Country is not available");
            }
        );
    }

    private checkFormattedAddressForNullOrEmpty(value: string, isCountry?: boolean) {
        if (!isNullOrUndefined(value) && value.trim() != "") {
            if (isCountry) {
                return value;
            } else {
                return value + ", ";
            }
        }
        return "";
    }

    private createFormattedAddress() {
        this.formattedAddress = this.formattedAddress_Address + this.formattedAddress_ZipCode + this.formattedAddress_State
            + this.formattedAddress_City + this.formattedAddress_Country;
        this.branchForm.controls["formattedAddress"].setValue(this.formattedAddress);
    }
}
