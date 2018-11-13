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
    examRooms: any = [];
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
    // ];
    // cities: any = [];
    // state:any;
    // countryList: Array<any> = [
    //     {name: 'Germany', label:'Germany',value:'Germany', cities: ['Duesseldorf', 'Leinfelden-Echterdingen', 'Eschborn']},
    //     {name: 'Pakistan',label:'Pakistan',value:'Pakistan', cities: ['Punjab', 'Sindh', 'Balochistan', 'KPK']},
    //     {name: 'USA',label:'USA',value:'USA', cities: ['California', 'Florida', 'Texas', 'New York', 'Hawai', 'Pennsylvania']},
    //     {name: 'Canada',label:'Caanda',value:'Canada', cities: ['Alberta', 'Ontario']},
    //     {name: 'Saudi Arab',label:'Saudi Arab',value:'Saudi Arab', cities: ['Riyadh', 'Jeddah', 'Dammam']},
    //     {name: 'China',label:'China',value:'China', cities: ['Hainan', 'Sichuan', 'Hunan', 'Henan']},
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


    allRoomCount = () => {
        this.requestService.getRequest(AppConstants.FETCH_ROOM_COUNT_OF_BRANCH + this.id)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "BRANCH_SUC_01") {
                        if (!isNullOrUndefined(response["responseData"])) {
                            this.noOfRoom = response["responseData"].data;
                        }
                        if (this.noOfRoom < 1) {
                            this.noOfRoom = 1;
                        }
                        console.log("No of rooms: " + this.noOfRoom);
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })
    }
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
                },
                (error: any) => {
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
            "officePhone": [null],
            "fax": [null],
            "formattedAddress": [null],
            "officeHoursStart": [null, Validators.required],
            "officeHoursEnd": [null, Validators.required],
            "noOfExamRooms": [null],
            "examRooms": this.fb.array([this.createExamRoom()]),

            "selectedCountry": [null],
            "selectedState": [null],
            "selectedCity": [null],
        })
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
                    //  this.id = user.id;
                    // if (!isNullOrUndefined(this.countryList) && !isNullOrUndefined(this.countryList.find((x: any) => x.name == branch.country))) {
                    //     this.cities = this.countryList.find((x: any) => x.name == branch.country).cities;
                    // }
                    this.branchForm.patchValue({
                        branchName: branch.branchName,
                        officeHoursStart: branch.officeHoursStart,
                        officeHoursEnd: branch.officeHoursEnd,
                        noOfExamRooms: branch.examRooms.length,
                        // state:branch.state,
                        city: branch.city.city,
                        state: branch.city.state,
                        country: branch.city.country,

                        cityId: branch.city.cityId,
                        stateId: branch.city.stateId,
                        countryId: branch.city.countryId,

                        selectedCity: branch.city.city,
                        selectedState: branch.city.state,
                        selectedCountry: branch.city.country,
                        // primaryDoctor: branch.user.id,
                        fax: branch.fax,
                        // country: branch.country,
                        address: branch.address,
                        zipCode: branch.zipCode,
                        officePhone: branch.officePhone,
                        flow: branch.flow,

                    });

                    this.cityId = branch.city.cityId;
                    this.stateId = branch.city.stateId;
                    this.countryId = branch.city.countryId;

                    // this.selectedCity.push({value: branch.city.city});
                    // this.selectedState.push({value: branch.city.state});
                    // this.selectedCountry.push({value: branch.city.country});
                    // this.state = branch.state,

                    /*     this.billingForm.patchValue({
                             billingBranch: branch.billingBranch,
                             billingName: branch.billingName,
                             billingTaxID: branch.billingTaxID

                         });

                         this.scheduleForm.patchValue({
                                 showBranchOnline: branch.showBranchOnline,
                                 allowOnlineSchedulingInBranch: branch.allowOnlineSchedulingInBranch,
                             }
                         );*/
                    this.branchForm.controls["zipCode"].patchValue(branch.zipCode);
                    this.allRoomCount();
                    branch.examRooms = this.noOfRoom;
                    this.addFields(branch.rooms);
                    // this.branchForm.controls['examRooms'].patchValue(branch.examRooms);
                    // this.selectedCity.push({value: branch.city.city});
                    // this.selectedState.push({value: branch.city.state});
                    // this.selectedCountry.push({value: branch.city.country});
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

    addBranch(data: FormData) {
        this.branchForm.patchValue({
                cityId: this.selectedCity,
            }
        );
        this.cityId = this.selectedCity;
        data["cityId"] = this.selectedCity;

        if (this.branchForm.valid) {
            //  let branchObject = this.prepareSaveBranch();
            var that = this;
            this.requestService.putRequest(AppConstants.UPDATE_BRANCH + this.id, data)
                .subscribe(
                    (response: Response) => {
                        that.router.navigate(["/dashboard/setting/branch"]);
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
                    });

        } else {
            this.validateAllFormFields(this.branchForm);
            if (this.examRooms.length != 0) {
                /*let examRoomLen = this.examRooms.length;
                for (var i = 0; i < examRoomLen; i++) {
                   console.log(this.examRooms.controls(i).controls['roomName'].value);
                }*/
                this.notificationService.error("Fill examroom Properly");
            }
        }

        console.log("\nCity: " + this.cityId + ': ' + this.selectedCity + "  ::  " + this.city.id + " : " + this.city.name);
        console.log("State: " + this.stateId + ': ' + this.selectedState + "  ::  " + this.state.id + " : " + this.state.name);
        console.log("Country: " + this.countryId + ': ' + this.selectedCountry + "  ::  " + this.country.id + " : " + this.country.name);
    }

    deleteField(index: number) {
        this.examRooms = this.branchForm.get("examRooms") as FormArray;
        this.examRooms.removeAt(index);
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

    cancel() {
        this.router.navigate(["/dashboard/setting/staff"]);
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

    // getSelectedStates(countryObj: any) {
    //     const country = countryObj.value;
    //     if (country) {
    //         this.cities = this.countryList.find((x: any) => x.name == country).cities;
    //         this.branchForm.controls['country'].setValue(country);
    //     }
    // }

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

    removeAllFields() {
        this.examRooms = this.branchForm.get("examRooms") as FormArray;
        let examRoomLen = this.examRooms.length;
        for (var i = 0; i < examRoomLen; i++) {
            this.examRooms.removeAt(0);
        }
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

    /*getCountryByBrId() {
        this.requestService.getRequest(AppConstants.FETCH_LIST_OF_COUNTRIES + this.id)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "BRANCH_SUC_01") {
                        this.country = response["responseData"].data;
                        // for (let country of this.countryList) {
                        //     var pair: any = {label: this.country.name, value: this.country.id};
                        //     this.countryListModified.push(pair);
                        // }

                        var pair: any = {value: this.country.name};
                        this.selectedCountry.push(pair);
                        this.selectedCountry = this.country.name;
                        this.countryId = this.country.id;
                        console.log(this.countryId + ': ' + this.selectedCountry);
                        this.createCountriesList();
                        this.getStateByBrId();


                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "Branch Country List is not available");
                });
    }

    getStateByBrId() {
        console.log("Country ID: " +this.countryId + " : " + this.country.id);
        this.getStatesByCountryId(this.countryId);
        this.requestService.getRequest(AppConstants.FETCH_STATE_BY_BR_ID + this.id)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "BRANCH_SUC_01") {
                        this.state = response["responseData"].data;
                        this.selectedState = this.state.name;
                        this.stateId = this.state.id;
                        console.log(this.stateId + ': ' + this.selectedState);
                        // this.getStatesByCountryId(this.countryId);
                        this.getCityByBrId();
                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "Branch State is not available");
                });
    }

    getCityByBrId(): any {
        this.requestService.getRequest(AppConstants.FETCH_CITY_BY_BR_ID + this.id)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "BRANCH_SUC_01") {
                        this.city = response["responseData"].data;
                        this.selectedCity = this.city.name;
                        this.cityId = this.city.id;
                        console.log(this.cityId + ': ' + this.selectedCity);
                        this.getCitiesByStateId(this.stateId);
                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "Country List is not available");
                });
    }*/

    getStatesByCountryId(countryId: any) {
        this.statesList = this.citiesList = this.statesListModified = this.citiesListModified = [];
        // this.selectedCity = this.selectedState = [];

        // console.log('CML: ' + this.countryListModified);
        // this.selectedCountry = this.countryListModified.filter(this.filterCountryById);

        // console.log("Sel Country: "+this.selectedCountry);

        this.cityId = this.selectedCity;
        this.stateId = this.state.id;
        this.countryId = this.country.id;

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
        // this.selectedCity = [];

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

    selectBranchCity(city: any) {
        this.city = city;
        // console.log("Branch City ID: " + this.branchCity);
    }

    getCityStateCntryByBranchId(){
        this.requestService.getRequest(AppConstants.FETCH_CITY_STATE_CNTRY_BY_BR_ID + this.id)
            .subscribe(
                (response: Response) => {
                    if (response["responseCode"] === "BRANCH_SUC_01") {
                        this.city = response["responseData"].data.city;
                        this.state = response["responseData"].data.state;
                        this.country = response["responseData"].data.country;

                        this.selectedCity = this.city.name;
                        this.selectedState = this.state.name;
                        this.selectedCountry = this.country.name;

                        this.cityId = this.city.id;
                        this.stateId = this.state.id;
                        this.countryId = this.country.id;

                        console.log("City: " + this.cityId + ': ' + this.selectedCity);
                        console.log("State: " + this.stateId + ': ' + this.selectedState);
                        console.log("Country: " + this.countryId + ': ' + this.selectedCountry);

                        this.createCountriesList();
                        this.getStatesByCountryId(this.countryId)
                        this.getCitiesByStateId(this.stateId);
                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "CIty State Country for branch is/are not available");
                });
    }

    /*filterCountryById(element: any, index: any, array: any[]) {
        // return (element.id == this.countryId) ? element.name : this.selectedCountry;
        console.log('Elem: ' + element);
        return (element.label == this.selectedCountry);
    }*/
}