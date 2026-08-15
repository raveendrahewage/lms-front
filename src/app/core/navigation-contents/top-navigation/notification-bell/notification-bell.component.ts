import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../feature/dashboard/services/notification.service';
import { Notification } from '../../../../feature/dashboard/models/schemas/notification';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  isOpen: boolean = false;

  private subs = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.notificationService.startConnection();

    this.subs.add(
      this.notificationService.notifications$.subscribe((data: Notification[]) => {
        this.notifications = data;
      })
    );

    this.subs.add(
      this.notificationService.unreadCount$.subscribe((count: number) => {
        this.unreadCount = count;
      })
    );
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  onNotificationClick(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.isRead = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      });
    }

    if (notification.targetUrl) {
      this.router.navigateByUrl(notification.targetUrl);
    }
    this.isOpen = false;
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach((n) => (n.isRead = true));
      this.unreadCount = 0;
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}