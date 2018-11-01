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
var requests_service_1 = require("../../../services/requests.service");
var app_constants_1 = require("../../../utils/app.constants");
var notification_service_1 = require("../../../services/notification.service");
var ConformationDialogService_1 = require("../../../services/ConformationDialogService");
var patient_1 = require("../../../model/patient");
var status_1 = require("../../../model/status");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var StatusesComponent = (function () {
    function StatusesComponent(router, requestsService, notificationService, confirmationDialogService) {
        this.router = router;
        this.requestsService = requestsService;
        this.notificationService = notificationService;
        this.confirmationDialogService = confirmationDialogService;
        this.pages = [];
        this.status = new status_1.Status();
        this.selectedStatus = new status_1.Status();
        this.pageNo = 0;
        this.patient = new patient_1.Patient();
    }
    StatusesComponent.prototype.ngOnInit = function () {
        this.getAllStatusesFromServer(0);
    };
    StatusesComponent.prototype.getAllStatusesFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_PAGINATED_STATUS + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'STATUS_SUC_02') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.data = response['responseData']['data'];
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    StatusesComponent.prototype.saveStatus = function (data) {
        var _this = this;
        if (data.valid) {
            this.status.colorHash = this.color;
            this.requestsService.postRequest(app_constants_1.AppConstants.STATUS_CREATE, this.status)
                .subscribe(function (response) {
                if (response['responseCode'] === 'STATUS_SUC_01') {
                    _this.addModal.hide();
                    _this.getAllStatusesFromServer(_this.currPage);
                    _this.notificationService.success(response['responseMessage'], 'Status');
                }
                if (response['responseCode'] === 'STATUS_ERR_05') {
                    _this.notificationService.warn('Status already Exists');
                    //  this.router.navigate(['/dashboard/setting/branch'])
                }
            }, function (error) {
            });
        }
        else {
            this.notificationService.error('Form Invalid', '');
        }
    };
    StatusesComponent.prototype.onUpdatePopupLoad = function (status) {
        this.status = status;
        this.addModal.show();
    };
    StatusesComponent.prototype.updateStatus = function (form) {
        var _this = this;
        if (form.valid) {
            this.status.colorHash = this.color;
            this.requestsService.putRequest(app_constants_1.AppConstants.UPDATE_FAMILY_HISTORY_URL + this.selectedStatus.id, this.selectedStatus)
                .subscribe(function (response) {
                if (response['responseCode'] === 'FAM_HISTORY_SUC_03') {
                    _this.notificationService.success(response['responseMessage'], 'Family History');
                    _this.getAllStatusesFromServer(_this.currPage);
                }
                else {
                    _this.notificationService.error(response['responseMessage'], 'Family History');
                }
            }, function (error) {
            });
        }
        else {
            this.notificationService.error('Required fields missing', 'Clinical Department');
        }
    };
    StatusesComponent.prototype.deleteStatus = function (id) {
        var _this = this;
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to delete?')
            .subscribe(function (res) {
            if (res == true) {
                _this.requestsService.deleteRequest(app_constants_1.AppConstants.STATUS_DELETE + id).subscribe(function (data) {
                    if (data['responseCode'] === 'STATUS_SUC_04') {
                        _this.notificationService.success('Status has been Deleted Successfully');
                        _this.getAllStatusesFromServer(_this.currPage);
                    }
                }, function (error) {
                    _this.notificationService.error('ERROR', 'Status is not deleted ');
                });
            }
        });
    };
    StatusesComponent.prototype.closeAddStatusModal = function () {
        this.addModal.hide();
    };
    StatusesComponent.prototype.addStatus = function () {
        this.addModal.show();
        this.status = new status_1.Status();
    };
    StatusesComponent.prototype.searchSatatusesFromServer = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.STATUS_SEARCH + this.pageNo + '?statusName=' + this.searchStatus)
            .subscribe(//branch search
        function (response) {
            if (response['responseCode'] === 'STATUS_SUC_02') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.data = response['responseData']['data'];
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    __decorate([
        core_1.ViewChild('statusModal'),
        __metadata("design:type", ngx_bootstrap_1.ModalDirective)
    ], StatusesComponent.prototype, "addModal", void 0);
    StatusesComponent = __decorate([
        core_1.Component({
            selector: 'patient-family-history',
            templateUrl: '../../../templates/dashboard/setting/statuses.template.html',
        }),
        __metadata("design:paramtypes", [router_1.Router, requests_service_1.RequestsService,
            notification_service_1.NotificationService, ConformationDialogService_1.ConformationDialogService])
    ], StatusesComponent);
    return StatusesComponent;
}());
exports.StatusesComponent = StatusesComponent;
//# sourceMappingURL=statuses.component.js.map