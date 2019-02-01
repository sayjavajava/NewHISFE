import {MenuItem, SelectItem} from "primeng/api";
import {Component, OnInit} from "@angular/core";
import {FileServices} from "../../../services/FileServices";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {HISUtilService} from "../../../services/his-util.service";
import {DataService} from "../../../services/DataService";
import {NotificationService} from "../../../services/notification.service";
import {AppConstants} from "../../../utils/app.constants";

@Component({
    selector: "import-patient-data-component",
    templateUrl: "../../../templates/dashboard/patient/import-patient-data.template.html"
})
export class ImportPatientDataComponent implements OnInit {

    heading: string = 'Import Patients';
    dupRecOp: string = 'Skip';          //Duplicate Record Operation
    uploadFileTitle: string = 'Upload an EXCEL file';
    activeIndex: number = 0;
    items: MenuItem[];
    patientDataImport: File = null;
    charEncodingList: any = [];
    encodingType: string = ''; // 'UTF-8 (Unicode)';
    importFileId: number = -1;
    fileFieldsList: any[];
    fileFieldsListModified: SelectItem[] = [];

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title,
                private HISUtilService: HISUtilService,
                private dataService: DataService,
                private notificationService: NotificationService,
                private fileServices: FileServices) {
    }

    ngOnInit() {
        this.titleService.setTitle("HIS | Import Patients");
        this.items = [
            {label: 'Upload'},
            {label: 'Map Fields'},
            {label: 'Import Done'}
        ];

        this.charEncodingList = [
            {value: 'UTF-8 (Unicode)', label: 'UTF-8 (Unicode)'},
            {value: 'UTF-16 (Unicode)', label: 'UTF-16 (Unicode)'},
        ];
    }

    recordOperation() {
        if (this.patientDataImport == null) {
            this.notificationService.warn('Please select a file first');
            this.uploadFileTitle = 'Upload an EXCEL file';
        } else if(this.encodingType.trim() == ''){
            this.notificationService.warn('Please select character encoding');
            document.getElementById('encodingType').focus();
            this.uploadFileTitle = 'Upload an EXCEL file';
        } else {
            console.log(this.patientDataImport);
            this.uploadFileTitle = this.patientDataImport.name;
            this.nextPage();
        }
    }

    downloadSampleFiles() {
        this.fileServices.downloadSampleFile('patient');
    }

    importData(event: any) {
        // console.log(event);
        // console.log("Patient Data Import method is called");
        let fileList: FileList = event.target.files;
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === 'patientDataImport') {
                // if (fileList[0].size < 4000000) {
                this.patientDataImport = fileList[0];
                this.uploadFileTitle = this.patientDataImport.name;
                // } else {
                // this.notificationService.warn('File size must be less than 4000000 bytes');
                // }
            }
        }
        console.log(this.patientDataImport);
    }

    getSelectedEncoding(value: any){
        console.log(value);
        console.log(this.encodingType);
    }

    cancel() {
        this.router.navigate(['/dashboard/patient/manage/']);
    }

    nextPage() {
        this.requestsService.postRequestMultipartForm(AppConstants.IMPORT_PATIENTS_LIST_TO_SERVER + '/' + this.dupRecOp + '/' + this.encodingType, this.patientDataImport)
            .subscribe((response: Response) => {
                if (response['responseCode'] === 'SUCCESS') {
                    this.notificationService.success(response['responseMessage'], 'Import Patient');
                    this.importFileId = response["responseData"];
                    // console.log(this.importFileId);
                    if (this.importFileId != -1) {
                        this.router.navigate(['/dashboard/patient/importPatientMapFields/' + this.importFileId]);
                    } else {
                        this.notificationService.error('Import Patient', 'Failed to upload file' );
                    }
                } else {
                    this.notificationService.error(response['responseMessage'], 'Import Patient');
                }
            },(error: any) => {
                //console.log(error.json())
                this.HISUtilService.tokenExpired(error.error.error);
                this.notificationService.error(error.error.responseMessage, 'Import Patient');
            }
        );

    }

}