import type { AgentStatus, TaskStatusCore, WorkflowNodeStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";

type BadgeVariant = "slate" | "blue" | "green" | "red" | "amber" | "violet";

/** 协调器 Task 主状态机 11 核心态 → 文案 + 配色 */
const taskStatusMap: Record<TaskStatusCore, { label: string; variant: BadgeVariant }> = {
  created: { label: "created · 已创建", variant: "slate" },
  claimed: { label: "claimed · 已认领", variant: "blue" },
  running: { label: "running · 执行中", variant: "blue" },
  waiting_input: { label: "waiting_input · 等待输入", variant: "amber" },
  pending_gate: { label: "pending_gate · 等 Gate", variant: "amber" },
  pending_council: { label: "pending_council · 等议会", variant: "violet" },
  reviewing: { label: "reviewing · 审查中", variant: "blue" },
  blocked: { label: "blocked · 已阻断", variant: "red" },
  completed: { label: "completed · 已完成", variant: "green" },
  failed: { label: "failed · 失败", variant: "red" },
  cancelled: { label: "cancelled · 已取消", variant: "slate" },
};

export function TaskStatusPill({ status }: { status: TaskStatusCore }) {
  const s = taskStatusMap[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

const agentStatusMap: Record<
  AgentStatus,
  { label: string; variant: "slate" | "blue" | "amber" | "violet" | "green" }
> = {
  idle: { label: "空闲", variant: "slate" },
  working: { label: "工作中", variant: "blue" },
  waiting: { label: "等待中", variant: "amber" },
  reviewing: { label: "审查中", variant: "violet" },
  done: { label: "已完成", variant: "green" },
};

const nodeStatusMap: Record<
  WorkflowNodeStatus,
  { label: string; variant: "slate" | "blue" | "green" | "red" | "amber" }
> = {
  pending: { label: "待执行", variant: "slate" },
  active: { label: "执行中", variant: "blue" },
  done: { label: "已完成", variant: "green" },
  blocked: { label: "已阻塞", variant: "red" },
  updated: { label: "已被介入", variant: "amber" },
};

export function AgentStatusPill({ status }: { status: AgentStatus }) {
  const s = agentStatusMap[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

export function NodeStatusPill({ status }: { status: WorkflowNodeStatus }) {
  const s = nodeStatusMap[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}
