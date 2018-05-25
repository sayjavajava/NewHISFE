import {Injectable} from '@angular/core';
import 'rxjs/Rx';
import {Router} from '@angular/router';

@Injectable()
export class UserSharedService {
    constructor(private router: Router) {
    };

    firstName: string;
    lastName: string;
    profileImg: string;
    email: string;
    userName: string;
    role: string;

}