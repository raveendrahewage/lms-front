import { DataRecord } from '../data-record';
import { SystemUser } from './system-user';

export interface SystemRole extends DataRecord {
  name: string;
  systemUsers: SystemUser[];
}
