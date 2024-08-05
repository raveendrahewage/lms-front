import { DataRecord } from '../data-record';
import { Leave } from './leave';
import { LeaveAvailability } from './leave-availability';
import { SystemRole } from './system-role';

export interface SystemUser extends DataRecord {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  roleId: number;
  supervisorId?: number | null;
  supervisor?: SystemUser | null;
  employeesUnderSupervision?: SystemUser[] | null;
  role: SystemRole;
  leaves: Leave[];
  reviewedLeaves: Leave[];
  leaveAvailabilities: LeaveAvailability[];
}
