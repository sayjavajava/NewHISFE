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
var medication_model_1 = require("../../../model/medication.model");
var notification_service_1 = require("../../../services/notification.service");
var requests_service_1 = require("../../../services/requests.service");
var his_util_service_1 = require("../../../services/his-util.service");
var app_constants_1 = require("../../../utils/app.constants");
var DataService_1 = require("../../../services/DataService");
var patient_1 = require("../../../model/patient");
var drug_model_1 = require("../../../model/drug.model");
var angular2_datetimepicker_1 = require("angular2-datetimepicker");
var common_1 = require("@angular/common");
var PatientMedicationListComponent = (function () {
    function PatientMedicationListComponent(notificationService, route, requestsService, HISUtilService, router, activatedRoute, dataService, datepipe) {
        var _this = this;
        this.notificationService = notificationService;
        this.route = route;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataService = dataService;
        this.datepipe = datepipe;
        this.pages = [];
        this.medicationData = [];
        this.medicationModel = new medication_model_1.MedicationModel();
        this.appointments = [];
        this.isUpdate = false;
        this.patient = new patient_1.Patient();
        this.futureAppointments = [];
        this.pastAppointments = [];
        this.text = '';
        this.drugs = [];
        this.searchedDrugNames = [];
        this.date = new Date();
        this.dateStarted = new Date();
        this.dateEnded = new Date();
        this.drug = new drug_model_1.DrugModel();
        this.searchedDrugNamesLst = [];
        this.searchedDrugStrengths = new drug_model_1.DrugModel();
        this.cols = [];
        this.StrengthListModified = [];
        this.isUpdateAppoint = false;
        this.searchedDrugStrengthsAnyListModified = [];
        this.selectedstr = [];
        /* this.subscription = this.dataService.currentPatientId.subscribe(id => {
             this.selectedPatientId = id;
         });*/
        this.route.params.subscribe(function (params) {
            _this.selectedPatientId = params['id'];
        });
        this.getPaginatedMedicationFromServer(0);
        this.appointmentsByPatientFromServer(this.selectedPatientId);
        angular2_datetimepicker_1.DatePicker.prototype.ngOnInit = function () {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }
            this.settings.timePicker = true;
            this.date = new Date();
        };
    }
    PatientMedicationListComponent.prototype.ngOnInit = function () {
        this.statusType = [
            { label: 'ACTIVE', value: 'ACTIVE' },
            { label: 'IN-ACTIVE', value: 'IN-ACTIVE' },
        ];
        this.orderStatusList = [
            { label: 'administered during visit', value: 'administered during visit' },
            { label: 'Electronic eRx Sent', value: 'Electronic eRx Sent' },
            { label: 'Phoned into Pharmacy"', value: 'Phoned into Pharmacy"' },
            { label: 'Faxed to Pharmacy', value: 'Faxed to Pharmacy' },
            { label: 'Paper Rx', value: 'Paper Rx' },
            { label: 'Prescription Printed', value: 'Prescription Printed' },
            { label: 'Discontinued', value: 'Discontinued' },
            { label: 'Prescribed by other Dr', value: 'Prescribed by other Dr' },
            { label: 'Over the Counter', value: 'Over the Counter' },
        ];
        this.durationList = [
            { label: 'Days ', value: 'Days ' },
            { label: 'Week ', value: 'Week ' },
            { label: 'Month ', value: 'Month ' },
        ];
        /*<th> Appointment Date/Time</th>
        <th> Medication</th>
        <th>Strengths</th>
        <th>Frequency</th>
        <th> Duration</th>
        <th> SIG </th>
        <th> Start Date</th>
        <th>Action</th>*/
        this.cols = [
            { field: 'appointmentDate', header: 'Appointment Date/Time' },
            { field: 'drugName', header: 'Medication' },
            { field: 'strengths', header: 'Strengths' },
            { field: 'frequency', header: 'Frequency' },
            { field: 'duration', header: 'Duration' },
            { field: 'pharmacyNote', header: 'SIG' },
            { field: 'datePrescribedString', header: 'Start Date' },
            { field: 'status', header: 'Action' },
        ];
    };
    PatientMedicationListComponent.prototype.appointmentsByPatientFromServer = function (selectedPatientId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + selectedPatientId).subscribe(function (response) {
                if (response['responseCode'] === 'USER_SUC_01') {
                    _this.patient = response['responseData'];
                    _this.futureAppointments = [];
                    _this.futureAppointments = response['responseData'].futureAppointments;
                    _this.pastAppointments = [];
                    _this.pastAppointments = response['responseData'].pastAppointments;
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Patient');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientMedicationListComponent.prototype.addMedication = function () {
        this.isUpdate = false;
        this.isUpdateAppoint = false;
        this.medicationModel = new medication_model_1.MedicationModel();
        this.appointmentsByPatientFromServer(this.selectedPatientId);
        this.getAllDrugsFromServer();
    };
    PatientMedicationListComponent.prototype.getRouteDrug = function (txt) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_NAME_ROUTE + txt)
            .subscribe(function (response) {
            if (response['responseCode'] === 'DRUG_SUC_10') {
                _this.routeDrug = response['responseData'];
                //   let drug = new DrugModel();
                console.log(_this.routeDrug);
                _this.medicationModel.route = _this.routeDrug;
                //    this.medicationModel.strengths=this.routeDrug.strengths;
            }
            else {
                _this.notificationService.error(response['responseMessage']);
            }
        }),
            function (error) {
                _this.notificationService.error(error.error.error);
            };
    };
    PatientMedicationListComponent.prototype.openUrl = function (val) {
        var url = '';
        if (!/^http[s]?:\/\//.test(val)) {
            url += 'http://';
        }
        url += val;
        window.open(url, '_blank');
        //   window.open("https://www.google.com", "_blank");
    };
    PatientMedicationListComponent.prototype.getStrengthsDrug = function (txt) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_NAME_STRENGTHS + txt)
            .subscribe(function (response) {
            if (response['responseCode'] === 'DRUG_SUC_10') {
                _this.searchedDrugStrengths = response['responseData'];
                _this.searchedDrugStrengthsAny = _this.searchedDrugStrengths.strengths;
                for (var _i = 0, _a = _this.searchedDrugStrengthsAny; _i < _a.length; _i++) {
                    var strenths = _a[_i];
                    var pair = { label: strenths, value: strenths };
                    _this.searchedDrugStrengthsAnyListModified.push(pair);
                }
                _this.selectedstr = _this.searchedDrugStrengthsAnyListModified[0].value;
                _this.strengthLst = _this.searchedDrugStrengths.strengths;
                _this.medicationModel.strengths = _this.searchedDrugStrengths.strengths[0];
                _this.medicationModel.strengths = _this.searchedDrugStrengths.strengths;
                console.log(_this.medicationModel.strengths);
            }
            else {
                _this.notificationService.error(response['responseMessage']);
            }
        }),
            function (error) {
                _this.notificationService.error(error.error.error);
            };
    };
    PatientMedicationListComponent.prototype.saveMedication = function (mdForm) {
        var _this = this;
        this.medicationModel.drugName = this.text;
        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
        if (this.medicationModel.appointmentId <= 0) {
            this.notificationService.warn('Please select appoint.');
            document.getElementById('appointmentId').focus();
            return;
        }
        if (this.medicationModel.drugName === '') {
            this.notificationService.warn('Please provide drug name.');
            document.getElementById('drugNameId').focus();
            return;
        }
        if (this.medicationModel.datePrescribedDate === null) {
            this.notificationService.warn('Please provide proper prescribed date and time.');
            document.getElementById('datePrescribedId').focus();
            return;
        }
        if (this.medicationModel.dateStartedTakingDate === null) {
            this.notificationService.warn('Please provide proper start taking date and time.');
            document.getElementById('dateStartedTakingId').focus();
            return;
        }
        if (this.medicationModel.dateStoppedTakingDate === null) {
            this.notificationService.warn('Please provide proper stoop taking date and time.');
            document.getElementById('dateStoppedTakingId').focus();
            return;
        }
        this.medicationModel.datePrescribedDate = new Date(this.medicationModel.datePrescribedDate);
        this.medicationModel.dateStartedTakingDate = new Date(this.medicationModel.dateStartedTakingDate);
        this.medicationModel.dateStoppedTakingDate = new Date(this.medicationModel.dateStoppedTakingDate);
        this.medicationModel.strengths = this.selectedstr;
        if (localStorage.getItem(btoa('access_token'))) {
            this.medicationModel.patientId = this.selectedPatientId;
            console.log(this.medicationModel);
            this.requestsService.postRequest(app_constants_1.AppConstants.MEDICATION_SAVE_URL, this.medicationModel)
                .subscribe(function (response) {
                if (response['responseCode'] === 'MEDICATION_SUC_28') {
                    _this.notificationService.success(response['responseMessage'], 'Medication');
                    _this.getPaginatedMedicationFromServer(0);
                    _this.closeBtnMedication.nativeElement.click();
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Medication');
                    _this.getPaginatedMedicationFromServer(0);
                }
            }, function (error) {
                if (error.error.responseMessage === 'Patient not found' ||
                    error.error.responseMessage === 'Appoint not found') {
                    _this.notificationService.error(error.error.responseMessage, 'Medication');
                }
                else {
                    _this.HISUtilService.tokenExpired(error.error.error);
                }
            });
        }
    };
    PatientMedicationListComponent.prototype.getPaginatedMedicationFromServer = function (page) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.MEDICATION_PAGINATED_URL + page + '?selectedPatientId=' + this.selectedPatientId)
            .subscribe(function (response) {
            if (response['responseCode'] === 'MEDICATION_SUC_32') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.medicationData = response['responseData']['data'];
                console.log(_this.medicationData);
            }
            else {
                _this.notificationService.error(response['responseMessage']);
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    PatientMedicationListComponent.prototype.getPageWiseMedications = function (p) {
        this.getPaginatedMedicationFromServer(p);
    };
    PatientMedicationListComponent.prototype.deleteMedication = function (medicationId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete'))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.MEDICATION_DELETE_URI + medicationId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'MEDICATION_SUC_33') {
                    _this.notificationService.success(response['responseMessage'], 'Medication');
                    _this.getPaginatedMedicationFromServer(0);
                }
                else {
                    _this.getPaginatedMedicationFromServer(0);
                    _this.notificationService.error(response['responseMessage'], 'Medication');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientMedicationListComponent.prototype.editMedication = function (medicationId) {
        var _this = this;
        this.isUpdate = true;
        this.isUpdateAppoint = false;
        this.medicationModel = new medication_model_1.MedicationModel();
        this.getAllDrugsFromServer();
        if (medicationId > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(app_constants_1.AppConstants.MEDICATION_GET_URL + 'medicationId=' + medicationId)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'MEDICATION_SUC_34') {
                        _this.medicationModel = response['responseData'];
                        _this.text = _this.medicationModel.drugName;
                        _this.medicationModel.datePrescribedDate = new Date(_this.medicationModel.datePrescribedString);
                        _this.medicationModel.dateStartedTakingDate = new Date(_this.medicationModel.dateStartedTakingString);
                        _this.medicationModel.dateStoppedTakingDate = new Date(_this.medicationModel.dateStoppedTakingString);
                        _this.medicationModel.status = _this.medicationModel.status;
                        _this.isUpdateAppoint = true;
                        _this.selectedstr = _this.medicationModel.strengths;
                        _this.appointmentsByPatientFromServer(_this.medicationModel.patientId);
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Medication');
                    }
                }, function (error) {
                    _this.HISUtilService.tokenExpired(error.error.error);
                });
            }
            else {
                this.router.navigate(['/login']);
            }
        }
        else {
            this.notificationService.error('Please select proper Medication', 'Medication');
        }
    };
    PatientMedicationListComponent.prototype.updateMedication = function (mdForm) {
        var _this = this;
        this.medicationModel.drugName = this.text;
        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
        if (this.medicationModel.appointmentId <= 0) {
            this.notificationService.warn('Please select appoint.');
            document.getElementById('appointmentId').focus();
            return;
        }
        if (this.medicationModel.drugName === '') {
            this.notificationService.warn('Please provide drug name.');
            document.getElementById('drugNameId').focus();
            return;
        }
        if (this.medicationModel.datePrescribedDate === null) {
            this.notificationService.warn('Please provide proper prescribed date and time.');
            document.getElementById('datePrescribedId').focus();
            return;
        }
        if (this.medicationModel.dateStartedTakingDate === null) {
            this.notificationService.warn('Please provide proper start taking date and time.');
            document.getElementById('dateStartedTakingId').focus();
            return;
        }
        if (this.medicationModel.dateStoppedTakingDate === null) {
            this.notificationService.warn('Please provide proper stoop taking date and time.');
            document.getElementById('dateStoppedTakingId').focus();
            return;
        }
        this.medicationModel.datePrescribedDate = new Date(this.medicationModel.datePrescribedDate);
        this.medicationModel.dateStartedTakingDate = new Date(this.medicationModel.dateStartedTakingDate);
        this.medicationModel.dateStoppedTakingDate = new Date(this.medicationModel.dateStoppedTakingDate);
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.putRequest(app_constants_1.AppConstants.MEDICATION_UPDATE_URL, this.medicationModel)
                .subscribe(function (response) {
                if (response['responseCode'] === 'MEDICATION_SUC_35') {
                    _this.notificationService.success(response['responseMessage'], 'Medication');
                    _this.getPaginatedMedicationFromServer(0);
                    _this.closeBtnMedication.nativeElement.click();
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Medication');
                    _this.getPaginatedMedicationFromServer(0);
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientMedicationListComponent.prototype.getPaginatedDataFromServer = function (page) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.PAGINATED_URL + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'MEDICATION_SUC_32') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.medicationData = response['responseData']['data'];
                console.log("All" + _this.medicationData);
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    PatientMedicationListComponent.prototype.isEmpty = function (val) {
        return (val === undefined || val == null || val.length <= 0) ? true : false;
    };
    PatientMedicationListComponent.prototype.search = function (event) {
        var _this = this;
        if (this.isEmpty(this.text) == false) {
            this.getRouteDrug(this.text);
            this.getStrengthsDrug(this.text);
        }
        this.requestsService.getRequest(app_constants_1.AppConstants.DRUG_SEARCH_BY_NAME_URL + this.text)
            .subscribe(function (response) {
            if (response['responseCode'] === 'DRUG_SUC_10') {
                _this.searchedDrugNames = response['responseData'];
            }
            else {
                _this.notificationService.error(response['responseMessage']);
            }
        }),
            function (error) {
                _this.notificationService.error(error.error.error);
            };
    };
    PatientMedicationListComponent.prototype.getAllDrugsFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.DRUG_GET_ALL_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'DRUG_SUC_10') {
                _this.drugs = response['responseData'];
            }
            else {
                _this.notificationService.error(response['responseMessage']);
            }
        }),
            function (error) {
                _this.notificationService.error(error.error.error);
            };
    };
    __decorate([
        core_1.ViewChild('closeBtnMedication'),
        __metadata("design:type", core_1.ElementRef)
    ], PatientMedicationListComponent.prototype, "closeBtnMedication", void 0);
    PatientMedicationListComponent = __decorate([
        core_1.Component({
            selector: 'patient-medical-list',
            templateUrl: '../../../templates/dashboard/patient/patient-medication-list.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService, router_1.ActivatedRoute,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router,
            router_1.ActivatedRoute,
            DataService_1.DataService, common_1.DatePipe])
    ], PatientMedicationListComponent);
    return PatientMedicationListComponent;
}());
exports.PatientMedicationListComponent = PatientMedicationListComponent;
//# sourceMappingURL=patient-medication-list.component.js.map