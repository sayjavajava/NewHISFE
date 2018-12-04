import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppConstants} from "../../../utils/app.constants";
import {RequestsService} from "../../../services/requests.service";
import {NotificationService} from "../../../services/notification.service";
import {Patient} from "../../../model/patient";
import {HISUtilService} from "../../../services/his-util.service";
import {LabTestSpecimanModel} from "../../../model/LabTestSpecimanModel";
import {DatePicker} from "angular2-datetimepicker";
import {LabTestModel} from "../../../model/LabTestModel";
import {SelectItem} from "primeng/api";

@Component({
    selector: 'patient-lab-orders',
    templateUrl: '../../../templates/dashboard/patient/patient-add-lab-orders.template.html',
})
export class PatientAddLabOrdersComponent implements OnInit {


    labForm:FormGroup;
    labTest: any = [];
    dateTest = new Date();//new Date();
    error:any;
    id:number;
    appointmentId : number;
    orderId:number=0;
    patient:Patient =new Patient();
    filteredTestSingle: any[];
    statusType:any;
    labTestSpecimanList: LabTestSpecimanModel[];
    singleTestSpeciman:LabTestSpecimanModel=new LabTestSpecimanModel();
    resultValue:string;
    LabForm:FormGroup;
    LabReadList : any = [];
    singleObj:LabTestModel=new LabTestModel();
    selectedTest: LabTestModel ;
    show:boolean = false;
    selectedService:LabTestModel;
    showEdit:boolean = false;
    hideField:boolean = false;
    editIndex : number;
    filterSpeciman:LabTestSpecimanModel=new LabTestSpecimanModel();
    LabReadListObj : any = [];
    doctorAppointment:string;
    showDoctor:boolean = false;
    appointmentList:any[];
    selectedAppointmentId: SelectItem[] = [];
    selectedString:string;
    filterLabTestSingle(event:any) {
        let query = event.query;
        this.filteredTestSingle = this.filterLabTest(query, this.labTestSpecimanList);

        if(this.filteredTestSingle.length > 0){
            this.show = true;
        }else{
            this.show=false;
        }
        this.singleObj=this.filteredTestSingle[0];
        this.singleTestSpeciman.description=this.filteredTestSingle[0].description;
        this.filterSpeciman.description=this.singleObj.description;
        this.singleTestSpeciman.unit=this.filteredTestSingle[0].unit;
        this.filterSpeciman.unit=this.singleObj.unit;
        this.singleTestSpeciman.minNormalRange=this.filteredTestSingle[0].minNormalRange;
        this.filterSpeciman.minNormalRange=this.singleObj.minNormalRange;
        this.singleTestSpeciman.maxNormalRange=this.filteredTestSingle[0].maxNormalRange;
        this.filterSpeciman.maxNormalRange=this.singleObj.maxNormalRange;
        this.singleTestSpeciman.testCode=this.filteredTestSingle[0].testCode;
        this.filterSpeciman.testCode=this.singleObj.testCode;
        this.singleTestSpeciman.testName=this.filteredTestSingle[0].testName;
        this.filterSpeciman.testName=this.singleObj.testName;
        this.singleTestSpeciman.id=this.filteredTestSingle[0].id;
        this.filterSpeciman.id=this.singleObj.id;
    }

    filterLabTest(query:any, labTests: any[]):any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered : any[] = [];
        for(let i = 0; i < labTests.length; i++) {
            let test = labTests[i];
            if( ( test.testCode.toLocaleLowerCase().indexOf(query.toLowerCase())  >= 0 ) || ( test.testName.toLocaleLowerCase().indexOf(query.toLowerCase()) >= 0 ) ) {//country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(test);
            }
        }
        return filtered;
    }
    /*
    *  constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    *
    * */


    constructor(private router: Router,private route:ActivatedRoute,private fb:FormBuilder,private requestService:RequestsService,private notificationService:NotificationService,private hISUtilService: HISUtilService)
    {

        this.createLabTest();
        DatePicker.prototype.ngOnInit = function() {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }
            this.settings.timePicker =true;
            this.date = new Date();
        };
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
        if(this.orderId !=null) {
            this.patchOrderData();
        }
        this.statusType = [
            { label: 'ORDERED ENTERED', value: 'ORDEREDENTERED' },
            { label: 'IN_PROGRESS', value: 'INPROGRESS' },
            { label: 'RESULT RECEIVED', value: 'RESULTRECEIVED' },

        ];
        this.requestService.getRequest(AppConstants.FETCH_LAB_TEST_SPECIMAN_CONFIGURATIONS
        ).subscribe(
            (response: Response) => {
                if (response['responseCode'] === 'SUCCESS') {
                    this.labTestSpecimanList = response['responseData'];
                } else {
                    this.notificationService.error(response['responseMessage'], 'Lab Test Speciman Configurations');
                }
            },
            (error: any) => {
                this.notificationService.error(Response['responseMessage'], 'Lab Test Speciman Configurations');
            }
        );
        //  this.addMoreTest();
    }

    goToUserDashBoard(){
        this.router.navigate(['/dashboard/'+atob(localStorage.getItem(btoa('user_type')))+'/']);
    }

    loadRecord(){
        if(this.id == null || this.id ==0 || this.id==undefined){
            this.notificationService.error('Please Select Patient Again From Dashboard')
        }else {
            this.requestService.getRequest(
                AppConstants.PATIENT_FETCH_URL + this.id
            ).subscribe(
                response => {
                    if (response['responseCode'] === 'USER_SUC_01') {
                        this.patient = response['responseData'];

                        console.log(this.patient);
                        let apptId = response['responseData']['pastAppointments'];
                        this.appointmentList=response['responseData']['pastAppointments'];

                        //   this.doctorAppointment=apptId[]
                        console.log(apptId);
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
    }
    createLabOrderForm() {
        this.labForm = this.fb.group({
            'orderStatus': [null,Validators.required],
            'orderTestDate': [null],
            'doctorSignOff': [null],
            'comments': [null],
            'testNameId': [null],
            'doctorName':[null],
            'patientId' :[null,Validators.required],
            'appointmentId':[null,Validators.required],
            'labTest': this.fb.array([this.createLabTest()]),
        })
    }
    createLabTest(): FormGroup {
        return this.fb.group({
            'textCode': '',
            'textName':'',
            'resultValue': '',
            'units': '',
            'normalRange': '',
        });
    }

    public patchOrderData() {
        this.requestService.findById(AppConstants.FETCH_LABORDER_BY_ID + this.orderId).subscribe(
            res => {
                this.LabReadList=res.labTests;
                for(let i = 0; i < res.labTests.length; i++) {
                    let test = res.labTests[i];

                    if(test!=null) {
                        this.LabReadList[i].testCode=test.loincCode;
                        this.LabReadList[i].resultValue=test.resultValue;
                        this.LabReadList[i].unit=test.units;
                        this.LabReadList[i].minNormalRange=test.normalRange;
                    }
                }

                this.addUpdateResponseTest(res.labTests.length);

                let selectAppointment=this.patient.pastAppointments.filter((listing: any) => listing.appointmentId === res.appointment[0].appointmentId);
                this.selectedAppointmentId=selectAppointment[0].label;
                /*debugger;
                for (let sel of selectAppointment) {
                    var pair: any = {label: sel.label, value: sel.label};
                    this.selectedAppointmentId.push(pair);
                }*/

                this.selectedString=res.labTests[0].testCode.toString();

                this.labForm.patchValue({
                    orderStatus: res.status,
                    orderTestDate: new Date(),
                    comments: res.comments,
                    labTest : res.labTests,



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
        debugger;
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

    goToStatus(valueObj:any){
        const value = valueObj.value;
        this.labForm.controls['orderStatus'].setValue(value);
    }
    clearField(){

        this.filterSpeciman.description='';
        this.filterSpeciman.unit='';
        this.filterSpeciman.minNormalRange='';
        this.filterSpeciman.maxNormalRange='';
        this.filterSpeciman.testCode='';
        this.filterSpeciman.testName='';
        this.resultValue='';

    }


    deleteTestEdit(){
        this.createLabTest();
        this.selectedTest.testCode = '';
        this.selectedTest.testName = '';
        this.selectedTest.unit='';
        this.selectedTest.maxNormalRange='';
        this.selectedTest.id=0;
        this.selectedTest.resultValue='';


    }
    addLabOrder(data:any ){

        data.testDate=new Date(this.dateTest);
        if (this.labForm.valid) {
            if(this.orderId >0){

                this.requestService.putRequest(AppConstants.LAB_ORDER_UPDATE+ this.orderId,data)
                    .subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'LAB_ORDER_SUC_03') {
                                this.notificationService.success('LabOrder is Updated Successfully');
                                this.router.navigate(['/dashboard/patient/lab-orders/',this.id,'history']);
                            }
                        }, function (error) {
                            this.notificationService.error('ERROR', 'LabOrder is not Updated');
                        });
            }else {
                data.labTest=this.LabReadList;
                this.requestService.postRequest(AppConstants.LAB_ORDER_CREATE, data)
                    .subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'LAB_ORDER_SUC_01') {
                                this.notificationService.success('LabOrder is Created Successfully');
                                this.router.navigate(['/dashboard/patient/lab-orders/',this.id,'history']);
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
    selectedAppointment(aptObje:any){
        const id = aptObje.value;
        let doctorName= this.appointmentList.filter((listing: any) => listing.id === id);
        debugger;
        this.doctorAppointment=doctorName[0].docFirstName+' '+doctorName[0].docLastName;
        // console.log('apt idd ' +  id + '' )
        this.showDoctor=true;
        this.labForm.controls['appointmentId'].setValue(id);
        //  this.labForm.controls['doctorName'].setValue()
    }

    addLabtoGrid(event : any){

        this.selectedTest = new LabTestModel();
        this.selectedTest.testCode = this.singleObj.testCode;
        this.selectedTest.unit=this.singleObj.unit;
        this.selectedTest.minNormalRange=this.singleObj.minNormalRange;
        this.selectedTest.id=this.singleObj.id;
        this.selectedTest.resultValue=this.resultValue;
        debugger;
        this.LabReadList.push(this.selectedTest);
        this.show = false;
        this.showEdit=false;
        this.clearField();
        let arr = this.filteredTestSingle.filter((listing: any) => listing.id === this.selectedTest.id);
        this.filteredTestSingle.splice(arr[0],1);

    }

    updateLabtoGrid(event : any){
        debugger;
        this.selectedTest = new LabTestModel();
        this.selectedTest.testCode=this.filterSpeciman.testCode;
        this.selectedTest.unit=this.filterSpeciman.unit;
        this.selectedTest.minNormalRange=this.filterSpeciman.minNormalRange;
        this.selectedTest.id=this.filterSpeciman.id;
        this.selectedTest.resultValue=this.resultValue;
        this.LabReadList[this.editIndex]=this.selectedTest;
        this.clearField();
        this.show = false;
        this.showEdit = false;


    }

    unSelectedList()
    {
        if(this.filteredTestSingle)
        {

            let list = Object.assign([], this.filteredTestSingle);
            var i = 0, len = this.LabReadList.length;
            for (; i < len; i++) {

                const index = list.findIndex(list => list.id === this.LabReadList[i].id);
                if(index != -1){
                    list.splice(index, 1);
                }
            }
            this.filteredTestSingle = list;

        }
    }


    editLabtoGrid(value : any){

        debugger;
        this.selectedTest = new LabTestModel();
        this.filterSpeciman.testCode = this.LabReadList[value].testCode;
        this.filterSpeciman.unit=this.LabReadList[value].unit;
        this.filterSpeciman.minNormalRange=this.LabReadList[value].minNormalRange;
        this.filterSpeciman.id=this.LabReadList[value].id;
        this.resultValue=this.LabReadList[value].resultValue;
        this.selectedTest.testCode=this.LabReadList[value].testCode;
        this.selectedTest.unit=this.LabReadList[value].unit;
        this.selectedTest.minNormalRange=this.LabReadList[value].minNormalRange;
        this.selectedTest.id=this.LabReadList[value].id;
        this.selectedTest.resultValue=this.LabReadList[value].resultValue;
        this.LabReadList[value]=this.selectedTest;
        this.editIndex = value ;
        this.show = true;
        this.showEdit=true;


    }

    removeLabtoGrid(value : any)
    {


        let arr = this.LabReadList.filter((listing: any) => listing.id === value);
        if(arr.length >= 0)
        {
            // this.filteredTestSingle.push(arr[0]);
            this.LabReadList.splice(arr,1);
        }

    }

    showUpdatedItem(obj:any){
        let updateItem = this.LabReadList.items.find(this.findIndexToUpdate, obj.id);

        let index = this.LabReadList.items.indexOf(updateItem);


        this.LabReadList.items[index] = obj.id;

    }

    findIndexToUpdate(object:any) {
        return this.LabReadList.id === this;
    }

}