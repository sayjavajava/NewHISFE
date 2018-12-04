import {SelectItem} from 'primeng/api';
import {Country} from "./Country";
/**
 * Created by jamal on 10/24/2018.
 */

export class DrugModel {

    id: number;
    drugNaturalId: string = '';
    drugName: string = '';
    genericName: string = '';
    companyName: string = '';

    route: string = 'Syrup';
    routes: SelectItem[] = [
        {label: 'Oral', value: 'Oral'},
        {label: 'Syrup', value: 'Syrup'},
        {label: 'Tab', value: 'Tab'},
        {label: 'Injection', value: 'Injection'},
    ];

    strength: string = '';
    strengths: string[] = [];

    uOM: string = 'DOSING SYRINGE';

 //   UOMs: SelectItem[] = [];
    drugInfo:String='';
   // origin: string = '';

    UOMs: SelectItem[] = [
        {label: 'ML', value: 'ML'},
        {label: 'DOSING CUP', value: 'DOSING CUP'},
        {label: 'MEASURING SPOONS', value: 'MEASURING SPOONS'},
        {label: 'DOSING SPOONS', value: 'DOSING SPOONS'},
        {label: 'DOSING SYRINGE', value: 'DOSING SYRINGE'},
    ];

    origin: string = '';

    active: boolean = true;
    hasChild: boolean = false;
    selectedCountry:any;
    addInfo:any;
    countryView:string;
    constructor() {

    }
}