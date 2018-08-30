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
    templateUrl: '../../../templates/dashboard/patient/patient-lab-orders.template.html',
})
export class PatientLabOrdersComponent implements OnInit {
    labForm:FormGroup;
    labTest: any = [];
    dateTest =new Date();
    id : number;
    patient:Patient =new Patient();
    constructor(private router: Router,private route:ActivatedRoute,private fb:FormBuilder,private requestService:RequestsService,private notificationService:NotificationService,private hISUtilService: HISUtilService) {
    }
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.createLabOrderForm();
        this.loadRecord();
        this.labForm.controls['patientId'].setValue(this.id);

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
                    //this.patient.races = JSON.parse(response['responseData'].racesString);
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
}