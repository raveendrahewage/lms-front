import { CalendarEventType } from '../constant/calendar-event-type';
import { CalendarEvent as CalEvent } from 'angular-calendar';
import { Event } from './event';
import { Leave } from './leave';

export interface CalendarEvent {
  calendarEventId: number;
  title: string;
  startDate: Date;
  endDate: Date;
  calendarEventType: CalendarEventType;
  leave: Leave | null;
  event: Event | null;
}

export interface CalendarDay {
  badgeTotal: number;
  date: Date;
  events: CalEvent[];
}
