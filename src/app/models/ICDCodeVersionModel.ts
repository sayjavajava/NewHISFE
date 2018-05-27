import {ICDCodeModel} from "./ICDCodeModel";
import {ICDVersionModel} from "./ICDVersionModel";

export class ICDCodeVersionModel {
    public id: Number;
    public icdCode: ICDCodeModel;
    public icdVersion: ICDVersionModel;
    selectedICDVersionId: number = 0;
    description: string;
    selectedICDCodes: ICDCodeModel[] = [];
    iCDCodes: ICDCodeModel [];


    constructor() {
    }


}