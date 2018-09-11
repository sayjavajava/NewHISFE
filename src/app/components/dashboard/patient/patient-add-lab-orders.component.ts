import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppConstants} from "../../../utils/app.constants";
import {RequestsService} from "../../../services/requests.service";
import {NotificationService} from "../../../services/notification.service";
import {Patient} from "../../../model/patient";
import {HISUtilService} from "../../../services/his-util.service";


@Component({
    selector: 'patient-lab-orders',
    templateUrl: '../../../templates/dashboard/patient/patient-add-lab-orders.template.html',
})
export class PatientAddLabOrdersComponent implements OnInit {


    labForm:FormGroup;
    labTest: any = [];
    dateTest =new Date();
    error:any;
    id:number;
    appointmentId : number;
    orderId:number=0;
    patient:Patient =new Patient();
    constructor(private router: Router,private route:ActivatedRoute,private fb:FormBuilder,private requestService:RequestsService,private notificationService:NotificationService,private hISUtilService: HISUtilService) {
    }
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.route.params.subscribe(params => {
            this.orderId = params['orderId'];
        });
        this.createLabOrderForm();
        this.loadRecord();
        this.labForm.controls['patientId'].setValue(this.id);
        if(this.orderId !=null)
            this.patchOrderData();

      //  this.addMoreTest();
    }
    goToUserDashBoard(){
        this.router.navigate(['/dashboard/'+atob(localStorage.getItem(btoa('user_type')))+'/']);
    }

    loadRecord(){
        this.requestService.getRequest(
            AppConstants.PATIENT_FETCH_URL + this.id
        ).subscribe(
            response => {
                if (response['responseCode'] === 'USER_SUC_01') {
                    this.patient = response['responseData'];
                    let apptId = response['responseData']['pastAppointments'];
                    this.appointmentId  = apptId[0].id;
                    console.log('test appoint id :'+ this.appointmentId)
                } else {
                    this.notificationService.error(response['responseMessage'], 'Patient');
                    // this.router.navigate(['404-not-found'])
                }
            },
            (error: any) => {
                this.hISUtilService.tokenExpired(error.error.error);
            });
    }
    createLabOrderForm() {
        this.labForm = this.fb.group({
            'orderStatus': [null,Validators.required],
            'orderTestDate': [null],
            'doctorSignOff': [null],
            'comments': [null],
            'patientId' :[null,Validators.required],
            'appointmentId':[null,Validators.required],
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

    public patchOrderData() {
        this.requestService.findById(AppConstants.FETCH_LABORDER_BY_ID + this.orderId).subscribe(
            res => {
                this.addUpdateResponseTest(res.labTests.length);
                this.labForm.patchValue({
                    orderStatus: res.status,
                    orderTestDate: new Date(),
                    comments: res.comments,
                    labTest : res.labTests

                });

            }, (error: any) => {
                //console.log(error.json());
                this.error = error.error.error_description;

            });


    }


    addMoreTest(): void {
        this.labTest = this.labForm.get('labTest') as FormArray;
        this.labTest.push(this.createLabTest());

    }

    addUpdateResponseTest(no:Number): void {
        this.removeAllFields();
        this.labTest = this.labForm.get('labTest') as FormArray;

         for (var i = 0; i < no; i++) {
                this.labTest.push(this.createLabTest());
            }
    }
    removeAllFields(){
        this.labTest = this.labForm.get('labTest') as FormArray;
        let examRoomLen = this.labTest.length;
        for (var i = 0; i < examRoomLen; i++) {
            this.labTest.removeAt(0);
        }

    }


    goToStatus(value:any){
        this.labForm.controls['orderStatus'].setValue(value);
    }
    deleteTest(index : number){
        this.labTest = this.labForm.get('labTest') as FormArray;
        this.labTest.removeAt(index);

    }
    addLabOrder(data:any ){
        if (this.labForm.valid) {
            if(this.orderId >0){
                this.requestService.putRequest(AppConstants.LAB_ORDER_UPDATE+ this.orderId,data)
                    .subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'LAB_ORDER_SUC_03') {
                                this.notificationService.success('LabOrder is Updated Successfully');
                            }
                        }, function (error) {
                            this.notificationService.error('ERROR', 'LabOrder is not Updated');
                        });
               }else {
            this.requestService.postRequest(AppConstants.LAB_ORDER_CREATE, data)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'LAB_ORDER_SUC_01') {
                            this.notificationService.success('LabOrder is Created Successfully');
                        }
                    }, function (error) {
                        this.notificationService.error('ERROR', 'LabOrder is not Created');
                    });}

        } else {
            this.validateAllFormFields(this.labForm);
        }

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
        console.log('selec id'+id);
        this.labForm.controls['appointmentId'].setValue(id);
    }
}