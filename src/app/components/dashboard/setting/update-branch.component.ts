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
                    this.branchForm.patchValue({
                        branchName: branch.branchName,
                        officeHoursStart: branch.officeHoursStart,
                        officeHoursEnd: branch.officeHoursEnd,
                        noOfExamRooms: branch.examRooms.length,
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
                        zipCode: branch.zipCode,
                        officePhone: branch.officePhone,
                        flow: branch.flow,

                    });

                    this.cityId = branch.cityId;
                    this.stateId = branch.stateId;
                    this.countryId = branch.countryId;

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

    addBranch(data: FormData) {
        // data["cityId"] = this.selectedCity;
        if (this.branchForm.valid) {
            //  let branchObject = this.prepareSaveBranch();
            var that = this;
            this.requestService.postRequest(AppConstants.UPDATE_BRANCH + this.id, data)
                .subscribe(
                    (response: Response) => {
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
                    });

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

    getStatesByCountryId(countryId: any) {
        this.statesList = this.citiesList = this.statesListModified = this.citiesListModified = [];

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

                        this.createCountriesList();
                        this.getStatesByCountryId(this.countryId)
                        this.getCitiesByStateId(this.stateId);
                    }
                }, function (error) {
                    this.notificationService.error("ERROR", "CIty State Country for branch is/are not available");
                });
    }

    cancel() {
        this.router.navigate(["/dashboard/setting/branch"]);
    }
}
