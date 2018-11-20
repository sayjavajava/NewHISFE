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
var requests_service_1 = require("../../../services/requests.service");
var notification_service_1 = require("../../../services/notification.service");
var his_util_service_1 = require("../../../services/his-util.service");
var app_constants_1 = require("../../../utils/app.constants");
var MedicalServiceSearchModel_1 = require("../../../model/MedicalServiceSearchModel");
var MedicalServiceComponent = (function () {
    function MedicalServiceComponent(notificationService, requestsService, HISUtilService) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.pages = [];
        this.dataMD = [];
        this.branches = [];
        this.departments = [];
        this.checkedBranches = [];
        this.checkedDepartments = [];
        this.searchMSModel = new MedicalServiceSearchModel_1.MedicalServiceSearchModel();
        this.loading = false;
    }
    MedicalServiceComponent.prototype.ngOnInit = function () {
        this.getBranchesFromServer();
        this.getDepartmentsFromServer();
        document.title = 'HIS | Medical Services';
        if (localStorage.getItem(btoa('access_token'))) {
            this.cols = [
                { field: 'name', header: 'name' },
                { field: 'code', header: 'code' },
                { field: 'branch', header: 'branch' },
                { field: 'department', header: 'department' },
                { field: 'fee', header: 'fee' },
                { field: 'tax', header: 'tax' },
                { field: 'cost', header: 'cost' },
                { field: 'status', header: 'status' },
                { field: 'Action', header: 'Action' }
            ];
            this.getAllMedicalServicesFromServer();
        }
        ;
    };
    MedicalServiceComponent.prototype.deleteMedicalServices = function (ms) {
        var _this = this;
        if (ms.id > 0) {
            if (!confirm('Are Your Source You Want To Delete'))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.DELETE_MEDICAL_SERVICES_URL + 'msId=' + ms.id)
                .subscribe(function (response) {
                if (response['responseCode'] === 'MED_SER_SUC_02') {
                    _this.notificationService.success(response['responseMessage'], 'Medical Service');
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Medical Service');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
    };
    MedicalServiceComponent.prototype.getCheckedDepartmentsByMedicalServiceId = function (ms) {
        var _this = this;
        if (ms.id > 0) {
            this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_DEPARTMENTS_BY_MEDICAL_SERVICE_ID_URL + ms.id)
                .subscribe(function (response) {
                if (response['responseCode'] === 'MED_SER_SUC_01') {
                    _this.checkedDepartments = response['responseData'];
                }
                else {
                    //this.notificationService.success('Service has no departments', 'Medical Services');
                    //document.getElementById('close-btn-depart').click();
                    _this.checkedDepartments = [];
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
    };
    MedicalServiceComponent.prototype.clearList = function (event) {
        if (event.target.name === 'close-btn-branch') {
            this.checkedBranches = [];
        }
        else if (event.target.name === 'close-btn-depart') {
            this.checkedDepartments = [];
        }
    };
    MedicalServiceComponent.prototype.getCheckedBranchesByMedicalServiceId = function (ms) {
        var _this = this;
        if (ms.id > 0) {
            this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_BRANCHES_BY_MEDICAL_SERVICE_ID_URL + ms.id)
                .subscribe(function (response) {
                if (response['responseCode'] === 'MED_SER_SUC_01') {
                    _this.checkedBranches = response['responseData'];
                }
                else {
                    _this.checkedBranches = [];
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
    };
    MedicalServiceComponent.prototype.getBranchesFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_ALL_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branches = response['responseData'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    MedicalServiceComponent.prototype.getDepartmentsFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI)
            .subscribe(function (response) {
            if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                _this.departments = response['responseData'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    MedicalServiceComponent.prototype.getAllMedicalServicesFromServer = function () {
        var _this = this;
        this.loading = true;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL)
            .subscribe(function (response) {
            if (response['responseCode'] == 'MED_SER_SUC_01') {
                _this.dataMD = response['responseData'];
                _this.loading = false;
            }
            else {
                _this.notificationService.error(response['responseMessage']);
                _this.loading = false;
            }
        });
    };
    MedicalServiceComponent = __decorate([
        core_1.Component({
            selector: 'medical-services-component',
            templateUrl: '../../../templates/dashboard/setting/medical-services.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService])
    ], MedicalServiceComponent);
    return MedicalServiceComponent;
}());
exports.MedicalServiceComponent = MedicalServiceComponent;
//# sourceMappingURL=medical-service.component.js.map