import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-leaverequest-main',
  standalone: true,
  imports: [MatIcon, RouterModule],
  templateUrl: './event-main.component.html',
  styleUrls: ['./event-main.component.css'],
})
export class EventMainComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit() {}
}
