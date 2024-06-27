import { DataRecord } from './data-record';
import { LeaveType } from './leave-type';
import { SystemUser } from './system-user';
import { DateWiseLeave } from './date-wise-leave';
import { LeaveStatus } from '../constant/leave-status';

export interface Leave extends DataRecord {
  id: number;
  employeeId: number;
  leaveTypeId: number;
  fromDate: Date;
  toDate: Date;
  reason: string;
  leaveStatus: LeaveStatus;
  deniedReason?: string | null;
  reviewedBy?: number | null;
  leaveType: LeaveType;
  supervisor?: SystemUser | null;
  employee: SystemUser;
  dateWiseLeaves: DateWiseLeave[];
}

export interface LeaveListItem extends DataRecord {
  employeeId: number;
  employeeName: string;
  leaveTypeId: number;
  leaveTypeName: string;
  supervisorId: number;
  supervisorName: string;
  fromDate: Date;
  toDate: Date;
  leaveStatus: LeaveStatus;
}
