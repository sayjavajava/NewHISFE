import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'not-found-404-setting-component',
    templateUrl: '../../../templates/dashboard/setting/not-found-404-setting.template.html',
})
export class NotFound404SettingComponent implements OnInit {

    constructor(private titleService: Title) {
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Resource not found');
    }

}
