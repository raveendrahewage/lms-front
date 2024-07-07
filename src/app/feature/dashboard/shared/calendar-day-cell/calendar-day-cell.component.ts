import { Component, Input } from '@angular/core';
import { CalendarDay } from '../../models/calendar-event';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { CalendarEventTileComponent } from '../calendar-event-tile/calendar-event-tile.component';
import { AuthService } from '../../auth/auth.service';
import { isWeekend } from 'date-fns';

@Component({
  selector: 'app-calendar-day-cell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIcon,
    CalendarModule,
    CalendarEventTileComponent,
  ],
  templateUrl: './calendar-day-cell.component.html',
  styleUrl: './calendar-day-cell.component.css',
})
export class CalendarDayCellComponent {
  @Input() day!: CalendarDay;
  @Input() locale!: string;

  constructor(public authService: AuthService) {}

  isWeekend(): boolean {
    return isWeekend(this.day.date);
  }
}
