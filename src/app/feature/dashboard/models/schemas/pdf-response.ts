import { UploadedDocument } from "../file-upload-item";

export interface UploadResponse {
    uploadUrl: string;
    blobName: string;
}

export interface JobStatusResponse {
    jobId: string;
    document: UploadedDocument;
}

export interface DownloadResponse {
    downloadUrl: string;
    fileName: string;
}