import {Component, OnInit} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {ActivatedRoute, Router} from "@angular/router";
import {RequestsService} from "../../../services/requests.service";
import {NotificationService} from "../../../services/notification.service";
import {AmazingTimePickerService} from "amazing-time-picker";
import {Branch} from "../../../model/Branch";
import {ExamRooms} from "../../../model/ExamRooms";
import {AppConstants} from "../../../utils/app.constants";
import {isNullOrUndefined} from "util";
import {SelectItem} from "primeng/api";


@Component({
    selector: "update-branch-component",
    templateUrl: "../../../templates/dashboard/setting/update-branch.template.html",
})
export class UpdateBranchComponent implements OnInit {
    id: number;
    examRooms: FormArray;
    branchesList: any = [];
    officeHoursStart: string;
    officeHoursEnd: string;
    userSelected: string = "DOCTOR";
    pDoctor: any = [];
    error: any;
    branchForm: FormGroup;
    billingForm: FormGroup;
    scheduleForm: FormGroup;
    branch: Branch;
    defaultBranch: string = "primary";
    noOfRoom: number = 1;
    disable: boolean = true;
    flowList: any;
    countryList: any[];
    countryListModified: SelectItem[] = [];
    statesList: any[];
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

    formattedAddress_Address: string = "";
    formattedAddress_ZipCode: string = "";
    formattedAddress_State: string = "";
    formattedAddress_City: string = "";
    formattedAddress_Country: string = "";
    formattedAddress: string = "";

    allRoomCount = () => {
        this.requestService.getRequest(AppConstants.FETCH_ROOM_COUNT_OF_BRANCH + this.id)
            .subscribe((response: Response) => {
                if (response["responseCode"] === "BRANCH_SUC_01") {
                    if (!isNullOrUndefined(response["responseData"])) {
                        this.noOfRoom = response["responseData"].data;
                    }
                    if (this.noOfRoom < 1) {
                        this.noOfRoom = 1;
                    }
                    console.log("No of rooms: " + this.noOfRoom);
                }
            }, (error: any) => {
                this.error = error.error.error;
            }
        )
    };

    private sub: any;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private requestService: RequestsService,
                private fb: FormBuilder,
                private notificationService: NotificationService,
                private amazingTimePickerService?: AmazingTimePickerService) {
        this.requestService.getRequest(AppConstants.USER_BY_ROLE + "?name=" + this.userSelected)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "USER_SUC_01") {
                        this.pDoctor = response["responseData"];
                    }
                }, (error: any) => {
                    this.error = error.error.error;
                });
        // this.allBranches();
    }

    ngOnInit() {
        this.createBranchForm();
        this.sub = this.route.params.subscribe(params => {
            this.id = params["id"];
            console.log(this.id);
        });
        this.createBillingForm();
        this.createScheduleForm();
        this.patchData();
        this.flowList = [
            {label: "RCND", value: "RCND"},
            {label: "2", value: 2},
            {label: "3", value: 3},
            {label: "4", value: 4},

        ];
        this.getCityStateCntryByBranchId();
        this.createFormattedAddress();
    }

    createBranchForm() {
        this.branchForm = this.fb.group({
            "branchName": [null, Validators.compose([Validators.required, Validators.minLength(4)])],
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
            "formattedAddress": [{disabled: true}, Validators.required],
            "officePhone": [null],
            "fax": [null],
            "officeHoursStart": [null, Validators.required],
            "officeHoursEnd": [null, Validators.required],
            "noOfExamRooms": [null],
            "examRooms": this.fb.array([this.createExamRoom()]),
            "selectedCountry": [null],
            "selectedState": [null],
            "selectedCity": [null],
        });
        // console.log(this.branchForm.controls);
        // console.log( ((this.branchForm.controls.examRooms as FormArray).controls[0] as FormGroup).controls.roomName.value );
    }

    createBillingForm() {
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

    createExamRoom(): FormGroup {
        return this.fb.group({
            "roomName": "",
            "allowOnlineScheduling": "",
        });
    }

    createExamRooms(roomName: string, allowOnlineScheduling: boolean): FormGroup {
        return this.fb.group({
            "roomName": roomName,
            "allowOnlineScheduling": allowOnlineScheduling,
        });
    }

    allBranches() {
        this.requestService.getRequest(AppConstants.BRANCHES_NAME)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "BRANCH_SUC_01") {
                        this.branchesList = response["responseData"];
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })
    }

    public patchData() {
        if (this.id) {
            this.requestService.findById(AppConstants.FETCH_BRANCHES_BY_ID + this.id).subscribe(
                branch => {
                    this.branchForm.patchValue({
                        branchName: branch.branchName,
                        officeHoursStart: branch.officeHoursStart,
                        officeHoursEnd: branch.officeHoursEnd,
                        noOfExamRooms: branch.examRooms.length,
                        examRooms: (branch.examRooms as FormArray),
                        city: branch.city,
                        state: branch.state,
                        country: branch.country,
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
                    this.cityId = branch.cityId;
                    this.stateId = branch.stateId;
                    this.countryId = branch.countryId;
                    this.formattedAddress_Address = this.checkFormattedAddressForNullOrEmpty(branch.address);
                    this.formattedAddress_ZipCode = this.checkFormattedAddressForNullOrEmpty(branch.zipCode);
                    this.formattedAddress_City = this.checkFormattedAddressForNullOrEmpty(branch.city);
                    this.formattedAddress_State = this.checkFormattedAddressForNullOrEmpty(branch.state);
                    this.formattedAddress_Country = this.checkFormattedAddressForNullOrEmpty(branch.country,true);
                    this.examRooms = branch.examRooms;
                    this.addValuesFields(this.examRooms.length, this.examRooms);
                    this.createFormattedAddress();
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
                    console.log( this.examRooms );
                    console.log( this.branchForm.controls.examRooms );
                    // console.log( ((this.branchForm.controls.examRooms as FormArray).controls[0] as FormGroup).controls.roomName.value );
                    // console.log( ((this.branchForm.controls.examRooms as FormArray).controls[0] as FormGroup).controls.allowOnlineScheduling.value );
                    // console.log( ((this.branchForm.controls.examRooms as FormArray).controls[0] as FormGroup).value.roomName);
                    // console.log( ((this.branchForm.controls.examRooms as FormArray).controls[0] as FormGroup).value.allowOnlineScheduling);
                }, (error: any) => {
                    //console.log(error.json());
                    this.error = error.error.error_description;

                });


        }
    }

    removeBranch() {
        this.branchesList.forEach((item: any, index: any) => {
            if (item === this.defaultBranch) this.branchesList.splice(index, 1);
        });
    }

    deleteField(index: number) {
        this.examRooms = this.branchForm.get("examRooms") as FormArray;
        this.noOfRoom = this.noOfRoom - 1;
        this.examRooms.removeAt(index);
    }

    prepareSaveBranch(): Branch {
        const formModel = this.branchForm.value;
        const billingModel = this.billingForm.value;
        const scheduleModel = this.scheduleForm.value;

        const secretLairsDeepCopy: ExamRooms = formModel.examRooms.map(
            (examRooms: ExamRooms) => Object.assign({}, examRooms)
        );
        console.log(secretLairsDeepCopy);

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
        console.log(saveBranchModel);
        return saveBranchModel;
    }

    addBranch(data: FormData) {
        // data["cityId"] = this.selectedCity;
        if (this.branchForm.valid) {
            //  let branchObject = this.prepareSaveBranch();
            var that = this;
            this.branchForm.value.cityId = this.branchForm.value.city;
            this.branchForm.value.stateId = this.branchForm.value.state;
            this.branchForm.value.countryId = this.branchForm.value.country;
            // data = this.branchForm;
            // data.set("cityId", data.get("city"));
            this.requestService.postRequest(AppConstants.UPDATE_BRANCH + this.id, this.branchForm.value)
                .subscribe((response: Response) => {
                    //that.router.navigate(["/dashboard/setting/branch"]);
                    if (response["responseCode"] == "BRANCH_UPDATE_SUC_01") {
                        console.log("updated...");
                        that.notificationService.success(" Branch has been Updated Successfully");
                        that.router.navigate(["/dashboard/setting/branch"]);
                    }
                    if (response["responseCode"] === "BR_ALREADY_EXISTS_01") {
                        this.notificationService.warn("Branch already Exists");
                        //  this.router.navigate(['/dashboard/setting/branch'])
                    }

                }, function (error) {
                    this.error = error.error.error_description;
                    this.notificationService.error("ERROR", "Branch is not updated ");
                }
            );
        } else {
            this.validateAllFormFields(this.branchForm);
            if (this.examRooms.length != 0) {
                /*let examRoomLen = this.examRooms.length;
                for (var i = 0; i < examRoomLen; i++) {
                   console.log(this.examRooms.controls(i).controls['roomName'].value);
                }*/
                this.notificationService.error("Fill exam room Properly");
            }
        }
    }

    isFieldValid(field: string) {
        return !this.branchForm.get(field).valid && this.branchForm.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            "has-error": this.isFieldValid(field),
            "has-feedback": this.isFieldValid(field)
        };
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            //console.log(field);
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({onlySelf: true});
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
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

    getBillingBranch(value: any) {
        if (value) {
            this.billingForm.controls["billingBranch"].setValue(value);
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

    getNoOfExamRooms(value: any) {
        if (value) {
            this.branchForm.controls["noOfExamRooms"].setValue(value);
            //  this.noOfExamRooms=value;
            this.addFields(value);
        }
    }

    addFields(no: number): void {
        this.removeAllFields();
        this.examRooms = this.branchForm.get("examRooms") as FormArray;
        for (var i = 0; i < no; i++) {
            this.examRooms.push(this.createExamRoom());
        }

    }

    addValuesFields(no: number, examRooms: any): void {
        this.removeAllFields();
        // this.examRooms = this.branchForm.get("examRooms") as FormArray;
        for (let i = 0; i < no; i++) {
            this.examRooms.push(
                this.createExamRooms(
                    examRooms[i].roomName,
                    examRooms[i].allowOnlineScheduling)
            );
        }
        // console.log(this.examRooms);
    }

    removeAllFields() {
        this.examRooms = this.branchForm.get("examRooms") as FormArray;
        let examRoomLen = this.examRooms.length;
        for (var i = 0; i < examRoomLen; i++) {
            this.examRooms.removeAt(0);
        }
    }

    createCountriesList() {
        this.requestService.getRequest(AppConstants.FETCH_LIST_OF_COUNTRIES)
            .subscribe((response: Response) => {
                if (response["responseCode"] === "BRANCH_SUC_01") {
                    this.countryList = response["responseData"].data;
                    for (let country of this.countryList) {
                        var pair: any = {label: country.name, value: country.id};
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

        // this.cityId = this.selectedCity;
        this.cityId = !(isNullOrUndefined(this.city)) ? this.city.id : null;
        this.stateId = !(isNullOrUndefined(this.state)) ? this.state.id : null;
        this.countryId = countryId;
        // this.countryId = !(isNullOrUndefined(this.country)) ? this.country.id : null;

        let pair: any;
        if (countryId == -1) {
            pair = {label: "Not Applicable", value: -1};
            this.statesListModified.push(pair);
            this.citiesListModified.push(pair);

        } else {
            this.requestService.getRequest(AppConstants.FETCH_LIST_OF_STATES_BY_CNTRY_ID + countryId)
                .subscribe((response: Response) => {
                        if (response["responseCode"] === "STATE_SUC_11") {
                            this.statesList = response["responseData"].statesList;
                            this.country = response["responseData"].country;

                            if (this.statesList.length > 0) {
                                for (let state of this.statesList) {
                                    pair = {label: state.name, value: state.id};
                                    this.statesListModified.push(pair);
                                    console.log(this.statesListModified);
                                }
                            } else {
                                pair = {label: "Not Applicable", value: -1};
                                this.statesListModified.push(pair);
                                this.citiesListModified.push(pair);
                                this.formattedAddress_City = this.checkFormattedAddressForNullOrEmpty("Not Applicable");
                                this.formattedAddress_State = this.checkFormattedAddressForNullOrEmpty("Not Applicable");
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
                    if (response["responseCode"] === "CITY_SUC_11") {
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

    selectBranchCity(city: any) {
        this.city = city;
        this.cityId = city;
        this.cityChange(city);
    }

    getCityStateCntryByBranchId(){
        this.requestService.getRequest(AppConstants.FETCH_CITY_STATE_CNTRY_BY_BR_ID + this.id)
            .subscribe((response: Response) => {
                if (response["responseCode"] === "BRANCH_SUC_01") {
                    this.city = response["responseData"].data.city;
                    this.state = response["responseData"].data.state;
                    this.country = response["responseData"].data.country;

                    if (!isNullOrUndefined(this.country)) {
                        this.selectedCountry = this.country.name;
                        this.countryId = this.country.id;
                        this.getStatesByCountryId(this.countryId);
                        this.formattedAddress_Country = this.checkFormattedAddressForNullOrEmpty(this.country.name,true);
                    }

                    if (!isNullOrUndefined(this.state)) {
                        this.selectedState = this.state.name;
                        this.stateId = this.state.id;
                        this.getCitiesByStateId(this.stateId);
                        this.formattedAddress_State = this.checkFormattedAddressForNullOrEmpty(this.state.name);
                    }

                    if (!isNullOrUndefined(this.city)) {
                        this.selectedCity = this.city.name;
                        this.cityId = this.city.id;
                        this.formattedAddress_City = this.checkFormattedAddressForNullOrEmpty(this.city.name);
                    }
                    console.log(this.selectedCountry);

                    this.createCountriesList();
                    this.createFormattedAddress();
                }
            }, function (error: any) {
                this.notificationService.error("ERROR", "CIty State Country for branch is/are not available");
            }
        );
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
                    this.branchForm.value.state = this.state;
                    this.branchForm.value.stateId = this.stateId;
                    this.formattedAddress_State = this.checkFormattedAddressForNullOrEmpty(this.state.name);
                    this.createFormattedAddress();
                } else {
                    this.formattedAddress_State = "N/A";
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
                } else {
                    this.formattedAddress_City = this.checkFormattedAddressForNullOrEmpty("Not Applicable");
                    this.cityId = -1;
                }
            }, function (error) {
                this.notificationService.error("ERROR", "City is not available");
                this.formattedAddress_City = this.checkFormattedAddressForNullOrEmpty("Not Applicable");
                this.cityId = -1;
            }
        );
    }

    countryChange(countryId: any) {
        this.requestService.getRequest(AppConstants.GET_COUNTRY_BY_ID + countryId)
            .subscribe((response: Response) => {
                if (response["responseCode"] === "COUNTRY_SUC_11") {
                    this.country = response["responseData"];
                    // console.log(this.country);
                    this.formattedAddress_Country = this.checkFormattedAddressForNullOrEmpty(this.country.name, true);
                } else {
                    this.formattedAddress_City = this.checkFormattedAddressForNullOrEmpty("Not Applicable");
                    this.formattedAddress_State = this.checkFormattedAddressForNullOrEmpty("Not Applicable");
                    this.countryId = -1;
                    this.stateId = -1;
                    this.cityId = -1;
                }
            }, function (error) {
                this.notificationService.error("ERROR", "Country is not available");
                this.formattedAddress_City = this.checkFormattedAddressForNullOrEmpty("Not Applicable");
                this.formattedAddress_State = this.checkFormattedAddressForNullOrEmpty("Not Applicable");
                this.countryId = -1;
                this.stateId = -1;
                this.cityId = -1;
            }
        );
        this.createFormattedAddress();
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
