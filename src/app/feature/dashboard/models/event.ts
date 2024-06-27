import { DataRecord } from './data-record';

export interface Event extends DataRecord {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}
