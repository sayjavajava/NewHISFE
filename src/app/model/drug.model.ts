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
    routes: SelectItem[] = [];

    strength: string = '';
    strengths: string[] = [];

    uOM: string = 'DOSING SYRINGE';
    UOMs: SelectItem[] = [];

    origin: string = '';
    active: boolean = true;
    hasChild: boolean = false;


    constructor() {
        this.routes = [
            {label: 'Oral', value: 'Oral'},
            {label: 'Syrup', value: 'Syrup'},
            {label: 'Tab', value: 'Tab'},
            {label: 'Injection', value: 'Injection'},
        ];

        this.UOMs = [
            {label: 'ML', value: 'ML'},
            {label: 'DOSING CUP', value: 'DOSING CUP'},
            {label: 'MEASURING SPOONS', value: 'MEASURING SPOONS'},
            {label: 'DOSING SPOONS', value: 'DOSING SPOONS'},
            {label: 'DOSING SYRINGE', value: 'DOSING SYRINGE'},
        ];
    }
}