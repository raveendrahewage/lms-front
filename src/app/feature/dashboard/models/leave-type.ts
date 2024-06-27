import { DataRecord } from './data-record';
import { Leave } from './leave';

export interface LeaveType extends DataRecord {
  id: number;
  name: string;
  leaves: Leave[];
}
