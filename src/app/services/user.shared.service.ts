import {Injectable} from "@angular/core";
import "rxjs/Rx";
import { BehaviorSubject } from 'rxjs';
import {Subject} from "rxjs/Subject";

@Injectable()
export class UserSharedService {
    isSidebarVisible: boolean;
    sidebarVisibilityChange: Subject<boolean> = new Subject<boolean>();
    isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  //  profileImg= new BehaviorSubject('');
    firstName: string;
    lastName: string;
    profileImg: string;
    email: string;
    userName: string;
    roles: string;
    userType: string;
    constructor()  {
        this.sidebarVisibilityChange.subscribe((value) => {
            this.isSidebarVisible = value
        });
    }

    toggleSidebarVisibility() {
        this.sidebarVisibilityChange.next(!this.isSidebarVisible);
    }

    /*setProfileImg(profileImg:string) {
        this.profileImg.next(profileImg);
    }*/
}