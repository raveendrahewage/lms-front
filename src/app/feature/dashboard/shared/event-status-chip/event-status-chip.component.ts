import { Component, Input } from '@angular/core';
import { EventStatus } from '../../constant/event-status';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-status-chip',
  standalone: true,
  imports: [],
  templateUrl: './event-status-chip.component.html',
  styleUrl: './event-status-chip.component.css',
})
export class EventStatusChipComponent {
  @Input() event!: Event;
  today: Date = new Date();

  getStatusClass(): string {
    const eventStatus: EventStatus = this.event.eventStatus;
    const startDate: Date = new Date(this.event.startDate);
    const endDate: Date = new Date(this.event.endDate);

    if (eventStatus === EventStatus.CANCELED) {
      return 'bg-red-400';
    }

    if (eventStatus === EventStatus.ACTIVE) {
      if (startDate > this.today) {
        return 'bg-blue-400';
      } else if (startDate <= this.today && endDate >= this.today) {
        return 'bg-green-400';
      } else if (endDate < this.today) {
        return 'bg-gray-400';
      }
    }

    return '';
  }

  getStatusText(): string {
    const eventStatus: EventStatus = this.event.eventStatus;
    const startDate: Date = new Date(this.event.startDate);
    const endDate: Date = new Date(this.event.endDate);

    if (eventStatus === EventStatus.CANCELED) {
      return 'Canceled';
    }

    if (eventStatus === EventStatus.ACTIVE) {
      if (startDate > this.today) {
        return 'Up Coming';
      } else if (startDate <= this.today && endDate >= this.today) {
        return 'On Going';
      } else if (endDate < this.today) {
        return 'Closed';
      }
    }

    return '';
  }
}
