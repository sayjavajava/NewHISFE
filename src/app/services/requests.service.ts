import {Injectable} from '@angular/core';
import 'rxjs/Rx';
import {Router} from '@angular/router';
import {AppConfig} from '../configuration/app.config';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {RoleAndPermission} from '../model/roleandpermission';
import {Receptionist} from '../model/Receptionist';
import {Observable} from "rxjs/Observable";
import {RequestOptions} from "@angular/http";
import {HttpParamsOptions} from '@angular/common/http/src/params';
import {delay} from "q";

@Injectable()
export class RequestsService {
    constructor(private http: HttpClient,
                private router: Router,
                private appConfig: AppConfig) {
    };

    getToken() {
        return localStorage.getItem(btoa('access_token'));
    }

    getBEAPIServer() {
        var protocol = AppConfig.BE_HTTP_PROTOCOL; // http
        var server = AppConfig.BE_API_ENDPOINT; // 192.168.1.188
        var port = AppConfig.BE_API_PORT;
        var contextPath = '/' + AppConfig.BE_API_CONTEXT_PATH;
        if (protocol === '' || !protocol || server === '' || !server)
            return ''
        else {
            if (port === '' || !port) {
                return protocol + AppConfig.BE_HTTP_SEPARATOR + server + ':' + port + contextPath
            }
            else {
                return protocol + AppConfig.BE_HTTP_SEPARATOR + server + ':' + port + contextPath
            }
        }
    }

    postRequestOauth2Token(url: any, _params: any) {
        const reqHeader = new HttpHeaders({'Authorization': 'Basic ' + btoa(AppConfig.BE_ACCESS_CLIENT + ':' + AppConfig.BE_ACCESS_SECRET)});
        let URI = this.getBEAPIServer() + url + '?username=' + _params['userName'] + '&password=' + _params['password'] + '&grant_type=' + _params['grantType'];

        return this.http.post(URI, _params, {headers: reqHeader});
    }

    getRequest(url: any) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        return this.http.get(this.getBEAPIServer() + url, {headers: reqHeader});
    }

    postRequest(url: any, _params: any) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        return this.http.post(this.getBEAPIServer() + url, _params, {headers: reqHeader});
    }

    deleteRequest(url: any) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        return this.http.delete(this.getBEAPIServer() + url, {headers: reqHeader});

    }

    findById(url: any): Observable<any> {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        return this.http.get(this.getBEAPIServer() + url, {headers: reqHeader})
            .map((data: any) => {
                return data.responseData as Object;
            });
        //.catch((error:any) => Observable.throw(error.json().error || 'Error'));
    }

    findByIdAndType(url: any, type: any): Observable<any> {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        let params = new HttpParams().set("userType", type);
        return this.http.get(this.getBEAPIServer() + url, {headers: reqHeader, params: params})
            .map((data: any) => {
                return data.responseData as Object;
            });
        ;
        //.catch((error:any) => Observable.throw(error.json().error || 'Error'));
    }

    putRequest(url: any, _params: any) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        return this.http.put(this.getBEAPIServer() + url, _params, {headers: reqHeader});
    }

    getRequestWithParam(url: any, param: any) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        let params = new HttpParams().set('name', param);
        return this.http.get(this.getBEAPIServer() + url, {headers: reqHeader, params: params});
    }

    searchWithParam(url: any, param1: any, param2: any) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        let params = new HttpParams().set('doctorId', param1).set('branchId', param2);
        return this.http.get(this.getBEAPIServer() + url, {headers: reqHeader, params: params});
    }

    postRequestMultipartFormData(url: any, data: any) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        let formData: FormData = new FormData();
        formData.append('file', data, data.name);
        return this.http.post(this.getBEAPIServer() + url, formData, {headers: reqHeader});
    }

    putRequestWithParam(url: any, _param: any) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        let params = new HttpParams().set('status', _param);
        return this.http.put(this.getBEAPIServer() + url, params, {headers: reqHeader});
    }

    postRequestMultipartFormAndData(url: any, data: any, profileImg: File, photoFront: File, photoBack: File) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'multipart/form-data');
        let formData: FormData = new FormData();
        formData.append('patientRequest', new Blob([JSON.stringify(data)],
            {
                type: "application/json"
            }));
        if (profileImg != null) {
            formData.append('profileImg', profileImg, profileImg.name);
        }
        if (photoFront != null) {
            formData.append('photoFront', photoFront, photoFront.name);
        }
        if (photoBack != null) {
            formData.append('photoBack', photoBack, photoBack.name);
        }
        return this.http.post(this.getBEAPIServer() + url, formData, {headers: reqHeader});
    }

    postRequestMultipartFormAndDataWithOneFile(url: any, data: any, img: File) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'multipart/form-data');
        let formData: FormData = new FormData();
        formData.append('myObject', new Blob([JSON.stringify(data)],
            {
                type: "application/json"
            }));
        if (img != null) {
            formData.append('img', img, img.name);
        }
        return this.http.post(this.getBEAPIServer() + url, formData, {headers: reqHeader});
    }

    postRequestMultipartForm(url: any, dataFile: File) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'multipart/form-data');
        let formData: FormData = new FormData();

        if (dataFile != null) {
            formData.append('dataFile', dataFile, dataFile.name);
        }
        return this.http.post(this.getBEAPIServer() + url, formData, {headers: reqHeader});
    }

    getEvents() {
        return this.http.get('showcase/resources/data/scheduleevents.json')
            .toPromise()
        //    .then(res => <any[]> res.data)
            .then(data => { return data; });
    }

    postRequestMultipartFormAndDataWithMultipleFile(url: any, data: any, img: File[]) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'multipart/form-data');
        let formData: FormData = new FormData();
        formData.append('myObject', new Blob([JSON.stringify(data)],
            {
                type: "application/json"
            }));
        if (img != null) {
            for (var i = 0; i < img.length; i++) {
                formData.append('img',img[i]);
            }
         //   formData.append('img', img, img.name);
        }
        return this.http.post(this.getBEAPIServer() + url, formData, {headers: reqHeader});
    }

}