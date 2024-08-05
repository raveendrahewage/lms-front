import { AuthService } from './../../auth/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  FormGroupDirective,
} from '@angular/forms';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { LeaveTypeForm } from '../../models/forms';
import { DataRecordStatus } from '../../constant/data-record-status';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { StatusValue } from '../../models/status-toggle';
import { OptionToggleComponent } from '../../shared/option-toggle/option-toggle.component';
import { LeaveType } from '../../models/schemas/leave-type';
import { LeaveTypeService } from '../../services/leave-type.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatRadioModule,
    CommonModule,
    RouterModule,
    MatButtonToggleModule,
    OptionToggleComponent,
  ],
  templateUrl: './leave-type-manage.component.html',
  styleUrls: ['./leave-type-manage.component.css'],
})
export class LeaveTypeManageComponent {
  dataRecordStatus: typeof DataRecordStatus = DataRecordStatus;
  newLeaveTypeForm: FormGroup<LeaveTypeForm> = this.fb.group({
    id: [0, [Validators.required]],
    name: ['', [Validators.required]],
    defaultLeaveCount: [0, [Validators.required]],
    status: [DataRecordStatus.ACTIVE, [Validators.required]],
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

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private leaveTypeService: LeaveTypeService,
    private toastr: ToastrService
  ) {}

  updateStatus(dataRecordStatus: DataRecordStatus) {
    this.newLeaveTypeForm.controls.status.patchValue(dataRecordStatus);
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.newLeaveTypeForm.valid) {
      const updateProfileData: LeaveType =
        this.newLeaveTypeForm.getRawValue() as LeaveType;
      this.leaveTypeService.createLeaveType(updateProfileData).subscribe({
        next: (res) => {
          formDirective.resetForm();
          this.newLeaveTypeForm.controls.status.setValue(
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
