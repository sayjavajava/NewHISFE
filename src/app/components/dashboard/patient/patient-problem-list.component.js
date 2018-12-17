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
var notification_service_1 = require("../../../services/notification.service");
var requests_service_1 = require("../../../services/requests.service");
var his_util_service_1 = require("../../../services/his-util.service");
var patient_problem_model_1 = require("../../../model/patient.problem.model");
var app_constants_1 = require("../../../utils/app.constants");
var patient_1 = require("../../../model/patient");
var DataService_1 = require("../../../services/DataService");
var angular2_datetimepicker_1 = require("angular2-datetimepicker");
var PatientProblemListComponent = (function () {
    function PatientProblemListComponent(notificationService, route, requestsService, HISUtilService, router, activatedRoute, dataService) {
        var _this = this;
        this.notificationService = notificationService;
        this.route = route;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataService = dataService;
        this.pages = [];
        this.problemData = [];
        this.ppm = new patient_problem_model_1.PatientProblemModel();
        this.appointments = [];
        this.isUpdate = false;
        this.patient = new patient_1.Patient();
        this.futureAppointments = [];
        this.pastAppointments = [];
        this.isRequestUnderProcess = false;
        this.date = new Date();
        this.selectedCodeId = [];
        this.route.params.subscribe(function (params) {
            _this.selectedPatientId = params['id'];
        });
        this.appointmentsByServer();
        angular2_datetimepicker_1.DatePicker.prototype.ngOnInit = function () {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }
            this.settings.timePicker = true;
            this.date = new Date();
        };
    }
    PatientProblemListComponent.prototype.ngOnInit = function () {
        document.title = 'HIS | Problem list';
        this.getPaginatedProblemsFromServer(0);
        this.statusType = [
            { label: 'ACTIVE', value: 'ACTIVE' },
            { label: 'IN-ACTIVE', value: 'IN-ACTIVE' },
        ];
        this.cols = [
            { field: 'versionName', header: 'Version' },
            { field: 'codeName', header: 'Code' },
            { field: 'problemName', header: 'Name' },
            { field: 'dateDiagnosis', header: 'Diagnosis Date' },
            { field: 'note', header: 'Notes' },
            { field: 'status', header: 'Status' },
            { field: 'action', header: 'Action' }
        ];
        /* this.problemList = [
             {label: 'Fever ', value: '0 '},
             {label: 'General ', value: '1 '},
             {label: 'BackBone ', value: '2 '}
         ];*/
    };
    PatientProblemListComponent.prototype.appointmentsByServer = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + this.selectedPatientId).subscribe(function (response) {
                if (response['responseCode'] === 'USER_SUC_01') {
                    _this.patient = response['responseData'];
                    _this.futureAppointments = [];
                    _this.futureAppointments = response['responseData'].futureAppointments;
                    _this.pastAppointments = [];
                    _this.pastAppointments = response['responseData'].pastAppointments;
                    console.log(_this.pastAppointments);
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
    PatientProblemListComponent.prototype.appointmentsByPatientServer = function (selectedPatientId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + selectedPatientId).subscribe(function (response) {
                if (response['responseCode'] === 'USER_SUC_01') {
                    _this.patient = response['responseData'];
                    _this.futureAppointments = response['responseData'].futureAppointments;
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
    PatientProblemListComponent.prototype.versionsByServer = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(app_constants_1.AppConstants.ICD_VERSIONS)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_VERSIONS_FOUND_03') {
                    _this.iCDVersions = response['responseData'];
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientProblemListComponent.prototype.addProblemPopupClick = function () {
        this.isUpdate = false;
        this.ppm = new patient_problem_model_1.PatientProblemModel();
        this.appointmentsByServer();
        this.versionsByServer();
    };
    PatientProblemListComponent.prototype.changedVersion = function (associatedICDCVId) {
        this.ppm.selectedCodeId = -1;
        this.codesByVersionFromServer(associatedICDCVId);
    };
    PatientProblemListComponent.prototype.codesByVersionFromServer = function (associatedICDCVId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(app_constants_1.AppConstants.ICD_CODES_ASSOCIATED_BY_VERSION_ID + associatedICDCVId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ICD_ASSOCIATED_FOUND_SUC_02') {
                    _this.associatedCodes = [];
                    _this.associatedCodes = response['responseData'].code;
                    debugger;
                    for (var i = 0; i < _this.associatedCodes.length; i++) {
                        var problems = _this.associatedCodes[i];
                        var pair = { label: problems.problem, value: problems.id };
                        _this.selectedCodeId.push(pair);
                    }
                    console.log(_this.associatedCodes);
                    debugger;
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
    };
    PatientProblemListComponent.prototype.savePatientProblem = function () {
        var _this = this;
        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
        if (this.ppm.appointmentId <= 0) {
            this.notificationService.warn('Please select appoint.');
            //  document.getElementById('selectedAppointmentId').focus();
            return;
        }
        if (this.ppm.selectedICDVersionId <= 0) {
            this.notificationService.warn('Please select Version.');
            //   document.getElementById('icdVersionId').focus();
            return;
        }
        if (this.ppm.selectedCodeId <= 0) {
            this.notificationService.warn('Please select Code.');
            //   document.getElementById('associatedCodesId').focus();
            return;
        }
        if (this.ppm.datePrescribedDate === null) {
            this.notificationService.warn('Please enter Diagnosis Date.');
            //    document.getElementById('dateDiagnosisId').focus();
            return;
        }
        this.ppm.datePrescribedDate = new Date(this.ppm.datePrescribedDate);
        console.log(this.ppm);
        if (!this.isRequestUnderProcess) {
            this.isRequestUnderProcess = true;
            if (localStorage.getItem(btoa('access_token'))) {
                this.ppm.patientId = this.selectedPatientId;
                this.requestsService.postRequest(app_constants_1.AppConstants.PATIENT_PROBLEM_SAVE_URL, this.ppm)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_14') {
                        _this.notificationService.success(response['responseMessage'], 'Problem of Patient');
                        _this.getPaginatedProblemsFromServer(0);
                        _this.closeBtn.nativeElement.click();
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Problem of Patient');
                        _this.getPaginatedProblemsFromServer(0);
                    }
                    _this.isRequestUnderProcess = false;
                }, function (error) {
                    _this.HISUtilService.tokenExpired(error.error.error);
                    _this.isRequestUnderProcess = false;
                });
            }
        }
        else {
            this.notificationService.warn('Your first request is under process,Please wait...');
            return;
        }
    };
    PatientProblemListComponent.prototype.getPaginatedProblemsFromServer = function (page) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_PROBLEM_FETCH_URL + page + '?patientId=' + this.selectedPatientId)
            .subscribe(function (response) {
            if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_16') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.problemData = response['responseData']['data'];
                console.log(_this.problemData);
            }
            else {
                _this.notificationService.error(response['responseMessage']);
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    PatientProblemListComponent.prototype.deletePatientProblem = function (problemId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete'))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.PATIENT_PROBLEM_DELETE_URI + problemId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'PATIENT_SUC_06') {
                    _this.notificationService.success(response['responseMessage'], 'Problem of Patient');
                    _this.getPaginatedProblemsFromServer(0);
                }
                else {
                    _this.getPaginatedProblemsFromServer(0);
                    _this.notificationService.error(response['responseMessage'], 'Problem of Patient');
                }
            }, function (error) {
                //console.log(error.json())
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientProblemListComponent.prototype.editPatientProblem = function (problemId) {
        var _this = this;
        this.isUpdate = true;
        if (problemId > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_PROBLEM_GET_URL + 'problemId=' + problemId)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'USER_SUC_01') {
                        _this.ppm = response['responseData'];
                        _this.appointmentsByPatientServer(_this.ppm.patientId);
                        _this.versionsByServer();
                        debugger;
                        _this.codesByVersionFromServer(_this.ppm.selectedICDVersionId);
                        _this.ppm.datePrescribedDate = new Date(_this.ppm.dateDiagnosis);
                        // this.selectedCodeId=this.ppm.codeName;
                        debugger;
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Problem of Patient');
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
            this.notificationService.error('Please select proper problem', 'Problem of Patient');
        }
    };
    PatientProblemListComponent.prototype.updatePatientProblem = function () {
        var _this = this;
        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
        if (this.ppm.appointmentId <= 0) {
            this.notificationService.warn('Please select appoint.');
            //    document.getElementById('selectedAppointmentId').focus();
            return;
        }
        if (this.ppm.selectedICDVersionId <= 0) {
            this.notificationService.warn('Please select Version.');
            //     document.getElementById('icdVersionId').focus();
            return;
        }
        if (this.ppm.selectedCodeId <= 0) {
            this.notificationService.warn('Please select Code.');
            //    document.getElementById('associatedCodesId').focus();
            return;
        }
        if (this.ppm.datePrescribedDate === null) {
            this.notificationService.warn('Please enter Diagnosis Date.');
            //      document.getElementById('dateDiagnosisId').focus();
            return;
        }
        this.ppm.datePrescribedDate = new Date(this.ppm.datePrescribedDate);
        if (!this.isRequestUnderProcess) {
            this.isRequestUnderProcess = true;
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.putRequest(app_constants_1.AppConstants.PATIENT_PROBLEM_UPDATE_URL, this.ppm)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_14') {
                        _this.ppm = new patient_problem_model_1.PatientProblemModel();
                        _this.notificationService.success(response['responseMessage'], 'Problem of Patient');
                        _this.closeBtn.nativeElement.click();
                        _this.getPaginatedProblemsFromServer(0);
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Problem of Patient');
                        _this.getPaginatedProblemsFromServer(0);
                    }
                    _this.isRequestUnderProcess = false;
                }, function (error) {
                    _this.HISUtilService.tokenExpired(error.error.error);
                    _this.isRequestUnderProcess = false;
                });
            }
            else {
                this.router.navigate(['/login']);
            }
        }
        else {
            this.notificationService.warn('Your first request is under process,Please wait...');
            return;
        }
    };
    PatientProblemListComponent.prototype.getPageWisePatientProblem = function (page) {
        this.getPaginatedProblemsFromServer(page);
    };
    PatientProblemListComponent.prototype.openUrl = function (val) {
        var url = '';
        if (!/^http[s]?:\/\//.test(val)) {
            url += 'http://';
        }
        url += val;
        window.open(url, '_blank');
        //   window.open("https://www.google.com", "_blank");
    };
    __decorate([
        core_1.ViewChild('closeBtn'),
        __metadata("design:type", core_1.ElementRef)
    ], PatientProblemListComponent.prototype, "closeBtn", void 0);
    PatientProblemListComponent = __decorate([
        core_1.Component({
            selector: 'patient-problem-list',
            templateUrl: '../../../templates/dashboard/patient/patient-problem-list.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService, router_1.ActivatedRoute,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router,
            router_1.ActivatedRoute,
            DataService_1.DataService])
    ], PatientProblemListComponent);
    return PatientProblemListComponent;
}());
exports.PatientProblemListComponent = PatientProblemListComponent;
//# sourceMappingURL=patient-problem-list.component.js.map