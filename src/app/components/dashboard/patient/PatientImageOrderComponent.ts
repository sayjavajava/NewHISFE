import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DocumentModel} from '../../../model/document';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {AppConstants} from '../../../utils/app.constants';
import {HISUtilService} from '../../../services/his-util.service';
import {DataService} from '../../../services/DataService';
import {Subscription} from 'rxjs/Subscription';
import {Patient} from '../../../model/patient';
import {SelectItem} from "primeng/api";
import {PatientImageOrderModel} from "../../../model/PatientImageOrderModel";
import {PatientImageModel} from "../../../model/PatientImageModel";


@Component({
    selector: 'patient-document',
    templateUrl: '../../../templates/dashboard/patient/patient-order.template.html',
})
export class PatientImageOrderComponent implements OnInit {
    patient: Patient = new Patient();
    isUpdate: boolean;
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    orderData: PatientImageOrderModel[] = [];
    dm: DocumentModel = new DocumentModel();
    private selectedPatientId: number;
    private uploadedImage: File = null;
    private isRequestUnderProcess: boolean = false;
    private subscription: Subscription;
    reportType:any;
    orderListModified: SelectItem[] = [];
    data: PatientImageModel[];
    selectedOrder: SelectItem[] = [];
    statusType:any;
    uploadedFiles: any[] = [];
    showEdit:boolean=true;
    TestCode:any;
    images: any[]=[];
    filteredOrderResult :any[] =[];
    showImage:boolean=false;
    showDoc:boolean=false;
    docDiv:string;
    url:string;
    labTestFiltered:any[] =[];
    filteredLabTestUrl:any[]=[];
    selectedId:string;
    patientImageTemplate: PatientImageOrderModel = new PatientImageOrderModel();
    showUpload:boolean=false;
    @ViewChild('closeBtn') closeBtn: ElementRef;
    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private dataService: DataService) {

        this.subscription = this.dataService.currentPatientId.subscribe(id => {
            this.selectedPatientId = id;
        });

        this.getPatientImageSetupList();
        this.getPatientByIdFromServer(this.selectedPatientId);



    }


    ngOnInit(): void {

        this.statusType = [
            {label: 'ACTIVE',value:'ACTIVE'},
            {label: 'IN-ACTIVE',value:'IN-ACTIVE'},
        ];

        this.reportType = [
            {label: 'Insurance',value:'Insurance'},
            {label: 'HEALTH_CERTIFICATE',value:'HEALTH_CERTIFICATE'},
            {label: 'REPORT',value:'REPORT'},
            {label: 'TEST',value:'TEST'},

        ];
        this.getPageWiseOrderFromServer(0);
        this.isUpdate = true;
    }


    addProblemPopupClick() {
        this.isUpdate = true;
        this.patientImageTemplate=new PatientImageOrderModel();
        this.uploadedFiles=[];
        this.selectedOrder=this.orderListModified[0].value;
        this.uploadedFiles.length=0;
        this.showUpload=true;
        /*if($('Div').hasClass('ui-fileupload-content')){
            $('Div').removeClass('ui-fileupload-content');
        }*/
      //  $(".k-widget.k-upload").find("ul").remove();
     //   $("ui-widget-content").removeClass("ui-fileupload-row");
      //  document.getElementsByClassName('appBanner').style.visibility='hidden';
     //   this.demo
       /* let element = document.getElementsByClassName("ui-fileupload-content ui-widget-content ui-corner-bottom").style.visibility='hidden';;
        element.style.display = element.style.display === 'none' ? 'block' : 'none';*/
       // document.getElementById("")ui-fileupload-content
    }


    uploadImgOnChange(event: any,form:any) {
            // clear before loading
            this.uploadedFiles=[];
        for (var i = 0; i < event.files.length; i++) {
            this.uploadedFiles.push(event.files[i]);


        }

        this.notificationService.success("File Uploaded");
       // event.target.clear();
        form.clear();
    }

    saveOrder() {
        if (localStorage.getItem(btoa('access_token'))) {


            if (this.selectedPatientId <= 0) {
                this.notificationService.warn('Please provide proper patient.');
                return;
            }
            this.patientImageTemplate.patientId = this.selectedPatientId;

            this.patientImageTemplate.patientImageId=this.selectedOrder.toString();

            if (this.patientImageTemplate.patientImageId == null || this.patientImageTemplate.patientImageId=="") {
                this.notificationService.warn('Please provide Order.');
                return;
            }

            if (this.patientImageTemplate.doctorComment == "" || this.patientImageTemplate.doctorComment == null) {
                this.notificationService.warn('Please provide Doctor Comment');
                return;
            }


            /*if (this.patientImageTemplate.description == "" || this.patientImageTemplate.description == null) {
                this.notificationService.warn('Please provide Description');
                return;
            }*/

            if(this.uploadedFiles.length <= 0){
                this.notificationService.warn('Please Upload  File ');
                return;
            }
                console.log(this.patientImageTemplate);
                this.closeBtn.nativeElement.click();
                this.requestsService.postRequestMultipartFormAndDataWithMultipleFile(
                    AppConstants.PATIENT_IMAGE_SAVE_ORDER,
                    this.patientImageTemplate,this.uploadedFiles
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'DOC_SUC_37') {
                            this.notificationService.success(response['responseMessage'], 'Patient Image Order');

                            this.closeBtn.nativeElement.click();
                            this.getPageWiseOrderFromServer(0);
                        } else {
                            this.notificationService.error(response['responseMessage'], '');
                        }
                        this.isRequestUnderProcess = false;
                    },
                    (error: any) => {
                        this.notificationService.success(Response['responseMessage'], '');
                        this.HISUtilService.tokenExpired(error.error.error);
                        this.isRequestUnderProcess = false;
                    }
                );


        } else {
            this.router.navigate(['/login']);
        }
    }

    private getPageWiseOrderFromServer(page: number) {

        this.requestsService.getRequest(AppConstants.PATIENT_IMAGE_FETCH_ALL_PAGINATED_URI + page + '?patientId=' + this.selectedPatientId)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DOC_SUC_39') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.orderData = response['responseData']['data'];

                        console.log(this.orderData);
                    } else {
                        this.notificationService.error(response['responseMessage'], 'No Record Found');
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    getPageWiseDocuments(page: number) {
        this.getPageWiseOrderFromServer(page);
    }

    editOrder(Id: number) {

        if (Id > 0) {
            if (localStorage.getItem(btoa('access_token'))) {
                this.requestsService.getRequest(AppConstants.FETCH_PATIENT_ORDER_ID + 'orderId=' + Id)
                    .subscribe(
                        response => {
                            if (response['responseCode'] === 'DOC_SUC_42') {
                                this.patientImageTemplate = response['responseData'];
                               // this.showEdit=false;

                                this.selectedOrder=this.patientImageTemplate.orderObj.code;
                                this.isUpdate = true;
                            } else {
                                this.notificationService.error(response['responseMessage'], 'Image of Patient');
                                this.isUpdate = true;
                            }
                        },
                        (error: any) => {
                            this.HISUtilService.tokenExpired(error.error.error);
                            this.isUpdate = true;
                        });
            } else {
                this.router.navigate(['/login']);
            }
        } else {
            this.notificationService.error('Please select proper record', 'Order Image of Patient');
        }
    }

    updateOrderByPatient() {
        if (localStorage.getItem(btoa('access_token'))) {

            if (this.selectedPatientId <= 0) {
                this.notificationService.warn('Please provide proper patient.');
                return;
            }
            this.patientImageTemplate.patientId = this.selectedPatientId;

            this.patientImageTemplate.patientImageId=this.selectedOrder.toString();
            if (this.patientImageTemplate.patientImageId == null || this.patientImageTemplate.patientImageId=="") {
                this.notificationService.warn('Please provide Order.');
                return;
            }

            if (this.patientImageTemplate.doctorComment == "" || this.patientImageTemplate.doctorComment == null) {
                this.notificationService.warn('Please provide Doctor Comment');
                return;
            }

            if (!this.isRequestUnderProcess) {
                this.isRequestUnderProcess = true;
                this.requestsService.postRequestMultipartFormAndDataWithOneFile(
                    AppConstants.UPDATE_PATIENT_IMAGE_UPDATE,
                    this.patientImageTemplate, this.uploadedImage
                ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'DOC_SUC_44') {
                            this.uploadedImage = null;
                            this.isUpdate = false;
                            this.notificationService.success(response['responseMessage'],'Patient Image Order');
                            this.closeBtn.nativeElement.click();
                            this.getPageWiseOrderFromServer(0);
                        } else {
                            this.notificationService.error(response['responseMessage'], '');
                        }
                        this.isRequestUnderProcess = false;
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                        this.isRequestUnderProcess = false;
                    }
                );

            } else {
                this.notificationService.warn('Your first request is under process,Please wait...');
            }
        } else {
            this.router.navigate(['/login']);
        }
    }


    deleteOrder(orderId: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are Your Source You Want To Delete')) return;

            this.requestsService.deleteRequest(
                AppConstants.DELETE_PATIENT_IMAGE_DELETE + orderId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.notificationService.success(response['responseMessage'], 'Patient Image Order');
                            this.getPageWiseOrderFromServer(0);
                        } else {

                            this.notificationService.error(response['responseMessage'], 'Patient Image Order');
                            this.getPageWiseOrderFromServer(0);
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }


    goToUserDashBoard() {
        this.router.navigate(['/dashboard/' + atob(localStorage.getItem(btoa('user_type'))) + '/']);
    }

    getPatientByIdFromServer(patientId: number) {
        this.requestsService.getRequest(
            AppConstants.PATIENT_FETCH_URL + patientId
        ).subscribe(
            response => {
                if (response['responseCode'] === 'USER_SUC_01') {
                    this.patient = response['responseData'];
                    let apptId = response['responseData']['pastAppointments'];
                } else {
                    this.notificationService.error(response['responseMessage'], 'Patient');
                    // this.router.navigate(['404-not-found'])
                }
            },
            (error: any) => {
                this.HISUtilService.tokenExpired(error.error.error);
            });
    }


    downloadFile(data: Response) {
        console.log(data);
        // may be you need to use data._body to get data of body
        var blob = new Blob([data], {type: 'image/jpeg'});
        var url = window.URL.createObjectURL(blob);
        window.open(url);
    }


    getPatientImageSetupList() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(AppConstants.FETCH_PATIENT_IMAGE
            ).subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SUCCESS') {
                        this.data = response['responseData'];
                        for (let patientImg of this.data) {
                            let pair: any = {label: patientImg.name, value: patientImg.id};
                            this.orderListModified.push(pair);

                        }
                    } else {
                        this.notificationService.error(response['responseMessage'], ' Setup ');
                    }
                },
                (error: any) => {
                    this.notificationService.error(Response['responseMessage'], ' Setup ');
                }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }


    getImageTest(Id:any){

        if(this.showImage=true){
            this.showImage=false;
        }
        this.labTestFiltered = this.orderData.filter((x:any) =>x.id == Id);

         this.filteredLabTestUrl = this.labTestFiltered[0].url;
         this.selectedId=this.labTestFiltered[0].id;
        /*for (let patientImg of this.filteredLabTestUrl) {
            var filename = patientImg.substring(patientImg.lastIndexOf('/')+1);

            var ext=filename.substr(filename.length - 3);
            debugger;
            if(ext=="gif" || ext=="png" || ext=="jpeg" || ext=="tiff" || ext=="jpg" || ext=="GIF" || ext=="PNG" || ext=="JPEG" || ext=="TIFF" || ext=="JPG" ){


            }else{

                // this.docDiv=patientImg.url;
            }

        }*/


    }


    openDiv(val :string){
        if(this.showImage==true){
            this.showImage=false;
        }
        var filename = val.substring(val.lastIndexOf('/')+1);

        var ext=filename.substr(filename.length - 3);

        var link = document.getElementById("abc");
        this.images=[];

        if(ext=="gif" || ext=="png" || ext=="jpeg" || ext=="tiff" || ext=="jpg" || ext=="GIF" || ext=="PNG" || ext=="JPEG" || ext=="TIFF" || ext=="JPG" ){
            let labTestFilteredimgUrl = this.orderData.filter((x:any) =>x.id == this.selectedId);


            for(let i = 0; i < labTestFilteredimgUrl.length; i++) {
                let test = labTestFilteredimgUrl[i];
                    for(let j=0;j < test.url.length; j++) {

                        var urlpath=test.url[j];
                        var extPath=filename.substr(filename.length - 3);
                        if(extPath=="gif" || extPath=="png" || extPath=="jpeg" || extPath=="tiff" || extPath=="jpg" || extPath=="GIF" || extPath=="PNG" || extPath=="JPEG" || extPath=="TIFF" || ext=="JPG" ){

                        this.images.push({source: test.url[j]});
                    }
            }
            console.log(this.images);
            link.setAttribute("href", "#responsiveGalleria2");
            this.showImage=true;

        }
        }else if(ext=="pdf" || ext=="txt" || ext=="PDF" || ext=="TXT" ){
            this.showImage=false;
            link.setAttribute("href", "#Doc");
            var e = document.getElementById("MyFrame");
          //  var url="https://docs.google.com/viewer?url="+val;
         //   var site = url+'\'&embedded=true" style="width:600px; height:500px;" frameborder="0';
        //    var url="https://docs.google.com/viewer?url="+val;
         //   var site = url+'+\'" style="width:600px; height:500px;" frameborder="0';
            this.url=val;
            var src = document.getElementById('MyFrame');
            src.setAttribute("src",this.url);
            this.images=[];

        }else{
            this.downloadURL(val);
        }
    }

     downloadURL(urlString:string) {
        var hiddenIFrameID = 'hiddenDownloader',
            iframe = document.getElementById("MyFrame");
        if (iframe === null) {
            iframe = document.createElement('iframe');
            iframe.id = hiddenIFrameID;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
         iframe.setAttribute("src",urlString);
      //  iframe.src = urlString;
         // updted
    };
}