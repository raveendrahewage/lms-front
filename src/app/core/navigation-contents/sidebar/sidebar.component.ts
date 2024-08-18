import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../service/sidebar.service';
import { RouterModule } from '@angular/router';
import { RouteLink } from '../../../feature/dashboard/models/route';
import { AuthService } from '../../../feature/dashboard/auth/auth.service';
import { sidebarRoutes } from '../../../feature/dashboard/constant/routes';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  isOpen = false;
  routes: RouteLink[] = this.getSidebarRoutes(this.authService.isAdmin());

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.sidebarService.change.subscribe((isOpen) => {
      this.isOpen = isOpen;
    });
  }

  getSidebarRoutes(isAdmin: boolean): RouteLink[] {
    return sidebarRoutes.filter((route) => isAdmin || !route.isAdminOnly);
  }
}
