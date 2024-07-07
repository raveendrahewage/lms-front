import { AuthService } from './../../auth/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeeService } from './../../services/employee.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SystemUser } from '../../models/system-user';
import { CommonModule } from '@angular/common';
import { SystemRole } from '../../constant/system-user-roles';
import { ProfileForm } from '../../models/forms';
import { CustomValidators } from '../../helper/validators';
import { DataRecordStatus } from '../../constant/data-record-status';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { StatusValue } from '../../models/status-toggle';
import { OptionToggleComponent } from '../../shared/option-toggle/option-toggle.component';

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
  ],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
})
export class EmployeeDetailsComponent implements OnInit {
  sub: any;
  systemRoles: typeof SystemRole = SystemRole;
  dataRecordStatus: typeof DataRecordStatus = DataRecordStatus;
  allEmployees: SystemUser[] = [];
  systemUser: SystemUser = {} as SystemUser;
  profileUpdateForm: FormGroup<ProfileForm> = this.fb.group({
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
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.profileUpdateForm.disable();
    this.sub = this.route.params.subscribe((params) => {
      this.getEmployeeById(+params['id']);
    });
    this.getAllEmployees();
  }

  toggleMode(isEditable: boolean) {
    this.isEditable = isEditable;
    if (isEditable) {
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

  updateStatus(dataRecordStatus: DataRecordStatus) {
    this.profileUpdateForm.controls.status.patchValue(dataRecordStatus);
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
      supervisorId: systemUser.supervisorId,
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
        this.allEmployees = res.data;
      },
      error: (error) => {
        console.log(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }

  onSubmit() {
    if (this.profileUpdateForm.valid) {
      const updateProfileData: SystemUser =
        this.profileUpdateForm.getRawValue() as SystemUser;
      this.employeeService.updateEmployee(updateProfileData).subscribe({
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
