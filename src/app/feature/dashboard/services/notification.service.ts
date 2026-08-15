import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Notification, NotificationResponse } from '../models/schemas/notification';
import { CookieService } from 'ngx-cookie-service';
import { Constant } from '../constant/constant';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  public startConnection(): void {
    const token = this.cookieService.get(Constant.TOKEN_COOKIE_NAME);

    if (!token) {
      console.warn('SignalR: No access token found. Connection aborted.');
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl, {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR: Connected to LeaveNotificationHub');
        this.registerNotificationListener();
        this.fetchInitialNotifications();
      })
      .catch((err) => console.error('SignalR Connection Error: ', err));
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => console.log('SignalR: Disconnected'));
    }
  }

  private registerNotificationListener(): void {
    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      console.log('Real-time notification received:', notification);

      const currentList = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...currentList]);

      this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
    });
  }

  public fetchInitialNotifications(take: number = 10): void {
    this.http.get<ApiResponse<NotificationResponse>>(`${environment.apiUrl}/notifications?take=${take}`)
      .subscribe({
        next: (res) => {
          this.notificationsSubject.next(res.data.notifications);
          this.unreadCountSubject.next(res.data.unreadCount);
        },
        error: (err) => console.error('Failed to load notifications', err)
      });
  }

  public markAsRead(id: number): Observable<ApiResponse<Notification[]>> {
    return this.http.put<ApiResponse<Notification[]>>(`${environment.apiUrl}/notifications/read/${id}`, {});
  }

  public markAllAsRead(): Observable<ApiResponse<Notification[]>> {
    return this.http.put<ApiResponse<Notification[]>>(`${environment.apiUrl}/notifications/read-all`, {});
  }
}