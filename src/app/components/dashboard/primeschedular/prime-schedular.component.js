"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var requests_service_1 = require("../../../services/requests.service");
var PrimeSchedularComponent = (function () {
    function PrimeSchedularComponent(eventServices) {
        this.eventServices = eventServices;
        this.events = [
            { "id": "1", "resourceId": "b", "start": "2018-04-07T02:00:00", "end": "2018-04-07T07:00:00", "title": "event 1" },
            { "id": "2", "resourceId": "c", "start": "2018-04-07T05:00:00", "end": "2018-04-07T22:00:00", "title": "event 2" },
            { "id": "3", "resourceId": "d", "start": "2018-04-06", "end": "2018-04-08", "title": "event 3" },
            { "id": "4", "resourceId": "e", "start": "2018-04-07T03:00:00", "end": "2018-04-07T08:00:00", "title": "event 4" },
            { "id": "5", "resourceId": "f", "start": "2018-04-07T00:30:00", "end": "2018-04-07T02:30:00", "title": "event 5" }
        ];
    }
    PrimeSchedularComponent.prototype.ngOnInit = function () {
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
    };
    PrimeSchedularComponent = __decorate([
        core_1.Component({
            selector: 'add-appointment-component',
            templateUrl: '../../../templates/dashboard/appointment/schedule.template.html',
            styles: ["\n        .ui-grid-row div {\n          padding: 4px 10px\n        }\n        \n        .ui-grid-row div label {\n          font-weight: bold;\n        }\n  "]
            /*providers: [
                {
                    provide: CalendarEventTitleFormatter,
                    useClass: CustomEventTitleFormatter
                }]*/
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService])
    ], PrimeSchedularComponent);
    return PrimeSchedularComponent;
}());
exports.PrimeSchedularComponent = PrimeSchedularComponent;
var MyEvent = (function () {
    function MyEvent() {
        this.allDay = true;
    }
    return MyEvent;
}());
exports.MyEvent = MyEvent;
//# sourceMappingURL=prime-schedular.component.js.map