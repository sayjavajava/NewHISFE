
export  class PrefixTemplateModel{
    id: number;
    module: string = '';  //ModuleEnum
    name: string = ''; // prefix
    startValue: number = 1;
    currentValue: string = '0';
    constructor() {
    }
}