import { Check, Plus, TrendingUp, History, AlertTriangle } from "lucide-react";
import type { Agent } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AgentStatusPill } from "@/components/StatusPill";
import { cn } from "@/lib/utils";

type Props = {
  agent: Agent;
  selected: boolean;
  assigned: boolean;
  onSelect: () => void;
  onAssign: () => void;
};

export function AgentCard({
  agent,
  selected,
  assigned,
  onSelect,
  onAssign,
}: Props) {
  return (
    <Card
      onClick={onSelect}
      className={cn(
        "cursor-pointer transition-all hover:border-slate-600 hover:shadow-lg hover:shadow-black/30",
        selected && "border-blue-500/60 ring-1 ring-blue-500/40",
        assigned && "bg-blue-600/5"
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/30 to-violet-500/20 text-sm font-bold text-blue-200">
              {agent.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">
                {agent.name}
              </div>
              <div className="text-xs text-slate-500">{agent.role}</div>
            </div>
          </div>
          <AgentStatusPill status={agent.status} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat icon={TrendingUp} label="成功率" value={`${agent.successRate}%`} />
          <Stat icon={History} label="历史任务" value={`${agent.historicalTasks}`} />
          <Stat
            icon={AlertTriangle}
            label="失败数"
            value={`${agent.failureCount}`}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {agent.skills.slice(0, 4).map((s) => (
            <Badge key={s} variant="slate">
              {s}
            </Badge>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>协作：{agent.collaboration}</span>
          <span>{agent.tokenCost}</span>
        </div>

        <Button
          variant={assigned ? "success" : "primary"}
          size="sm"
          className="mt-4 w-full"
          onClick={(e) => {
            e.stopPropagation();
            onAssign();
          }}
        >
          {assigned ? (
            <>
              <Check className="h-4 w-4" /> 已加入项目
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Assign to Project
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-ink-900/60 py-2">
      <Icon className="mx-auto mb-1 h-3.5 w-3.5 text-slate-500" />
      <div className="text-sm font-semibold text-slate-100">{value}</div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  );
}
