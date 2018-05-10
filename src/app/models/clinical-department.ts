export class ClinicalDepartment {
    id: number;
    name: string;
    description: string;
    branchId: number = 1;
    active: boolean;
    deleted: boolean;

    constructor() {
    }
}
