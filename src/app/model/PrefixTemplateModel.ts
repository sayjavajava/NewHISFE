
export  class PrefixTemplateModel{
    id: number;
    module: string = '';  //ModuleEnum
    name: string = ''; // prefix
    startValue: number = 1;
    currentValue: number = 1;
    isFirstEdit: boolean = false;

    constructor() {
    }
}