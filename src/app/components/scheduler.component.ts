///<reference path="../../../node_modules/@angular/core/src/metadata/lifecycle_hooks.d.ts"/>
import {Component, OnDestroy} from '@angular/core';


import {
    ChangeDetectionStrategy,
    ViewChild,
    TemplateRef
} from '@angular/core';
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent
} from 'angular-calendar';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ReplaySubject} from 'rxjs/ReplaySubject';

const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};

@Component({
    selector: 'scheduler',
    templateUrl: '../templates/scheduler.template.html',

})
export class SchedulerComponent {


    title = 'app';
    @ViewChild('modalContent') modalContent: TemplateRef<any>;

    view: string = 'month';

     viewDate: Date = new Date();
     data:any=[];


    modalData: {
        action: string;
        event: CalendarEvent;
    };

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
            }
        }
    ];

    refresh: Subject<any> = new ReplaySubject<any>(1);


    events: CalendarEvent[] = [
    ];

    activeDayIsOpen: boolean = true;

    constructor(private modal: NgbModal,private dialog:MatDialog) {}

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    eventTimesChanged({   event,
                          newStart,
                          newEnd
                      }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        this.modal.open(this.modalContent, { size: 'sm'});
    }

    deleteEvent(action: string, event: CalendarEvent): void {

        console.log('del:' + event.title);
        this.events.splice(this.events.indexOf(event),1);
        this.refresh.next();
    }
    addEvent(): void {
        this.events.push({
            title: 'Moulvi Jamal  Title',
            start: startOfDay(new Date()),
            end: endOfDay(new Date()),
            color: colors.red,
            draggable: true,
            notes: 'any',
            patient: 'malairia',
            //notes:'notes',
            //disease:'',
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        });
        console.log('i am log23');
        this.refresh.next(this.events);

    }
    saveData(){
       // this.refresh.subscribe(res =>{'Observable :' +console.log(res)});
       // console.log(this.events);


    }


}
