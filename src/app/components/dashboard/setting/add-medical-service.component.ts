import {AfterViewInit, Component, OnInit} from '@angular/core';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {MedicalService} from '../../../model/medical-service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Tax} from '../../../model/Tax';
import {InputMaskModule} from 'primeng/inputmask';
@Component({
    selector: 'add-medical-services-component',
    templateUrl: '../../../templates/dashboard/setting/add-medical-services.template.html',
})
export class AddMedicalServiceComponent implements OnInit {

    ms: MedicalService = new MedicalService();
    taxes: Tax[] = [];
    branchId: number;
    serviceTax: any;
    branchIds: number[] = [];
    organizationDataList: any;
    currency:string;
    selectedBranches: any[] = [];
    selectedDepartments: any[] = [];
    currencyFormat:string;
    isError:boolean=false;
    isErrorFee:boolean=false;
    profileImg: File = null;
   // urlOrganization:string;
    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
        this.ms.tax.id = -1;
        this.getBranchesFromServer();
        this.getDepartmentsFromServer();
        this.getTaxesFromServer();
    }

    ngOnInit() {
        this.allorganizationData();
     //   this.getBranchesFromServer();
    //    this.getDepartmentsFromServer();
    }

    /*ngAfterViewInit() {
        let NumberInput = document.getElementById('fee');
       // let inputmask = new inputmask(this.currencyFormat);

      //  inputmask.mask(NumberInput);
    }*/

    getBranchesFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_BRANCHES_URL + 'all/all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.ms.branches = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    getDepartmentsFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                        this.ms.departments = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    onBranchSelection(branchObj :any) {
        if(this.selectedBranches.length >0)
        this.selectedBranches.forEach((x:any)=>{this.ms.selectedBranches = x.id})
       // this.ms.selectedBranches.push(branchObj.id);
        this.ms.selectedDepartments = [];
        this.ms.departments = [];
        if(this.ms.selectedBranches.length != 0){
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_BY_BRANCHES_IDs_URI + '?branchIds=' + this.ms.selectedBranches)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                        this.ms.selectedDepartments = [];
                        this.ms.departments = [];
                        this.ms.departments = response['responseData'];
                    } else {
                        this.ms.selectedDepartments = [];
                        this.ms.departments = [];
                        this.notificationService.error(response['responseMessage']);
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }}


    allorganizationData() {

        this.requestsService.getRequest(AppConstants.ORGANIZATION_DATA_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'ORG_SUC_01') {

                        this.organizationDataList = response['responseData'];
                        this.currency=this.organizationDataList.currency;
                        console.log(this.organizationDataList);
                        this.currencyFormat=this.organizationDataList.currencyFormat;

                    }
                },
                (error: any) => {
                    this.notificationService.error(error.error.error);
                })
    }


    getTaxesFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_TAX_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SER_TAX_SUC_01') {
                        this.taxes = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    saveMedicalServices(msForm: NgForm) {
        if (msForm.valid) {

            let foundBranch = 0;
            for (let branch of this.ms.branches) {
                if (branch.checkedBranch) {
                    foundBranch++;
                }
            }

            if (this.ms.selectedBranches.length <= 0) {
                this.notificationService.warn('Please select at least one branch.');
                document.getElementById('branchId').focus();
                return;
            }

            if (this.isError == true) {
                this.notificationService.warn('Please Enter Number.');
                document.getElementById('cost').focus();
                return;
            }

            if (this.isErrorFee == true) {
                this.notificationService.warn('Please Enter Number.');
                document.getElementById('fee').focus();
                return;
            }
            let foundDepartment = 0;
            for (let department of this.ms.departments) {
                if (department.checkedDepartment) {
                    foundDepartment++;
                }
            }

            if (this.selectedDepartments.length <= 0) {
                this.notificationService.warn('Please select at least one Department.');
                document.getElementById('departmentId').focus();
                return;
            }

            if (this.ms.tax.id <= 0) {
                this.notificationService.warn('Please select tax.');
                document.getElementById('taxId').focus();
                return;
            }

           this.selectedBranches.forEach((x:any)=>{this.ms.selectedBranchesMS.push(x.id)});
            this.requestsService.postRequestMultipartFormAndDataWithOneFile(
                AppConstants.SAVE_MEDICAL_SERVICES_URL,
                this.ms,this.profileImg)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MED_SER_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Medical Service');
                            this.router.navigate(['/dashboard/setting/medicalServices']);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Medical Service');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {

            if (this.ms.name === '') {
                this.notificationService.warn('Please enter name.');
                document.getElementById('msTitle').focus();
                return;
            }
            if (this.ms.code === '') {
                this.notificationService.warn('Please enter code.');
                document.getElementById('code').focus();
                return;
            }
            this.notificationService.error('Please provide required field data', 'Medical Service');
        }
    }

     isNumberCheck(evt:any) {

         var iKeyCode = (evt.which) ? evt.which : evt.keyCode;


         if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57) && (iKeyCode != 190)){
             this.isError=true;
             return false;
         }
        this.isError=false;
         return true;
    }

    isNumberCheckFee(evt:any) {

        var iKeyCode = (evt.which) ? evt.which : evt.keyCode;
        if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57) && (iKeyCode != 190)){
            this.isErrorFee=true;
            return false;
        }
        this.isErrorFee=false;
        return true;
    }

    /*uploadProfileImg() {
        if (this.profileImg && this.profileImg.size <= 40000000) {
            this.requestsService.postRequestMultipartFormData(
                AppConstants.UPLOAD_ORGNAIZATION_IMAGE_URL + this.id
                , this.profileImg)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'ORG_SUC_02') {

                            this.urlOrganization=response['responseData'];
                            this.notificationService.success( 'Medical Service Image has been uploaded Succesfully');
                            this.profileImg = null;
                            //   this.urlOrganization=response['responseData'];
                        }
                    },
                    (error: any) => {
                        this.notificationService.error('Profile Image uploading failed', 'Update Organization');

                    }
                );
        } else {
            this.notificationService.error('File size must be less then 4 mb.', 'Update Organization');
        }
    }*/

    uploadImgOnChange(event: any) {

        let fileList: FileList = event.target.files;
        debugger
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === "profileImgUrl") {
                this.profileImg = fileList[0];
            }
        }
    }
}
