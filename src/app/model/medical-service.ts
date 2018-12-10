import {Department} from './department';
import {Tax} from './Tax';
import {BranchPart} from './BranchPart';

export class MedicalService {
    id: number = 0;
    name: string = '';
    code: string = '';
    fee: number = 0;
    cost: number = 0;
    status: boolean = true;
    branches: BranchPart[] = [];
    checkedBranches: BranchPart[] = [];
    departments: Department[] = [];
    checkedDepartments: Department[] = [];
    checkedDepartmentCount: number = 0;
    checkedBranchCount: number = 0;
    tax: Tax = new Tax();
    selectedBranches: any[] = [];
    selectedDepartments: any[] = [];
    duration: number = 0;
    description: string = '';
    hasChild: boolean = false;
    value: number = 0;
    label: string = '';

    constructor() {
    }

    /*calculateTax() {
        if (this.fee == 0 || this.cost == 0 || this.tax.rate == 0) return 0;
        return (this.tax.rate * this.fee / 100);
    }*/
}
