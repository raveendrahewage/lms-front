import { DataRecord } from './data-record';

export interface SystemUserListItem extends DataRecord {
  id: number;
  email: string;
  phoneNumber?: string | null;
  roleId: number;
  roleName: string;
  supervisorId?: number | null;
  supervisorName: string | null;
}
