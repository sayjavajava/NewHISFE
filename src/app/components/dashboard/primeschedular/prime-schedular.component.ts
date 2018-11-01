import { Component} from '@angular/core';


import {RequestsService} from '../../../services/requests.service';



declare var $: any;

@Component({
    selector: 'add-appointment-component',
    templateUrl: '../../../templates/dashboard/appointment/schedule.template.html',
    styles: [`
        .ui-grid-row div {
          padding: 4px 10px
        }
        
        .ui-grid-row div label {
          font-weight: bold;
        }
  `]
    /*providers: [
        {
            provide: CalendarEventTitleFormatter,
            useClass: CustomEventTitleFormatter
        }]*/
})
export class PrimeSchedularComponent {

    header: any;
    events :any = [
        { "id": "1", "resourceId": "b", "start": "2018-04-07T02:00:00", "end": "2018-04-07T07:00:00", "title": "event 1" },
{ "id": "2", "resourceId": "c", "start": "2018-04-07T05:00:00", "end": "2018-04-07T22:00:00", "title": "event 2" },
{ "id": "3", "resourceId": "d", "start": "2018-04-06", "end": "2018-04-08", "title": "event 3" },
{ "id": "4", "resourceId": "e", "start": "2018-04-07T03:00:00", "end": "2018-04-07T08:00:00", "title": "event 4" },
{ "id": "5", "resourceId": "f", "start": "2018-04-07T00:30:00", "end": "2018-04-07T02:30:00", "title": "event 5" }
]
    constructor(private eventServices :RequestsService){

    }

    ngOnInit() {
      //  this.eventServices.getEvents().then(events => {this.events = events;});

        this.header = {
            left: 'prev,next',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        };

     //   this.eventService.getEvents().then(events => {this.events = events;});
        this.events = [
            {
                "title": "All Day Event",
                "start": "2016-01-01"
            },
            {
                "title": "Long Event",
                "start": "2016-01-07",
                "end": "2016-01-10"
            },
            {
                "title": "Repeating Event",
                "start": "2016-01-09T16:00:00"
            },
            {
                "title": "Repeating Event",
                "start": "2016-01-16T16:00:00"
            },
            {
                "title": "Conference",
                "start": "2016-01-11",
                "end": "2016-01-13"
            }
        ];
    }

}

export class MyEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    allDay: boolean = true;
}