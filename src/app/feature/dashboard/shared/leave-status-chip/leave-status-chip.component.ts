import { Component, Input } from '@angular/core';
import { LeaveStatus } from '../../constant/leave-status';

@Component({
  selector: 'app-leave-status-chip',
  standalone: true,
  imports: [],
  templateUrl: './leave-status-chip.component.html',
  styleUrl: './leave-status-chip.component.css',
})
export class LeaveStatusChipComponent {
  @Input() status!: LeaveStatus;

  getStatusClass(): string {
    switch (this.status) {
      case LeaveStatus.PENDING:
        return 'bg-[#2fa1ff]';
      case LeaveStatus.CANCELED:
        return 'bg-gray-400';
      case LeaveStatus.DENIED:
        return 'bg-red-400';
      case LeaveStatus.APPROVED:
        return 'bg-green-400';
      default:
        return '';
    }
  }

  getStatusText(): string {
    switch (this.status) {
      case LeaveStatus.PENDING:
        return 'Pending';
      case LeaveStatus.CANCELED:
        return 'Canceled';
      case LeaveStatus.DENIED:
        return 'Denied';
      case LeaveStatus.APPROVED:
        return 'Approved';
      default:
        return '';
    }
  }
}
