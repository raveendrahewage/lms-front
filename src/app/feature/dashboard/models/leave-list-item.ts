import { LeaveStatus } from '../constant/leave-status';
import { DataRecord } from './data-record';

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
