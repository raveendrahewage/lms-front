import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { FileUploadPayload, UploadedDocument } from '../models/file-upload-item';
import { environment } from '../../../../environments/environment';
import { BlockBlobClient } from '@azure/storage-blob';
import { Constant } from '../constant/constant';
import { ApiResponse } from '../models/api-response';
import { DownloadResponse, JobStatusResponse, UploadResponse } from '../models/schemas/pdf-response';
import { FileCategory } from '../constant/file-category';
import { FileStatus } from '../constant/file-status';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private uploadedDocumentsSubject = new BehaviorSubject<UploadedDocument[]>([]);
  public uploadedDocuments$ = this.uploadedDocumentsSubject.asObservable();

  readonly MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
  readonly ALLOWED_EXTENSIONS = [
    'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'zip'
  ];

  constructor(private http: HttpClient) { }
  errorHandler(error: HttpErrorResponse) {
    console.log('Leave api error ', error);
    return throwError(error);
  }
  getDocuments(): UploadedDocument[] {
    return this.uploadedDocumentsSubject.getValue();
  }

  getUploadedDocuments(): Observable<ApiResponse<UploadedDocument[]>> {
    return this.http
      .get<ApiResponse<UploadedDocument[]>>(
        `${Constant.API_ENDPOINT}/file/get-files`
      )
      .pipe(catchError(this.errorHandler));
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > this.MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File size exceeds the 25MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
      };
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !this.ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        valid: false,
        error: `File extension '.${extension}' is not supported. Supported: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
      };
    }

    return { valid: true };
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  getFileIcon(filename: string): string {
    const ext = filename?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'image';
      case 'doc':
      case 'docx':
      case 'txt':
        return 'description';
      case 'xls':
      case 'xlsx':
      case 'csv':
        return 'table_chart';
      case 'zip':
        return 'folder_zip';
      default:
        return 'insert_drive_file';
    }
  }

  addDocument(document: UploadedDocument) {
    this.uploadedDocumentsSubject.next([document, ...this.uploadedDocumentsSubject.value]);
  }

  uploadFileAndProcess(fileData: FileUploadPayload): Observable<ApiResponse<JobStatusResponse>> {
    const file = fileData.file;
    return this.http.get<ApiResponse<UploadResponse>>(
      `${Constant.API_ENDPOINT}/file-upload/generate-upload-url?fileName=${encodeURIComponent(file.name)}`
    ).pipe(
      switchMap((res: ApiResponse<UploadResponse>) => {
        const blockBlobClient = new BlockBlobClient(res.data?.uploadUrl);
        return from(blockBlobClient.uploadData(file)).pipe(
          switchMap(() => {
            fileData.document.url = res.data.uploadUrl;
            fileData.document.blobName = res.data.blobName;
            return this.http.post<ApiResponse<JobStatusResponse>>(`${Constant.API_ENDPOINT}/file-upload/submit-job`, {
              blobName: res.data?.blobName,
              originalFileName: file.name,
              file: fileData.document
            })
          })
        );
      })
    );
  }

  getDownloadUrl(fileId: number): Observable<ApiResponse<DownloadResponse>> {
    return this.http.get<ApiResponse<DownloadResponse>>(`${Constant.API_ENDPOINT}/file-upload/download-url/${fileId}`);
  }

  // Helper method to trigger the browser download directly
  downloadFileFromSasUrl(sasUrl: string, fileName: string): void {
    const anchor = document.createElement('a');
    anchor.href = sasUrl;
    anchor.download = fileName;
    anchor.style.display = 'none';

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}
