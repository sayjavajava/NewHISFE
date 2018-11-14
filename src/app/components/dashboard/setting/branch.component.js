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
        // this.allBranches();
        //   this.getbranchesWithDoctors(2);
        // this.allDepartments();
        this.requestService = requestService;
        this.router = router;
        this.notificationService = notificationService;
        this.fb = fb;
        this.matDialog = matDialog;
        this.confirmationDialogService = confirmationDialogService;
        this.pages = [];
        this.pageNo = 0;
        this.selectedRole = "SUPER_ADMIN";
        this.branchesList = [];
        this.doctorsInBranch = [];
    }
    BranchComponent.prototype.ngOnInit = function () {
        this.searchForm = this.fb.group({
            "branch": [null],
            "department": [null],
            "description": [null]
        });
        this.allBranches();
        this.allDepartments();
        // this.getBranchFromServer(0);
        this.cols = [
            { field: "name", header: "Name" },
            { field: "doctorsList", header: "Doctors" },
            /* TODO: Uncomment
            {field: 'country', header: 'Country'},
            {field: 'city', header: 'City'},*/
            { field: "rooms", header: "Rooms" },
            { field: "id", header: "Action" }
        ];
    };
    BranchComponent.prototype.allBranches = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_ALL_URL)
            .subscribe(function (response) {
            if (response["responseCode"] === "BR_SUC_01") {
                _this.branchesList = response["responseData"];
                _this.data = _this.branchesList;
                //    this.defaultSelectedBranch= this.branchesList[0].id;
            }
            //     this.searchForm.controls['branch'].setValue(this.defaultSelectedBranch,{onlySelf: true});
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    BranchComponent.prototype.getbranchesWithDoctors = function (id) {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_BRANCHES_WITH_DOCTORS + id)
            .subscribe(function (response) {
            if (response["responseCode"] === "BR_SUC_01") {
                _this.doctorsInBranch = response["responseData"];
                // console.log("doctor:" + this.doctorsInBranch);
                //    this.defaultSelectedBranch= this.branchesList[0].id;
            }
            //     this.searchForm.controls['branch'].setValue(this.defaultSelectedBranch,{onlySelf: true});
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    BranchComponent.prototype.allDepartments = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI)
            .subscribe(function (response) {
            if (response["responseCode"] === "CLI_DPT_SUC_01") {
                _this.departments = response["responseData"];
            }
        }, function (error) {
            _this.error = error.error.error;
        });
    };
    BranchComponent.prototype.searchData = function (data) {
        var _this = this;
        //   if (this.searchForm.valid) {
        var searchUserObj = new searchBranch_1.SearchBranch(data.branch, data.department, data.description);
        //   this.requestService.getRequest(AppConstants.BRANCH_SEARCH + this.pageNo + '?branch=' + data.branch + '&department=' + data.department)
        this.requestService.getRequest(app_constants_1.AppConstants.BRANCH_SEARCH + this.pageNo + "?branch=" + data.branch)
            .subscribe(function (response) {
            if (response["responseCode"] === "BRANCH_SUC_01") {
                _this.nextPage = response["responseData"]["nextPage"];
                _this.prePage = response["responseData"]["prePage"];
                _this.currPage = response["responseData"]["currPage"];
                _this.pages = response["responseData"]["pages"];
                _this.data = response["responseData"]["data"];
            }
        }, function (error) {
            _this.error = error.error.error;
        });
        /*} else {
            this.validateAllFormFields(this.searchForm)
        }*/
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
            "has-error": this.isFieldValid(field),
            "has-feedback": this.isFieldValid(field)
        };
    };
    // getBranchFromServer(page: number) {
    //     if (page > 0) {
    //         page = page;
    //
    //     }
    //     this.requestService.getRequest(
    //         AppConstants.FETCH_ALL_BRANCHES_URL + page)
    //         .subscribe(
    //             (response: Response) => {
    //                 if (response["responseCode"] === "BRANCH_SUC_01") {
    //                     this.nextPage = response["responseData"]["nextPage"];
    //                     this.prePage = response["responseData"]["prePage"];
    //                     this.currPage = response["responseData"]["currPage"];
    //                     this.pages = response["responseData"]["pages"];
    //                     this.data = response["responseData"]["data"];
    //
    //
    //                 }
    //             },
    //             (error: any) => {
    //                 this.error = error.error.error;
    //             }
    //         );
    // }
    BranchComponent.prototype.deleteBranch = function (id) {
        var _this = this;
        this.confirmationDialogService
            .confirm("Delete", "Are you sure you want to do this?")
            .subscribe(function (res) {
            if (res == true) {
                _this.requestService.deleteRequest(app_constants_1.AppConstants.DELETE_BRANCH_URI + id).subscribe(function (data) {
                    if (data["responseCode"] === "BRANCH_DEL_SUC_01") {
                        _this.notificationService.success("Branch has been Deleted Successfully");
                        // this.getBranchFromServer(this.currPage);
                        _this.allBranches();
                    }
                    if (data["responseCode"] === "BRANCH_NOT_FOUND") {
                        _this.notificationService.warn("Branch is Accossiated ");
                        // this.getBranchFromServer(this.currPage);
                    }
                }, function (error) {
                    _this.notificationService.error("ERROR", "Branch is Associated with another Branch");
                });
            }
        });
    };
    BranchComponent.prototype.updateBranch = function (id) {
        this.router.navigate(["/dashboard/setting/branch/edit/", id]);
    };
    BranchComponent.prototype.getSelectedBranch = function (valueObj) {
        var value = valueObj.value;
        if (value) {
            this.searchForm.controls["branch"].setValue(value);
        }
    };
    BranchComponent.prototype.getSelectedDepartment = function (value) {
        if (value) {
            //console.log('sel:' + value);
            this.searchForm.controls["department"].setValue(value);
        }
    };
    BranchComponent = __decorate([
        core_1.Component({
            selector: "branch-component",
            templateUrl: "../../../templates/dashboard/setting/branch.template.html",
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService, router_1.Router,
            notification_service_1.NotificationService, forms_1.FormBuilder,
            material_1.MatDialog, ConformationDialogService_1.ConformationDialogService])
    ], BranchComponent);
    return BranchComponent;
}());
exports.BranchComponent = BranchComponent;
//# sourceMappingURL=branch.component.js.map