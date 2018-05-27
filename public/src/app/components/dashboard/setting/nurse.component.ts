import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';

@Component({
    selector: 'nurse-component',
    templateUrl: '../../../templates/dashboard/setting/nurse.template.html',
})
export class NurseComponent implements OnInit {

    constructor(private notificationservice?: NotificationService) {
    }

    ngOnInit() {
    }


}
