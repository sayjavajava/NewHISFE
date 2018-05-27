import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-field-error-display',
  templateUrl: '../../../templates/dashboard/setting/error-display.template.html',
    styles:[`
        .error-msg {
            color: #a94442;
        }
        .fix-error-icon {
            top: 27px;
        }
  `],
})
export class ErrordisplayComponent implements OnInit {

    @Input() errorMsg: string;
    @Input() displayError: boolean;
    constructor() { }
    ngOnInit() {
    }
}
