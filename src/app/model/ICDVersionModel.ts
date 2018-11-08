export class ICDVersionModel {
    id: number;
    name: string = '';
    title: string;
    status: boolean = true;
    deleted: boolean;
    updatedOn: number;
    createdOn: number;
    hasChild: boolean = false;
    selectedVersion: boolean = false;
    label:string;
    value:boolean;
}