import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FileUploadService } from '../../services/file-upload.service';
import { NotificationService } from '../../services/notification.service';
import { FileUploadPayload, UploadedDocument } from '../../models/file-upload-item';
import { FileCategory } from '../../constant/file-category';
import { FileStatus } from '../../constant/file-status';
import { EnumSelectField } from '../../models/enum-select-field';
import { enumToIdNameArray } from '../../helper/enum-helper';
import { FileUploadForm } from '../../models/forms';
import { Notification } from '../../models/schemas/notification';

@Component({
  selector: 'app-file-upload-page',
  standalone: true,
  providers: [DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './file-upload-page.component.html',
  styleUrls: ['./file-upload-page.component.css'],
})
export class FileUploadPageComponent implements OnInit, AfterViewInit, OnDestroy {
  uploadForm: FormGroup<FileUploadForm>;
  isDragOver = false;
  searchTerm = '';
  filterCategory: number | 'All' = 'All';
  filterStatus: number | 'All' = 'All';

  categories: EnumSelectField[] = enumToIdNameArray(FileCategory);
  fileStatuses: EnumSelectField[] = enumToIdNameArray(FileStatus);

  isUploading = false;
  uploadStatus: 'idle' | 'uploading' | 'completed' | 'error' = 'idle';
  uploadErrorMessage = '';
  isLoadingList = false;

  uploadedDocuments: UploadedDocument[] = [];
  dataSource = new MatTableDataSource<UploadedDocument>([]);

  private _paginator!: MatPaginator;
  private _sort!: MatSort;

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator) {
      this._paginator = paginator;
      this.dataSource.paginator = paginator;
    }
  }
  get paginator(): MatPaginator {
    return this._paginator;
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort) {
      this._sort = sort;
      this.dataSource.sort = sort;
    }
  }
  get sort(): MatSort {
    return this._sort;
  }

  displayedColumns: string[] = [
    'index',
    'name',
    'category',
    'size',
    'uploadedBy',
    'uploadedAt',
    'status',
    'actions',
  ];

  fileStatusEnum = FileStatus;
  private subscriptions = new Subscription();

  constructor(
    public fileService: FileUploadService,
    private notificationService: NotificationService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {
    this.uploadForm = this.fb.group<FileUploadForm>({
      file: this.fb.control<File | null>(null, [Validators.required]),
      category: this.fb.control<FileCategory | null>(FileCategory.GENERAL_DOCUMENT, [Validators.required]),
      description: this.fb.control<string | null>(''),
    });
  }

  get selectedFile(): File | null {
    return this.uploadForm.get('file')?.value ?? null;
  }

  ngOnInit(): void {
    this.setupFilterPredicate();
    this.setupSortingDataAccessor();
    this.loadFilesFromApi();

    this.subscriptions.add(
      this.notificationService.pdfCompleted$.subscribe((notification: Notification | null) => {
        if (notification) {
          this.toastr.success(notification.message);
          this.loadFilesFromApi();
        }
      })
    );
  }

  ngAfterViewInit(): void {
    if (this._paginator) {
      this.dataSource.paginator = this._paginator;
    }
    if (this._sort) {
      this.dataSource.sort = this._sort;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setupSortingDataAccessor(): void {
    this.dataSource.sortingDataAccessor = (item: UploadedDocument, property: string): string | number => {
      switch (property) {
        case 'name':
          return item.name ? item.name.toLowerCase() : '';
        case 'category':
          return this.getCategoryName(item.category).toLowerCase();
        case 'size':
          return Number(item.size) || 0;
        case 'uploadedAt':
          return item.uploadedAt || item.createdDate
            ? new Date(item.uploadedAt || item.createdDate!).getTime()
            : 0;
        case 'status':
          return this.getFileStatusName(item.fileStatus).toLowerCase();
        case 'uploadedBy':
          return (item.uploadedBy
            ? `${item.uploadedBy.firstName} ${item.uploadedBy.lastName || ''}`
            : item.uploadedById ? String(item.uploadedById) : '').toLowerCase();
        default:
          return (item as any)[property] || '';
      }
    };
  }

  setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (doc: UploadedDocument, _: string): boolean => {
      const term = this.searchTerm.trim().toLowerCase();
      const matchesCategory =
        this.filterCategory === 'All' || Number(doc.category) === Number(this.filterCategory);

      const matchesStatus =
        this.filterStatus === 'All' || Number(doc.fileStatus) === Number(this.filterStatus);

      const categoryName = this.getCategoryName(doc.category).toLowerCase();
      const statusName = this.getFileStatusName(doc.fileStatus).toLowerCase();
      const uploaderName = (doc.uploadedBy?.firstName
        ? `${doc.uploadedBy.firstName} ${doc.uploadedBy?.lastName || ''}`
        : '').toLowerCase();

      const matchesSearch =
        !term ||
        (doc.name && doc.name.toLowerCase().includes(term)) ||
        (doc.description && doc.description.toLowerCase().includes(term)) ||
        categoryName.includes(term) ||
        statusName.includes(term) ||
        uploaderName.includes(term);

      return matchesCategory && matchesStatus && matchesSearch;
    };
  }

  getCategoryName(category: FileCategory | number | null | undefined): string {
    if (category === null || category === undefined) return '';
    const found = this.categories.find((c) => c.id === Number(category));
    return found ? found.name : 'Unknown';
  }

  getFileStatusName(status: FileStatus | number | null | undefined): string {
    switch (Number(status)) {
      case FileStatus.QUEUED:
        return 'Queued';
      case FileStatus.PROCESSING:
        return 'Processing';
      case FileStatus.COMPLETED:
        return 'Completed';
      case FileStatus.FAILED:
        return 'Failed';
      default:
        return 'Queued';
    }
  }

  loadFilesFromApi(): void {
    this.isLoadingList = true;
    this.fileService.getUploadedDocuments().subscribe({
      next: (res) => {
        this.isLoadingList = false;
        const docs = res?.data || [];
        this.uploadedDocuments = docs;
        this.dataSource.data = this.uploadedDocuments;
        this.applyFilter();
      },
      error: (err) => {
        this.isLoadingList = false;
      },
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleSingleFile(event.dataTransfer.files[0]);
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleSingleFile(input.files[0]);
      input.value = '';
    }
  }

  handleSingleFile(file: File): void {
    const validation = this.fileService.validateFile(file);
    if (!validation.valid) {
      this.toastr.error(validation.error || 'Invalid file', file.name);
      return;
    }

    this.uploadForm.patchValue({ file });
    this.uploadStatus = 'idle';
    this.uploadErrorMessage = '';
  }

  clearSelectedFile(): void {
    if (this.isUploading) return;
    this.uploadForm.patchValue({ file: null });
    this.uploadStatus = 'idle';
    this.uploadErrorMessage = '';
  }

  uploadFile(): void {
    if (this.uploadForm.invalid || this.isUploading) {
      this.uploadForm.markAllAsTouched();
      return;
    }

    const formValue = this.uploadForm.getRawValue();
    const fileToUpload = formValue.file;
    if (!fileToUpload) {
      return;
    }

    const category = formValue.category ?? FileCategory.GENERAL_DOCUMENT;
    const description = formValue.description || '';

    this.isUploading = true;
    this.uploadStatus = 'uploading';
    this.uploadErrorMessage = '';

    const newDoc: UploadedDocument = {
      id: 0,
      blobName: "",
      name: fileToUpload.name,
      size: fileToUpload.size,
      category: category,
      description: description || 'Direct Azure Upload',
    };
    const payload: FileUploadPayload = {
      file: fileToUpload,
      document: newDoc,
    };

    this.fileService.uploadFileAndProcess(payload).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.uploadStatus = 'completed';
        this.toastr.success(`"${fileToUpload.name}" uploaded and queued successfully!`);

        this.loadFilesFromApi()

        setTimeout(() => {
          this.uploadForm.patchValue({ file: null, description: '' });
          this.uploadStatus = 'idle';
        }, 2000);
      },
      error: (error) => {
        this.isUploading = false;
        this.uploadStatus = 'error';
        this.uploadErrorMessage = error?.error?.message || error?.message || 'Failed to upload and process file.';
        this.toastr.error(this.uploadErrorMessage, 'Upload Error');
      },
    });
  }

  applyFilter(): void {
    this.dataSource.filter = `${this.searchTerm.trim()}_${this.filterCategory}_${this.filterStatus}_${Date.now()}`;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  downloadDocument(doc: UploadedDocument): void {
    if (!doc.id) {
      this.toastr.error('Invalid file ID for download', 'Download Error');
      return;
    }

    this.fileService.getDownloadUrl(doc.id).subscribe({
      next: (response) => {
        if (response?.data?.downloadUrl) {
          this.fileService.downloadFileFromSasUrl(
            response.data.downloadUrl,
            response.data.fileName || doc.name
          );
          this.toastr.success(`Downloading "${doc.name}"...`);
        } else {
          this.toastr.error(`Unable to generate download link for "${doc.name}"`, 'Download Error');
        }
      },
      error: (error) => {
        const errorMsg = error?.error?.message || error?.message || 'Failed to retrieve download link.';
        this.toastr.error(errorMsg, 'Download Error');
      },
    });
  }
}
