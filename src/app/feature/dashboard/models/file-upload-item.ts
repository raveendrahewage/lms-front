import { FileCategory } from "../constant/file-category";
import { FileStatus } from "../constant/file-status";
import { SystemUser } from "./schemas/system-user";

export interface UploadQueueItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  category: FileCategory;
  description?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
  uploadedAt?: Date;
  url?: string;
}

export interface FileUploadPayload {
  file: File;
  document: UploadedDocument;
}

export interface UploadedDocument {
  id: number;
  name: string;
  size: number;
  category: FileCategory;
  blobName: string;
  description?: string;
  uploadedById?: number;
  uploadedBy?: SystemUser;
  url?: string;
  fileStatus?: FileStatus;
  status?: string;
  uploadedAt?: Date | string;
  createdDate?: Date | string;
}
