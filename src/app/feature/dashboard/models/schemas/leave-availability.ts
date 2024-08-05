import { DataRecord } from '../data-record';
import { LeaveType } from './leave-type';
import { SystemUser } from './system-user';

export interface LeaveAvailability extends DataRecord {
  year: number;
  systemUserId: number;
  leaveTypeId: number;
  leaveCount: number;
  bookedCount: number;
  balanceCount: number;
  leaveType?: LeaveType;
  systemUser?: SystemUser;
}
