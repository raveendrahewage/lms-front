import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { Observable, concat, of, Subject } from 'rxjs';
import { EmployeeService } from './../../services/employee.service';
import { Component, OnInit } from '@angular/core';
import { NewSystemUser, SystemUser } from '../../models/system-user';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { NewEmployeeForm } from '../../models/forms';
import { DataRecordStatus } from '../../constant/data-record-status';
import { AuthService } from '../../auth/auth.service';
import { CustomValidators } from '../../helper/validators';
import { ToastrService } from 'ngx-toastr';
import { SystemRoleId } from '../../constant/system-user-roles';
import { FormGroupDirective } from '@angular/forms';
import { StatusValue } from '../../models/status-toggle';
import { OptionToggleComponent } from '../../shared/option-toggle/option-toggle.component';

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
  ],
  templateUrl: './employee-manage.component.html',
  styleUrls: ['./employee-manage.component.css'],
})
export class EmployeeManageComponent implements OnInit {
  dataRecordStatus: typeof DataRecordStatus = DataRecordStatus;
  systemRoleId: typeof SystemRoleId = SystemRoleId;
  phide: boolean = true;
  has_error = false;
  create_employee_msg: string = '';

  supervisorEmployees: Observable<any> = new Observable();
  employeeinput$ = new Subject<string>();
  employeeSupervisor: SystemUser = {} as SystemUser;
  isSelectLoading = false;

  submitted = false;
  registerForm: FormGroup = new FormGroup({});
  allEmployees: SystemUser[] = [];
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
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getAllEmployees();
  }

  updateStatus(status: DataRecordStatus) {
    this.newEmployeeForm.controls.status.patchValue(status);
  }
  updateRole(sytemRole: SystemRoleId) {
    this.newEmployeeForm.controls.roleId.patchValue(sytemRole);
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.allEmployees = data.data;
      },
      error: (error) => {
        console.log(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  createEmployee(formDirective: FormGroupDirective) {
    if (this.newEmployeeForm.valid) {
      const newEmployeeData: NewSystemUser =
        this.newEmployeeForm.getRawValue() as NewSystemUser;
      this.employeeService.createEmployee(newEmployeeData).subscribe({
        next: (res) => {
          formDirective.resetForm();
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
