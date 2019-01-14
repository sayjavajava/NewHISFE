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
var medical_service_1 = require("../../../model/medical-service");
var router_1 = require("@angular/router");
var AddMedicalServiceComponent = (function () {
    function AddMedicalServiceComponent(notificationService, requestsService, HISUtilService, router) {
        this.notificationService = notificationService;
        this.requestsService = requestsService;
        this.HISUtilService = HISUtilService;
        this.router = router;
        this.ms = new medical_service_1.MedicalService();
        this.taxes = [];
        this.branchIds = [];
        this.selectedBranches = [];
        this.selectedDepartments = [];
        this.isError = false;
        this.isErrorFee = false;
        this.profileImg = null;
        this.urlOrganization = "/public/images/company-logo-placeholder.jpg";
        this.ms.tax.id = -1;
        this.getBranchesFromServer();
        this.getDepartmentsFromServer();
        this.getTaxesFromServer();
    }
    AddMedicalServiceComponent.prototype.ngOnInit = function () {
        this.allorganizationData();
        //   this.getBranchesFromServer();
        //    this.getDepartmentsFromServer();
    };
    /*ngAfterViewInit() {
        let NumberInput = document.getElementById('fee');
       // let inputmask = new inputmask(this.currencyFormat);

      //  inputmask.mask(NumberInput);
    }*/
    AddMedicalServiceComponent.prototype.getBranchesFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all/all')
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.ms.branches = response['responseData'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    AddMedicalServiceComponent.prototype.getDepartmentsFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI)
            .subscribe(function (response) {
            if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                _this.ms.departments = response['responseData'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    AddMedicalServiceComponent.prototype.onBranchSelection = function (branchObj) {
        var _this = this;
        if (this.selectedBranches.length > 0)
            this.selectedBranches.forEach(function (x) { _this.ms.selectedBranches = x.id; });
        // this.ms.selectedBranches.push(branchObj.id);
        this.ms.selectedDepartments = [];
        this.ms.departments = [];
        if (this.ms.selectedBranches.length != 0) {
            this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_BY_BRANCHES_IDs_URI + '?branchIds=' + this.ms.selectedBranches)
                .subscribe(function (response) {
                if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                    _this.ms.selectedDepartments = [];
                    _this.ms.departments = [];
                    _this.ms.departments = response['responseData'];
                }
                else {
                    _this.ms.selectedDepartments = [];
                    _this.ms.departments = [];
                    _this.notificationService.error(response['responseMessage']);
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
    };
    AddMedicalServiceComponent.prototype.allorganizationData = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ORG_SUC_01') {
                _this.organizationDataList = response['responseData'];
                _this.currency = _this.organizationDataList.currency;
                console.log(_this.organizationDataList);
                _this.currencyFormat = _this.organizationDataList.currencyFormat;
            }
        }, function (error) {
            _this.notificationService.error(error.error.error);
        });
    };
    AddMedicalServiceComponent.prototype.getTaxesFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_TAX_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'SER_TAX_SUC_01') {
                _this.taxes = response['responseData'];
            }
        }, function (error) {
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    AddMedicalServiceComponent.prototype.saveMedicalServices = function (msForm) {
        var _this = this;
        if (msForm.valid) {
            var foundBranch = 0;
            for (var _i = 0, _a = this.ms.branches; _i < _a.length; _i++) {
                var branch = _a[_i];
                if (branch.checkedBranch) {
                    foundBranch++;
                }
            }
            if (this.ms.selectedBranches.length <= 0) {
                this.notificationService.warn('Please select at least one branch.');
                document.getElementById('branchId').focus();
                return;
            }
            if (this.isError == true) {
                this.notificationService.warn('Please Enter Number.');
                document.getElementById('cost').focus();
                return;
            }
            if (this.isErrorFee == true) {
                this.notificationService.warn('Please Enter Number.');
                document.getElementById('fee').focus();
                return;
            }
            var foundDepartment = 0;
            for (var _b = 0, _c = this.ms.departments; _b < _c.length; _b++) {
                var department = _c[_b];
                if (department.checkedDepartment) {
                    foundDepartment++;
                }
            }
            if (this.selectedDepartments.length <= 0) {
                this.notificationService.warn('Please select at least one Department.');
                document.getElementById('departmentId').focus();
                return;
            }
            if (this.ms.tax.id <= 0) {
                this.notificationService.warn('Please select tax.');
                document.getElementById('taxId').focus();
                return;
            }
            this.selectedBranches.forEach(function (x) { _this.ms.selectedBranchesMS.push(x.id); });
            this.requestsService.postRequestMultipartFormAndDataWithOneFile(app_constants_1.AppConstants.SAVE_MEDICAL_SERVICES_URL, this.ms, this.profileImg)
                .subscribe(function (response) {
                if (response['responseCode'] === 'MED_SER_SUC_02') {
                    _this.notificationService.success(response['responseMessage'], 'Medical Service');
                    _this.router.navigate(['/dashboard/setting/medicalServices']);
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Medical Service');
                }
            }, function (error) {
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            if (this.ms.name === '') {
                this.notificationService.warn('Please enter name.');
                document.getElementById('msTitle').focus();
                return;
            }
            if (this.ms.code === '') {
                this.notificationService.warn('Please enter code.');
                document.getElementById('code').focus();
                return;
            }
            this.notificationService.error('Please provide required field data', 'Medical Service');
        }
    };
    AddMedicalServiceComponent.prototype.isNumberCheck = function (evt) {
        var iKeyCode = (evt.which) ? evt.which : evt.keyCode;
        if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57) && (iKeyCode != 190)) {
            this.isError = true;
            return false;
        }
        this.isError = false;
        return true;
    };
    AddMedicalServiceComponent.prototype.isNumberCheckFee = function (evt) {
        var iKeyCode = (evt.which) ? evt.which : evt.keyCode;
        if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57) && (iKeyCode != 190)) {
            this.isErrorFee = true;
            return false;
        }
        this.isErrorFee = false;
        return true;
    };
    /*uploadProfileImg() {
        if (this.profileImg && this.profileImg.size <= 40000000) {
            this.requestsService.postRequestMultipartFormData(
                AppConstants.UPLOAD_ORGNAIZATION_IMAGE_URL + this.id
                , this.profileImg)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ORG_SUC_02') {

                            this.urlOrganization=response['responseData'];
                            this.notificationService.success( 'Medical Service Image has been uploaded Succesfully');
                            this.profileImg = null;
                            //   this.urlOrganization=response['responseData'];
                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Profile Image uploading failed', 'Update Organization');

                    }
                );
        } else {
            this.notificationService.error('File size must be less then 4 mb.', 'Update Organization');
        }
    }*/
    AddMedicalServiceComponent.prototype.uploadImgOnChange = function (event) {
        var fileList = event.target.files;
        debugger;
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === "profileImgUrl") {
                this.profileImg = fileList[0];
            }
        }
    };
    AddMedicalServiceComponent = __decorate([
        core_1.Component({
            selector: 'add-medical-services-component',
            templateUrl: '../../../templates/dashboard/setting/add-medical-services.template.html',
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService,
            requests_service_1.RequestsService,
            his_util_service_1.HISUtilService,
            router_1.Router])
    ], AddMedicalServiceComponent);
    return AddMedicalServiceComponent;
}());
exports.AddMedicalServiceComponent = AddMedicalServiceComponent;
//# sourceMappingURL=add-medical-service.component.js.map