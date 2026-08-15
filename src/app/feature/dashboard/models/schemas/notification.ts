import { NotificationType } from "../../constant/notification-status";

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    targetUrl?: string;
    isRead: boolean;
    createdDate: string;
}

export interface NotificationResponse {
    notifications: Notification[];
    unreadCount: number;
}