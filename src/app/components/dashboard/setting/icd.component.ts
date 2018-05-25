import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';

@Component({
    selector: 'icd-component',
    templateUrl: '../../../templates/dashboard/setting/icd.template.html',
})
export class ICDComponent implements OnInit {

    constructor(private notificationService: NotificationService) {

    }

    ngOnInit() {
        document.title = 'HIS | Manage ICD';
    }

    onAddICDPopupLoad(){
        this.notificationService.success('ICD', 'Popup loaded.')
    }

}
