import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-leave-type-main',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './leave-type-main.component.html',
  styleUrl: './leave-type-main.component.css',
})
export class LeaveTypeMainComponent {}
