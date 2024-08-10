import { AuthService } from './../../auth/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeeService } from './../../services/employee.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SystemUser } from '../../models/schemas/system-user';
import { CommonModule } from '@angular/common';
import { SystemRole, SystemRoleId } from '../../constant/system-user-roles';
import {
  LeaveAvailabilityForm,
  NewEmployeeForm,
  ProfileForm,
  UpdateEmployeeForm,
} from '../../models/forms';
import { CustomValidators } from '../../helper/validators';
import { DataRecordStatus } from '../../constant/data-record-status';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { StatusValue } from '../../models/status-toggle';
import { OptionToggleComponent } from '../../shared/option-toggle/option-toggle.component';
import { BehaviorSubject } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { LeaveType } from '../../models/schemas/leave-type';
import { LeaveTypeService } from '../../services/leave-type.service';
import { LeaveAvailability } from '../../models/schemas/leave-availability';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatRadioModule,
    MatSelectModule,
    CommonModule,
    RouterModule,
    MatButtonToggleModule,
    OptionToggleComponent,
    MatTableModule,
  ],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
})
export class EmployeeDetailsComponent implements OnInit {
  sub: any;
  employeeId: number = 0;
  leaveAvailabilities: number[] = [];
  systemRoles: typeof SystemRole = SystemRole;
  dataRecordStatus: typeof DataRecordStatus = DataRecordStatus;
  employeesForSupervisionList: SystemUser[] = [];
  leaveTypes: LeaveType[] = [];
  employeesForUnderSupervisonList: SystemUser[] = [];
  systemUser: SystemUser = {} as SystemUser;
  leaveAvailabilityDataSource = new BehaviorSubject<AbstractControl[]>([]);
  leaveAvailabilityColumns: string[] = [
    'option',
    'leaveTypeName',
    'leaveCount',
  ];
  employeeUpdateForm: FormGroup<UpdateEmployeeForm> = this.fb.group({
    id: [0, [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phoneNumber: ['', [CustomValidators.phoneNumber]],
    email: ['', [Validators.required, Validators.email]],
    roleId: [{ value: 0, disabled: true }, [Validators.required]],
    status: [
      {
        value: DataRecordStatus.ACTIVE,
        disabled: !this.authService.isAdmin(),
      },
      [Validators.required],
    ],
    supervisorId: [
      {
        value: 0,
        disabled: !this.authService.isAdmin(),
      },
    ],
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
  isEditable: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public authService: AuthService,
    private employeeService: EmployeeService,
    private leaveTypeService: LeaveTypeService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.employeeUpdateForm.disable();
    this.employeeUpdateForm.controls.leaveAvailabilities.disable();
    this.sub = this.route.params.subscribe((params) => {
      this.employeeId = +params['id'];
      this.getEmployeeById(+params['id']);
    });
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

  leaveTypeCompairerForLeaveAvailabilities(
    option: LeaveType,
    value: number
  ): boolean {
    return option.id === value;
  }

  toggleMode(isEditable: boolean) {
    this.isEditable = isEditable;
    if (isEditable) {
      this.employeeUpdateForm.enable();
      if (!this.authService.isAdmin()) {
        this.employeeUpdateForm.controls.supervisorId.disable();
        this.employeeUpdateForm.controls.status.disable();
        this.employeeUpdateForm.controls.employeesUnderSupervision.disable();
        this.employeeUpdateForm.controls.leaveAvailabilities.disable();
      }
    } else {
      this.patchProfileUpdateForm(this.systemUser);
      this.employeeUpdateForm.disable();
    }
  }

  createEmployeeUnderSupervisonForm(
    systemUser: SystemUser
  ): FormGroup<ProfileForm> {
    return this.fb.group({
      id: [systemUser.id, [Validators.required]],
      firstName: [systemUser.firstName],
      lastName: [systemUser.lastName],
      email: [systemUser.email],
      phoneNumber: [systemUser.phoneNumber || ''],
      roleId: [systemUser.roleId as SystemRoleId],
      status: [systemUser.status as DataRecordStatus],
      supervisorId: [systemUser.supervisorId as number | null],
    });
  }

  updateStatus(dataRecordStatus: DataRecordStatus) {
    this.employeeUpdateForm.controls.status.patchValue(dataRecordStatus);
  }

  patchProfileUpdateForm(systemUser: SystemUser) {
    this.employeeUpdateForm.patchValue(systemUser);
    this.employeeUpdateForm.controls.leaveAvailabilities.clear();
    this.leaveAvailabilities = [];
    for (let i = 0; i < systemUser.leaveAvailabilities.length; i++) {
      this.leaveAvailabilities.push(
        systemUser.leaveAvailabilities[i].leaveTypeId
      );
      this.employeeUpdateForm.controls.leaveAvailabilities.push(
        this.createLeaveAvailability(systemUser.leaveAvailabilities[i])
      );
    }
    this.setLeaveAvailabilityDataSource();
  }

  setLeaveAvailabilityDataSource() {
    this.leaveAvailabilityDataSource.next(
      this.employeeUpdateForm.controls.leaveAvailabilities.controls
    );
  }

  removeLeaveAvailability(index: number) {
    this.employeeUpdateForm.controls.leaveAvailabilities.removeAt(index);
    this.setLeaveAvailabilityDataSource();
  }

  onLeaveTypeSelectionChanged(leaveTypes: LeaveType[]) {
    this.employeeUpdateForm.controls.leaveAvailabilities.clear();
    for (let i = 0; i < leaveTypes.length; i++) {
      this.employeeUpdateForm.controls.leaveAvailabilities.push(
        this.createLeaveAvailability({
          year: new Date().getFullYear(),
          leaveTypeId: leaveTypes[i].id,
          leaveCount: leaveTypes[i].defaultLeaveCount,
          balanceCount: 0,
          bookedCount: 0,
          systemUserId: this.employeeId,
        } as LeaveAvailability)
      );
    }
    this.setLeaveAvailabilityDataSource();
  }

  createLeaveAvailability(
    leaveAvailability: LeaveAvailability
  ): FormGroup<LeaveAvailabilityForm> {
    return this.fb.group({
      year: [leaveAvailability.year, [Validators.required]],
      systemUserId: [leaveAvailability.systemUserId],
      leaveTypeId: [leaveAvailability.leaveTypeId, [Validators.required]],
      leaveCount: [
        { value: leaveAvailability.leaveCount, disabled: !this.isEditable },
        [Validators.required, Validators.min(1)],
      ],
      bookedCount: [leaveAvailability.bookedCount],
      balanceCount: [leaveAvailability.balanceCount],
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

  getEmployeeById(id: number) {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (res) => {
        this.systemUser = res.data;
        this.patchProfileUpdateForm(this.systemUser);
      },
      error: (error) => {
        console.error(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res) => {
        this.employeesForSupervisionList = res.data.filter(
          (emp) =>
            emp.roleId != SystemRoleId.ADMIN &&
            emp.id != this.systemUser.id &&
            !this.systemUser.employeesUnderSupervision?.some(
              (e) => e.id == emp.id
            )
        );
        this.employeesForUnderSupervisonList = res.data.filter(
          (emp) =>
            emp.roleId != SystemRoleId.ADMIN &&
            emp.id != this.systemUser.id &&
            emp.id != this.systemUser.supervisorId
        );
      },
      error: (error) => {
        console.log(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }

  onSubmit() {
    if (this.employeeUpdateForm.valid) {
      const updateProfileData: SystemUser =
        this.employeeUpdateForm.getRawValue() as SystemUser;
      this.employeeService.updateEmployee(updateProfileData).subscribe({
        next: (res) => {
          this.systemUser = res.data;
          this.toastr.success(res.message);
        },
        error: (error) => {
          console.log(error.error.message ?? error.message);
          this.toastr.error(error.error.message ?? error.message);
        },
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
