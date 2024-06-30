import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarModule, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-header',
  standalone: true,
  // providers: [CalendarDatePipe],
  imports: [CalendarModule],
  templateUrl: './calendar-header.component.html',
  styleUrl: './calendar-header.component.css',
})
export class CalendarHeaderComponent {
  calendarView: typeof CalendarView = CalendarView;
  @Input()
  view: CalendarView = CalendarView.Month;

  @Input()
  viewDate: Date = new Date();

  @Input()
  locale: string = 'en';

  @Output()
  viewChange: EventEmitter<string> = new EventEmitter();

  @Output()
  viewDateChange: EventEmitter<Date> = new EventEmitter();
}
