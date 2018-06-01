import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';

@Component({
    selector: 'scheduler-dialog',
    templateUrl: '../templates/scheduler-dialog.template.html',

})
export class SchedularDialogComponent {

    constructor(private router : Router, public dialog : MatDialog) {

     }
}
