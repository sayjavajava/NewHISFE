import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RequestsService} from '../../services/requests.service';
import {Title} from '@angular/platform-browser';
import {items} from "../../model/items";

@Component({
    selector: 'menu-component',
    templateUrl: '../../templates/dashboard/menu.template.html',
    styleUrls: [],
})
export class MenuComponent implements OnInit{
    userPermissions: any[];
    showMenuBar: boolean = false;
    items:items[] =[];
    collapseMenu : boolean =true;
    collapsed : boolean =false;
    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title) {
    };

    ngOnInit() {
        if (!window.localStorage.getItem(btoa('access_token'))) {
            this.router.navigate(['/login']);
        }else {
            this.userPermissions = JSON.parse( atob(window.localStorage.getItem( btoa('permissions')) ) );

            let itemsList :items[] = [];
            let gList :items[] = [];
            let mList :items[] = [];
            let gInd : items;
            let sInd;
            let mInd;

            this.userPermissions.forEach(x=>{
                if(x.indicatior == 'G'){
                    let ob2  = new items(x.name,x.routeUrl,x.permissionIcon);
                    itemsList.push(ob2)
                    gInd = new items('General','','fa fa-cog',itemsList);
                   }
                if(x.indicatior == 'C'){
                    let ob3 = new items(x.name,x.routeUrl,x.permissionIcon);
                    gList.push(ob3)
                    sInd = new items('Clinical','','fa fa-cog',gList);
                }
                if(x.indicatior == 'A'){
                    let ob3  = new items(x.name,x.routeUrl,x.permissionIcon);
                    mList.push(ob3)
                    mInd = new items('Administration','','fa fa-code-fork',mList);
                }

            })

            this.items.push(gInd);
            this.items.push(sInd);
            this.items.push(mInd);


        }
        this.titleService.setTitle('HIS | Dashboard');
        let userType: string = atob(localStorage.getItem(btoa('user_type')))
        if(userType === 'admin' || userType==='manager')
            this.showMenuBar = true;
    }
    changeMenu(){
       console.log('Change menu');
        this.collapseMenu = !this.collapseMenu;
    }
}



