export class items{
    label:string;
    routerLink?:string='/dashboard/setting/branch';
    name:string;
    items:any=[];
    icon:string;
    routerLinkActiveOptions:string;
    constructor(label?: string, routeUrl?: string,permissionIcon?:string,items ?:items[]) {
        this.label = label;
        this.routerLink = routeUrl;
        this.items =items;
        this.icon =permissionIcon;
    }
}