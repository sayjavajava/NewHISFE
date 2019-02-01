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
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var app_constants_1 = require("../../../utils/app.constants");
var requests_service_1 = require("../../../services/requests.service");
var notification_service_1 = require("../../../services/notification.service");
var patient_1 = require("../../../model/patient");
var his_util_service_1 = require("../../../services/his-util.service");
var LabTestSpecimanModel_1 = require("../../../model/LabTestSpecimanModel");
var angular2_datetimepicker_1 = require("angular2-datetimepicker");
var LabTestModel_1 = require("../../../model/LabTestModel");
var PatientAddLabOrdersComponent = (function () {
    /*
    *  constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    *
    * */
    function PatientAddLabOrdersComponent(router, route, fb, requestService, notificationService, hISUtilService) {
        this.router = router;
        this.route = route;
        this.fb = fb;
        this.requestService = requestService;
        this.notificationService = notificationService;
        this.hISUtilService = hISUtilService;
        this.labTest = [];
        this.dateTest = new Date(); //new Date();
        this.orderId = 0;
        this.patient = new patient_1.Patient();
        this.singleTestSpeciman = new LabTestSpecimanModel_1.LabTestSpecimanModel();
        this.LabReadList = [];
        this.singleObj = new LabTestModel_1.LabTestModel();
        this.show = false;
        this.showEdit = false;
        this.hideField = false;
        this.filterSpeciman = new LabTestSpecimanModel_1.LabTestSpecimanModel();
        this.LabReadListObj = [];
        this.showDoctor = false;
        this.selectedAppointmentId = [];
        this.isUpdate = false;
        this.isError = false;
        this.searchedNamesLstNew = [];
        this.selectedTestNew = [];
        this.testList = [];
        this.profileImg = null;
        this.urlOrganization = "/public/images/company-logo-placeholder.jpg";
        this.createLabTest();
        angular2_datetimepicker_1.DatePicker.prototype.ngOnInit = function () {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }
            this.settings.timePicker = true;
            this.date = new Date();
        };
    }
    PatientAddLabOrdersComponent.prototype.getAllTestSpecimanList = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestService.getRequest(app_constants_1.AppConstants.FETCH_LAB_TEST_SPECIMAN_CONFIGURATIONS).subscribe(function (response) {
                if (response['responseCode'] === 'SUCCESS') {
                    _this.data = response['responseData'];
                    _this.testList = response['responseData'];
                    if (_this.testList.length > 0) {
                        for (var _i = 0, _a = _this.testList; _i < _a.length; _i++) {
                            var test = _a[_i];
                            var pair = { label: test.testName, value: test.id };
                            _this.searchedNamesLstNew.push(pair);
                        }
                        console.log(_this.data);
                    }
                    // this.cars = response['responseData'];
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Lab Test Specimen Configurations');
                }
            }, function (error) {
                _this.notificationService.error(Response['responseMessage'], 'Lab Test Specimen Configurations');
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientAddLabOrdersComponent.prototype.filterLabTestSingle = function (event) {
        //  let query = event.query;
        if (event > 0) {
            this.filteredTestSingle = this.testList.filter(function (listing) { return listing.id === event; });
            if (this.filteredTestSingle.length > 0) {
                this.show = true;
            }
            else {
                this.show = false;
            }
            if (this.filteredTestSingle.length > 0) {
                this.singleObj = this.filteredTestSingle[0];
                this.singleTestSpeciman.description = this.filteredTestSingle[0].description;
                this.filterSpeciman.description = this.singleObj.description;
                this.singleTestSpeciman.unit = this.filteredTestSingle[0].unit;
                this.filterSpeciman.unit = this.singleObj.unit;
                this.singleTestSpeciman.minNormalRange = this.filteredTestSingle[0].minNormalRange;
                this.filterSpeciman.minNormalRange = this.singleObj.minNormalRange + "-" + this.singleObj.maxNormalRange;
                this.singleTestSpeciman.maxNormalRange = this.filteredTestSingle[0].maxNormalRange;
                this.filterSpeciman.maxNormalRange = this.singleObj.maxNormalRange;
                this.singleTestSpeciman.testCode = this.filteredTestSingle[0].testCode;
                this.filterSpeciman.testCode = this.singleObj.testCode;
                this.singleTestSpeciman.testName = this.filteredTestSingle[0].testName;
                this.filterSpeciman.testName = this.singleObj.testName;
                this.singleTestSpeciman.id = this.filteredTestSingle[0].id;
                this.filterSpeciman.id = this.singleObj.id;
            }
        }
    };
    PatientAddLabOrdersComponent.prototype.filterLabTest = function (query, labTests) {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        var filtered = [];
        for (var i = 0; i < labTests.length; i++) {
            var test = labTests[i];
            if ((test.testCode.toLocaleLowerCase().indexOf(query.toLowerCase()) >= 0) || (test.testName.toLocaleLowerCase().indexOf(query.toLowerCase()) >= 0)) {
                filtered.push(test);
            }
        }
        return filtered;
    };
    PatientAddLabOrdersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.id = params['id'];
        });
        this.route.params.subscribe(function (params) {
            _this.orderId = params['orderId'];
        });
        this.route.params.subscribe(function (params) {
            _this.testId = params['orderCode'];
        });
        this.getAllTestSpecimanList();
        this.createLabOrderForm();
        this.loadRecord();
        this.labForm.controls['patientId'].setValue(this.id);
        if (this.orderId != null) {
            this.patchOrderData();
        }
        this.statusType = [
            { label: 'ORDERED', value: 'ORDERED' },
            { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
            { label: 'COMPLETED', value: 'COMPLETED' },
        ];
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_LAB_TEST_SPECIMAN_CONFIGURATIONS).subscribe(function (response) {
            if (response['responseCode'] === 'SUCCESS') {
                _this.labTestSpecimanList = response['responseData'];
            }
            else {
                _this.notificationService.error(response['responseMessage'], 'Lab Test Speciman Configurations');
            }
        }, function (error) {
            _this.notificationService.error(Response['responseMessage'], 'Lab Test Speciman Configurations');
        });
        //  this.addMoreTest();
    };
    PatientAddLabOrdersComponent.prototype.goToUserDashBoard = function () {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    };
    PatientAddLabOrdersComponent.prototype.loadRecord = function () {
        var _this = this;
        if (this.id == null || this.id == 0 || this.id == undefined) {
            this.notificationService.error('Please Select Patient Again From Dashboard');
        }
        else {
            this.requestService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + this.id).subscribe(function (response) {
                if (response['responseCode'] === 'USER_SUC_01') {
                    _this.patient = response['responseData'];
                    console.log(_this.patient);
                    var apptId = response['responseData']['pastAppointments'];
                    _this.appointmentList = response['responseData']['pastAppointments'];
                    //   this.doctorAppointment=apptId[]
                    console.log(apptId);
                    _this.appointmentId = apptId[0].id;
                    if (_this.appointmentList.length > 0) {
                        var doctorName = _this.appointmentList.filter(function (listing) { return listing.id === _this.appointmentId; });
                        _this.doctorAppointment = doctorName[0].docFirstName + ' ' + doctorName[0].docLastName;
                        _this.showDoctor = true;
                        _this.labForm.controls['appointmentId'].setValue(_this.appointmentId);
                    }
                    console.log('test appoint id :' + _this.appointmentId);
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Patient');
                    // this.router.navigate(['404-not-found'])
                }
            }, function (error) {
                _this.hISUtilService.tokenExpired(error.error.error);
            });
        }
    };
    PatientAddLabOrdersComponent.prototype.createLabOrderForm = function () {
        this.labForm = this.fb.group({
            'orderStatus': [null, forms_1.Validators.required],
            'orderTestDate': [null],
            'doctorSignOff': [null],
            'comments': [null],
            'testNameId': [null, forms_1.Validators.required],
            'doctorName': [null],
            'patientId': [null, forms_1.Validators.required],
            'appointmentId': [null, forms_1.Validators.required],
            'labTest': this.fb.array([this.createLabTest()]),
        });
    };
    PatientAddLabOrdersComponent.prototype.createLabTest = function () {
        return this.fb.group({
            'textCode': '',
            'textName': '',
            'resultValue': '',
            'units': '',
            'normalRange': '',
        });
    };
    PatientAddLabOrdersComponent.prototype.patchOrderData = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_LABORDER_BY_ID + this.orderId + '?orderId=' + this.testId).subscribe(function (res) {
            if (res['responseCode'] === 'LAB_ORDER_SUC_02') {
                _this.labOrder = res['responseData']['data'];
                _this.labTestList = res['responseData']['labTest'];
                _this.listOfAppointment = res['responseData']['appointment'];
                _this.LabReadList = _this.labTestList;
                if (_this.LabReadList.length > 0) {
                    for (var i = 0; i < _this.LabReadList.length; i++) {
                        var test = _this.LabReadList[i];
                        //labTests[i];
                        if (test != null) {
                            _this.LabReadList[i].testCode = test.loincCode;
                            _this.LabReadList[i].resultValue = test.resultValue;
                            _this.LabReadList[i].unit = test.units;
                            _this.LabReadList[i].minNormalRange = test.normalRange;
                        }
                    }
                    _this.addUpdateResponseTest(_this.LabReadList.length);
                    console.log(_this.patient);
                }
                if (_this.labOrder.length > 0) {
                    var associateAppoint_1 = _this.labOrder[0].appointment;
                    _this.urlOrganization = _this.labOrder[0].imgURL;
                    var selectAppointment = _this.patient.pastAppointments.filter(function (listing) { return listing.id === associateAppoint_1.id; });
                    //   console.log(this.labOrder.appointment[0].id);
                    _this.appointmentId = selectAppointment.appointmentId;
                    if (selectAppointment != null) {
                        _this.selectedAppointmentId = selectAppointment[0].label;
                    }
                }
                //   console.log(this.labOrder);
                /*let apptId = res['responseData']['pastAppointments'];
                this.appointmentList=response['responseData']['pastAppointments'];*/
                //     debugger;
                //   this.doctorAppointment=apptId[]
                //    console.log(apptId);
                //    this.appointmentId  = apptId[0].id;
                if (_this.LabReadList.length > 0) {
                    _this.selectedString = _this.LabReadList[0].testCode.toString();
                }
                if (_this.labOrder.length > 0) {
                    var DateTest = _this.labOrder[0].dateTest;
                    debugger;
                    if (DateTest != null) {
                        DateTest = new Date(_this.labOrder[0].dateTest);
                    }
                    else {
                        DateTest = new Date();
                    }
                    _this.dateTest = DateTest;
                    //  document.getElementById("TestDate") = DateTest;
                    /* this.labForm.patchValue({
                     //    orderStatus: this.labOrder[0].status,
                         dateTest: DateTest
                    //    comments: this.labOrder[0].comments,
                    ///     labTest : this.LabReadList,



                     });*/
                }
                if (_this.labOrder.length > 0) {
                    _this.labForm.patchValue({
                        orderStatus: _this.labOrder[0].status,
                        //      dateTest: DateTest,
                        comments: _this.labOrder[0].comments,
                        labTest: _this.LabReadList,
                    });
                }
                _this.isUpdate = true;
            }
            else {
                _this.notificationService.error(res['responseMessage'], '');
                // this.router.navigate(['404-not-found'])
            }
            /* this.LabReadList=res.labTests;
             for(let i = 0; i < res.labTests.length; i++) {
                 let test = res.labTests[i];

                 if(test!=null) {
                     this.LabReadList[i].testCode=test.loincCode;
                     this.LabReadList[i].resultValue=test.resultValue;
                     this.LabReadList[i].unit=test.units;
                     this.LabReadList[i].minNormalRange=test.normalRange;
                 }
             }*/
            /* debugger;
             this.addUpdateResponseTest(res.labTests.length);

             let selectAppointment=this.patient.pastAppointments.filter((listing: any) => listing.appointmentId === res.appointment[0].appointmentId);
             debugger;
             if(selectAppointment!=null){
                 this.selectedAppointmentId=selectAppointment[0].label;
             }*/
            /*debugger;
            for (let sel of selectAppointment) {
                var pair: any = {label: sel.label, value: sel.label};
                this.selectedAppointmentId.push(pair);
            }*/
            /* this.selectedString=res.labTests[0].testCode.toString();
             debugger;
             this.labForm.patchValue({
                 orderStatus: res.status,
                 orderTestDate: new Date(),
                 comments: res.comments,
                 labTest : res.labTests,



             });
             this.isUpdate=true;*/
        }, function (error) {
            //console.log(error.json());
            _this.error = error.error.error_description;
        });
    };
    PatientAddLabOrdersComponent.prototype.addMoreTest = function () {
        this.labTest = this.labForm.get('labTest');
        this.labTest.push(this.createLabTest());
    };
    PatientAddLabOrdersComponent.prototype.addUpdateResponseTest = function (no) {
        this.removeAllFields();
        this.labTest = this.labForm.get('labTest');
        for (var i = 0; i < no; i++) {
            this.labTest.push(this.createLabTest());
        }
    };
    PatientAddLabOrdersComponent.prototype.removeAllFields = function () {
        this.labTest = this.labForm.get('labTest');
        var examRoomLen = this.labTest.length;
        for (var i = 0; i < examRoomLen; i++) {
            this.labTest.removeAt(0);
        }
    };
    PatientAddLabOrdersComponent.prototype.goToStatus = function (valueObj) {
        var value = valueObj.value;
        this.labForm.controls['orderStatus'].setValue(value);
    };
    PatientAddLabOrdersComponent.prototype.clearField = function () {
        this.filterSpeciman.description = '';
        this.filterSpeciman.unit = '';
        this.filterSpeciman.minNormalRange = '';
        this.filterSpeciman.maxNormalRange = '';
        this.filterSpeciman.testCode = '';
        this.filterSpeciman.testName = '';
        this.resultValue = '';
    };
    PatientAddLabOrdersComponent.prototype.deleteTestEdit = function () {
        this.createLabTest();
        this.selectedTest.testCode = '';
        this.selectedTest.testName = '';
        this.selectedTest.unit = '';
        this.selectedTest.maxNormalRange = '';
        this.selectedTest.id = 0;
        this.selectedTest.resultValue = '';
    };
    /* addLabOrder(data:any ){

         data.testDate=new Date(this.dateTest);
         debugger;
             if (this.labForm.valid) {
                 if (this.orderId > 0) {

                     this.requestService.putRequest(AppConstants.LAB_ORDER_UPDATE + this.orderId, data)
                         .subscribe(
                             (response: Response) => {
                                 if (response['responseCode'] === 'LAB_ORDER_SUC_03') {
                                     this.notificationService.success('LabOrder is Updated Successfully');
                                     this.router.navigate(['/dashboard/patient/lab-orders/', this.id, 'history']);
                                 }
                             }, function (error) {
                                 this.notificationService.error('ERROR', 'LabOrder is not Updated');
                             });
                 } else {
                     debugger;
                     data.labTest = this.LabReadList;
                     this.requestService.postRequest(AppConstants.LAB_ORDER_CREATE, data)
                         .subscribe(
                             (response: Response) => {
                                 if (response['responseCode'] === 'LAB_ORDER_SUC_01') {
                                     this.notificationService.success('LabOrder is Created Successfully');
                                     this.router.navigate(['/dashboard/patient/lab-orders/', this.id, 'history']);
                                 }
                             }, function (error) {
                                 this.notificationService.error('ERROR', 'LabOrder is not Created');
                             });
                 }

             } else {
                 this.validateAllFormFields(this.labForm);
             }

     }*/
    PatientAddLabOrdersComponent.prototype.addLabOrder = function (data) {
        var _this = this;
        data.testDate = new Date(this.dateTest);
        if (this.orderId > 0) {
            data.labTest = this.LabReadList;
            data.testDate = new Date(this.dateTest);
            console.log(data);
            //put request
            this.requestService.putRequestMultipartFormAndDataWithOneFile(app_constants_1.AppConstants.LAB_ORDER_UPDATE + this.orderId, data, this.profileImg)
                .subscribe(function (response) {
                if (response['responseCode'] === 'LAB_ORDER_SUC_03') {
                    _this.notificationService.success('LabOrder is Updated Successfully');
                    _this.router.navigate(['/dashboard/patient/lab-orders/', _this.id, 'history']);
                }
            }, function (error) {
                this.notificationService.error('ERROR', 'LabOrder is not Updated');
            });
        }
        else {
            data.labTest = this.LabReadList;
            if (this.labForm.valid) {
                console.log(data);
                this.requestService.postRequestMultipartFormAndDataWithOneFile(app_constants_1.AppConstants.LAB_ORDER_CREATE, data, this.profileImg)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'LAB_ORDER_SUC_01') {
                        _this.notificationService.success('LabOrder is Created Successfully');
                        _this.router.navigate(['/dashboard/patient/lab-orders/', _this.id, 'history']);
                    }
                }, function (error) {
                    this.notificationService.error('ERROR', 'LabOrder is not Created');
                });
            }
            else {
                this.validateAllFormFields(this.labForm);
            }
        }
    };
    /*else{

         if (this.orderId > 0) {
             data.labTest = this.LabReadList;
             data.testDate=new Date(this.dateTest);
             console.log(data);
             debugger;
             this.requestService.putRequest(AppConstants.LAB_ORDER_UPDATE + this.orderId, data)
                 .subscribe(
                     (response: Response) => {
                         if (response['responseCode'] === 'LAB_ORDER_SUC_03') {
                             this.notificationService.success('LabOrder is Updated Successfully');
                             this.router.navigate(['/dashboard/patient/lab-orders/', this.id, 'history']);
                         }
                     }, function (error) {
                         this.notificationService.error('ERROR', 'LabOrder is not Updated');
                     });
         }
     }*/
    PatientAddLabOrdersComponent.prototype.validateAllFormFields = function (formGroup) {
        var _this = this;
        console.log('i am validating');
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
    PatientAddLabOrdersComponent.prototype.selectedAppointment = function (aptObje) {
        var id = aptObje.value;
        if (this.appointmentList.length > 0) {
            var doctorName = this.appointmentList.filter(function (listing) { return listing.id === id; });
            this.doctorAppointment = doctorName[0].docFirstName + ' ' + doctorName[0].docLastName;
            // console.log('apt idd ' +  id + '' )
            this.showDoctor = true;
            this.labForm.controls['appointmentId'].setValue(id);
        }
        else {
        }
        //  this.labForm.controls['doctorName'].setValue()
    };
    PatientAddLabOrdersComponent.prototype.isEmpty = function (val) {
        return (val === undefined || val == null || val.length <= 0) ? true : false;
    };
    PatientAddLabOrdersComponent.prototype.addLabtoGrid = function (event) {
        var _this = this;
        this.selectedTest = new LabTestModel_1.LabTestModel();
        this.selectedTest.testCode = this.singleObj.testCode;
        this.selectedTest.unit = this.singleObj.unit;
        this.selectedTest.minNormalRange = this.singleObj.minNormalRange + "-" + this.singleObj.maxNormalRange;
        this.selectedTest.id = this.singleObj.id;
        this.selectedTest.resultValue = this.resultValue;
        //  this.selectedTestNew=this.singleObj.testName;
        if (!this.isEmpty(this.resultValue)) {
            this.LabReadList.push(this.selectedTest);
            this.show = false;
            this.showEdit = false;
            this.clearField();
            var arr = this.filteredTestSingle.filter(function (listing) { return listing.id === _this.selectedTest.id; });
            this.filteredTestSingle.splice(arr[0], 1);
        }
        else {
            this.isError = false;
            this.LabReadList.push(this.selectedTest);
            this.show = false;
            this.showEdit = false;
            this.clearField();
            var arr = this.filteredTestSingle.filter(function (listing) { return listing.id === _this.selectedTest.id; });
            this.filteredTestSingle.splice(arr[0], 1);
        }
    };
    PatientAddLabOrdersComponent.prototype.updateLabtoGrid = function (event) {
        this.selectedTest = new LabTestModel_1.LabTestModel();
        this.selectedTest.testCode = this.filterSpeciman.testCode;
        this.selectedTest.unit = this.filterSpeciman.unit;
        this.selectedTest.minNormalRange = this.filterSpeciman.minNormalRange;
        this.selectedTest.id = this.filterSpeciman.id;
        this.selectedTest.resultValue = this.resultValue;
        if (!this.isEmpty(this.resultValue)) {
            this.LabReadList[this.editIndex] = this.selectedTest;
            this.clearField();
            this.show = false;
            this.showEdit = false;
        }
        else {
            this.isError = true;
        }
    };
    PatientAddLabOrdersComponent.prototype.unSelectedList = function () {
        var _this = this;
        if (this.filteredTestSingle) {
            var list = Object.assign([], this.filteredTestSingle);
            var i = 0, len = this.LabReadList.length;
            for (; i < len; i++) {
                var index = list.findIndex(function (list) { return list.id === _this.LabReadList[i].id; });
                if (index != -1) {
                    list.splice(index, 1);
                }
            }
            this.filteredTestSingle = list;
        }
    };
    PatientAddLabOrdersComponent.prototype.editLabtoGrid = function (value) {
        this.selectedTest = new LabTestModel_1.LabTestModel();
        if (this.LabReadList.length > 0) {
            this.filterSpeciman.testCode = this.LabReadList[value].testCode;
            this.filterSpeciman.unit = this.LabReadList[value].unit;
            this.filterSpeciman.minNormalRange = this.LabReadList[value].minNormalRange;
            this.filterSpeciman.id = this.LabReadList[value].id;
            this.resultValue = this.LabReadList[value].resultValue;
            this.selectedTest.testCode = this.LabReadList[value].testCode;
            this.selectedTest.unit = this.LabReadList[value].unit;
            this.selectedTest.minNormalRange = this.LabReadList[value].minNormalRange;
            this.selectedTest.id = this.LabReadList[value].id;
            this.selectedTest.resultValue = this.LabReadList[value].resultValue;
            this.LabReadList[value] = this.selectedTest;
            this.editIndex = value;
            this.show = true;
            this.showEdit = true;
        }
    };
    PatientAddLabOrdersComponent.prototype.removeLabtoGrid = function (value) {
        var arr = this.LabReadList.filter(function (listing) { return listing.id === value; });
        if (arr.length >= 0) {
            // this.filteredTestSingle.push(arr[0]);
            this.LabReadList.splice(arr, 1);
        }
    };
    PatientAddLabOrdersComponent.prototype.showUpdatedItem = function (obj) {
        var updateItem = this.LabReadList.items.find(this.findIndexToUpdate, obj.id);
        var index = this.LabReadList.items.indexOf(updateItem);
        this.LabReadList.items[index] = obj.id;
    };
    PatientAddLabOrdersComponent.prototype.findIndexToUpdate = function (object) {
        return this.LabReadList.id === this;
    };
    PatientAddLabOrdersComponent.prototype.uploadImgOnChange = function (event) {
        var fileList = event.target.files;
        debugger;
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === "profileImgUrl") {
                this.profileImg = fileList[0];
            }
        }
    };
    PatientAddLabOrdersComponent = __decorate([
        core_1.Component({
            selector: 'patient-lab-orders',
            templateUrl: '../../../templates/dashboard/patient/patient-add-lab-orders.template.html',
        }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, forms_1.FormBuilder, requests_service_1.RequestsService, notification_service_1.NotificationService, his_util_service_1.HISUtilService])
    ], PatientAddLabOrdersComponent);
    return PatientAddLabOrdersComponent;
}());
exports.PatientAddLabOrdersComponent = PatientAddLabOrdersComponent;
//# sourceMappingURL=patient-add-lab-orders.component.js.map