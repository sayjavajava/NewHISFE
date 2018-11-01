export class Department {
    id: number;
    name: string = '';
    description: string;
    active: boolean = true;
    deleted: boolean;
    checkedDepartment: boolean;
    branch :string;
    branchId :number;
    branchDepartmentId:number;
    hasChild: boolean = false;

    constructor() {
    }
}
