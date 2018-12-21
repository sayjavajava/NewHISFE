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
var app_constants_1 = require("../../../utils/app.constants");
var Invoice_1 = require("../../../model/Invoice");
var router_1 = require("@angular/router");
var GenerateInvoiceRequestModel_1 = require("../../../model/GenerateInvoiceRequestModel");
var PatientInvoiceComponent = (function () {
    function PatientInvoiceComponent(router, route, requestsService) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.requestsService = requestsService;
        this.completed = false;
        this.unSelectedServicesList = []; // remove selected service from all services List
        this.selectedServiceIndex = -1;
        this.quantity = 1;
        this.unitFee = 0;
        this.discountRate = 0;
        this.discountAmount = 0.00;
        this.taxRate = 0;
        this.taxAmount = 0.00;
        this.invoiceAmount = 0.00;
        this.show = false;
        this.showEditButton = false;
        this.invoiceList = [];
        this.grandTotal = 0.00;
        this.grandTotalDiscount = 0.00;
        this.grandTotalTax = 0.00;
        this.grandTotalWithTax = 0.00;
        this.route.params.subscribe(function (params) {
            _this.appointmentId = params['id'];
            console.log("ngOnInit --> Appointment Id :" + _this.appointmentId);
        });
        this.allServices();
        this.servicesList;
    }
    PatientInvoiceComponent.prototype.ngOnInit = function () {
        /*     this.route.params.subscribe(params => {
                this.appointmentId = params['id'];
                console.log("ngOnInit --> Appointment Id :"+this.appointmentId);
            });
    
            this.getAppointmentDataById();
            this.getInvoiceItemsById();
             */
    };
    PatientInvoiceComponent.prototype.goToUserDashBoard = function () {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    };
    PatientInvoiceComponent.prototype.getAppointmentDataById = function () {
        var _this = this;
        if (this.appointmentId) {
            this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_APPOINTMENTS_BY_ID + this.appointmentId)
                .subscribe(function (res) {
                _this.appointment = res.responseData;
                _this.invoicePrefix = res.responseData.invoicePrefix;
                _this.completed = res.responseData.completed;
                _this.patientName = res.responseData.patient;
                _this.scheduleDateAndTime = _this.appointment.scheduleDateAndTime;
                _this.appointmentStartedOn = _this.appointment.appointmentStartedOn;
                _this.docFirstName = _this.appointment.docFirstName;
                _this.docLastName = _this.appointment.docLastName;
                console.log("Appointment Data : " + _this.appointment.patient);
            }, function (error) {
                _this.error = error;
            });
        }
    };
    PatientInvoiceComponent.prototype.getInvoiceItemsById = function () {
        var _this = this;
        if (this.appointmentId) {
            this.requestsService.getRequest(app_constants_1.AppConstants.GET_INVOICE_ITEMS + this.appointmentId)
                .subscribe(function (res) {
                _this.invoiceList = res.responseData;
                console.log("get Invoice Items By Id Data : " + _this.invoiceList);
                _this.unSelectedServiceList();
                _this.getTotalOfAllInviceItems();
            }, function (error) {
                _this.error = error;
            });
        }
    };
    PatientInvoiceComponent.prototype.allServices = function () {
        var _this = this;
        this.requestsService.getRequest(app_constants_1.AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL)
            .subscribe(function (response) {
            //console.log('i am branch call');
            if (response['responseCode'] === 'MED_SER_SUC_01') {
                _this.servicesList = response['responseData'];
                console.log(_this.servicesList);
                _this.getAppointmentDataById();
                _this.getInvoiceItemsById();
            }
        }, function (error) {
            _this.error = error;
        });
    };
    PatientInvoiceComponent.prototype.selectServices = function (service) {
        if (service != "-1") {
            this.show = true;
            //      this.selectedService = this.servicesList[service];
            this.selectedService = this.unSelectedServicesList[service];
            this.serviceName = this.unSelectedServicesList[service].name;
            this.taxRate = this.unSelectedServicesList[service].tax.rate;
            this.unitFee = this.unSelectedServicesList[service].fee;
            this.selectedServiceIndex = service;
            this.invoiceBillCalculation(null);
        }
        else {
            this.show = false;
        }
    };
    PatientInvoiceComponent.prototype.invoiceBillCalculation = function (event) {
        console.log(this.selectedService);
        var Amt = (this.quantity * this.unitFee);
        var discountAmt = (this.quantity * this.unitFee) * this.discountRate / 100;
        var amtAfterDisc = Amt - discountAmt;
        var taxAmt = amtAfterDisc * this.taxRate / 100;
        var totalAMt = amtAfterDisc + taxAmt;
        this.discountAmount = discountAmt;
        this.taxAmount = taxAmt;
        this.invoiceAmount = totalAMt;
        console.log(' taxAmt  :' + this.invoiceAmount);
        console.log(' tax :' + this.taxRate);
        console.log(' tax amount :' + this.taxAmount);
        console.log(' total  :' + this.invoiceAmount);
        //    console.log(' selectedService :'+ (this.selectedService.tax.rate= 20));  
    };
    // this method will called when discount / tax amount will be changed
    PatientInvoiceComponent.prototype.invoiceBillCalculationOnAmount = function (event) {
        var Amt = (this.quantity * this.unitFee);
        this.discountRate = (this.discountAmount / (this.quantity * this.unitFee)) * 100;
        var amtAfterDisc = Amt - this.discountAmount;
        this.taxAmount = amtAfterDisc * this.taxRate / 100;
        var totalAMt = amtAfterDisc + this.taxAmount;
        this.invoiceAmount = totalAMt;
    };
    PatientInvoiceComponent.prototype.getTotalOfAllInviceItems = function () {
        console.log(this.selectedService);
        this.grandTotal = 0.00;
        this.grandTotalDiscount = 0.00;
        this.grandTotalTax = 0.00;
        this.grandTotalWithTax = 0.00;
        var itemAmt = 0.00;
        var taxAmt = 0.00;
        var discAmount = 0.00;
        var i = 0, len = this.invoiceList.length;
        for (; i < len; i++) {
            itemAmt = this.invoiceList[i].quantity * this.invoiceList[i].unitFee;
            this.grandTotal += itemAmt;
            discAmount = (this.invoiceList[i].quantity * this.invoiceList[i].unitFee) * this.invoiceList[i].discountRate / 100;
            this.grandTotalDiscount += discAmount;
            taxAmt = (itemAmt - discAmount) * this.invoiceList[i].taxRate / 100;
            this.grandTotalTax += taxAmt;
            this.grandTotalWithTax += itemAmt + taxAmt - discAmount;
        }
        console.log("----grandTotal : " + this.grandTotal);
    };
    PatientInvoiceComponent.prototype.addInvoice = function (event) {
        this.selectedInvoice = new Invoice_1.Invoice();
        //    this.selectedInvoice.id = this.selectedService.id;
        this.selectedInvoice.code = this.selectedService.code;
        this.selectedInvoice.serviceName = this.serviceName;
        this.selectedInvoice.description = this.selectedService.description;
        this.selectedInvoice.quantity = this.quantity;
        this.selectedInvoice.unitFee = this.unitFee;
        this.selectedInvoice.taxRate = this.taxRate;
        this.selectedInvoice.discountRate = this.discountRate;
        this.selectedInvoice.patientId = this.appointment.patientId;
        this.selectedInvoice.appointmentId = this.appointmentId;
        this.invoiceList.push(this.selectedInvoice);
        this.show = false;
        this.showEditButton = false;
        /*         this.selectedService = this.servicesList.filter((x:any) => x.code == this.selectedInvoice.code)[0]; */
        this.unSelectedServicesList.splice(this.selectedServiceIndex, 1);
        this.selectedServiceIndex = -1;
        this.getTotalOfAllInviceItems();
    };
    PatientInvoiceComponent.prototype.updateInovice = function (event) {
        this.selectedInvoice = new Invoice_1.Invoice();
        this.selectedInvoice.id = this.selectedService.id;
        this.selectedInvoice.code = this.selectedService.code;
        this.selectedInvoice.serviceName = this.serviceName;
        this.selectedInvoice.description = this.selectedService.description;
        this.selectedInvoice.quantity = this.quantity;
        this.selectedInvoice.unitFee = this.unitFee;
        this.selectedInvoice.taxRate = this.taxRate;
        this.selectedInvoice.discountRate = this.discountRate;
        this.selectedInvoice.patientId = this.appointment.patientId;
        this.selectedInvoice.appointmentId = this.appointmentId;
        this.invoiceList[this.editIndex] = this.selectedInvoice;
        this.show = false;
        this.showEditButton = false;
        if (this.selectedServiceIndex != -1) {
            //    this.unSelectedServicesList.splice(this.selectedServiceIndex,1);
            this.selectedServiceIndex = -1;
        }
        this.getTotalOfAllInviceItems();
    };
    PatientInvoiceComponent.prototype.cancel = function () {
        this.show = false;
        this.showEditButton = false;
        this.selectedServiceIndex = -1;
    };
    PatientInvoiceComponent.prototype.removeInvoic = function (value) {
        var _this = this;
        this.servicesList;
        var arr = this.servicesList.filter(function (x) { return x.code === _this.invoiceList[value].code; });
        if (arr.length > 0) {
            this.unSelectedServicesList.push(arr[0]);
            this.invoiceList.splice(value, 1);
        }
        this.getTotalOfAllInviceItems();
    };
    PatientInvoiceComponent.prototype.editInvoic = function (value) {
        this.selectedService = this.invoiceList[value];
        this.selectedService.id = this.invoiceList[value].id;
        this.serviceName = this.invoiceList[value].serviceName;
        this.selectedService.description = this.invoiceList[value].description;
        this.quantity = this.invoiceList[value].quantity;
        this.unitFee = this.invoiceList[value].unitFee;
        this.discountRate = this.invoiceList[value].discountRate;
        this.taxRate = this.invoiceList[value].taxRate;
        this.editIndex = value;
        this.invoiceBillCalculation(this);
        this.show = true;
        this.showEditButton = true;
    };
    // Show unselected services list in dropdown
    PatientInvoiceComponent.prototype.unSelectedServiceList = function () {
        var _this = this;
        if (this.servicesList) {
            //    let list = this.servicesList;
            var list = Object.assign([], this.servicesList);
            var i = 0, len = this.invoiceList.length;
            for (; i < len; i++) {
                var index = list.findIndex(function (list) { return list.code === _this.invoiceList[i].code; });
                if (index != -1) {
                    list.splice(index, 1);
                }
            }
            this.unSelectedServicesList = list;
            console.log("un sel final list:" + this.unSelectedServicesList);
        }
    };
    PatientInvoiceComponent.prototype.saveInvoice = function () {
        var _this = this;
        console.log("save invoice data : " + this.invoiceList);
        this.invoiceCompletedRequest = new GenerateInvoiceRequestModel_1.GenerateInvoiceRequestModel();
        this.invoiceCompletedRequest.invoicePrefix = "0001";
        this.invoiceCompletedRequest.completed = false;
        this.invoiceCompletedRequest.invoiceRequestWrapper = this.invoiceList;
        this.requestsService.postRequest(app_constants_1.AppConstants.SAVE_INVOICE, this.invoiceCompletedRequest)
            .subscribe(function (response) {
            console.log(" Added : " + response);
            if (response['responseCode'] === 'SUCCESS') {
                _this.router.navigate(['/dashboard/doctor']);
                /*  this.notificationService.success('Branch is Created Successfully');
                 this.router.navigate(['/dashboard/setting/branch']) */
            }
        }, function (error) {
            //    this.error('ERROR', 'Branch is not Created');
        });
    };
    PatientInvoiceComponent.prototype.completeInvoice = function () {
        var _this = this;
        console.log("save invoice data : " + this.invoiceList);
        this.invoiceCompletedRequest = new GenerateInvoiceRequestModel_1.GenerateInvoiceRequestModel();
        this.invoiceCompletedRequest.invoicePrefix = "0001";
        this.invoiceCompletedRequest.completed = true;
        this.invoiceCompletedRequest.invoiceRequestWrapper = this.invoiceList;
        this.requestsService.postRequest(app_constants_1.AppConstants.SAVE_INVOICE, this.invoiceCompletedRequest)
            .subscribe(function (response) {
            console.log(" Added : " + response);
            if (response['responseCode'] === 'SUCCESS') {
                _this.router.navigate(['/dashboard/doctor']);
                /*  this.notificationService.success('Branch is Created Successfully');
                 this.router.navigate(['/dashboard/setting/branch']) */
            }
        }, function (error) {
            //    this.error('ERROR', 'Branch is not Created');
        });
    };
    PatientInvoiceComponent.prototype.backPage = function () {
        this.router.navigate(['/dashboard/doctor']);
    };
    PatientInvoiceComponent = __decorate([
        core_1.Component({
            selector: 'patient-invoice',
            templateUrl: '../../../templates/dashboard/patient/patient-invoice.template.html',
        }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, requests_service_1.RequestsService])
    ], PatientInvoiceComponent);
    return PatientInvoiceComponent;
}());
exports.PatientInvoiceComponent = PatientInvoiceComponent;
//# sourceMappingURL=patient-invoice.component.js.map