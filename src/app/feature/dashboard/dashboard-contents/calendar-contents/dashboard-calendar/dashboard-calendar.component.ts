import { Router } from '@angular/router';
import { Event } from './../../../models/event';
import { EventService } from './../../../services/event.service';
import { Component, OnInit } from '@angular/core';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  getDay,
} from 'date-fns';
import {
  CalendarEvent as CalEvent,
  CalendarModule,
  CalendarView,
} from 'angular-calendar';
import { Subject, Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarHeaderComponent } from '../calendar-header/calendar-header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CalendarEvent } from '../../../models/calendar-event';
import { CalendarEventType } from '../../../constant/calendar-event-type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dash-calendar',
  standalone: true,
  imports: [CalendarModule, CalendarHeaderComponent, MatProgressSpinnerModule],
  templateUrl: './dashboard-calendar.component.html',
  styleUrls: ['./dashboard-calendar.component.css'],
})
export class DashboardCalendarComponent implements OnInit {
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
    this.fetchEvents();
  }

  dayClicked({ date, events }: { date: Date; events: CalEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventClicked(currEvent: CalEvent): void {
    console.log('Event clicked', currEvent.meta.event);
    const clickedEvent: CalendarEvent = currEvent.meta.event;
    if (clickedEvent.calendarEventType === CalendarEventType.LEAVE) {
      this.router.navigate([
        '/dashboard/leaves/details/' + clickedEvent.calendarEventId,
      ]);
    } else {
      this.router.navigate([
        '/dashboard/events/details/' + clickedEvent.calendarEventId,
      ]);
    }
  }

  fetchEvents(): void {
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
                ? { primary: '#2f79ef', secondary: '' }
                : { primary: '#e21841', secondary: '' },
            meta: {
              event,
            },
          };
        });
      },
      error: (error) => {
        console.log(error.error.message);
        this.toastr.error(error.error.message);
      },
    });
  }
}
