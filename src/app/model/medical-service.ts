import {Branch} from './branch';
import {Department} from './department';
import {Tax} from './Tax';
export class MedicalService {

    id: number = 0;
    name: string = '';
    code: string = '';
    fee: number = 0;
    cost: number = 0;
    status: boolean = true;
    branches: Branch[] = [];
    checkedBranches: Branch[] = [];
    departments: Department[] = [];
    checkedDepartments: Department[] = [];
    checkedDepartmentCount: number;
    checkedBranchCount: number;
    tax: Tax = new Tax();

    duration: number = 0;
    description: string;

    hasChild: boolean = false;

    constructor() {
    }
}
