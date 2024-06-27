import { DataRecordStatus } from '../constant/data-record-status';

export interface DataRecord {
  id: number;
  createdBy: number;
  createdDate: Date;
  modifiedBy?: number;
  modifiedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  status: DataRecordStatus;
}
