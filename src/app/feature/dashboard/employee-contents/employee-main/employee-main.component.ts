import { RouterModule } from '@angular/router';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employee-main',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './employee-main.component.html',
  styleUrls: ['./employee-main.component.css'],
})
export class EmployeeMainComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit() {}
}
