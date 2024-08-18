import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { LeaveTypeService } from '../../services/leave-type.service';
import { LeaveType } from '../../models/schemas/leave-type';
import { LeaveService } from '../../services/leave.service';
import {
  DateFilterFn,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
import { SystemUser } from '../../models/schemas/system-user';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../auth/auth.service';
import { Leave } from '../../models/schemas/leave';
import { LeaveStatus } from '../../constant/leave-status';
import { ActivatedRoute } from '@angular/router';
import { DateWiseLeave } from '../../models/schemas/date-wise-leave';
import { OptionToggleComponent } from '../../shared/option-toggle/option-toggle.component';
import { StatusValue } from '../../models/status-toggle';
import { ConfimationModalComponent } from '../../shared/confimation-modal/confimation-modal.component';
import { ConfirmationDialogData } from '../../models/confimation-modal-data';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { LeaveViewMode } from '../../constant/leave-view-mode';
import { leaveCalculation } from '../../helper/leave-helper';
import { LeaveCalculation } from '../../models/leave-calculation';
import { LeaveCalculationBarComponent } from '../../shared/leave-calculation-bar/leave-calculation-bar.component';

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
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    OptionToggleComponent,
    ConfimationModalComponent,
    LeaveCalculationBarComponent,
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
  dateWiseLeaveDataSourse = new BehaviorSubject<AbstractControl[]>([]);
  dateWiseLeaveDefaultColumns: string[] = ['date', 'leaveDayType'];
  dateWiseLeaveConditionalColumns: string[] = ['leaveDayHalfOrQuarterType'];
  dateWiseLeavedisplayColumns = [...this.dateWiseLeaveDefaultColumns];
  leave: Leave = {} as Leave;
  leaveTypes: LeaveType[] = [];
  allEmployees: SystemUser[] = [];
  selectedLeaveType: LeaveType | null = null;
  sub: any;
  leaveCalculation: LeaveCalculation = {
    currentBalance: 0,
    currentlyBooked: 0,
    balanceAfterBooked: 0,
  };
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
      this.getLeaveTypes(+params['mode']);
    });
    this.getAllEmployees();
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
  setDateWiseLeaveDataSource() {
    this.dateWiseLeaveDataSourse.next(
      this.leaveForm.controls.dateWiseLeaves.controls
    );
  }

  setDataSource() {
    this.dateWiseLeaveDataSourse.next(
      this.leaveForm.controls.dateWiseLeaves.controls
    );
  }

  weekendsDatesFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  };

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
          this.createDateWiseLeave({
            date: new Date(currentDate),
            leaveDayType: LeaveDayType.FULL_DAY,
          } as DateWiseLeave)
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }
      this.setDataSource();
      this.onLeaveTypeChanged(
        this.leaveForm.controls.leaveTypeId.value as number
      );
    }
  }

  getDisplayColumns() {
    return this.leaveForm.controls.dateWiseLeaves.controls.some(
      (c) => c.controls.leaveDayType.value !== LeaveDayType.FULL_DAY
    )
      ? [
          ...this.dateWiseLeaveDefaultColumns,
          ...this.dateWiseLeaveConditionalColumns,
        ]
      : this.dateWiseLeaveDefaultColumns;
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
    this.onLeaveTypeChanged(
      this.leaveForm.controls.leaveTypeId.value as number
    );
  }

  onLeaveTypeChanged(leaveTypeId: number) {
    this.selectedLeaveType = this.leaveTypes.find(
      (x) => x.id === leaveTypeId
    ) as LeaveType;
    this.leaveCalculation = leaveCalculation(
      this.leaveForm.getRawValue() as Leave,
      this.selectedLeaveType
    );
  }

  createDateWiseLeave(
    dateWiseLeave: DateWiseLeave
  ): FormGroup<DateWiseLeaveForm> {
    return this.fb.group({
      id: [dateWiseLeave.id ?? 0],
      leaveId: [dateWiseLeave.leaveId ?? this.leave.id],
      date: [
        { value: dateWiseLeave.date, disabled: true },
        [Validators.required],
      ],
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
    this.onLeaveTypeChanged(this.leave.leaveTypeId);
    this.setDateWiseLeaveDataSource();
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
        this.toggleMode(false);
      },
      error: (error) => {
        console.log(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }
  getLeaveTypes(mode: number) {
    if (
      mode === LeaveViewMode.SUPERVISOR_APPROVAL ||
      mode === LeaveViewMode.ADNIN_VIEW
    ) {
      this.leaveTypeService.getAllLeaveTypes().subscribe({
        next: (res) => {
          this.leaveTypes = res.data;
        },
        error: (error) => {
          console.log(error.error.message ?? error.message);
          this.toastr.error(error.error.message ?? error.message);
        },
      });
    } else if (mode === LeaveViewMode.SYSTEM_USER_UPDATE) {
      this.leaveTypeService
        .getLeaveTypesForEmployee(this.authService.getCurrentSystemUserId())
        .subscribe({
          next: (res) => {
            this.leaveTypes = res.data;
          },
          error: (error) => {
            console.log(error.error.message ?? error.message);
            this.toastr.error(error.error.message ?? error.message);
          },
        });
    }
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
          this.leave = res.data;
          this.toastr.success(res.message);
          this.leaveForm.controls.dateWiseLeaves.clear();
          this.setDateWiseLeaveDataSource();
          this.patchLeaveFrom(this.leave);
          this.toggleMode(false);
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
