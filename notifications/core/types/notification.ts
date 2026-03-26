export type NotificationType = "comment" | "mention" | "system" | "push";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO date
  link?: string;
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  comment: "댓글",
  mention: "멘션",
  system: "시스템",
  push: "푸시",
};
