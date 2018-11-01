import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import {ViewChild, Component, ElementRef, Renderer2} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";

@Component({
    selector: 'tool-root',
    template:  `<div>{{title}}</div>
    <div #el></div>
    <div bsModal #childModal="bs-modal" class="modal fade" tabindex="-1"
         role="dialog" aria-labelledby="dialog-child-name">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 id="dialog-child-name" class="modal-title pull-left">Child modal</h4>
                    <button type="button" class="close pull-right" aria-label="Close" (click)="hideChildModal()">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    I am a child modal, opened from parent component!
                </div>
            </div>
        </div>
    </div>
    <br>
    <ng-content></ng-content>`,
})

export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {

   // @ViewChild("showPopApt") lab :any ;
    title = 'tool tip works ';
    title2 = 'tool tip does not  ';
    appointmentId :any;
    ready:boolean;
    @ViewChild('el') nameInputRef: ElementRef;
    @ViewChild('childModal') childModal: ModalDirective;

    constructor(private renderer: Renderer2) {
        super();
    }

    ngAfterViewInit() {
        console.log('child init ');
        this.renderer.setProperty(this.nameInputRef.nativeElement, 'innerHTML', this.appointmentId );

    }
    monthTooltip(event: CalendarEvent): any {
      console.log('event test:' + event.id + event.patient);
     //   //`<div style="margin-left: 0px !important;">left menu</div>` ;
     //   return  (document.getElementById("det").innerHTML=event.status);
     //   this.renderer.setProperty(this.nameInputRef.nativeElement, 'innerHTML', this.appointmentId );
        this.appointmentId = 'hard code';
        return event.appointmentId;
    }

    weekTooltip(event: CalendarEvent): string {
        return;
    }

    dayTooltip(event: CalendarEvent): string {
        return;
    }
}