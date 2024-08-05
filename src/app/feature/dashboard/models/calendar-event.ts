import { CalendarEventType } from '../constant/calendar-event-type';
import { CalendarEvent as CalEvent } from 'angular-calendar';
import { Event } from './schemas/event';
import { Leave } from './schemas/leave';

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
