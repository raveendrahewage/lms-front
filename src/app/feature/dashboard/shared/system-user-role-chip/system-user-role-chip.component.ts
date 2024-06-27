import { Component, Input } from '@angular/core';
import { SystemRoleId } from '../../constant/system-user-roles';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-system-user-role-chip',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './system-user-role-chip.component.html',
  styleUrl: './system-user-role-chip.component.css',
})
export class SystemUserRoleChipComponent {
  @Input() role!: SystemRoleId;
  systemRoleId: typeof SystemRoleId = SystemRoleId;
}
