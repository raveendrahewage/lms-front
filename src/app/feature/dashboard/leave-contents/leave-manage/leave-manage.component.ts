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
import { LeaveType } from '../../models/schemas/leave-type';
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
import { SystemUser } from '../../models/schemas/system-user';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../auth/auth.service';
import { Leave } from '../../models/schemas/leave';
import { LeaveStatus } from '../../constant/leave-status';
import { ActivatedRoute } from '@angular/router';
import { LeaveCalculation } from '../../models/leave-calculation';
import { LeaveCalculationBarComponent } from '../../shared/leave-calculation-bar/leave-calculation-bar.component';
import { leaveCalculation } from '../../helper/leave-helper';

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
    LeaveCalculationBarComponent,
  ],
  templateUrl: './leave-manage.component.html',
  styleUrls: ['./leave-manage.component.css'],
})
export class LeaveManageComponent implements OnInit {
  sub: any;
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
  leaveType: LeaveType = {} as LeaveType;
  allEmployees: SystemUser[] = [];
  selectedLeaveType: LeaveType | null = null;
  leaveCalculation: LeaveCalculation = {
    currentBalance: 0,
    currentlyBooked: 0,
    balanceAfterBooked: 0,
  };
  leaveForm: FormGroup<LeaveForm> = this.initializeForm();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private leaveService: LeaveService,
    private employeeService: EmployeeService,
    private leaveTypeService: LeaveTypeService,
    private toastr: ToastrService
  ) {}

  initializeForm(): FormGroup<LeaveForm> {
    return this.fb.group({
      id: [0],
      employeeId: [
        this.authService.getCurrentSystemUserId(),
        [Validators.required],
      ],
      leaveTypeId: [null as number | null, [Validators.required]],
      fromDate: [new Date(''), [Validators.required]],
      toDate: [new Date(''), [Validators.required]],
      reason: [null as string | null, [Validators.required]],
      leaveStatus: [LeaveStatus.PENDING],
      deniedReason: [null as string | null],
      reviewedBy: [null as number | null],
      dateWiseLeaves: this.fb.array([] as FormGroup<DateWiseLeaveForm>[]),
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.leaveForm.controls.fromDate.setValue(params['date']);
      this.leaveForm.controls.toDate.setValue(params['date']);
    });
    this.getAllEmployees();
    this.getLeaveTypes();
  }

  removeDateWiseLeave(index: number) {
    this.leaveForm.controls.dateWiseLeaves.removeAt(index);
    this.setDataSource();
    this.onLeaveTypeChanged(
      this.leaveForm.controls.leaveTypeId.value as number
    );
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
      this.onLeaveTypeChanged(
        this.leaveForm.controls.leaveTypeId.value as number
      );
    }
  }
  createDateWiseLeave(date: Date): FormGroup<DateWiseLeaveForm> {
    return this.fb.group({
      id: [0],
      leaveId: [0],
      date: [{ value: date, disabled: true }, [Validators.required]],
      leaveDayType: [LeaveDayType.FULL_DAY, [Validators.required]],
      leaveHalfDayType: [null as LeaveHalfDayType | null],
      leaveQuarterDayType: [null as LeaveQuarterDayType | null],
    });
  }
  getLeaveTypes() {
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
        console.log(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.leaveForm.valid) {
      this.leaveService
        .createLeave(this.leaveForm.getRawValue() as Leave)
        .subscribe({
          next: (res) => {
            this.toastr.success(res.message);
            this.selectedLeaveType = null;
            this.leaveForm.controls.leaveStatus.setValue(LeaveStatus.PENDING);
            this.leaveForm.controls.dateWiseLeaves.clear();
            formDirective.resetForm();
            this.setDataSource();
            this.initializeForm();
          },
          error: (error) => {
            this.toastr.error(error.error.message ?? error.message);
          },
        });
    }
  }
}
