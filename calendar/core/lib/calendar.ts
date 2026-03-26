// calendar 모듈 비즈니스 로직
// 코어 영역 — vayne-cli update 시 덮어쓰기 대상

import type {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from "@/types/calendar";

const events: CalendarEvent[] = [];
const seeded = new Set<string>();

function seed(orgId: string): void {
  if (seeded.has(orgId)) return;
  seeded.add(orgId);

  const now = new Date();
  const samples: Array<Omit<CalendarEvent, "id" | "orgId" | "createdAt" | "updatedAt">> = [
    {
      title: "주간 회의",
      description: "팀 전체 주간 리뷰",
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0).toISOString(),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0).toISOString(),
      allDay: false,
      color: "#4593fc",
      authorId: "template-user-001",
      authorName: "관리자",
    },
    {
      title: "프로젝트 마감",
      description: "Q1 프로젝트 최종 제출",
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3).toISOString(),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3).toISOString(),
      allDay: true,
      color: "#ff3b30",
      authorId: "template-user-001",
      authorName: "관리자",
    },
    {
      title: "점심 미팅",
      description: "파트너사 미팅",
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 0).toISOString(),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13, 30).toISOString(),
      allDay: false,
      color: "#34c759",
      authorId: "template-user-001",
      authorName: "관리자",
    },
  ];

  for (const s of samples) {
    events.push({
      ...s,
      id: crypto.randomUUID(),
      orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

export function getEvents(orgId: string): CalendarEvent[] {
  seed(orgId);
  return events
    .filter((e) => e.orgId === orgId)
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function createEvent(
  orgId: string,
  input: CreateEventInput,
): CalendarEvent {
  const event: CalendarEvent = {
    ...input,
    id: crypto.randomUUID(),
    orgId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  events.push(event);
  return event;
}

export function updateEvent(
  orgId: string,
  eventId: string,
  input: UpdateEventInput,
): CalendarEvent | null {
  const event = events.find(
    (e) => e.id === eventId && e.orgId === orgId,
  );
  if (!event) return null;
  Object.assign(event, input, { updatedAt: new Date().toISOString() });
  return event;
}

export function deleteEvent(orgId: string, eventId: string): boolean {
  const idx = events.findIndex(
    (e) => e.id === eventId && e.orgId === orgId,
  );
  if (idx === -1) return false;
  events.splice(idx, 1);
  return true;
}
