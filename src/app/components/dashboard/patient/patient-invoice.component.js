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
var PatientInvoiceComponent = (function () {
    function PatientInvoiceComponent(router, route, requestsService) {
        this.router = router;
        this.route = route;
        this.requestsService = requestsService;
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
        this.allServices();
    }
    PatientInvoiceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.appointmentId = params['id'];
            console.log("ngOnInit --> Appointment Id :" + _this.appointmentId);
        });
        this.getAppointmentDataById();
        this.getInvoiceItemsById();
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
                var i = 0, len = _this.invoiceList.length;
                var _loop_1 = function () {
                    var arr = _this.servicesList.filter(function (x) { return x.code != _this.invoiceList[i].code; });
                    if (_this.unSelectedServicesList.length > 0 && !_this.unSelectedServicesList.filter(function (x) { return x.code == arr[0].code; })) {
                        console.log("un Selected Services List By Code Data : " + arr[0].name);
                        _this.unSelectedServicesList.push(arr[0]);
                    }
                    else if (_this.unSelectedServicesList.length == 0) {
                        _this.unSelectedServicesList.push(arr[0]);
                    }
                };
                for (; i < len; i++) {
                    _loop_1();
                }
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
            }
        }, function (error) {
            _this.error = error;
        });
    };
    PatientInvoiceComponent.prototype.selectServices = function (service) {
        if (service != "-1") {
            if (service) {
                this.show = true;
                //      this.selectedService = this.servicesList[service];
                this.selectedService = this.unSelectedServicesList[service];
                this.serviceName = this.unSelectedServicesList[service].name;
                this.taxRate = this.unSelectedServicesList[service].tax.rate;
                this.selectedServiceIndex = service;
            }
            else {
                this.show = false;
            }
            //        let arr:MedicalService[] = this.servicesList.filter((x:any) => x.id == service);
            // console.log('tax rate:'+ arr[0].tax.rate);  
            // if (service) {
            //     this.show = true;
            //     this.selectedService = arr[0];
            //     this.serviceName = arr[0].name;
            //     this.taxRate = arr[0].tax.rate;
            //     this.selectedServiceIndex = service;
            // }else{
            //     this.show = false;
            // }
        }
        else {
            this.show = false;
        }
    };
    PatientInvoiceComponent.prototype.invoiceBillCalculation = function (event) {
        console.log(this.selectedService);
        var Amt = (this.quantity * this.unitFee);
        var discountAmt = (this.quantity * this.unitFee) * this.discountRate / 100;
        var taxAmt = (this.quantity * this.unitFee) * this.taxRate / 100;
        var totalAMt = Amt + taxAmt - discountAmt;
        this.discountAmount = discountAmt;
        this.taxAmount = taxAmt;
        this.invoiceAmount = totalAMt;
        console.log(' taxAmt  :' + this.invoiceAmount);
        console.log(' tax :' + this.taxRate);
        console.log(' tax amount :' + this.taxAmount);
        console.log(' total  :' + this.invoiceAmount);
        //    console.log(' selectedService :'+ (this.selectedService.tax.rate= 20));  
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
            taxAmt = (this.invoiceList[i].quantity * this.invoiceList[i].unitFee) * this.invoiceList[i].taxRate / 100;
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
        this.getTotalOfAllInviceItems();
    };
    PatientInvoiceComponent.prototype.removeInvoic = function (value) {
        var _this = this;
        var arr = this.servicesList.filter(function (x) { return x.code == _this.invoiceList[value].code; });
        this.unSelectedServicesList.push(arr[0]);
        this.invoiceList.splice(value, 1);
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
    PatientInvoiceComponent.prototype.saveInvoice = function () {
        var _this = this;
        console.log("save invoice data : " + this.invoiceList);
        this.requestsService.postRequest(app_constants_1.AppConstants.SAVE_INVOICE, this.invoiceList)
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