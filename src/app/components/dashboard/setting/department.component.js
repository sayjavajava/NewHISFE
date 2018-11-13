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
var his_util_service_1 = require("../../../services/his-util.service");
var router_1 = require("@angular/router");
var requests_service_1 = require("../../../services/requests.service");
var user_shared_service_1 = require("../../../services/user.shared.service");
var app_constants_1 = require("../../../utils/app.constants");
var notification_service_1 = require("../../../services/notification.service");
var department_1 = require("../../../model/department");
var _ = require("lodash");
var DepartmentComponent = (function () {
    function DepartmentComponent(requestsService, router, userSharedService, HISUtilService, notificationService) {
        this.requestsService = requestsService;
        this.router = router;
        this.userSharedService = userSharedService;
        this.HISUtilService = HISUtilService;
        this.notificationService = notificationService;
        this.pages = [];
        this.searched = false;
        this.branchesList = [];
        this.selectedDepartment = new department_1.Department();
        this.allBranches();
    }
    DepartmentComponent.prototype.ngOnInit = function () {
        if (window.localStorage.getItem(btoa('access_token'))) {
            this.getPageWiseDepartmentFromServer(0);
        }
        else {
            this.router.navigate(['/login']);
        }
        ;
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'status', header: 'Status' },
            { field: 'Action', header: 'Action' },
        ];
        /*this.cars =[
            {"brand": "VW", "year": 2012, "color": "Orange", "vin": "dsad231ff"},
            {"brand": "Audi", "year": 2011, "color": "Black", "vin": "gwregre345"},
            {"brand": "Renault", "year": 2005, "color": "Gray", "vin": "h354htr"},
            {"brand": "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh"},
            {"brand": "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34"},
            {"brand": "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj"},
            {"brand": "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr"},
            {"brand": "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34"},
            {"brand": "Ford", "year": 2000, "color": "Black", "vin": "h54hw5"},
            {"brand": "Fiat", "year": 2013, "color": "Red", "vin": "245t2s"}
        ]*/
        //
        this.brands = [
            { label: 'All Brands', value: null },
            { label: 'Audi', value: 'Audi' },
            { label: 'BMW', value: 'BMW' },
            { label: 'Fiat', value: 'Fiat' },
            { label: 'Honda', value: 'Honda' },
            { label: 'Jaguar', value: 'Jaguar' },
            { label: 'Mercedes', value: 'Mercedes' },
            { label: 'Renault', value: 'Renault' },
            { label: 'VW', value: 'VW' },
            { label: 'Volvo', value: 'Volvo' }
        ];
        this.colors = [
            { label: 'White', value: 'White' },
            { label: 'Green', value: 'Green' },
            { label: 'Silver', value: 'Silver' },
            { label: 'Black', value: 'Black' },
            { label: 'Red', value: 'Red' },
            { label: 'Maroon', value: 'Maroon' },
            { label: 'Brown', value: 'Brown' },
            { label: 'Orange', value: 'Orange' },
            { label: 'Blue', value: 'Blue' }
        ];
    };
    DepartmentComponent.prototype.getPageWiseDepartment = function (page) {
        this.data = [];
        if (this.searched) {
            this.searchClinicalDepartment(page);
        }
        else {
            this.getPageWiseDepartmentFromServer(page);
        }
    };
    DepartmentComponent.prototype.refreshPage = function () {
        this.searched = false;
        this.searchDepart = '';
        this.getPageWiseDepartmentFromServer(0);
    };
    DepartmentComponent.prototype.allBranches = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(function (response) {
            if (response['responseCode'] === 'BR_SUC_01') {
                _this.branchesList = response['responseData'];
            }
            // this.userForm.controls['primaryBranch'].setValue(this.branchesList[0].id)
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    DepartmentComponent.prototype.getPageWiseDepartmentFromServer = function (page) {
        var _this = this;
        this.searchDepart = '';
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.data = response['responseData']['data'];
            }
        }, function (error) {
            //console.log(error.json())
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    DepartmentComponent.prototype.deleteDepartment = function (dptId) {
        var _this = this;
        if (window.localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete'))
                return;
            this.requestsService.deleteRequest(app_constants_1.AppConstants.DELETE_CLINICAL_DEPARTMENTS_URI + dptId)
                .subscribe(function (response) {
                if (response['responseCode'] === 'CLI_DPT_SUC_02') {
                    _this.notificationService.success(response['responseMessage'], 'Clinical Department');
                    _this.getPageWiseDepartmentFromServer(0);
                }
                else {
                    _this.getPageWiseDepartmentFromServer(0);
                    _this.notificationService.error(response['responseMessage'], 'Clinical Department');
                }
            }, function (error) {
                _this.notificationService.error(error.error, 'Clinical Department');
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    };
    DepartmentComponent.prototype.searchClinicalDepartment = function (page) {
        var _this = this;
        this.searched = true;
        this.requestsService.getRequest(app_constants_1.AppConstants.SEARCH_CLINICAL_DEPARTMENT_URL + page + '?name=' + this.searchDepart)
            .subscribe(function (response) {
            if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.data = response['responseData']['data'];
            }
            else {
                _this.nextPage = 0;
                _this.prePage = 0;
                _this.currPage = 0;
                _this.pages = [];
                _this.data = null;
            }
        }, function (error) {
            //console.log(error.json())
            _this.HISUtilService.tokenExpired(error.error.error);
        });
    };
    DepartmentComponent.prototype.saveClinicalDepartment = function (form) {
        var _this = this;
        if (form.valid) {
            this.requestsService.postRequest(app_constants_1.AppConstants.SAVE_CLINICAL_DEPARTMENT_URL, this.selectedDepartment)
                .subscribe(function (response) {
                if (response['responseCode'] === 'CLI_DPT_SUC_02') {
                    _this.notificationService.success(response['responseMessage'], 'Clinical Department');
                    _this.getPageWiseDepartmentFromServer(0);
                    _this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Clinical Department');
                }
            }, function (error) {
                //console.log(error.json())
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.notificationService.error('Required fields missing', 'Clinical Department');
        }
    };
    DepartmentComponent.prototype.updateClinicalDepartment = function (form) {
        var _this = this;
        _.each(form.form.controls, function (control) {
            control['_touched'] = true;
        });
        if (form.valid) {
            this.requestsService.putRequest(app_constants_1.AppConstants.UPDATE_CLINICAL_DEPARTMENT_URL, this.selectedDepartment)
                .subscribe(function (response) {
                if (response['responseCode'] === 'CLI_DPT_SUC_02') {
                    _this.notificationService.success(response['responseMessage'], 'Clinical Department');
                    _this.getPageWiseDepartmentFromServer(0);
                    _this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Clinical Department');
                }
            }, function (error) {
                //console.log(error.json())
                _this.HISUtilService.tokenExpired(error.error.error);
            });
        }
        else {
            this.notificationService.error('Required fields missing', 'Clinical Department');
        }
    };
    DepartmentComponent.prototype.onUpdatePopupLoad = function (department) {
        this.selectedDepartment = department;
    };
    DepartmentComponent.prototype.onAddPopupLoad = function () {
        this.selectedDepartment = new department_1.Department();
    };
    DepartmentComponent = __decorate([
        core_1.Component({
            selector: 'department-component',
            templateUrl: '../../../templates/dashboard/setting/department.template.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router,
            user_shared_service_1.UserSharedService,
            his_util_service_1.HISUtilService,
            notification_service_1.NotificationService])
    ], DepartmentComponent);
    return DepartmentComponent;
}());
exports.DepartmentComponent = DepartmentComponent;
//# sourceMappingURL=department.component.js.map