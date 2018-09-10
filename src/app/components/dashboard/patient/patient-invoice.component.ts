import {Component, OnInit} from "@angular/core";
import {RequestsService} from '../../../services/requests.service';
import {AppConstants} from '../../../utils/app.constants';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MedicalService } from "../../../model/medical-service";
import {Invoice} from "../../../model/Invoice";

import {ActivatedRoute, Router} from '@angular/router';
import { Appointment } from "../../../model/Appointment";

@Component({
    selector: 'patient-invoice',
    templateUrl: '../../../templates/dashboard/patient/patient-invoice.template.html',
})
export class PatientInvoiceComponent implements OnInit {

    appointment : any;
    patientName : string;
    scheduleDateAndTime : any;
    appointmentStartedOn: any;
    docFirstName: any;
    docLastName: any;

    appointmentId : string;

    servicesList: MedicalService[] ;
    selectedService: MedicalService ;
    error: string;

    serviceName: string;
    quantity : number = 1;
    unitFee : number = 0;

    discountRate : number = 0;
    discountAmount: number = 0.00;
    taxRate : number = 0;
    taxAmount : number = 0.00;
    invoiceAmount: number = 0.00;
    show:boolean = false;
    showEditButton:boolean = false;
    selectedInvoice: Invoice ;
    invoiceList : any = [];

    appointmentForm: FormGroup;
    editIndex : number;

    grandTotal : number = 0.00;
    grandTotalDiscount  : number= 0.00;
    grandTotalTax : number= 0.00;
    grandTotalWithTax : number= 0.00;

    

    constructor(private router: Router,private route: ActivatedRoute, private requestsService: RequestsService) {

        this.allServices();
    }
    ngOnInit(): void {
      
        this.route.params.subscribe(params => {
            this.appointmentId = params['id'];
            console.log("ngOnInit --> Appointment Id :"+this.appointmentId);
        });

        this.getAppointmentDataById();
        this.getInvoiceItemsById();
    }
    goToUserDashBoard(){
        this.router.navigate(['/dashboard/'+atob(localStorage.getItem(btoa('user_type')))+'/']);
    }

    public getAppointmentDataById() 
    {
        if (this.appointmentId) {
            this.requestsService.getRequest(AppConstants.FETCH_APPOINTMENTS_BY_ID + this.appointmentId)
            .subscribe((res :any) =>{
                this.appointment = res.responseData;
                this.patientName = res.responseData.patient;
                this.scheduleDateAndTime = this.appointment.scheduleDateAndTime;
                this.appointmentStartedOn= this.appointment.appointmentStartedOn;
                this.docFirstName= this.appointment.docFirstName;
                this.docLastName= this.appointment.docLastName;
                console.log("Appointment Data : " + this.appointment.patient );
                
                 },
                (error: any) => {
                    this.error = error;
                })
        }
    }

    public getInvoiceItemsById() 
    {
        if (this.appointmentId) 
        {
            this.requestsService.getRequest(AppConstants.GET_INVOICE_ITEMS + this.appointmentId)
            .subscribe((res :any) =>{
                this.invoiceList = res.responseData ;
                console.log("get Invoice Items By Id Data : " + this.invoiceList );

                this.getTotalOfAllInviceItems();
                 },
                (error: any) => {
                    this.error = error;
                })
        }
    }


    allServices() {
        this.requestsService.getRequest(AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL)
            .subscribe(
                (response: Response) => {
                    //console.log('i am branch call');
                    if (response['responseCode'] === 'MED_SER_SUC_01') {
                        this.servicesList = response['responseData'];
                        console.log(this.servicesList);
                    }
                },
                (error: any) => {
                    this.error = error;
                })
    }

    selectServices(service: any) {
        if(service !="-1"){
            console.log('test:'+ this.servicesList[0].name);  
            let arr:MedicalService[] = this.servicesList.filter((x:any) => x.id == service);
            console.log('tax rate:'+ arr[0].tax.rate);  
            
            if (service) {
                this.show = true;
                this.selectedService = arr[0];
                this.serviceName = arr[0].name;
                this.taxRate = arr[0].tax.rate;
                
            }else{
                this.show = false;
            }
        }else{
            this.show = false;
        }
    }


    invoiceBillCalculation(event : any){
        console.log(this.selectedService)

        var Amt = (this.quantity * this.unitFee);
        var discountAmt = (this.quantity * this.unitFee) * this.discountRate/100;
        var taxAmt = (this.quantity * this.unitFee) * this.taxRate/100;
        var totalAMt = Amt + taxAmt - discountAmt;

        this.discountAmount = discountAmt;
        this.taxAmount = taxAmt;
        this.invoiceAmount=totalAMt;

        console.log(' taxAmt  :'+this.invoiceAmount)
        console.log(' tax :'+this.taxRate)
        console.log(' tax amount :'+ this.taxAmount);
        console.log(' total  :'+this.invoiceAmount);
    //    console.log(' selectedService :'+ (this.selectedService.tax.rate= 20));  
    }
    

    getTotalOfAllInviceItems(){
        console.log(this.selectedService);
        
        this.grandTotal = 0.00;
        this.grandTotalDiscount = 0.00;
        this.grandTotalTax = 0.00;
        this.grandTotalWithTax = 0.00;

        var itemAmt = 0.00;
        var taxAmt = 0.00;
        var discAmount = 0.00;

        var i = 0, len = this.invoiceList.length;
        for(;i<len; i++){
            itemAmt = this.invoiceList[i].quantity * this.invoiceList[i].unitFee ;
            this.grandTotal += itemAmt ;

            discAmount = (this.invoiceList[i].quantity * this.invoiceList[i].unitFee) * this.invoiceList[i].discountRate/100  ;
            this.grandTotalDiscount += discAmount;

            taxAmt = (this.invoiceList[i].quantity * this.invoiceList[i].unitFee) * this.invoiceList[i].taxRate/100  ;
            this.grandTotalTax += taxAmt;
            this.grandTotalWithTax +=  itemAmt + taxAmt - discAmount;
        }
        console.log("----grandTotal : " + this.grandTotal);
    }
    

    addInvoice(event : any){
    
        this.selectedInvoice = new Invoice();
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

        this.getTotalOfAllInviceItems();
    }


    updateInovice(event : any){
        this.selectedInvoice = new Invoice();
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

        this.invoiceList[this.editIndex]=this.selectedInvoice;
        this.show = false;
        this.showEditButton = false;

        this.getTotalOfAllInviceItems();
    }


    removeInvoic(value : any){
        this.invoiceList.splice(value,1);
    }

    editInvoic(value : any){
        this.selectedService = this.invoiceList[value];
        this.selectedService.id = this.invoiceList[value].id;
        this.serviceName = this.invoiceList[value].serviceName;
        this.selectedService.description = this.invoiceList[value].description;
        this.quantity = this.invoiceList[value].quantity;
        this.unitFee = this.invoiceList[value].unitFee;
        this.discountRate = this.invoiceList[value].discountRate;
        this.taxRate = this.invoiceList[value].taxRate;

        this.editIndex = value ;
        this.invoiceBillCalculation(this);
        this.show = true;
        this.showEditButton = true;
    }

    saveInvoice(){
        console.log("save invoice data : " + this.invoiceList);
        this.requestsService.postRequest(AppConstants.SAVE_INVOICE, this.invoiceList)
        .subscribe(
        (response: Response) => {
            console.log(" Added : " + response);
            if (response['responseCode'] === 'SUCCESS') {
                this.router.navigate(['/dashboard/doctor']);
               /*  this.notificationService.success('Branch is Created Successfully');
                this.router.navigate(['/dashboard/setting/branch']) */
            }
        }, function (error) {
        //    this.error('ERROR', 'Branch is not Created');
        });
    }

    backPage(){
        this.router.navigate(['/dashboard/doctor']);
    }




}