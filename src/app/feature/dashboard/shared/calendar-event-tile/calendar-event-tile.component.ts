import { Component, Input } from '@angular/core';
import { CalendarEvent as CalEvent } from 'angular-calendar';
import { CalendarEventType } from '../../constant/calendar-event-type';
import { CalendarEvent } from '../../models/calendar-event';
import { Router } from '@angular/router';
import { LeaveViewMode } from '../../constant/leave-view-mode';
import { AuthService } from '../../auth/auth.service';

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

  constructor(private router: Router, private authService: AuthService) {}

  eventClicked(currEvent: CalendarEvent): void {
    switch (currEvent.calendarEventType) {
      case CalendarEventType.LEAVE:
        if (
          this.authService.getCurrentSystemUserId() ===
            currEvent.systemUserId ||
          this.authService.getCurrentSystemUserId() === currEvent.supervisorId
        )
          this.router.navigate([
            '/dashboard/leaves/details/' +
              LeaveViewMode.ADNIN_VIEW +
              '/' +
              currEvent.calendarEventId,
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
