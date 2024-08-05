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
import { EventService } from '../../services/event.service';
import { Event } from '../../models/schemas/event';
import { CommonModule } from '@angular/common';
import { EventStatusChipComponent } from '../../shared/event-status-chip/event-status-chip.component';
import { EventModeChipComponent } from '../../shared/event-mode-chip/event-mode-chip.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    MatIcon,
    CommonModule,
    MatProgressBar,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    RouterModule,
    EventStatusChipComponent,
    EventModeChipComponent,
  ],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading: boolean = true;
  page: number = 0;
  pageSize: number = 10;
  sortBy: string = 'Id';
  sortMode: SortMode = SortMode.ASC;
  totalRecords: number = 0;
  searchForm: FormGroup<SearchForm> = this.fb.nonNullable.group({
    searchTerm: ['', Validators.required],
  });
  displayedColumns: string[] = [
    'index',
    'title',
    'description',
    'startDate',
    'endDate',
    'eventMode',
    'eventStatus',
    'options',
  ];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getAllEvents();
  }

  getRecordIndex(i: number): number {
    return this.page * this.pageSize + i + 1;
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllEvents();
  }
  onSortChange(event: Sort) {
    this.sortBy = capitalizeFirstLetter(event.active);
    this.sortMode =
      getEnumValueByName(SortMode, event.direction.toLocaleUpperCase()) ??
      SortMode.ASC;
    this.getAllEvents();
  }

  onSearchTermChange() {
    if (this.searchForm.controls.searchTerm.value.length === 0)
      this.getAllEvents();
  }

  getAllEvents() {
    const dataTableConfiguration: DataTableConfiguration = {
      page: this.page,
      pageSize: this.pageSize,
      search: this.searchForm.controls.searchTerm.value,
      sortBy: this.sortBy,
      sortMode: this.sortMode,
    };
    this.eventService.getAllEventsSsr(dataTableConfiguration).subscribe({
      next: (res) => {
        this.events = res.data.data;
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
