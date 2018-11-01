import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppConstants} from "../../../utils/app.constants";
import {RequestsService} from "../../../services/requests.service";
import {NotificationService} from "../../../services/notification.service";
import {Patient} from "../../../model/patient";
import {HISUtilService} from "../../../services/his-util.service";
import {ConfirmationdialogComponent} from "../confirmationdialog.component";
import {ConformationDialogService} from "../../../services/ConformationDialogService";


@Component({
    selector: 'patient-lab-orders',
    templateUrl: '../../../templates/dashboard/patient/patient-lab-orders.template.html',
})
export class PatientLabOrdersComponent implements OnInit {

    nextPage: number;
    prePage: number;
    currPage: number;
    pages: number[] = [];
    labForm:FormGroup;
    labTest: any = [];
    dateTest =new Date();
    id : number;
    orderId:number;
    error:any;
    orderNotFound:boolean=false;

    allOrders:any=[];
    filteredLabTest :any[] =[];
    patient:Patient =new Patient();
    constructor(private router: Router,private route:ActivatedRoute,private fb:FormBuilder,private requestService:RequestsService,
                private notificationService:NotificationService,private hISUtilService: HISUtilService,private confirmationDialogService: ConformationDialogService ) {
    }
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.createLabOrderForm();
        this.loadRecord();
        this.labForm.controls['patientId'].setValue(this.id);
        this.getLabOrderFromServer(0);

      //  this.addMoreTest();
    }

    goToUserDashBoard(){
        this.router.navigate(['/dashboard/'+atob(localStorage.getItem(btoa('user_type')))+'/']);
    }
    getLabOrderFromServer(page: number) {
        if (page > 0) {
            page = page;

        }
        if(this.id == null || this.id ==0 || this.id==undefined){
            this.orderNotFound =true;
            this.notificationService.error('Please Select Patient Again From Dashboard')
        }else {
        this.requestService.getRequestWithParam(
            AppConstants.FETCH_ALL_ORDER_BY_PATIENT_URL + page,this.id)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'LAB_ORDER_SUC_02') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.allOrders = response['responseData']['data'];

                    }
                    if(response['responseCode'] =='LAB_ORDER_ERR_02'){
                        this.notificationService.warn(`Info ${response['responseMessage']}`)
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                }
            );
        }
    }
    loadRecord(){
        this.requestService.getRequest(
            AppConstants.PATIENT_FETCH_URL + this.id
        ).subscribe(
            response => {
                if (response['responseCode'] === 'USER_SUC_01') {
                    this.patient = response['responseData'];
                    //this.patient.races = JSON.parse(response['responseData'].racesString);
                }
            },
            (error: any) => {
                this.hISUtilService.tokenExpired(error.error.error);
            });
    }
    createLabOrderForm() {
        this.labForm = this.fb.group({
            'orderStatus': [null],
            'orderTestDate': [null],
            'doctorSignOff': [null],
            'comments': [null],
            'patientId' :[null],
            'appointmentId':[null],
            'selectedAppointment':[null,Validators.required],
            'labTest': this.fb.array([this.createLabTest()]),
        })
    }
    createLabTest(): FormGroup {
        return this.fb.group({
            'loincCode': '',
            'description': '',
            'resultValue': '',
            'units': '',
            'normalRange': '',
        });
    }

    addMoreTest(): void {
        this.labTest = this.labForm.get('labTest') as FormArray;
        this.labTest.push(this.createLabTest());

    }
    goToStatus(value:any){
        this.labForm.controls['orderStatus'].setValue(value);
    }
    deleteTest(index : number){
        console.log('indexsss:'+ index);
        this.labTest = this.labForm.get('labTest') as FormArray;
        this.labTest.removeAt(index);

    }
    addLabOrder(data:any ){
        console.log('tes'+data);
        if (this.labForm.valid) {

            // let branchObject = this.prepareSaveBranch();
            this.requestService.postRequest(AppConstants.LAB_ORDER_CREATE, data)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'LAB_ORDER_SUC_01') {
                            this.notificationService.success('LabOrder is Created Successfully');
                        }
                    }, function (error) {
                        this.notificationService.error('ERROR', 'LabOrder is not Created');
                    });

        } else {
            this.validateAllFormFields(this.labForm);
        }

    }
    getLabTest(orderId:any){
      let labTestFiltered :any[]= this.allOrders.filter((x:any) =>x.id == orderId).map((x:any)=>x.labTests);
      this.filteredLabTest = labTestFiltered[0];
      labTestFiltered.forEach(function (msg) {
          console.log(msg);
      })
      console.log('lab tes'+ labTestFiltered[0]);
    }
    updateOrder(id:number){
        console.log('dmmm');
        this.orderId = id;
       // this.router.navigate("['/dashboard/patient/create-order/',id,'add',orderId,'order']");
        this.router.navigate(['/dashboard/patient/create-order',this.id,'add',this.orderId,'order']);
    }

    validateAllFormFields(formGroup: FormGroup) {
        console.log('i am validating');
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({onlySelf: true});
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }
    selectedAppointment(id:any){
        this.labForm.controls['appointmentId'].setValue(id);
    }
    deleteLabOrder(id: number) {
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(res => {
                if (res ==true) {
                    this.requestService.deleteRequest(AppConstants.LAB_ORDER_DELETE + id).subscribe((data: Response) => {
                        if (data['responseCode'] === 'LAB_ORDER_SUC_04') {
                            this.notificationService.success('LabOrder has been Deleted Successfully');
                            this.getLabOrderFromServer(this.currPage);

                        }

                    }, error => {
                        this.notificationService.error('ERROR', 'LabOrder is not deleted ');

                    });
                }
            });
    }
}