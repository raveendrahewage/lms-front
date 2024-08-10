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
import { SystemRoleId } from '../../constant/system-user-roles';
import { MatTabsModule } from '@angular/material/tabs';
import { LeaveListItem } from '../../models/leave-list-item';
import { LeaveFetchingMode } from '../../constant/leave';
import { AuthService } from '../../auth/auth.service';
import { LeaveService } from '../../services/leave.service';
import { CommonModule, DatePipe } from '@angular/common';
import { LeaveStatus } from '../../constant/leave-status';
import { LeaveStatusChipComponent } from '../../shared/leave-status-chip/leave-status-chip.component';
import { LeaveViewMode } from '../../constant/leave-view-mode';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  providers: [DatePipe],
  imports: [
    MatIcon,
    CommonModule,
    MatTabsModule,
    MatProgressBar,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    RouterModule,
    LeaveStatusChipComponent,
  ],
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.css'],
})
export class LeaveListComponent implements OnInit {
  leaveFetchingMode: typeof LeaveFetchingMode = LeaveFetchingMode;
  leaveViewMode: typeof LeaveViewMode = LeaveViewMode;
  leaveStatus: typeof LeaveStatus = LeaveStatus;
  allEmployeeLeaves: LeaveListItem[] = [];
  myLeaves: LeaveListItem[] = [];
  leavesForApproval: LeaveListItem[] = [];
  systemRoleId: typeof SystemRoleId = SystemRoleId;
  loading: boolean = true;
  page: number = 0;
  pageSize: number = 10;
  sortBy: string = 'Id';
  sortMode: SortMode = SortMode.ASC;
  totalAllEmployeeLeaves: number = 0;
  totalMyLeaves: number = 0;
  totalLeavesForApproval: number = 0;
  searchForm: FormGroup<SearchForm> = this.fb.nonNullable.group({
    searchTerm: ['', Validators.required],
  });
  displayedColumns: string[] = [
    'index',
    'employee',
    'leaveType',
    'fromDate',
    'toDate',
    'status',
    'options',
  ];

  constructor(
    private leaveService: LeaveService,
    public authService: AuthService,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    if (this.authService.isAdmin()) this.getAllLeaves();
    else this.getEmployeeLeaveByIdSsr(LeaveFetchingMode.ALL);
  }

  getRecordIndex(i: number): number {
    return this.page * this.pageSize + i + 1;
  }

  onPageChange(event: PageEvent, leaveFetchingMode?: LeaveFetchingMode) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    if (leaveFetchingMode) this.getEmployeeLeaveByIdSsr(leaveFetchingMode);
    else this.getAllLeaves();
  }
  onSortChange(event: Sort, leaveFetchingMode?: LeaveFetchingMode) {
    this.sortBy = capitalizeFirstLetter(event.active);
    this.sortMode =
      getEnumValueByName(SortMode, event.direction.toLocaleUpperCase()) ??
      SortMode.ASC;
    if (leaveFetchingMode) this.getEmployeeLeaveByIdSsr(leaveFetchingMode);
    else this.getAllLeaves();
  }

  onSearchTermChange(leaveFetchingMode?: LeaveFetchingMode) {
    if (this.searchForm.controls.searchTerm.value.length === 0) {
      if (leaveFetchingMode) this.getEmployeeLeaveByIdSsr(leaveFetchingMode);
      else this.getAllLeaves();
    }
  }

  getAllLeaves() {
    const dataTableConfiguration: DataTableConfiguration = {
      page: this.page,
      pageSize: this.pageSize,
      search: this.searchForm.controls.searchTerm.value,
      sortBy: this.sortBy,
      sortMode: this.sortMode,
    };
    this.leaveService.getAllLeavesSsr(dataTableConfiguration).subscribe({
      next: (res) => {
        this.allEmployeeLeaves = res.data.data;
        this.totalAllEmployeeLeaves = res.data.totalRecords;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toastrService.error(error.error.message);
      },
    });
  }

  getEmployeeLeaveByIdSsr(leaveFetchingMode: LeaveFetchingMode) {
    const dataTableConfiguration: DataTableConfiguration = {
      page: this.page,
      pageSize: this.pageSize,
      search: this.searchForm.controls.searchTerm.value,
      sortBy: this.sortBy,
      sortMode: this.sortMode,
    };
    this.leaveService
      .getLeavesByEmployeeIdSsr(
        this.authService.getCurrentSystemUserId(),
        leaveFetchingMode,
        dataTableConfiguration
      )
      .subscribe({
        next: (res) => {
          switch (leaveFetchingMode) {
            case LeaveFetchingMode.ALL:
              this.myLeaves = res.data.data.filter(
                (l) =>
                  l.employeeId === this.authService.getCurrentSystemUserId()
              );
              this.leavesForApproval = res.data.data.filter(
                (l) =>
                  l.supervisorId === this.authService.getCurrentSystemUserId()
              );
              break;
            case LeaveFetchingMode.ONLY_MINE:
              this.myLeaves = res.data.data;
              this.totalMyLeaves = res.data.totalRecords;
              break;
            case LeaveFetchingMode.ONLY_APPROVALS:
              this.leavesForApproval = res.data.data;
              this.totalLeavesForApproval = res.data.totalRecords;
              break;
          }
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.toastrService.error(error.error.message);
        },
      });
  }
}
