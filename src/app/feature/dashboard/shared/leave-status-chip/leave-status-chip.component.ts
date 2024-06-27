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
  leaveSatus: typeof LeaveStatus = LeaveStatus;
}
