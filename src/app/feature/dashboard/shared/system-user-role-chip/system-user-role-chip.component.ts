import { Component, Input } from '@angular/core';
import { SystemRole, SystemRoleId } from '../../constant/system-user-roles';
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

  getUserClass(): string {
    switch (this.role) {
      case SystemRoleId.ADMIN:
        return 'bg-[darkgoldenrod]';
      case SystemRoleId.USER:
        return 'bg-[darkseagreen]';
    }
  }

  getUserText(): string {
    switch (this.role) {
      case SystemRoleId.ADMIN:
        return 'Admin';
      case SystemRoleId.USER:
        return 'User';
    }
  }

  getUserIcon(): string {
    switch (this.role) {
      case SystemRoleId.ADMIN:
        return 'admin_panel_settings';
      case SystemRoleId.USER:
        return 'person';
    }
  }
}
