import {
  LeaveDayType,
  LeaveHalfDayType,
  LeaveQuarterDayType,
} from '../../constant/leave';
import { DataRecord } from '../data-record';
import { Leave } from './leave';

export interface DateWiseLeave extends DataRecord {
  leaveId: number;
  date: Date;
  leaveDayType: LeaveDayType;
  leaveHalfDayType: LeaveHalfDayType | null;
  leaveQuarterDayType: LeaveQuarterDayType | null;
  leave: Leave;
}
