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
import { LeaveForm, DateWiseLeaveForm } from '../../models/forms';
import { CommonModule, DatePipe } from '@angular/common';
import {
  LeaveDayType,
  LeaveHalfDayType,
  LeaveQuarterDayType,
} from '../../constant/leave';
import { EnumSelectField } from '../../models/enum-select-field';
import { enumToIdNameArray } from '../../helper/enum-helper';
import { MatButtonModule } from '@angular/material/button';
import { SystemUser } from '../../models/system-user';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../auth/auth.service';
import { Leave } from '../../models/leave';
import { LeaveStatus } from '../../constant/leave-status';
import { ActivatedRoute } from '@angular/router';
import { DateWiseLeave } from '../../models/date-wise-leave';
import { OptionToggleComponent } from '../../shared/option-toggle/option-toggle.component';
import { StatusValue } from '../../models/status-toggle';
import { ConfimationModalComponent } from '../../shared/confimation-modal/confimation-modal.component';
import { ConfirmationDialogData } from '../../models/confimation-modal-data';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

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
    MatButtonModule,
    OptionToggleComponent,
    ConfimationModalComponent,
  ],
  templateUrl: './leave-details.component.html',
  styleUrls: ['./leave-details.component.css'],
})
export class LeaveDetailsComponent implements OnInit {
  leaveStatus: typeof LeaveStatus = LeaveStatus;
  leaveDayType: typeof LeaveDayType = LeaveDayType;
  leaveDayTypeList: EnumSelectField[] = enumToIdNameArray(LeaveDayType);
  leaveHalfDayType: typeof LeaveHalfDayType = LeaveHalfDayType;
  leaveHalfDayTypeList: EnumSelectField[] = enumToIdNameArray(LeaveHalfDayType);
  leaveQuarterDayType: typeof LeaveQuarterDayType = LeaveQuarterDayType;
  leaveQuarterDayTypeList: EnumSelectField[] =
    enumToIdNameArray(LeaveQuarterDayType);
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  defaultColumns: string[] = ['date', 'leaveDayType'];
  conditionalColumns: string[] = ['leaveDayHalfOrQuarterType'];
  displayColumns = [...this.defaultColumns];
  leave: Leave = {} as Leave;
  leaveTypes: LeaveType[] = [];
  allEmployees: SystemUser[] = [];
  selectedLeaveType: LeaveType = {} as LeaveType;
  sub: any;
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
    leaveStatus: [LeaveStatus.APPROVED, [Validators.required]],
    deniedReason: [null as string | null],
    reviewedBy: [null as number | null],
    dateWiseLeaves: this.fb.array([] as FormGroup<DateWiseLeaveForm>[]),
  });
  statuses: StatusValue[] = [
    {
      value: LeaveStatus.APPROVED,
      label: 'Approve',
      color: '#0cbe8c',
      clickAction: () => this.updateStatus(LeaveStatus.APPROVED),
    },
    {
      value: LeaveStatus.DENIED,
      label: 'Denie',
      color: 'darkgray',
      clickAction: () => this.updateStatus(LeaveStatus.DENIED),
    },
    {
      value: LeaveStatus.PENDING,
      label: 'Pending',
      color: '#0cbe8c',
      clickAction: () => this.updateStatus(LeaveStatus.PENDING),
    },
    {
      value: LeaveStatus.CANCELED,
      label: 'Canceled',
      color: 'rgb(251, 146, 60)',
      clickAction: () => this.updateStatus(LeaveStatus.CANCELED),
    },
  ];
  isEditable: boolean =
    this.authService.getCurrentSystemUserId() ===
    this.leave.employee?.supervisorId;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public authService: AuthService,
    private leaveService: LeaveService,
    private employeeService: EmployeeService,
    private leaveTypeService: LeaveTypeService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.getLeaveById(+params['id']);
    });
    this.getAllEmployees();
    this.getLeaveTypes();
    this.setFormMode();
  }

  toggleMode(isEditable: boolean) {
    this.isEditable = isEditable;
    if (isEditable) {
      this.setFormMode();
    } else {
      this.patchLeaveFrom(this.leave);
      this.leaveForm.disable();
    }
  }

  setFormMode() {
    if (
      this.authService.getCurrentSystemUserId() === this.leave.employeeId ||
      this.authService.getCurrentSystemUserId() ===
        this.leave.employee?.supervisorId
    ) {
      if (
        this.leave.leaveStatus === LeaveStatus.APPROVED ||
        this.leave.leaveStatus === LeaveStatus.DENIED ||
        this.leave.leaveStatus === LeaveStatus.CANCELED
      ) {
        this.leaveForm.disable();
        this.isEditable = false;
      } else {
        this.isEditable = true;
        if (
          this.authService.getCurrentSystemUserId() === this.leave.employeeId
        ) {
          this.leaveForm.enable();
          this.leaveForm.controls.fromDate.disable();
          this.leaveForm.controls.toDate.disable();
        }
        if (
          this.authService.getCurrentSystemUserId() ===
          this.leave.employee?.supervisorId
        ) {
          this.leaveForm.disable();
          this.leaveForm.controls.leaveStatus.enable();
          this.leaveForm.controls.deniedReason.enable();
        }
      }
    } else {
      this.leaveForm.disable();
      this.isEditable = false;
    }
  }
  updateStatus(status: LeaveStatus) {
    this.leaveForm.controls.leaveStatus.patchValue(status);
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
  createDateWiseLeave(
    dateWiseLeave: DateWiseLeave
  ): FormGroup<DateWiseLeaveForm> {
    return this.fb.group({
      id: [dateWiseLeave.id],
      leaveId: [dateWiseLeave.leaveId],
      date: [dateWiseLeave.date, [Validators.required]],
      leaveDayType: [dateWiseLeave.leaveDayType, [Validators.required]],
      leaveHalfDayType: [dateWiseLeave.leaveHalfDayType as LeaveHalfDayType],
      leaveQuarterDayType: [
        dateWiseLeave.leaveQuarterDayType as LeaveQuarterDayType,
      ],
    });
  }
  patchLeaveFrom(leave: Leave) {
    this.leaveForm.patchValue(leave);
    this.leaveForm.controls.dateWiseLeaves.clear();
    for (let i = 0; i < leave.dateWiseLeaves.length; i++) {
      this.leaveForm.controls.dateWiseLeaves.push(
        this.createDateWiseLeave(leave.dateWiseLeaves[i])
      );
    }
    this.setDataSource();
  }

  openConfirmationDialog(status: string): void {
    const dialogData: ConfirmationDialogData = {
      title: 'Confirm',
      message: `Are you sure you want to ${status} this leave?`,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes',
      onConfirm: () => this.updateLeave(),
    };
    const dialogRef = this.dialog.open(ConfimationModalComponent, {
      data: dialogData,
    });
  }

  getLeaveById(id: number) {
    this.leaveService.getLeavesById(id).subscribe({
      next: (res) => {
        this.leave = res.data;
        this.patchLeaveFrom(this.leave);
      },
      error: (error) => {
        console.log(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }
  getLeaveTypes() {
    this.leaveTypeService.getAllLeaveTypes().subscribe({
      next: (res) => {
        this.leaveTypes = res.data;
      },
      error: (error) => {
        console.log(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res) => {
        this.allEmployees = res.data;
      },
      error: (error) => {
        console.log(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }

  onSubmit() {
    if (this.leaveForm.valid) {
      switch (this.leaveForm.controls.leaveStatus.value) {
        case LeaveStatus.APPROVED:
          this.openConfirmationDialog('approve');
          break;
        case LeaveStatus.DENIED:
          this.openConfirmationDialog('denie');
          break;
        case LeaveStatus.CANCELED:
          this.openConfirmationDialog('cancel');
          break;
        case LeaveStatus.PENDING:
          this.updateLeave();
          break;
      }
    }
  }

  updateLeave() {
    this.leaveService
      .updateLeave(this.leaveForm.getRawValue() as Leave)
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.leaveForm.controls.dateWiseLeaves.clear();
          this.setDataSource();
        },
        error: (error) => {
          this.toastr.error(error.error.message ?? error.message);
        },
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
