export interface CalendarEvent {
  id: string;
  orgId: string;
  title: string;
  description: string;
  start: string;
  end: string;
  allDay: boolean;
  color: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateEventInput = Omit<
  CalendarEvent,
  "id" | "orgId" | "createdAt" | "updatedAt"
>;

export type UpdateEventInput = Partial<
  Omit<CalendarEvent, "id" | "orgId" | "createdAt" | "updatedAt">
>;

export const EVENT_COLORS = [
  { value: "#4593fc", label: "파랑" },
  { value: "#34c759", label: "초록" },
  { value: "#ff9500", label: "주황" },
  { value: "#ff3b30", label: "빨강" },
  { value: "#af52de", label: "보라" },
  { value: "#8b95a1", label: "회색" },
] as const;
