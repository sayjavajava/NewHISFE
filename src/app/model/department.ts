export class Department {
    id: number;
    name: string = '';
    description: string;
    active: boolean = true;
    deleted: boolean;
    checkedDepartment: boolean;
    /**
     * we decided if child record found then we should not update status
     * */
    hasChild: boolean = false;

    constructor() {
    }
}
