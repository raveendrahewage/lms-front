import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification, NotificationResponse } from '../models/schemas/notification';
import { CookieService } from 'ngx-cookie-service';
import { Constant } from '../constant/constant';
import { ApiResponse } from '../models/api-response';
import { JobStatusResponse } from '../models/schemas/pdf-response';
import { NotificationType } from '../constant/notification-status';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private pdfCompletedSubject$ = new BehaviorSubject<Notification | null>(null);
  public pdfCompleted$ = this.pdfCompletedSubject$.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  public startConnection(): void {
    const token = this.cookieService.get(Constant.TOKEN_COOKIE_NAME);

    if (!token) {
      console.warn('SignalR: No access token found. Connection aborted.');
      return;
    }

    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(Constant.HUB_URL, {
        accessTokenFactory: () => token,
        withCredentials: true,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // 1. REGISTER LISTENERS BEFORE STARTING CONNECTION
    this.registerNotificationListener();

    this.hubConnection.onreconnected(() => {
      console.log('SignalR: Reconnected. Re-registering listeners...');
      this.registerNotificationListener();
    });

    // 2. START CONNECTION
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR: Connected to NotificationHub');
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
    this.hubConnection.off('ReceiveNotification');
    this.hubConnection.off('PdfCompleted');

    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      console.log('Real-time notification received:', notification);
      const currentList = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...currentList]);
      this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
    });

    this.hubConnection.on('PdfCompleted', (notification: string) => {
      console.log('PDF Completed Event Received:', notification);

      const parsedNotification: Notification = JSON.parse(notification);
      const currentList = this.notificationsSubject.value;
      this.notificationsSubject.next([parsedNotification, ...currentList]);

      this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
      this.pdfCompletedSubject$.next(parsedNotification);
    });
  }

  public fetchInitialNotifications(take: number = 10): void {
    this.http.get<ApiResponse<NotificationResponse>>(`${Constant.API_ENDPOINT}/notifications?take=${take}`)
      .subscribe({
        next: (res) => {
          this.notificationsSubject.next(res.data.notifications);
          this.unreadCountSubject.next(res.data.unreadCount);
        },
        error: (err) => console.error('Failed to load notifications', err)
      });
  }

  public markAsRead(id: number): Observable<ApiResponse<Notification[]>> {
    return this.http.put<ApiResponse<Notification[]>>(`${Constant.API_ENDPOINT}/notifications/read/${id}`, {});
  }

  public markAllAsRead(): Observable<ApiResponse<Notification[]>> {
    return this.http.put<ApiResponse<Notification[]>>(`${Constant.API_ENDPOINT}/notifications/read-all`, {});
  }
}