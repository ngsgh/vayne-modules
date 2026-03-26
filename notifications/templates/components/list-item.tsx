"use client";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { NOTIFICATION_ICON_MAP } from "@/components/notification-bell";
import { NOTIFICATION_TYPE_LABELS } from "@/types/notification";
import type { Notification } from "@/types/notification";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface NotificationListItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

export function NotificationListItem({
  notification,
  onMarkRead,
}: NotificationListItemProps) {
  const router = useRouter();
  const Icon = NOTIFICATION_ICON_MAP[notification.type];

  const handleClick = () => {
    if (!notification.read) onMarkRead(notification.id);
    if (notification.link) router.push(notification.link);
  };

  return (
    <Card
      className={`flex-row items-center gap-4 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50 ${
        notification.read ? "" : "bg-primary/5 ring-primary/20"
      }`}
      onClick={handleClick}
    >
      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-muted shrink-0">
        <Icon size={16} className="text-muted-foreground" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Badge variant="secondary">
            {NOTIFICATION_TYPE_LABELS[notification.type]}
          </Badge>
          {notification.read ? null : (
            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          )}
        </div>
        <p className="text-sm font-medium">{notification.title}</p>
        <p className="text-sm text-muted-foreground">
          {notification.message}
        </p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
        {formatDate(notification.createdAt)}
      </span>
    </Card>
  );
}
