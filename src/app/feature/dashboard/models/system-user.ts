import { DataRecord } from './data-record';
import { Leave } from './leave';
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
}

export interface NewSystemUser extends SystemUser {
  password: string;
}
export interface SystemUserListItem extends DataRecord {
  id: number;
  email: string;
  phoneNumber?: string | null;
  roleId: number;
  roleName: string;
  supervisorId?: number | null;
  supervisorName: string | null;
}
