export class ICDCodeModel {

    id: number;
    code: string = '';
    title: string;
    status: boolean = true;
    updatedOn: number;
    createdOn: number;
    description: string;
    checkedCode: boolean;
    hasChild: boolean = false;

    constructor() {

    }

}