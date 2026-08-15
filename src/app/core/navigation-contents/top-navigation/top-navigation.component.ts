import { AuthService } from './../../../feature/dashboard/auth/auth.service';
import { Component } from '@angular/core';
import { SidebarService } from '../service/sidebar.service';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav'; // Import for potential sidenav toggle
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { NotificationBellComponent } from './notification-bell/notification-bell.component';

@Component({
  selector: 'app-top-navigation',
  standalone: true,
  imports: [
    MatIcon,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    NotificationBellComponent,
  ],
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css'],
})
export class TopNavigationComponent {
  isLoggedIn: boolean = this.authService.isLoggedIn();

  constructor(
    private sideBarService: SidebarService,
    public authService: AuthService
  ) { }

  toggleSidebar() {
    this.sideBarService.toggle();
  }
}
