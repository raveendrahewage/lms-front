import { Component } from '@angular/core';
import { DashboardCalendarComponent } from '../dashboard-contents/calendar-contents/dashboard-calendar/dashboard-calendar.component';

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [DashboardCalendarComponent],
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.css',
})
export class DashboardMainComponent {}
