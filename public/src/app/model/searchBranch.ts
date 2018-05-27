export class SearchBranch {

    branch:string;
    department:string;
    description:string;


    constructor(branch?: string, department?: string, description?: string) {
        this.branch = branch;
        this.department = department;
        this.description = description;
    }
}