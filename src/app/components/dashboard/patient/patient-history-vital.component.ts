import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {RequestsService} from "../../../services/requests.service";
import {NotificationService} from "../../../services/notification.service";
import {PatientProblemModel} from "../../../model/patient.problem.model";
import {PatientAllergyModel} from "../../../model/patient.allergy.model";
import {MedicationModel} from "../../../model/medication.model";
import {DataService} from "../../../services/DataService";
import {Patient} from "../../../model/patient";
import {SelectItem} from "primeng/api";
import {PatientVitalModel} from "../../../model/PatientVitalModel";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
    selector: 'patient-history',
    templateUrl: '../../../templates/dashboard/patient/patient-history-vital.template.html',
})
export class PatientHistoryVitalComponent implements OnInit {

    problemPages: number[] = [];
    problemNextPage: any;
    problemPrePage: any;
    problemCurrPage: any;
    problemActiveData: PatientProblemModel[] = [];


    vitalPages: number[] = [];
    vitalNextPage: any;
    vitalPrePage: any;
    vitalCurrPage: any;
    // vitalActiveData: PatientProblemModel[] = [];

    allergiesPages: number[] = [];
    allergiesNextPage: any;
    allergiesPrePage: any;
    allergiesCurrPage: any;
    allergiesActiveData: PatientAllergyModel[] = [];

    medicationsPages: number[] = [];
    medicationsNextPage: any;
    medicationsPrePage: any;
    medicationsCurrPage: any;
    medicationsActiveData: MedicationModel[] = [];

    selectedPatientId: any;
  //  subscription: Subscription;
    patient: Patient = new Patient();
    isUpdate: boolean = false;
    data: PatientVitalModel[];
    vitalSetupTemplate: PatientVitalModel = new PatientVitalModel();
    searchedVitalAnyListModified: SelectItem[] = [];
    selectedstr: SelectItem[] = [];
    allVitalsNamesAny: any[];
    vitalList: PatientVitalModel[];
    vitalListData: PatientVitalModel[];
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    cols: any[];
    vitalListSetupData: PatientVitalModel[];
    vitalForm: FormGroup;
    items: FormArray;
    public myForm: FormGroup;
    vitalListReadData:PatientVitalModel[];
    /* vitalForm: FormGroup;
     items: FormArray;*/
    vitalSetupTemplatetemp:PatientVitalModel;
    public form: FormGroup;
    public contactList: FormArray;
    vitalSaveList:any[];
    constructor(private requestsService: RequestsService,
                private router: Router,
                private route: ActivatedRoute,
                private HISUTilService: HISUtilService,
                private notificationService: NotificationService,
                private dataService: DataService,private fb: FormBuilder) {


       /* this.subscription = this.dataService.currentPatientId.subscribe(id => {
            this.selectedPatientId = id;
        });*/

        this.route.params.subscribe(params => {
            this.selectedPatientId = params['id'];

        });

        this.getPaginatedProblemsByActiveAndPatientIdFromServer(0, 5, 'ACTIVE');this.getPaginatedAllergiesByActiveAndPatientIdFromServer(0, 5, 'ACTIVE');
        this.getPaginatedMedicationsByActiveAndPatientIdFromServer(0, 5, 'ACTIVE');
        this.getPatientByIdFromServer(this.selectedPatientId);
        this.getPaginatedPatientVitalList(0);
        this.getVitalSetupList();
    }

    get createFormGroup() {
        return this.vitalForm.get('items') as FormArray;
    }

    get contactFormGroup() {
        return this.form.get('contacts') as FormArray;
    }



    createForm(): FormGroup {
        return this.fb.group({
            type: ['email', Validators.compose([Validators.required])],
            name: [null, Validators.compose([Validators.required])],
            value: [null, Validators.compose([Validators.required, Validators.email])]
        });
    }

    addAddress() {
        // add address to the list
        const control = <FormArray>this.myForm.controls['addresses'];
        control.push(this.initAddress());
    }


    ngOnInit(): void {

        this.form = this.fb.group({
            name: [null, Validators.compose([Validators.required])],
            organization: [null],
            contacts: this.fb.array([this.createContact()])
        });
        this.contactList = this.form.get('contacts') as FormArray;



        this.vitalForm = this.fb.group({

            items: this.fb.array([this.createItem()])
        });

        this.myForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(5)]],
            addresses: this.fb.array([
                this.initAddress(),
            ])
        });

        /* this.vitalForm = this.fb.group({
             currentValue: '',
             items: this.fb.array([ this.createItem() ])
         });*/
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'unit', header: 'Unit' },
            { field: 'currentValue', header: 'Current' },
            { field: 'standardValue', header: 'Standard' },
            /*   { field: 'status', header: 'Status' },*/
            { field: 'status', header: 'Action' }
        ];

        this.getVitalSetupList();


    }

    createContact(): FormGroup {
        return this.fb.group({
            type: ['email', Validators.compose([Validators.required])], // i.e Email, Phone
            name: [null, Validators.compose([Validators.required])], // i.e. Home, Office
            value: [null, Validators.compose([Validators.required, Validators.email])]
        });
    }



    initAddress() {
        return this.fb.group({
            street: ['', Validators.required],
            postcode: ['']
        });
    }

    createItem(): FormGroup {
        return this.fb.group({
            name: '',
            currentValue: '',
            standardValue: ''
        });
    }


    /* createVitalForm() {
         this.billingForm = this.fb.group({
             "currentValue": ['']

         })
     }*/


    getPatientByIdFromServer(patientId: number) {
        this.requestsService.getRequest(
            AppConstants.PATIENT_FETCH_URL + patientId
        ).subscribe(
            response => {
                if (response['responseCode'] === 'USER_SUC_01') {
                    this.patient = response['responseData'];
                    let apptId = response['responseData']['pastAppointments'];
                }
            },
            (error: any) => {
                this.HISUTilService.tokenExpired(error.error.error);
            });
    }

    getPaginatedProblemsByActiveAndPatientIdFromServer(page: number, pageSize: number, problemStatus: any) {

        this.requestsService.getRequest(
            AppConstants.PATIENT_PROBLEM_FETCH_STATUS_URL + page +
            "?selectedPatientId=" + this.selectedPatientId +
            "&status=" + problemStatus +
            "&pageSize=" + pageSize)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATIENT_PROBLEM_SUC_16') {
                        this.problemNextPage = response['responseData']['nextPage'];
                        this.problemPrePage = response['responseData']['prePage'];
                        this.problemCurrPage = response['responseData']['currPage'];
                        this.problemPages = response['responseData']['pages'];
                        this.problemActiveData = [];
                        this.problemActiveData = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                }
            );
    }

    /*  getPageWiseProblemActive(page: number) {
          this.getPaginatedProblemsByActiveAndPatientIdFromServer(page, 5, 'ACTIVE');
      }
  */
    getPaginatedAllergiesByActiveAndPatientIdFromServer(page: number, pageSize: number, allergyStatus: any) {

        this.requestsService.getRequest(
            AppConstants.ALLERGY_PAGINATED_STATUS_URL + page +
            "?selectedPatientId=" + this.selectedPatientId +
            "&status=" + allergyStatus +
            "&pageSize=" + pageSize)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ALLERGY_SUC_28') {
                        this.allergiesNextPage = response['responseData']['nextPage'];
                        this.allergiesPrePage = response['responseData']['prePage'];
                        this.allergiesCurrPage = response['responseData']['currPage'];
                        this.allergiesPages = response['responseData']['pages'];
                        this.allergiesActiveData = [];
                        this.allergiesActiveData = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                }
            );
    }

    getPageWiseAllergiesByActive(page: number) {
        this.getPaginatedAllergiesByActiveAndPatientIdFromServer(page, 5, 'ACTIVE');
    }

    goToUserDashBoard() {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    }

    getPaginatedMedicationsByActiveAndPatientIdFromServer(page: number, pageSize: number, medicationStatus: any) {
        this.requestsService.getRequest(
            AppConstants.MEDICATION_PAGINATED_STATUS_URL + page +
            "?selectedPatientId=" + this.selectedPatientId +
            "&status=" + medicationStatus +
            "&pageSize=" + pageSize)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'MEDICATION_SUC_36') {
                        this.medicationsNextPage = response['responseData']['nextPage'];
                        this.medicationsPrePage = response['responseData']['prePage'];
                        this.medicationsCurrPage = response['responseData']['currPage'];
                        this.medicationsPages = response['responseData']['pages'];
                        this.medicationsActiveData = [];
                        this.medicationsActiveData = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                }
            );
    }

    getPageWiseMedicationsByActive(page: number) {
        this.getPaginatedMedicationsByActiveAndPatientIdFromServer(page, 5, 'ACTIVE');
    }

   /* ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }*/

    patientHistory() {
        // this.dataService.getPatientId(id);//
        var url = '/dashboard/patient/' + this.selectedPatientId + '/history';
        this.router.navigate([url]);
    }

    addVitalPopupClick() {
        this.isUpdate = false;
        this.vitalSetupTemplate = new PatientVitalModel();
        this.vitalListData=[];
        //  this.getPaginatedPatientVitalList(0);


        this.getVitalSetupList();
    }

    getVitalSetupList() {
        this.vitalListData=[];
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(AppConstants.FETCH_VITALS_CONFIGURATIONS+'?patientId=' + this.selectedPatientId
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.data = response['responseData'];
                        console.log(this.data);
                        this.vitalList = this.data;
                        this.vitalSaveList=this.data;
                        this.allVitalsNamesAny = this.data;

                        this.vitalListData=this.data;
                        for (let vital of this.allVitalsNamesAny) {
                            let pair: any = {label: vital.name, value: vital.name};
                            this.searchedVitalAnyListModified.push(pair);

                        }

                        this.selectedstr = this.searchedVitalAnyListModified[0].value;

                        // console.log("Length : " + this.prefixTemplateList.length);
                    } else {
                        this.notificationService.error('Vital Information not fetched');
                    }
                },
                (error: any) => {
                    this.notificationService.error('Vital  Information not fetched');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }


    /*getPatientVitalList() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(AppConstants.FETCH_VITALS_PATIENT
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.vitalListData = response['responseData'];
                        console.log(this.vitalListData);

                    } else {
                        this.notificationService.error(response['responseMessage'], 'Vital ');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], 'Vital Setup Configurations');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }*/


    getSelectedVital(name: any) {

        let vitalSelectedObj = this.vitalList.filter(x => x.name == this.selectedstr.toString());

        if(vitalSelectedObj.length>0){
            this.vitalSetupTemplate.unit = vitalSelectedObj[0].unit;
            this.vitalSetupTemplate.standardValue = vitalSelectedObj[0].standardValue;
            this.vitalSetupTemplate.status = vitalSelectedObj[0].status;
        }

    }

    savePatientVital() {

        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }


        if (this.selectedstr.toString() == '') {
            this.notificationService.warn('Please select Vital');

            return;
        }

        if (this.vitalSetupTemplate.currentValue == '' || this.vitalSetupTemplate.currentValue == null) {
            this.notificationService.warn('Please Enter Current Value');

            return;
        }
        if (this.vitalSetupTemplate.standardValue == '' || this.vitalSetupTemplate.standardValue == null) {
            this.notificationService.warn('Please Select standard Value');

            return;
        }

        if (this.vitalSetupTemplate.unit == '' || this.vitalSetupTemplate.unit == null) {
            this.notificationService.warn('Please Select Vital');
            document.getElementById('name').focus();
            return;
        }

        this.vitalSetupTemplate.name = this.selectedstr.toString();

        if (localStorage.getItem(btoa('access_token'))) {
            this.vitalSetupTemplate.patientId = this.selectedPatientId;
            this.requestsService.postRequest(
                AppConstants.VITALS_PATIENT_SAVE, this.vitalSetupTemplate)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {

                            this.notificationService.success('Patient Vital Sucessfully Saved');
                            document.getElementById('close-btn-Prefix').click();
                            this.getPaginatedPatientVitalList(0);
                            //  this.getPatientVitalList();

                        } else {
                            this.notificationService.error("Patient Vital not Saved");
                            //  this.getPaginatedProblemsFromServer(0);
                            this.getPaginatedPatientVitalList(0);
                        }

                    },
                    (error: any) => {
                        this.HISUTilService.tokenExpired(error.error.error);

                    }
                );
        } else {
            this.notificationService.warn('Your first request is under process,Please wait...');
            return;
        }

    }


    savePatientVitalList(form:FormData) {

        console.log(this.vitalListData);
        //console.log(form);

        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }
        /* for(int i=0;i<this.vitalListData.length;)
             for (let vital of this.vitalListData) {
                 let pair: any = {label: vital.name, value: vital.name};
                 this.searchedVitalAnyListModified.push(pair);

             }*/

        /* debugger;
         if (this.selectedstr.toString() == '') {
             this.notificationService.warn('Please select Vital');

             return;
         }

         if (this.vitalSetupTemplate.currentValue == '' || this.vitalSetupTemplate.currentValue == null) {
             this.notificationService.warn('Please Enter Current Value');

             return;
         }
         if (this.vitalSetupTemplate.standardValue == '' || this.vitalSetupTemplate.standardValue == null) {
             this.notificationService.warn('Please Select standard Value');

             return;
         }*/

        /*  if (this.vitalSetupTemplate.unit == '' || this.vitalSetupTemplate.unit == null) {
              this.notificationService.warn('Please Select Vital');
              document.getElementById('name').focus();
              return;
          }*/

        //   this.vitalSetupTemplate.name = this.selectedstr.toString();
        this.vitalSetupTemplate.listofVital=this.vitalListData;

        if (localStorage.getItem(btoa('access_token'))) {
            //    this.vitalSetupTemplate.patientId = this.selectedPatientId;
            console.log(this.vitalSetupTemplate.listofVital.length);

            this.requestsService.postRequest(
                AppConstants.VITALS_PATIENT_SAVE_LIST+"?selectedPatientId=" + this.selectedPatientId, this.vitalListData)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {

                            this.notificationService.success('Patient Vital Sucessfully Saved');
                            document.getElementById('close-btn-new-vitals').click();
                            this.getPaginatedPatientVitalList(0);
                            //  this.getPatientVitalList();

                        } else {
                            this.notificationService.error("Patient Vital not Saved");
                            //  this.getPaginatedProblemsFromServer(0);
                            this.getPaginatedPatientVitalList(0);
                        }

                    },
                    (error: any) => {
                        this.HISUTilService.tokenExpired(error.error.error);

                    }
                );
        } else {
            this.notificationService.warn('Your first request is under process,Please wait...');
            return;
        }

    }


    editVital(Id: number) {

        this.isUpdate = true;




        if (Id > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(AppConstants.VITAL_GET_URL + Id)
                    .subscribe(
                        response => {
                            if (response['responseCode'] === 'SUCCESS') {
                                this.vitalSetupTemplate = response['responseData'];

                                //      this.selectedPatientId=this.vitalSetupTemplate.id;



                            }
                        },
                        (error: any) => {
                            this.HISUTilService.tokenExpired(error.error.error);
                        });
            } else {
                this.router.navigate(['/login']);
            }
        }
    }


    delete(Id: number) {

        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }

        if (window.localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Sure You Want To Delete')) return;
            this.requestsService.deleteRequest(
                AppConstants.DELETE_VITAL + Id)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success('Patient Vital Sucessfully Deleted');
                            //  this.getPatientVitalList();

                            //   this.HISUTilService.hidePopupWithCloseButtonId('closeButton');
                            document.getElementById('close-btn-Prefix').click();
                            this.getPaginatedPatientVitalList(0);
                        } else {
                            this.getPaginatedPatientVitalList(0);
                            this.notificationService.error(response['responseMessage'], 'Patient Vital unable to Delete');
                        }
                    },
                    (error: any) => {

                        this.notificationService.error(error.error.error)
                        this.HISUTilService.tokenExpired(error.error.error);
                    }
                );

        } else {
            this.router.navigate(['/login']);
        }
    }


    updateVital(formData: FormData) {
        if (this.selectedPatientId <= 0) {
            this.notificationService.warn('Please select patient from dashboard again ');
            return;
        }

        if (this.selectedstr.toString() == '') {
            this.notificationService.warn('Please select Vital');
            document.getElementById('name').focus();
            return;
        }

        if (this.vitalSetupTemplate.currentValue == '' || this.vitalSetupTemplate.currentValue == null) {
            this.notificationService.warn('Please Enter Current value');
            document.getElementById('currentValueId').focus();
            return;
        }

        if (this.vitalSetupTemplate.standardValue == '' || this.vitalSetupTemplate.standardValue == null) {
            this.notificationService.warn('Please Select Vital');
            document.getElementById('name').focus();
            return;
        }

        this.vitalSetupTemplate.name = this.selectedstr.toString();
        this.vitalSetupTemplatetemp=new PatientVitalModel();
        this.vitalSetupTemplatetemp.id=this.vitalSetupTemplate.id;
        this.vitalSetupTemplatetemp.currentValue=this.vitalSetupTemplate.currentValue;
        /*this.vitalSetupTemplatetemp.patientId=this.vitalSetupTemplate.patientId;*/
        if (localStorage.getItem(btoa('access_token'))) {
            //   this.vitalSetupTemplate.patientId = this.selectedPatientId;
            console.log(this.vitalSetupTemplatetemp);
            this.requestsService.putRequest(
                AppConstants.VITALS_PATIENT_UPDATE, this.vitalSetupTemplatetemp)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {

                            this.notificationService.success('Patient Vital Sucessfully Updated');
                            document.getElementById('close-btn-Prefix').click();
                            this.getPaginatedPatientVitalList(0);

                        } else {
                            this.notificationService.error("Patient Vital Not Sucessfully Updated");
                            //  this.getPaginatedProblemsFromServer(0);
                            //  this.getPatientVitalList();
                            this.getPaginatedPatientVitalList(0);
                        }

                    },
                    (error: any) => {
                        this.HISUTilService.tokenExpired(error.error.error);

                    }
                );
        } else {
            this.notificationService.warn('Your first request is under process,Please wait...');
            return;
        }

    }


    /*getPaginatedPatientVitalList(page:number) {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(AppConstants.VITALS_PAGINATED_URL
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.vitalListData = response['responseData'];
                        console.log(this.vitalListData);

                    } else {
                        this.notificationService.error(response['responseMessage'], 'Vital Setup Configurations');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], 'Vital Setup Configurations');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }*/

    private getPaginatedPatientVitalList(page: number) {

        //   this.selectedPatientId=this.vitalSetupTemplate.patientId;

        this.requestsService.getRequest(AppConstants.VITALS_PAGINATED_URL + page + '?patientId=' + this.selectedPatientId)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.vitalNextPage = response['responseData']['nextPage'];
                        this.vitalPrePage = response['responseData']['prePage'];
                        this.vitalCurrPage = response['responseData']['currPage'];
                        this.vitalPages = response['responseData']['pages'];
                        // this.vitalActiveData=[];
                        this.vitalListReadData = response['responseData']['data'];
                    } else {
                      //  this.notificationService.error( 'Vital  Information not fetched');
                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                }
            );
    }

    getPageWiseVitalActive(page: number) {
        this.getPaginatedVitalByActiveAndPatientIdFromServer(page, 5);
    }

    getPaginatedVitalByActiveAndPatientIdFromServer(page: number, pageSize: number) {

        this.requestsService.getRequest(
            AppConstants.VITALS_PAGINATED_URL + page +
            "?selectedPatientId=" + this.selectedPatientId +
            "&pageSize=" + pageSize)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.vitalNextPage = response['responseData']['nextPage'];
                        this.vitalPrePage = response['responseData']['prePage'];
                        this.vitalCurrPage = response['responseData']['currPage'];
                        this.vitalPages = response['responseData']['pages'];
                        //   this.vitalActiveData = [];
                        this.vitalListData = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUTilService.tokenExpired(error.error.error);
                }
            );
    }

    onBlurMethod(id:number,event : any){

        const index = this.vitalListData.findIndex(list => list.id === id);
        let arr = this.vitalListData.filter((listing: any) => listing.id === id);
        this.vitalListData[index].currentValue=event;
        //   this.vitalListData[index].currentValue=arr[index].currentValue;
        //    let updateItem = this.vitalListData.items.find(this.findIndexToUpdate, id);
        //   let arr = this.vitalListData.filter((listing: any) => listing.id === id);

        //   let updateItem = this.vitalListData.items.find(this.findIndexToUpdate, id);
        //   let index = this.vitalListData.items.indexOf(updateItem);
        //  this.vitalListData.items[index].currentValue = event.value;
        //var currentValue = event.value();

    }

    /*showUpdatedItem(obj:any){
        let updateItem = this.vitalListData.items.find(this.findIndexToUpdate, obj.id);
        //updateItem
        let index = this.vitalListData.items.indexOf(updateItem);


        this.LabReadList.items[index] = obj.id;

    }*/

    findIndexToUpdate(object:any) {
        //   return this.vitalListData.id === this;
    }


    /* getVitalSetupList() {
         if (localStorage.getItem(btoa('access_token'))) {
             this.requestsService.getRequest(AppConstants.FETCH_VITALS_CONFIGURATIONS
             ).subscribe(
                 (response: Response) => {
                     if (response['responseCode'] === 'SUCCESS') {
                         this.data = response['responseData'];
                         // console.log("Length : " + this.prefixTemplateList.length);
                     } else {
                         this.notificationService.error(response['responseMessage'], 'Vital Setup Configurations');
                     }
                 },
                 (error: any) => {
                     this.notificationService.error(Response['responseMessage'], 'Vital Setup Configurations');
                 }
             );
         } else {
             this.router.navigate(['/login']);
         }
     }*/

}
