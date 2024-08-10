import { CalendarEventType } from '../constant/calendar-event-type';
import { CalendarEvent as CalEvent } from 'angular-calendar';

export interface CalendarEvent {
  calendarEventId: number;
  supervisorId: number;
  systemUserId: number;
  title: string;
  startDate: Date;
  endDate: Date;
  calendarEventType: CalendarEventType;
}

export interface CalendarDay {
  badgeTotal: number;
  date: Date;
  events: CalEvent[];
}
