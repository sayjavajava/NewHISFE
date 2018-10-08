export class Department {
    id: number;
    name: string = '';
    description: string;
    active: boolean = true;
    deleted: boolean;
    checkedDepartment: boolean;

    hasChild: boolean = false;

    constructor() {
    }
}
