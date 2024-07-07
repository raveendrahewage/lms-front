import { Router } from '@angular/router';
import { EventService } from './../../../services/event.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';
import {
  CalendarEvent as CalEvent,
  CalendarModule,
  CalendarView,
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { CalendarHeaderComponent } from '../calendar-header/calendar-header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CalendarEvent } from '../../../models/calendar-event';
import { CalendarEventType } from '../../../constant/calendar-event-type';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { CalendarEventTileComponent } from '../../../shared/calendar-event-tile/calendar-event-tile.component';
import { CalendarDayCellComponent } from '../../../shared/calendar-day-cell/calendar-day-cell.component';

@Component({
  selector: 'app-dashboard-calendar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    CalendarModule,
    CalendarHeaderComponent,
    MatProgressSpinnerModule,
    CalendarEventTileComponent,
    CalendarDayCellComponent,
  ],
  templateUrl: './dashboard-calendar.component.html',
  styleUrls: ['./dashboard-calendar.component.css'],
})
export class DashboardCalendarComponent implements OnInit {
  calendarEventType: typeof CalendarEventType = CalendarEventType;
  calendarView: typeof CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  activeDayIsOpen = false;
  refresh: Subject<any> = new Subject();
  excludeDays: number[] = [];
  calendarEvents: CalEvent[] = [];

  constructor(
    private eventService: EventService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getEvents();
  }

  eventClicked(currEvent: CalEvent): void {
    const clickedEvent: CalendarEvent = currEvent.meta.event;
    switch (clickedEvent.calendarEventType) {
      case CalendarEventType.LEAVE:
        this.router.navigate([
          '/dashboard/leaves/details/' + clickedEvent.calendarEventId,
        ]);
        break;
      case CalendarEventType.EVENT:
        this.router.navigate([
          '/dashboard/events/details/' + clickedEvent.calendarEventId,
        ]);
        break;
      default:
        break;
    }
  }

  getEvents(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];
    const getEnd: any = { month: endOfMonth, week: endOfWeek, day: endOfDay }[
      this.view
    ];
    const startDate = format(getStart(this.viewDate), 'yyyy-MM-dd');
    const endDate = format(getEnd(this.viewDate), 'yyyy-MM-dd');
    this.eventService.getEventsBetweenDate(startDate, endDate).subscribe({
      next: (res) => {
        this.calendarEvents = res.data.map((event: CalendarEvent) => {
          return {
            title: event.title,
            start: startOfDay(new Date(event.startDate)),
            end: endOfDay(new Date(event.endDate)),
            allDay: true,
            color:
              event.calendarEventType === CalendarEventType.LEAVE
                ? {
                    primary: '#179376',
                    secondary: '#179376',
                    secondaryText: 'white',
                  }
                : {
                    primary: '#e2af18',
                    secondary: '#e2af18',
                    secondaryText: 'white',
                  },
            meta: {
              event,
            },
          };
        });
      },
      error: (error) => {
        console.log(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }
}
