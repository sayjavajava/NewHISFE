import {SelectItem} from 'primeng/api';
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
    strength: string = '';
    strengths: string[] = [];
    uOM: string = 'MG';
    drugInfo:String='';

    routes: SelectItem[] = [
        // {label: 'Oral', value: 'Oral'},
        // {label: 'Syrup', value: 'Syrup'},
        // {label: 'Tab', value: 'Tab'},
        // {label: 'Injection', value: 'Injection'},
        {label: 'Orally (Tab)', value: 'Orally (Tab)'},
        {label: 'Orally (Cap)', value: 'Orally (Cap)'},
        {label: 'Orally (Powdered)', value: 'Orally (Powdered)'},
        {label: 'Orally (Drops)', value: 'Orally (Drops)'},
        {label: 'Orally (Syrup)', value: 'Orally (Syrup)'},
        {label: 'Sublingually', value: 'Sublingually'},
        {label: 'Buccally', value: 'Buccally)'},
        {label: 'Injection (I.V.)', value: 'Injection (I.V.)'},
        {label: 'Injection (I.M.)', value: 'Injection (I.M.)'},
        {label: 'Injection (Intrathecally)', value: 'Injection (Intrathecally)'},
        {label: 'Injection (Subcutaneously)', value: 'Injection (Subcutaneously)'},
        {label: 'Rectally', value: 'Rectally)'},
        {label: 'Vaginally', value: 'Vaginally)'},
        {label: 'Ocular', value: 'Ocular)'},
        {label: 'Otic', value: 'Otic)'},
        {label: 'Nasally', value: 'Nasally)'},
        {label: 'Inhalation', value: 'Inhalation)'},
        {label: 'Nebulization', value: 'Nebulization)'},
        {label: 'Cutaneously', value: 'Cutaneously)'},
        {label: 'Transdermally', value: 'Transdermally)'},
    ];


   // origin: string = '';

    UOMs: SelectItem[] = [
        {label: 'ML', value: 'ML'},
        {label: 'MG', value: 'MG'},
        {label: 'MCG', value: 'MCG'},
        {label: 'GM', value: 'GM'},
        {label: 'MG/ML', value: 'MG/ML'},
        {label: 'MCG/ML', value: 'MCG/ML'},
        {label: 'LITRE', value: 'LITRE'},
        // {label: 'DOSING CUP', value: 'DOSING CUP'},
        // {label: 'DOSING SPOONS', value: 'DOSING SPOONS'},
        // {label: 'DOSING SYRINGE', value: 'DOSING SYRINGE'},
        // {label: 'MEASURING SPOONS', value: 'MEASURING SPOONS'},
    ];

    origin: string = '';

    active: boolean = true;
    hasChild: boolean = false;
    drugMaker:any = 'Select Manufacturer';
    addInfo:any;
    drugMakerView:string;
    constructor() {

    }
}