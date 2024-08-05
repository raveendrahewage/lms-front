import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DataRecordStatus } from '../constant/data-record-status';
import { SystemRoleId } from '../constant/system-user-roles';
import {
  LeaveDayType,
  LeaveHalfDayType,
  LeaveQuarterDayType,
} from '../constant/leave';
import { LeaveStatus } from '../constant/leave-status';
import { EventStatus } from '../constant/event-status';
import { SystemUser } from './schemas/system-user';
import { EventMode } from '../constant/event-mode';

export interface SearchForm {
  searchTerm: FormControl<string>;
}

export interface SignInForm {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ResetPasswordForm {
  oldPassword: FormControl<string>;
  newPassword: FormControl<string>;
  confirmPassword: FormControl<string>;
}

export interface ResetPasswordFormData {
  token: string;
  oldPassword: string;
  newPassword: string;
}

export interface ProfileForm {
  id: FormControl<number | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  email: FormControl<string | null>;
  roleId: FormControl<SystemRoleId | null>;
  status: FormControl<DataRecordStatus | null>;
  supervisorId: FormControl<number | null>;
}

export interface LeaveAvailabilityForm {
  year: FormControl<number | null>;
  systemUserId: FormControl<number | null>;
  leaveTypeId: FormControl<number | null>;
  leaveCount: FormControl<number | null>;
  bookedCount: FormControl<number | null>;
  balanceCount: FormControl<number | null>;
}

export interface NewEmployeeForm extends ProfileForm {
  password: FormControl<string | null>;
  employeesUnderSupervision: FormControl<SystemUser[] | null>;
  leaveAvailabilities: FormArray<FormGroup<LeaveAvailabilityForm>>;
}
export interface UpdateEmployeeForm extends ProfileForm {
  employeesUnderSupervision: FormControl<SystemUser[] | null>;
  leaveAvailabilities: FormArray<FormGroup<LeaveAvailabilityForm>>;
}

export interface LeaveForm {
  id: FormControl<number | null>;
  employeeId: FormControl<number | null>;
  leaveTypeId: FormControl<number | null>;
  fromDate: FormControl<Date | null>;
  toDate: FormControl<Date | null>;
  reason: FormControl<string | null>;
  leaveStatus: FormControl<LeaveStatus | null>;
  deniedReason: FormControl<string | null>;
  reviewedBy: FormControl<number | null>;
  dateWiseLeaves: FormArray<FormGroup<DateWiseLeaveForm>>;
}

export interface DateWiseLeaveForm {
  id: FormControl<number | null>;
  leaveId: FormControl<number | null>;
  date: FormControl<Date | null>;
  leaveDayType: FormControl<LeaveDayType | null>;
  leaveHalfDayType: FormControl<LeaveHalfDayType | null>;
  leaveQuarterDayType: FormControl<LeaveQuarterDayType | null>;
}

export interface LeaveTypeForm {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  defaultLeaveCount: FormControl<number | null>;
  status: FormControl<DataRecordStatus | null>;
}

export interface EventForm {
  id: FormControl<number | null>;
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
  eventStatus: FormControl<EventStatus | null>;
  eventMode: FormControl<EventMode | null>;
}
