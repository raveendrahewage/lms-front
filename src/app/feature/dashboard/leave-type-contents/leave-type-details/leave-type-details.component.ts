import { AuthService } from './../../auth/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  FormGroup,
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
import { CommonModule } from '@angular/common';
import { LeaveTypeForm } from '../../models/forms';
import { DataRecordStatus } from '../../constant/data-record-status';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { StatusValue } from '../../models/status-toggle';
import { OptionToggleComponent } from '../../shared/option-toggle/option-toggle.component';
import { LeaveType } from '../../models/leave-type';
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
  templateUrl: './leave-type-details.component.html',
  styleUrls: ['./leave-type-details.component.css'],
})
export class LeaveTypeDetailsComponent implements OnInit {
  sub: any;
  dataRecordStatus: typeof DataRecordStatus = DataRecordStatus;
  leaveType: LeaveType = {} as LeaveType;
  leaveTypeUpdateForm: FormGroup<LeaveTypeForm> = this.fb.group({
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
  isEditable: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public authService: AuthService,
    private leaveTypeService: LeaveTypeService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.leaveTypeUpdateForm.disable();
    this.sub = this.route.params.subscribe((params) => {
      this.getLeaveTypeById(+params['id']);
    });
  }

  toggleMode(isEdit: boolean) {
    this.isEditable = isEdit;
    if (isEdit) this.leaveTypeUpdateForm.enable();
    else {
      this.patchLeaveTypeUpdateForm(this.leaveType);
      this.leaveTypeUpdateForm.disable();
    }
  }

  updateStatus(dataRecordStatus: DataRecordStatus) {
    this.leaveTypeUpdateForm.controls.status.patchValue(dataRecordStatus);
  }

  patchLeaveTypeUpdateForm(leaveType: LeaveType) {
    this.leaveTypeUpdateForm.patchValue(leaveType);
  }

  getLeaveTypeById(id: number) {
    this.leaveTypeService.getLeaveTypeById(id).subscribe({
      next: (res) => {
        this.leaveType = res.data;
        this.patchLeaveTypeUpdateForm(this.leaveType);
      },
      error: (error) => {
        console.error(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }

  onSubmit() {
    if (this.leaveTypeUpdateForm.valid) {
      const updateProfileData: LeaveType =
        this.leaveTypeUpdateForm.getRawValue() as LeaveType;
      this.leaveTypeService.updateLeaveType(updateProfileData).subscribe({
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
