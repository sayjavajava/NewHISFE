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
var ConformationDialogService_1 = require("../../../services/ConformationDialogService");
var requests_service_1 = require("../../../services/requests.service");
var router_1 = require("@angular/router");
var notification_service_1 = require("../../../services/notification.service");
var app_constants_1 = require("../../../utils/app.constants");
var material_1 = require("@angular/material");
var OrganizationComponent = (function () {
    function OrganizationComponent(requestService, router, notificationService, fb, matDialog, confirmationDialogService) {
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
    }
    OrganizationComponent.prototype.ngOnInit = function () {
        this.searchForm = this.fb.group({
            'organization': [null],
        });
        this.getOrganizationFromServer(0);
    };
    /*searchData(data: SearchBranch) {
        console.log('I am in ');
        if (this.searchForm.valid) {
            console.log('Valid ');
            let searchUserObj = new SearchBranch(data.branch, data.department, data.description);

            this.requestService.getRequest(AppConstants.BRANCH_SEARCH + this.pageNo+'?branch='+data.branch +'&department='+data.department +'&description='+data.description)
                .subscribe(
                    (response: Response) => {

                        if (response['responseCode'] === 'BRANCH_SUC_01') {
                            this.nextPage = response['responseData']['nextPage'];
                            this.prePage = response['responseData']['prePage'];
                            this.currPage = response['responseData']['currPage'];
                            this.pages = response['responseData']['pages'];
                            this.data = response['responseData']['data'];

                        }
                    },
                    (error: any) => {

                        this.error = error.error.error;
                    })
        }else {this.validateAllFormFields(this.searchForm)}
    }

*/
    OrganizationComponent.prototype.validateAllFormFields = function (formGroup) {
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
    OrganizationComponent.prototype.isFieldValid = function (field) {
        return !this.searchForm.get(field).valid && this.searchForm.get(field).touched;
    };
    OrganizationComponent.prototype.displayFieldCss = function (field) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    };
    OrganizationComponent.prototype.getOrganizationFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_ORGANIZATION_URL_PAGINATED + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ORG_SUC_02') {
                _this.nextPage = response['responseData']['nextPage'];
                _this.prePage = response['responseData']['prePage'];
                _this.currPage = response['responseData']['currPage'];
                _this.pages = response['responseData']['pages'];
                _this.data = response['responseData']['data'];
            }
        }, function (error) {
        });
    };
    /*deleteBranch(id: number) {
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(res => {
                if (id) {
                    this.requestService.deleteRequest(AppConstants.DELETE_BRANCH_URI + id).subscribe((data: Response) => {
                        if (data['responseCode'] === 'BRANCH_DEL_SUC_01') {
                            this.notificationService.success('User has been Deleted Successfully');
                            this.getBranchFromServer(this.currPage);

                        }
                    }, error => {
                        this.notificationService.error('ERROR', 'User Unable to Delete ');

                    });
                }
            });
    }*/
    OrganizationComponent.prototype.updateOrganization = function (id) {
        this.router.navigate(['/dashboard/setting/organization/edit/', id]);
    };
    OrganizationComponent.prototype.getSelectedBranch = function (value) {
        if (value) {
            this.searchForm.controls['branch'].setValue(value);
        }
    };
    OrganizationComponent = __decorate([
        core_1.Component({
            selector: 'organization',
            templateUrl: '../../../templates/dashboard/setting/organization.template.html',
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService, router_1.Router,
            notification_service_1.NotificationService, forms_1.FormBuilder,
            material_1.MatDialog, ConformationDialogService_1.ConformationDialogService])
    ], OrganizationComponent);
    return OrganizationComponent;
}());
exports.OrganizationComponent = OrganizationComponent;
//# sourceMappingURL=organization.component.js.map