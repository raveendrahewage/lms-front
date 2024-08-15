import { Component, Input } from '@angular/core';
import { LeaveCalculation } from '../../models/leave-calculation';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-leave-calculation-bar',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './leave-calculation-bar.component.html',
  styleUrl: './leave-calculation-bar.component.css',
})
export class LeaveCalculationBarComponent {
  @Input() leaveCalculation!: LeaveCalculation;
}
