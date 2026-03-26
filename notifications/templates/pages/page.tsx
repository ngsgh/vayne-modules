"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { NotificationListItem } from "@/app/(app)/notifications/list-item";
import { useNotifications } from "@/lib/use-notifications";

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead } = useNotifications();

  return (
    <div>
      <div className="flex items-start justify-between">
        <PageHeader title="알림" description="최근 알림 목록" />
        <Button variant="outline" size="sm" onClick={markAllRead}>
          모두 읽음으로 표시
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {notifications.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            알림이 없습니다
          </p>
        ) : (
          notifications.map((n) => (
            <NotificationListItem
              key={n.id}
              notification={n}
              onMarkRead={markRead}
            />
          ))
        )}
      </div>
    </div>
  );
}
