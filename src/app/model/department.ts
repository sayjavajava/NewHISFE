export class Department {
    id: number;
    name: string = '';
    description: string;
    active: boolean = true;
    deleted: boolean;
    checkedDepartment: boolean;
    branch :string;
    branchId :number;
    selectedBranches:any=[];
    branchDepartmentId:number;
    hasChild: boolean = false;

    constructor() {
        this.selectedBranches =[];
    }
}
