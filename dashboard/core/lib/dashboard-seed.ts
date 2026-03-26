import { registerDataSource } from "@/lib/dashboard-sources";
import { getBalance, getTransactions } from "@/lib/credits";
import { getPosts } from "@/lib/board";
import { getColumns, getCards } from "@/lib/kanban";
import { getOrgMembers } from "@/lib/org";

let seeded = false;

export function seedDashboardSources(): void {
  if (seeded) return;
  seeded = true;

  // --- 크레딧 ---
  registerDataSource({
    id: "credit_balance",
    module: "credits",
    label: "크레딧 잔액",
    type: "number",
    fetch: (orgId) => getBalance(orgId),
  });

  registerDataSource({
    id: "credit_transactions",
    module: "credits",
    label: "크레딧 사용 추이",
    type: "timeseries",
    fetch: (orgId) => {
      const txs = getTransactions(orgId);
      const byDate = new Map<string, number>();
      for (const tx of txs) {
        const date = tx.createdAt.slice(0, 10);
        byDate.set(date, (byDate.get(date) ?? 0) + Math.abs(tx.amount));
      }
      return Array.from(byDate.entries())
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => a.date.localeCompare(b.date));
    },
  });

  // --- 게시판 ---
  registerDataSource({
    id: "board_post_count",
    module: "board",
    label: "게시글 수",
    type: "number",
    fetch: (orgId) => {
      const result = getPosts({}, orgId);
      return result.total;
    },
  });

  registerDataSource({
    id: "board_category_dist",
    module: "board",
    label: "카테고리별 게시글",
    type: "distribution",
    fetch: (orgId) => {
      const result = getPosts({}, orgId);
      const dist = new Map<string, number>();
      for (const post of result.posts) {
        const cat = post.category ?? "기타";
        dist.set(cat, (dist.get(cat) ?? 0) + 1);
      }
      return Array.from(dist.entries()).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });

  // --- 칸반 ---
  registerDataSource({
    id: "kanban_card_count",
    module: "kanban",
    label: "칸반 카드 수",
    type: "number",
    fetch: (orgId) => getCards(orgId).length,
  });

  registerDataSource({
    id: "kanban_column_dist",
    module: "kanban",
    label: "칸반 상태별 카드",
    type: "distribution",
    fetch: (orgId) => {
      const cols = getColumns(orgId);
      const allCards = getCards(orgId);
      return cols.map((c) => ({
        name: c.name,
        value: allCards.filter((card) => card.columnId === c.id).length,
      }));
    },
  });

  // --- 멤버 ---
  registerDataSource({
    id: "member_count",
    module: "rbac",
    label: "멤버 수",
    type: "number",
    fetch: (orgId) => {
      const members = getOrgMembers(orgId);
      return members.length;
    },
  });

  registerDataSource({
    id: "member_role_dist",
    module: "rbac",
    label: "역할별 멤버",
    type: "distribution",
    fetch: (orgId) => {
      const members = getOrgMembers(orgId);
      const dist = new Map<string, number>();
      for (const m of members) {
        dist.set(m.role, (dist.get(m.role) ?? 0) + 1);
      }
      return Array.from(dist.entries()).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });
}
