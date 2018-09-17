import {Injectable} from '@angular/core';
import {Permission} from "../model/Permission"
@Injectable()
export class PermissionsService {

    constructor() {
    }

    public loadPermissions(dbPermissions: any[]) {
        let permissions: any[] = [];
        dbPermissions.forEach((item, index) => {
            permissions[index] = item;
        });
        window.localStorage.setItem(  btoa('permissions' ), btoa(JSON.stringify(permissions)));
    }

    public unloadPermissions() {

    }

    public hasPermission(permission: string): boolean {
        let hasPermission: boolean = false;
        let permissions: Permission[];
        const userPermissions = localStorage.getItem(btoa('permissions'));
        if (userPermissions) {
            console.log('permission awa'+ userPermissions.length);
            permissions = JSON.parse(atob(userPermissions));
            permissions.forEach((item, index) => {
                //properties.hasOwnProperty('name') && properties.
                if (item.name === permission) {
                    hasPermission = true;
                    return hasPermission;
                }
            });
        }
        return hasPermission;
    }

    ngOnInit() {

    }

}