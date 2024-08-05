import { Component, Input } from '@angular/core';
import { EventMode } from '../../constant/event-mode';
import { Event } from '../../models/schemas/event';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-event-mode-chip',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './event-mode-chip.component.html',
  styleUrl: './event-mode-chip.component.css',
})
export class EventModeChipComponent {
  @Input() event!: Event;

  getModeClass(): string {
    switch (this.event.eventMode) {
      case EventMode.PUBLIC:
        return 'bg-[cadetblue]';
      case EventMode.PRIVATE:
        return 'bg-[darkgray]';
    }
  }

  getModeText(): string {
    switch (this.event.eventMode) {
      case EventMode.PUBLIC:
        return 'Public';
      case EventMode.PRIVATE:
        return 'Private';
    }
  }

  getModeIcon(): string {
    switch (this.event.eventMode) {
      case EventMode.PUBLIC:
        return 'public';
      case EventMode.PRIVATE:
        return 'lock';
    }
  }
}
