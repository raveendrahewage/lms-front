import { CalendarEventType } from '../constant/calendar-event-type';
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
