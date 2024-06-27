import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  FormGroupDirective,
  ValidationErrors,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { LeaveTypeService } from '../../services/leave-type.service';
import { LeaveType } from '../../models/leave-type';
import { LeaveService } from '../../services/leave.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { LeaveForm, DateWiseLeaveForm } from '../../models/forms';
import { CommonModule, DatePipe } from '@angular/common';
import {
  LeaveDayType,
  LeaveHalfDayType,
  LeaveQuarterDayType,
} from '../../constant/leave';
import { EnumSelectField } from '../../models/enum-select-field';
import { enumToIdNameArray } from '../../helper/enum-helper';
import { SystemUser } from '../../models/system-user';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../auth/auth.service';
import { Leave } from '../../models/leave';
import { LeaveStatus } from '../../constant/leave-status';

@Component({
  selector: 'app-leaverequest-manage',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [
    CommonModule,
    MatIcon,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './leave-manage.component.html',
  styleUrls: ['./leave-manage.component.css'],
})
export class LeaveManageComponent implements OnInit {
  leaveDayType: typeof LeaveDayType = LeaveDayType;
  leaveDayTypeList: EnumSelectField[] = enumToIdNameArray(LeaveDayType);
  leaveHalfDayType: typeof LeaveHalfDayType = LeaveHalfDayType;
  leaveHalfDayTypeList: EnumSelectField[] = enumToIdNameArray(LeaveHalfDayType);
  leaveQuarterDayType: typeof LeaveQuarterDayType = LeaveQuarterDayType;
  leaveQuarterDayTypeList: EnumSelectField[] =
    enumToIdNameArray(LeaveQuarterDayType);
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  defaultColumns: string[] = ['option', 'date', 'leaveDayType'];
  conditionalColumns: string[] = ['leaveDayHalfOrQuarterType'];
  displayColumns = [...this.defaultColumns];
  leaveTypes: LeaveType[] = [];
  allEmployees: SystemUser[] = [];
  selectedLeaveType: LeaveType = {} as LeaveType;
  leaveForm: FormGroup<LeaveForm> = this.fb.group({
    id: [0],
    employeeId: [
      this.authService.getCurrentSystemUserId(),
      [Validators.required],
    ],
    leaveTypeId: [null as number | null, [Validators.required]],
    fromDate: [new Date(''), [Validators.required]],
    toDate: [new Date(''), [Validators.required]],
    reason: [null as string | null],
    leaveStatus: [LeaveStatus.PENDING],
    deniedReason: [null as string | null],
    reviewedBy: [null as number | null],
    dateWiseLeaves: this.fb.array([] as FormGroup<DateWiseLeaveForm>[]),
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private leaveService: LeaveService,
    private employeeService: EmployeeService,
    private datePipe: DatePipe,
    private leaveTypeService: LeaveTypeService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getAllEmployees();
    this.getLeaveTypes();
  }

  removeDateWiseLeave(index: number) {
    this.leaveForm.controls.dateWiseLeaves.removeAt(index);
    this.setDataSource();
  }

  setDataSource() {
    this.dataSource.next(this.leaveForm.controls.dateWiseLeaves.controls);
  }
  getDisplayColumns() {
    return this.leaveForm.controls.dateWiseLeaves.controls.some(
      (c) => c.controls.leaveDayType.value !== LeaveDayType.FULL_DAY
    )
      ? [...this.defaultColumns, ...this.conditionalColumns]
      : this.defaultColumns;
  }
  onLeaveDayTypeChange(event: MatSelectChange, index: number) {
    if (event.value === LeaveDayType.HALF_DAY)
      this.leaveForm.controls.dateWiseLeaves
        .at(index)
        .controls.leaveHalfDayType.setValue(LeaveHalfDayType.FIRST_HALF);
    else if (event.value === LeaveDayType.QUARTER_DAY)
      this.leaveForm.controls.dateWiseLeaves
        .at(index)
        .controls.leaveQuarterDayType.setValue(
          LeaveQuarterDayType.FIRST_QUARTER
        );
  }

  onDateChange() {
    if (
      this.leaveForm.controls.fromDate.value &&
      this.leaveForm.controls.toDate.value &&
      this.leaveForm.controls.fromDate.value <=
        this.leaveForm.controls.toDate.value
    ) {
      this.leaveForm.controls.dateWiseLeaves.clear();
      const currentDate = new Date(this.leaveForm.controls.fromDate.value);
      while (currentDate <= this.leaveForm.controls.toDate.value) {
        this.leaveForm.controls.dateWiseLeaves.push(
          this.createDateWiseLeave(new Date(currentDate))
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }
      this.setDataSource();
    }
  }
  createDateWiseLeave(date: Date): FormGroup<DateWiseLeaveForm> {
    return this.fb.group({
      id: [0],
      leaveId: [0],
      date: [date, [Validators.required]],
      leaveDayType: [LeaveDayType.FULL_DAY, [Validators.required]],
      leaveHalfDayType: [null as LeaveHalfDayType | null],
      leaveQuarterDayType: [null as LeaveQuarterDayType | null],
    });
  }
  getLeaveTypes() {
    this.leaveTypeService.getAllLeaveTypes().subscribe({
      next: (res) => {
        this.leaveTypes = res.data;
      },
      error: (error) => {
        console.log(error.error.message);
        this.toastr.error(error.error.message);
      },
    });
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res) => {
        this.allEmployees = this.authService.isAdmin()
          ? res.data
          : res.data.filter(
              (e) => e.id === this.authService.getCurrentSystemUserId()
            );
      },
      error: (error) => {
        console.log(error.error.message);
        this.toastr.error(error.error.message);
      },
    });
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.leaveForm.valid) {
      this.leaveService
        .createEmployeeLeave(this.leaveForm.getRawValue() as Leave)
        .subscribe({
          next: (res) => {
            this.leaveForm.controls.dateWiseLeaves.clear();
            formDirective.resetForm();
            this.setDataSource();
            this.toastr.success('Leave created successfully');
          },
          error: (error) => {
            this.toastr.error(error.error.message);
          },
        });
    }
  }
}
