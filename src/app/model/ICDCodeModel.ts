import {ICDVersionModel} from './ICDVersionModel';
export class ICDCodeModel {

    id: number;
    code: string = '';
    problem: string;//// title replaced by problem
    status: boolean = true;
    updatedOn: number;
    createdOn: number;
    description: string;
    checkedCode: boolean;
    hasChild: boolean = false;
    selectedVersions: ICDVersionModel [] = [];
    checkedVersionCount: string = '';
    versionCountUnique: boolean = true;/// unique mean it has one version,if code has one version then we show its name if code has more thane one version then show total count

    constructor() {

    }

}