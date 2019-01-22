import {FileServices} from "../../../services/FileServices";
import {NotificationService} from "../../../services/notification.service";
import {RequestsService} from "../../../services/requests.service";
import {MenuItem} from "primeng/api";
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {HISUtilService} from "../../../services/his-util.service";
import {DataService} from "../../../services/DataService";
import {AppConstants} from "../../../utils/app.constants";
import {PatientImportRecordModel} from "../../../model/PatientImportRecordModel";

@Component({
    selector: "import-patient-data-component",
    templateUrl: "../../../templates/dashboard/patient/import-patient-upload-import.template.html"
})
export class ImportPatientUploadImportComponent implements OnInit {

    heading: string = 'Import Patients';
    dupRecOp: string = 'Skip';          //Duplicate Record Operation
    activeIndex: number = 2;
    items: MenuItem[];
    importFileId: number = -1;
    showFieldsDiv: boolean = false;
    allPatientDataToImport: PatientImportRecordModel[] = [];
    numOfRecords: number = 0;
    numOfCheckedRecords: number = 0;
    patientImportRecord: PatientImportRecordModel = new PatientImportRecordModel;
    dataMap:{ [name: string]: any } = {};
    allChecked: boolean = false;

    constructor(private requestsService: RequestsService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private titleService: Title,
                private HISUtilService: HISUtilService,
                private dataService: DataService,
                private notificationService: NotificationService,
                private fileServices: FileServices) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.importFileId = params['id'];
        });

        this.titleService.setTitle("HIS | Import Patients");

        this.items = [
            {label: 'Upload'},
            {label: 'Map Fields'},
            {label: 'Import Done'}
        ];
        console.log(this.importFileId);

        this.requestsService.postRequest(AppConstants.IMPORT_PATIENTS_IMPORT_MAPPED_DATA, this.importFileId)
            .subscribe((response: Response) => {
                if (response['responseCode'] === 'SUCCESS') {
                    this.notificationService.success(response['responseMessage'], 'Import Patient');
                    this.allPatientDataToImport = response['responseData'];
                    this.numOfRecords = this.allPatientDataToImport.length;
                    console.log(this.allPatientDataToImport);
                    console.log(this.numOfRecords);
                    if (this.numOfRecords > 0) {
                        this.showFieldsDiv = true;
                        for (let i = 0; i < this.numOfRecords; i++) {
                            this.patientImportRecord = this.allPatientDataToImport[i];
                            if (this.patientImportRecord.status) {
                                this.numOfCheckedRecords++;
                            }
                        }
                        if (this.numOfRecords == this.numOfCheckedRecords) {
                            this.allChecked = true;
                            // document.getElementById('allChecked').setAttribute('checked', 'checked');
                        }
                    } else {
                        this.notificationService.error('No record to import. Please select a valid file!', 'Import Patient');
                    }
                    // this.router.navigate(['/dashboard/patient/importPatientSaveImport/' + this.importFileId]);
                } else {
                    this.notificationService.error(response['responseMessage'], 'Import Patient');
                }
            },(error: any) => {
                //console.log(error.json())
                this.HISUtilService.tokenExpired(error.error.error);
                this.notificationService.error(error.error.error, 'Import Patient');
            }
        );

    }

    importData() {
        if (this.numOfRecords > 0) {
            if (this.numOfCheckedRecords > 0) {
                // this.dataMap["importFileId"] = this.importFileId + "";
                // this.dataMap["dataList"] = this.allPatientDataToImport;
                console.log(this.allPatientDataToImport);
                this.requestsService.postRequest(AppConstants.IMPORT_PATIENTS_SAVE_MAPPED_DATA + '?importFileId=' + this.importFileId, this.allPatientDataToImport)
                    .subscribe((response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success(response['responseData'] + ' patients record imported', 'Import Patient');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Import Patient');
                        }
                    },(error: any) => {
                        //console.log(error.json())
                        this.HISUtilService.tokenExpired(error.error.error);
                        this.notificationService.error(error.error.error, 'Import Patient');
                    }
                );
            } else {
                this.notificationService.warn('Please select a record first');
            }
        } else {
            this.notificationService.warn('No data to import. Please check your data file!');
        }
    }

    evalCheckedRecords(value: any) {
        console.log(value);
        if (value) {
            this.numOfCheckedRecords++;
        } else {
            this.numOfCheckedRecords--;
        }
        this.evalAllCheckedRecord();
    }

    evalAllCheckedRecord() {
        console.log(this.numOfRecords + " : " + this.numOfCheckedRecords);
        if (this.numOfRecords == this.numOfCheckedRecords) {
            this.allChecked = true;
            // document.getElementById('allChecked').setAttribute('checked', 'true');
        } else {
            this.allChecked = false;
            // document.getElementById('allChecked').removeAttribute('checked');
        }
    }

    checkAll(checkToggle: boolean) {
        console.log(checkToggle);
        for (let i = 0; i < this.numOfRecords; i++) {
            let patientImportRec = this.allPatientDataToImport[i];
            patientImportRec.status = checkToggle;
        }

        if (checkToggle) {
            this.numOfCheckedRecords = this.numOfRecords;
        } else {
            this.numOfCheckedRecords = 0;
        }

        this.evalAllCheckedRecord();

        /*
        let checkBoxes = document.getElementsByTagName('input');
        for (let i=0; i<checkBoxes.length; i++)  {
            if (checkBoxes[i].type == 'checkbox')   {
                if (checkToggle) {
                    checkBoxes[i].setAttribute('checked', 'true')
                } else {
                    checkBoxes[i].removeAttribute('checked')
                }

                // checkBoxes[i].checked = checkToggle;
            }
        }
        */
    }

    previousPage() {
        this.router.navigate(['/dashboard/patient/importPatientMapFields/' + this.importFileId]);
    }

    cancel() {
        this.router.navigate(['/dashboard/patient/manage/']);
    }

}