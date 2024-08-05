import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { Observable, concat, of, Subject, BehaviorSubject } from 'rxjs';
import { EmployeeService } from './../../services/employee.service';
import { Component, OnInit } from '@angular/core';
import { SystemUser } from '../../models/schemas/system-user';
import { NewSystemUser } from '../../models/new-system-user';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { LeaveAvailabilityForm, NewEmployeeForm } from '../../models/forms';
import { DataRecordStatus } from '../../constant/data-record-status';
import { AuthService } from '../../auth/auth.service';
import { CustomValidators } from '../../helper/validators';
import { ToastrService } from 'ngx-toastr';
import { SystemRoleId } from '../../constant/system-user-roles';
import { FormGroupDirective } from '@angular/forms';
import { StatusValue } from '../../models/status-toggle';
import { OptionToggleComponent } from '../../shared/option-toggle/option-toggle.component';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { LeaveTypeService } from '../../services/leave-type.service';
import { LeaveType } from '../../models/schemas/leave-type';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-manage',
  standalone: true,
  imports: [
    MatRadioModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatIcon,
    OptionToggleComponent,
    RouterModule,
    MatExpansionModule,
    MatTableModule,
  ],
  templateUrl: './employee-manage.component.html',
  styleUrls: ['./employee-manage.component.css'],
})
export class EmployeeManageComponent implements OnInit {
  dataRecordStatus: typeof DataRecordStatus = DataRecordStatus;
  leaveTypes: LeaveType[] = [];
  systemRoleId: typeof SystemRoleId = SystemRoleId;
  passwordHide: boolean = true;
  leaveAvailabilityDataSource = new BehaviorSubject<AbstractControl[]>([]);
  leaveAvailabilityColumns: string[] = [
    'option',
    'leaveTypeName',
    'leaveCount',
  ];
  supervisorEmployees: Observable<any> = new Observable();
  employeeSupervisor: SystemUser = {} as SystemUser;
  registerForm: FormGroup = new FormGroup({});
  employeesForSupervisionList: SystemUser[] = [];
  employeesForUnderSupervisonList: SystemUser[] = [];
  newEmployeeForm: FormGroup<NewEmployeeForm> = this.fb.group({
    id: [0, [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    password: [
      '',
      [
        Validators.required,
        CustomValidators.requiredLength(8),
        CustomValidators.requireDigit(),
        CustomValidators.requireNonAlphanumeric(),
        CustomValidators.requireUppercase(),
        CustomValidators.requireLowercase(),
      ],
    ],
    phoneNumber: ['', [CustomValidators.phoneNumber]],
    email: ['', [Validators.required, Validators.email]],
    roleId: [SystemRoleId.USER, [Validators.required]],
    status: [DataRecordStatus.ACTIVE, [Validators.required]],
    supervisorId: [null as number | null],
    employeesUnderSupervision: [[] as SystemUser[]],
    leaveAvailabilities: this.fb.array(
      [] as FormGroup<LeaveAvailabilityForm>[]
    ),
  });
  statuses: StatusValue[] = [
    {
      value: DataRecordStatus.ACTIVE,
      label: 'Active',
      color: '#0cbe8c',
      clickAction: () => this.updateStatus(DataRecordStatus.ACTIVE),
    },
    {
      value: DataRecordStatus.INACTIVE,
      label: 'Inactive',
      color: 'darkgray',
      clickAction: () => this.updateStatus(DataRecordStatus.INACTIVE),
    },
  ];
  roles: StatusValue[] = [
    {
      value: SystemRoleId.ADMIN,
      label: 'Admin',
      color: 'darkgoldenrod',
      clickAction: () => this.updateRole(SystemRoleId.ADMIN),
    },
    {
      value: SystemRoleId.USER,
      label: 'User',
      color: 'darkseagreen',
      clickAction: () => this.updateRole(SystemRoleId.USER),
    },
  ];

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private employeeService: EmployeeService,
    private leaveTypeService: LeaveTypeService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getAllEmployees();
    this.getLeaveTypes();
  }

  getLeaveTypeName(leaveTypeId: number): string {
    const leaveType = this.leaveTypes.find((type) => type.id === leaveTypeId);
    return leaveType ? leaveType.name : '';
  }

  employeeCompairerForUnderSupervisionList(
    option: SystemUser,
    value: SystemUser
  ): boolean {
    return option.id === value.id;
  }

  updateStatus(status: DataRecordStatus) {
    this.newEmployeeForm.controls.status.patchValue(status);
  }
  updateRole(sytemRole: SystemRoleId) {
    this.newEmployeeForm.controls.roleId.patchValue(sytemRole);
  }

  setLeaveAvailabilityDataSource() {
    this.leaveAvailabilityDataSource.next(
      this.newEmployeeForm.controls.leaveAvailabilities.controls
    );
  }

  removeLeaveAvailability(index: number) {
    this.newEmployeeForm.controls.leaveAvailabilities.removeAt(index);
    this.setLeaveAvailabilityDataSource();
  }

  onLeaveTypeSelectionChanged(leaveTypes: LeaveType[]) {
    this.newEmployeeForm.controls.leaveAvailabilities.clear();
    for (let i = 0; i < leaveTypes.length; i++) {
      this.newEmployeeForm.controls.leaveAvailabilities.push(
        this.createLeaveAvailability(leaveTypes[i])
      );
    }
    this.setLeaveAvailabilityDataSource();
  }

  createLeaveAvailability(
    leaveType: LeaveType
  ): FormGroup<LeaveAvailabilityForm> {
    return this.fb.group({
      year: [new Date().getFullYear(), [Validators.required]],
      systemUserId: [this.authService.getCurrentSystemUserId()],
      leaveTypeId: [leaveType.id, [Validators.required]],
      leaveCount: [
        leaveType.defaultLeaveCount,
        [Validators.required, Validators.min(1)],
      ],
      bookedCount: [0],
      balanceCount: [0],
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
        this.employeesForSupervisionList = res.data.filter(
          (emp) => emp.roleId != SystemRoleId.ADMIN
        );
        this.employeesForUnderSupervisonList = res.data.filter(
          (emp) => emp.roleId != SystemRoleId.ADMIN
        );
      },
      error: (error) => {
        console.log(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }

  createEmployee(formDirective: FormGroupDirective) {
    if (this.newEmployeeForm.valid) {
      const newEmployeeData: NewSystemUser =
        this.newEmployeeForm.getRawValue() as NewSystemUser;
      this.employeeService.createEmployee(newEmployeeData).subscribe({
        next: (res) => {
          formDirective.resetForm();
          this.newEmployeeForm.controls.roleId.setValue(SystemRoleId.USER);
          this.newEmployeeForm.controls.status.setValue(
            DataRecordStatus.ACTIVE
          );
          this.toastr.success(res.message);
        },
        error: (error) => {
          console.log(error.error.message ?? error.message);
          this.toastr.error(error.error.message ?? error.message);
        },
      });
    }
  }
}
