import { EventMode } from '../../constant/event-mode';
import { EventStatus } from '../../constant/event-status';
import { DataRecord } from '../data-record';

export interface Event extends DataRecord {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  eventStatus: EventStatus;
  eventMode: EventMode;
}
