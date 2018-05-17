import {Injectable} from '@angular/core';
import {Headers, RequestOptions, Response, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {Router} from '@angular/router';
import {AppConfig} from '../configuration/app.config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Receptionist} from '../model/Receptionist';

@Injectable()
export class RequestsService {
    constructor(private http: HttpClient,
                private router: Router,
                private appConfig: AppConfig) {
    };

    getToken() {
        return window.localStorage.getItem(btoa('access_token'));
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

    /*    deleteRequest(url: any, _params: any) {
            const headers = new Headers();
            if (this.getToken()) {
                headers.append('Authorization', 'auth_token ' + this.getToken());
            }
            return this.http.delete(this.getBEAPIServer() + url, {headers: headers})
                .map((response: Response) => response.json());
        };*/

    getRequest(url: any) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        return this.http.get(this.getBEAPIServer() + url, {headers: reqHeader});
    }

    deleteRequest(url:any){
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        return this.http.delete(this.getBEAPIServer() + url,{headers: reqHeader});

    }
    postRequest(url: any, _params: any) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        return this.http.post(this.getBEAPIServer() + url,  _params, {headers: reqHeader});
    }


    findById(url:any): Observable<any> {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        return this.http.get<Receptionist>(this.getBEAPIServer() + url, {headers: reqHeader})
            .map((data: any) => {
                return data.responseData as Object;
            });
            ;
            //.catch((error:any) => Observable.throw(error.json().error || 'Error'));
    }

    putRequest(url: any,params: any) {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + atob(this.getToken())});
        reqHeader.append('Content-Type', 'application/json');
        console.log('iam put');
        return this.http.put(this.getBEAPIServer()+ url,params, {headers: reqHeader});
    }

}
