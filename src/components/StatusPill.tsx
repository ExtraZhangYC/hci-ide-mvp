import type { AgentStatus, WorkflowNodeStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";

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
