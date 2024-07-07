import { LeaveStatus } from '../constant/leave-status';

export interface LeaveReportItem {
  count: number;
  leaveTypeId: number;
  leaveTypeName: string;
  month: number;
  leaveStatus: LeaveStatus;
  leaveStatusName: string;
}
