import {MenuItem, SelectItem} from "primeng/api";
import {Component, OnInit} from "@angular/core";
import {FileServices} from "../../../services/FileServices";
import {RequestsService} from "../../../services/requests.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {HISUtilService} from "../../../services/his-util.service";
import {DataService} from "../../../services/DataService";
import {NotificationService} from "../../../services/notification.service";
import {AppConstants} from "../../../utils/app.constants";

@Component({
    selector: "import-patient-data-component",
    templateUrl: "../../../templates/dashboard/patient/import-patient-map-fields.template.html"
})
export class ImportPatientMapFieldsComponent implements OnInit {

    heading: string = 'Import Patients';
    dupRecOp: string = 'Skip';          //Duplicate Record Operation
    uploadFileTitle: string = 'Upload an EXCEL file';
    activeIndex: number = 1;
    items: MenuItem[];
    patientDataImport: File = null;
    importFileId: number = -1;
    fileFieldsList: any[];
    // fieldMappingList:any = new Map();
    fieldMappingList:{ [name: string]: any } = {};
    fileFieldsListModified: SelectItem[] = [];
    showFieldsDiv: boolean = false;
    firstNameField: string = 'First Name';
    lastNameField: string = 'Last Name';
    cellPhoneField: string = 'Cell Phone';
    dobField: string = 'Date of Birth (yyyy-MM-dd)';
    genderField: string = 'Gender (Male, Female, Other)';

    constructor(private requestsService: RequestsService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private titleService: Title,
                private HISUtilService: HISUtilService,
                private dataService: DataService,
                private notificationService: NotificationService,
                private fileServices: FileServices) {
    }

    ngOnInit(){
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
        this.requestsService.getRequest(AppConstants.IMPORT_PATIENTS_MAP_FIELDS + '/' + this.importFileId)
            .subscribe((response: Response) => {
                if (response['responseCode'] === 'SUCCESS') {
                    this.notificationService.success(response['responseMessage'], 'Import Patient');
                    this.importFileId = response["responseData"].importFileId;
                    this.fileFieldsList = response["responseData"].fieldsList;
                    for (let fieldName of this.fileFieldsList) {
                        let pair: any = {label: fieldName, value: fieldName};
                        this.fileFieldsListModified.push(pair);
                    }
                    this.showFieldsDiv = true;
                    console.log(this.fileFieldsListModified);
                    console.log(this.importFileId);
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


    previousPage() {
        this.router.navigate(['/dashboard/patient/importPatientData/']);
    }

    cancel() {
        this.router.navigate(['/dashboard/patient/manage/']);
    }

    mapFields() {
        if (this.firstNameField == '' || this.lastNameField == '' || this.cellPhoneField == ''
            || this.dobField == '' || this.genderField == '') {
            this.notificationService.warn('Map all the fields first');
        } else {
            let mappingFieldsList: any[] = [];
            mappingFieldsList.push(this.firstNameField);
            mappingFieldsList.push(this.lastNameField);
            mappingFieldsList.push(this.cellPhoneField);
            mappingFieldsList.push(this.dobField);
            mappingFieldsList.push(this.genderField);

            this.fieldMappingList["importFileId"] = this.importFileId + "";
            this.fieldMappingList["fileFieldsList"] = this.fileFieldsList;
            this.fieldMappingList["mappingFieldsList"] = mappingFieldsList;
            // this.fieldMappingList.set("importFileId", this.importFileId);
            // this.fieldMappingList.set("fileFieldsList", this.fileFieldsList);
            // this.fieldMappingList.set("mappingFieldsList", mappingFieldsList);
            // for (let key of this.fieldMappingList.keys()) {
            //     console.log(key);
            // }
            // for (let val of this.fieldMappingList.values()) {
            //     console.log(val);
            // }
            console.log(this.fieldMappingList);
            this.notificationService.success('Map Fields', 'Mapping done');

            // let mapFieldStr:string = this.firstNameField + ',' + this.lastNameField + ',' + this.cellPhoneField + ',' + this.dobField + ',' + this.genderField;
            // for (var value of mappingFieldsList) {
            //     mapFieldStr = value + ',';
            // }
            // mapFieldStr = mapFieldStr.substring(0, mapFieldStr.length-1);
            // console.log(mapFieldStr);

            //
            this.requestsService.postRequest(AppConstants.IMPORT_PATIENTS_SAVE_MAP_FIELDS, this.fieldMappingList)
                .subscribe((response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.notificationService.success(response['responseMessage'], 'Import Patient');
                        this.router.navigate(['/dashboard/patient/importPatientSaveImport/' + this.importFileId]);
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
    }

    printSelFieldValue(value: any){
        console.log(value);
    }

    // mapToObj(strMap: any) {
    //     console.log(strMap);
    //     let obj = Object.create(null);
    //     console.log(obj);
    //     for (let [k,v] of strMap) {
    //         obj[k] = v; //look out! Key must be a string!
    //         console.log(v + " : " + obj[k]);
    //     }
    //     // console.log(strMap.json());
    //     return obj;
    // }

}