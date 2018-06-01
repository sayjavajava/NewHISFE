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
var forms_1 = require("@angular/forms");
var requests_service_1 = require("../../../services/requests.service");
var router_1 = require("@angular/router");
var notification_service_1 = require("../../../services/notification.service");
var material_1 = require("@angular/material");
var ConformationDialogService_1 = require("../../../services/ConformationDialogService");
var app_constants_1 = require("../../../utils/app.constants");
var searchBranch_1 = require("../../../model/searchBranch");
var BranchComponent = (function () {
    function BranchComponent(requestService, router, notificationService, fb, matDialog, confirmationDialogService) {
        var _this = this;
        this.requestService = requestService;
        this.router = router;
        this.notificationService = notificationService;
        this.fb = fb;
        this.matDialog = matDialog;
        this.confirmationDialogService = confirmationDialogService;
        this.pages = [];
        this.pageNo = 0;
        this.selectedRole = 'SUPER_ADMIN';
        this.branchesList = [];
        this.requestService.getRequest(app_constants_1.AppConstants.BRANCHES_NAME)
            .subscribe(function (response) {
            if (response['responseCode'] === 'BRANCH_SUC_01') {
                var data = response['responseData'];
                var userNameData = data;
                _this.branchesList = response['responseData'];
                console.log(_this.branchesList);
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    }
    BranchComponent.prototype.ngOnInit = function () {
        this.searchForm = this.fb.group({
            'branch': [null],
            'department': [null],
            'description': [null]
        });
        //   this.searchForm.controls['role'].setValue(this.default, {onlySelf: true});
        this.getBranchFromServer(0);
    };
    BranchComponent.prototype.searchData = function (data) {
        var _this = this;
        console.log('I am in ');
        if (this.searchForm.valid) {
            console.log('Valid ');
            var searchUserObj = new searchBranch_1.SearchBranch(data.branch, data.department, data.description);
            this.requestService.getRequest(app_constants_1.AppConstants.BRANCH_SEARCH + this.pageNo + '?branch=' + data.branch + '&department=' + data.department + '&description=' + data.description)
                .subscribe(function (response) {
                if (response['responseCode'] === 'BRANCH_SUC_01') {
                    _this.nextPage = response['responseData']['nextPage'];
                    _this.prePage = response['responseData']['prePage'];
                    _this.currPage = response['responseData']['currPage'];
                    _this.pages = response['responseData']['pages'];
                    _this.data = response['responseData']['data'];
                }
            }, function (error) {
                _this.error = error.error.error;
            });
        }
        else {
            this.validateAllFormFields(this.searchForm);
        }
    };
    BranchComponent.prototype.validateAllFormFields = function (formGroup) {
        var _this = this;
        Object.keys(formGroup.controls).forEach(function (field) {
            //console.log(field);
            var control = formGroup.get(field);
            if (control instanceof forms_1.FormControl) {
                control.markAsTouched({ onlySelf: true });
            }
            else if (control instanceof forms_1.FormGroup) {
                _this.validateAllFormFields(control);
            }
        });
    };
    BranchComponent.prototype.isFieldValid = function (field) {
        return !this.searchForm.get(field).valid && this.searchForm.get(field).touched;
    };
    BranchComponent.prototype.displayFieldCss = function (field) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    };
    BranchComponent.prototype.getBranchFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_URL + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'BRANCH_SUC_01') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.data = response['responseData']['data'];
                var data = response['responseData']['data'];
            }
        }, function (error) {
            //  this.HISUtilService.tokenExpired(error.error.error);
            _this.error = error.error.error;
        });
    };
    BranchComponent.prototype.deleteBranch = function (id) {
        var _this = this;
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(function (res) {
            if (id) {
                _this.requestService.deleteRequest(app_constants_1.AppConstants.DELETE_BRANCH_URI + id).subscribe(function (data) {
                    if (data['responseCode'] === 'BRANCH_DEL_SUC_01') {
                        _this.notificationService.success('User has been Deleted Successfully');
                        _this.getBranchFromServer(_this.currPage);
                    }
                }, function (error) {
                    _this.notificationService.error('ERROR', 'User Unable to Delete ');
                });
            }
        });
    };
    BranchComponent.prototype.updateBranch = function (id) {
        this.router.navigate(['/dashboard/setting/branch/edit/', id]);
    };
    BranchComponent.prototype.getSelectedBranch = function (value) {
        if (value) {
            this.searchForm.controls['branch'].setValue(value);
        }
    };
    BranchComponent = __decorate([
        core_1.Component({
            selector: 'branch-component',
            templateUrl: '../../../templates/dashboard/setting/branch.template.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService, router_1.Router,
            notification_service_1.NotificationService, forms_1.FormBuilder,
            material_1.MatDialog, ConformationDialogService_1.ConformationDialogService])
    ], BranchComponent);
    return BranchComponent;
}());
exports.BranchComponent = BranchComponent;
//# sourceMappingURL=branch.component.js.map