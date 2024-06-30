import { Component, Input } from '@angular/core';
import { DataRecordStatus } from '../../constant/data-record-status';

@Component({
  selector: 'app-data-record-status-chip',
  standalone: true,
  imports: [],
  templateUrl: './data-record-status-chip.component.html',
  styleUrl: './data-record-status-chip.component.css',
})
export class DataRecordStatusChipComponent {
  @Input() status!: DataRecordStatus;

  getStatusClass(): string {
    switch (this.status) {
      case DataRecordStatus.ACTIVE:
        return 'bg-[#2fa1ff]';
      case DataRecordStatus.INACTIVE:
        return 'bg-gray-400';
      case DataRecordStatus.DELETED:
        return 'bg-red-400';
      default:
        return '';
    }
  }

  getStatusText(): string {
    switch (this.status) {
      case DataRecordStatus.ACTIVE:
        return 'Active';
      case DataRecordStatus.INACTIVE:
        return 'Inactive';
      case DataRecordStatus.DELETED:
        return 'Deleted';
      default:
        return '';
    }
  }
}
