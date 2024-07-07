import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { SystemUser } from '../../models/system-user';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ProfileForm,
  ResetPasswordForm,
  ResetPasswordFormData,
} from '../../models/forms';
import { CustomValidators } from '../../helper/validators';
import { DataRecordStatus } from '../../constant/data-record-status';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../auth/auth.service';
import { SystemRole } from '../../constant/system-user-roles';
import { ToastrService } from 'ngx-toastr';
import { FormGroupDirective } from '@angular/forms';
import { SystemUserRoleChipComponent } from '../../shared/system-user-role-chip/system-user-role-chip.component';
import { OptionToggleComponent } from '../../shared/option-toggle/option-toggle.component';
import { StatusValue } from '../../models/status-toggle';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatSelectModule,
    RouterModule,
    SystemUserRoleChipComponent,
    OptionToggleComponent,
  ],
  providers: [EmployeeService],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent implements OnInit {
  dataRecordStatus: typeof DataRecordStatus = DataRecordStatus;
  systemRoles: typeof SystemRole = SystemRole;
  oldPasswordHide: boolean = true;
  newPasswordHide: boolean = true;
  confirmPasswordHide: boolean = true;
  isEdit: boolean = false;
  systemUser: SystemUser = {} as SystemUser;
  allEmployees: SystemUser[] = [];

  profileUpdateForm: FormGroup<ProfileForm> = this.fb.group({
    id: [0, [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phoneNumber: ['', [CustomValidators.phoneNumber]],
    email: ['', [Validators.required, Validators.email]],
    roleId: [
      { value: 0, disabled: !this.authService.isAdmin() },
      [Validators.required],
    ],
    status: [
      {
        value: DataRecordStatus.ACTIVE,
        disabled: !this.authService.isAdmin(),
      },
      [Validators.required],
    ],
    supervisorId: [
      {
        value: null as number | null,
        disabled: !this.authService.isAdmin(),
      },
    ],
  });
  resetPasswordForm: FormGroup<ResetPasswordForm> = this.fb.nonNullable.group(
    {
      oldPassword: ['', [Validators.required]],
      newPassword: [
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
      confirmPassword: [
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
    },
    {
      validators: CustomValidators.matchValidator(
        'newPassword',
        'confirmPassword'
      ),
    }
  );
  statuses: StatusValue[] = [
    {
      value: DataRecordStatus.ACTIVE,
      label: 'Active',
      color: '#0cbe8c',
    },
    {
      value: DataRecordStatus.INACTIVE,
      label: 'Inactive',
      color: 'darkgray',
    },
  ];

  constructor(
    public authService: AuthService,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.profileUpdateForm.disable();
    this.getUserInfo();
    this.getAllEmployees();
  }

  toggleMode(isEdit: boolean) {
    this.isEdit = isEdit;
    if (isEdit) {
      this.profileUpdateForm.enable();
      if (!this.authService.isAdmin()) {
        this.profileUpdateForm.controls.supervisorId.disable();
        this.profileUpdateForm.controls.status.disable();
      }
    } else {
      this.patchProfileUpdateForm(this.systemUser);
      this.profileUpdateForm.disable();
    }
  }

  patchProfileUpdateForm(systemUser: SystemUser) {
    this.profileUpdateForm.patchValue({
      id: systemUser.id,
      firstName: systemUser.firstName,
      lastName: systemUser.lastName,
      email: systemUser.email,
      phoneNumber: systemUser.phoneNumber || '',
      roleId: systemUser.roleId,
      status: systemUser.status,
    });
  }

  getUserInfo() {
    this.employeeService.getCurrentEmployee().subscribe({
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
      next: (data) => {
        this.allEmployees = data.data;
      },
      error: (error) => {
        console.log(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }
  updateStatus(dataRecordStatus: DataRecordStatus) {
    this.profileUpdateForm.controls.status.patchValue(dataRecordStatus);
  }

  resetPassword(formDirective: FormGroupDirective) {
    if (this.resetPasswordForm.valid) {
      const formData =
        this.resetPasswordForm.getRawValue() as unknown as ResetPasswordFormData;
      this.employeeService.resetPassword(formData).subscribe({
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

  updateProfile() {
    if (this.profileUpdateForm.valid) {
      const updateProfileData: SystemUser =
        this.profileUpdateForm.getRawValue() as SystemUser;
      this.employeeService.updateCurrentEmployee(updateProfileData).subscribe({
        next: (res) => {
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
