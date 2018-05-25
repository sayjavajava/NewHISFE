import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'confirmationdialog-component',
  templateUrl: '../../templates/dashboard/confirmationdialog.template.html',

})
export class ConfirmationdialogComponent implements OnInit {
    public confirmMessage:string;
    constructor(public dialogRef: MatDialogRef<ConfirmationdialogComponent>) { }

    public title: string;
    public message: string;
    ngOnInit() {

    }

}