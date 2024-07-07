import { Component, Input } from '@angular/core';
import { CalendarEvent as CalEvent } from 'angular-calendar';
import { CalendarEventType } from '../../constant/calendar-event-type';
import { CalendarEvent } from '../../models/calendar-event';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-event-tile',
  standalone: true,
  imports: [],
  templateUrl: './calendar-event-tile.component.html',
  styleUrl: './calendar-event-tile.component.css',
})
export class CalendarEventTileComponent {
  @Input() calendarEvent!: CalEvent;
  calendarEventType: typeof CalendarEventType = CalendarEventType;

  constructor(private router: Router) {}

  eventClicked(currEvent: CalendarEvent): void {
    switch (currEvent.calendarEventType) {
      case CalendarEventType.LEAVE:
        this.router.navigate([
          '/dashboard/leaves/details/' + currEvent.calendarEventId,
        ]);
        break;
      case CalendarEventType.EVENT:
        this.router.navigate([
          '/dashboard/events/details/' + currEvent.calendarEventId,
        ]);
        break;
      default:
        break;
    }
  }
}
