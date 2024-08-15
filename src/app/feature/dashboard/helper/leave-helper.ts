import { LeaveDayType } from '../constant/leave';
import { LeaveCalculation } from '../models/leave-calculation';
import { Leave } from '../models/schemas/leave';
import { LeaveAvailability } from '../models/schemas/leave-availability';
import { LeaveType } from '../models/schemas/leave-type';

export const getLeaveCountOfLeave = (leave: Leave): number =>
  leave.dateWiseLeaves.reduce((count, day) => {
    const leaveValueMap = {
      [LeaveDayType.FULL_DAY]: 1,
      [LeaveDayType.HALF_DAY]: 0.5,
      [LeaveDayType.QUARTER_DAY]: 0.25,
    };
    return count + (leaveValueMap[day.leaveDayType] || 0);
  }, 0);

export const leaveCalculation = (
  leave: Leave,
  leaveType: LeaveType
): LeaveCalculation => {
  const balanceCount: number = (
    leaveType.leaveAvailabilities.find(
      (x) => x.leaveTypeId === leave.leaveTypeId
    ) as LeaveAvailability
  ).balanceCount;
  const currentlyBooked: number = getLeaveCountOfLeave(leave);
  return {
    currentBalance: balanceCount,
    currentlyBooked: currentlyBooked,
    balanceAfterBooked: balanceCount - currentlyBooked,
  };
};
