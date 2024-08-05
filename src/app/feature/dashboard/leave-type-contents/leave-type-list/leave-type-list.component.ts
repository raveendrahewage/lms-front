import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { SearchForm } from '../../models/forms';
import { DataTableConfiguration } from '../../models/data-table-configuration';
import { SortMode } from '../../constant/sort-mode';
import { ToastrService } from 'ngx-toastr';
import { capitalizeFirstLetter } from '../../helper/string-formatter';
import { getEnumValueByName } from '../../helper/enum-helper';
import { LeaveTypeService } from '../../services/leave-type.service';
import { LeaveType } from '../../models/schemas/leave-type';
import { DataRecordStatusChipComponent } from '../../shared/data-record-status-chip/data-record-status-chip.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    MatIcon,
    MatProgressBar,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    RouterModule,
    DataRecordStatusChipComponent,
  ],
  templateUrl: './leave-type-list.component.html',
  styleUrls: ['./leave-type-list.component.css'],
})
export class LeaveTypeListComponent implements OnInit {
  leaveTypes: LeaveType[] = [];
  loading: boolean = true;
  page: number = 0;
  pageSize: number = 10;
  sortBy: string = 'Id';
  sortMode: SortMode = SortMode.ASC;
  totalRecords: number = 0;
  searchForm: FormGroup<SearchForm> = this.fb.nonNullable.group({
    searchTerm: ['', Validators.required],
  });
  displayedColumns: string[] = ['index', 'name', 'status', 'options'];

  constructor(
    private leaveTypeService: LeaveTypeService,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getAllLeaveTypes();
  }

  getRecordIndex(i: number): number {
    return this.page * this.pageSize + i + 1;
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllLeaveTypes();
  }
  onSortChange(event: Sort) {
    this.sortBy = capitalizeFirstLetter(event.active);
    this.sortMode =
      getEnumValueByName(SortMode, event.direction.toLocaleUpperCase()) ??
      SortMode.ASC;
    this.getAllLeaveTypes();
  }

  onSearchTermChange() {
    if (this.searchForm.controls.searchTerm.value.length === 0)
      this.getAllLeaveTypes();
  }

  getAllLeaveTypes() {
    const dataTableConfiguration: DataTableConfiguration = {
      page: this.page,
      pageSize: this.pageSize,
      search: this.searchForm.controls.searchTerm.value,
      sortBy: this.sortBy,
      sortMode: this.sortMode,
    };
    this.leaveTypeService
      .getAllLeaveTypesSsr(dataTableConfiguration)
      .subscribe({
        next: (res) => {
          this.leaveTypes = res.data.data;
          this.totalRecords = res.data.totalRecords;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.toastrService.error(error.error.message);
        },
      });
  }
}
