import { DataRecord } from './data-record';
import { Leave } from './leave';
import { LeaveAvailability } from './leave-availability';

export interface LeaveType extends DataRecord {
  id: number;
  name: string;
  defaultLeaveCount: number;
  leaves: Leave[];
  leaveAvailabilities: LeaveAvailability[];
}
