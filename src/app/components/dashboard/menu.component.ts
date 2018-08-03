import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RequestsService} from '../../services/requests.service';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'menu-component',
    templateUrl: '../../templates/dashboard/menu.template.html',
    styleUrls: [],
})
export class MenuComponent implements OnInit{
    userPermissions: any[];

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title) {
    };

    ngOnInit() {
        if (!window.localStorage.getItem(btoa('access_token'))) {
            this.router.navigate(['/login']);
        }else {
            this.userPermissions = JSON.parse( atob(window.localStorage.getItem( btoa('permissions')) ) );
        }
        this.titleService.setTitle('HIS | Dashboard');
    }
}
