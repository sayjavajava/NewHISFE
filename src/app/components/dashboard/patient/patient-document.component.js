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
var document_1 = require("../../../model/document");
var notification_service_1 = require("../../../services/notification.service");
var requests_service_1 = require("../../../services/requests.service");
var app_constants_1 = require("../../../utils/app.constants");
var his_util_service_1 = require("../../../services/his-util.service");
var DataService_1 = require("../../../services/DataService");
var patient_1 = require("../../../model/patient");
var PatientDocumentsComponent = (function () {
    function PatientDocumentsComponent(notificationService, requestsService, HISUtilService, router, activatedRoute, dataService) {
        var _this = this;
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataService = dataService;
        this.patient = new patient_1.Patient();
        this.pages = [];
        this.documentData = [];
        this.dm = new document_1.DocumentModel();
        this.uploadedImage = null;
        this.isRequestUnderProcess = false;
        this.subscription = this.dataService.currentPatientId.subscribe(function (id) {
            _this.selectedPatientId = id;
        });
        this.getPageWiseDocumentsFromServer(0);
        this.getPatientByIdFromServer(this.selectedPatientId);
    }
    PatientDocumentsComponent.prototype.ngOnInit = function () {
    };
    PatientDocumentsComponent.prototype.uploadImgOnChange = function (event) {
        var fileList = event.target.files;
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === 'documentName') {
                if (fileList[0].size < 4000000) {
                    this.uploadedImage = fileList[0];
                    this.dm.name = this.uploadedImage.name;
                }
                else {
                    this.notificationService.warn('File size must be less than 4000000 bytes');
                }
            }
        }
    };
    PatientDocumentsComponent.prototype.saveDocumentByPatient = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (this.uploadedImage === null) {
                this.notificationService.warn('Please upload Document');
                return;
            }
            if (this.selectedPatientId <= 0) {
                this.notificationService.warn('Please provide proper patient.');
                return;
            }
            if (!this.isRequestUnderProcess) {
                this.isRequestUnderProcess = true;
                this.dm.patientId = this.selectedPatientId;
                this.requestsService.postRequestMultipartFormAndDataWithOneFile(app_constants_1.AppConstants.DOCUMENT_SAVE_URL, this.dm, this.uploadedImage).subscribe(function (response) {
                    if (response['responseCode'] === 'DOC_SUC_37') {
                        _this.dm = new document_1.DocumentModel();
                        _this.uploadedImage = null;
                        _this.notificationService.success(response['responseMessage'], 'Document');
                        _this.getPageWiseDocumentsFromServer(0);
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Document');
                    }
                    _this.isRequestUnderProcess = false;
                }, function (error) {
                    _this.notificationService.success(Response['responseMessage'], 'Document');
                    _this.HISUtilService.tokenExpired(error.error.error);
                    _this.isRequestUnderProcess = false;
                });
                console.log(this.isRequestUnderProcess);
            }
            else {
                this.notificationService.warn('Your first request is under process,Please wait...');
            }
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientDocumentsComponent.prototype.getPageWiseDocumentsFromServer = function (page) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.DOCUMENT_PAGINATED_URL + page + '?patientId=' + this.selectedPatientId)
            .subscribe(function (response) {
            if (response['responseCode'] === 'DOC_SUC_39') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.documentData = response['responseData']['data'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    PatientDocumentsComponent.prototype.getPageWiseDocuments = function (page) {
        this.getPageWiseDocumentsFromServer(page);
    };
    PatientDocumentsComponent.prototype.editDocument = function (documentId) {
        var _this = this;
        this.dm = new document_1.DocumentModel();
        this.uploadedImage = null;
        if (documentId > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(app_constants_1.AppConstants.DOCUMENT_GET_URL + 'documentId=' + documentId)
                    .subscribe(function (response) {
                    if (response['responseCode'] === 'DOC_SUC_42') {
                        _this.dm = response['responseData'];
                        _this.notificationService.success(response['responseMessage'], 'Document of Patient');
                        _this.isUpdate = true;
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Document of Patient');
                        _this.isUpdate = false;
                    }
                }, function (error) {
                    _this.HISUtilService.tokenExpired(error.error.error);
                    _this.isUpdate = false;
                });
            }
            else {
                this.router.navigate(['/login']);
            }
        }
        else {
            this.notificationService.error('Please select proper record', 'Document of Patient');
        }
    };
    PatientDocumentsComponent.prototype.updateDocumentByPatient = function () {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (this.uploadedImage === null) {
                this.notificationService.warn('Please upload Document');
                return;
            }
            this.dm.patientId = this.selectedPatientId;
            if (!this.isRequestUnderProcess) {
                this.isRequestUnderProcess = true;
                this.requestsService.postRequestMultipartFormAndDataWithOneFile(app_constants_1.AppConstants.DOCUMENT_UPDATE_URL, this.dm, this.uploadedImage).subscribe(function (response) {
                    if (response['responseCode'] === 'DOC_SUC_44') {
                        _this.dm = new document_1.DocumentModel();
                        _this.uploadedImage = null;
                        _this.isUpdate = false;
                        _this.notificationService.success(response['responseMessage'], 'Document');
                        _this.getPageWiseDocumentsFromServer(0);
                    }
                    else {
                        _this.notificationService.error(response['responseMessage'], 'Document');
                    }
                    _this.isRequestUnderProcess = false;
                }, function (error) {
                    _this.HISUtilService.tokenExpired(error.error.error);
                    _this.isRequestUnderProcess = false;
                });
                console.log(this.isRequestUnderProcess);
            }
            else {
                this.notificationService.warn('Your first request is under process,Please wait...');
            }
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientDocumentsComponent.prototype.deleteDocument = function (documentId) {
        var _this = this;
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete'))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.DOCUMENT_DELETE_URI + documentId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'DOC_SUC_40') {
                    _this.notificationService.success(response['responseMessage'], 'Document of Patient');
                    _this.getPageWiseDocumentsFromServer(0);
                }
                else {
                    _this.getPageWiseDocumentsFromServer(0);
                    _this.notificationService.error(response['responseMessage'], 'Document of Patient');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    PatientDocumentsComponent.prototype.goToUserDashBoard = function () {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    };
    PatientDocumentsComponent.prototype.getPatientByIdFromServer = function (patientId) {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.PATIENT_FETCH_URL + patientId).subscribe(function (response) {
            if (response['responseCode'] === 'USER_SUC_01') {
                _this.patient = response['responseData'];
                var apptId = response['responseData']['pastAppointments'];
            }
            else {
                _this.notificationService.error(response['responseMessage'], 'Patient');
                // this.router.navigate(['404-not-found'])
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    PatientDocumentsComponent.prototype.downloadFile = function (data) {
        console.log(data);
        // may be you need to use data._body to get data of body
        var blob = new Blob([data], { type: 'image/jpeg' });
        var url = window.URL.createObjectURL(blob);
        window.open(url);
    };
    PatientDocumentsComponent = __decorate([
        core_1.Component({
            selector: 'patient-document',
            templateUrl: '../../../templates/dashboard/patient/patient-documents.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router,
            router_1.ActivatedRoute,
            DataService_1.DataService])
    ], PatientDocumentsComponent);
    return PatientDocumentsComponent;
}());
exports.PatientDocumentsComponent = PatientDocumentsComponent;
//# sourceMappingURL=patient-document.component.js.map