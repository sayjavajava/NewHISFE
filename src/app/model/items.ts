export class items{
    label:string;
    routerLink:string='/dashboard/setting/branch';
    name:string;
    items:any=[];
    routerLinkActiveOptions:string;
    constructor(label?: string, routeUrl?: string,items ?:items[]) {
        this.label = label;
        this.routerLink = routeUrl;
        this.items =items;
    }
}