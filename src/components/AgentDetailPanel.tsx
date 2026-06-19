import { Check, Plus, UserCircle2 } from "lucide-react";
import type { Agent } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AgentStatusPill } from "@/components/StatusPill";

type Props = {
  agent: Agent | null;
  assigned: boolean;
  onAssign: () => void;
};

export function AgentDetailPanel({ agent, assigned, onAssign }: Props) {
  if (!agent) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center text-slate-500">
        <UserCircle2 className="mb-3 h-10 w-10 text-slate-700" />
        <p className="text-sm">选择左侧任意 Agent</p>
        <p className="text-xs text-slate-600">查看完整员工档案与历史表现</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line p-5">
        <div className="callsign mb-2 text-[9px] text-slate-600">
          PERSONNEL DOSSIER
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-line-bright bg-gradient-to-br from-command/25 to-violet-500/15 font-mono text-base font-bold text-command-soft">
            {agent.name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="font-display text-base font-semibold text-white">
              {agent.name}
            </div>
            <div className="callsign text-[10px] text-slate-500">
              {agent.role}
            </div>
          </div>
          <div className="ml-auto">
            <AgentStatusPill status={agent.status} />
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">
          {agent.description}
        </p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        <section>
          <SectionTitle>核心指标</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <Metric label="成功率" value={`${agent.successRate}%`} accent />
            <Metric label="代码接受率" value={`${agent.acceptedRate}%`} accent />
            <Metric label="平均完成时间" value={agent.avgCompletionTime} />
            <Metric label="Token 成本" value={agent.tokenCost} />
            <Metric label="历史任务数" value={`${agent.historicalTasks}`} />
            <Metric label="失败记录数" value={`${agent.failureCount}`} />
          </div>
        </section>

        <section>
          <SectionTitle>技能标签</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {agent.skills.map((s) => (
              <Badge key={s} variant="blue">
                {s}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>协作表现</SectionTitle>
          <Badge variant="violet">{agent.collaboration}</Badge>
        </section>

        <section>
          <SectionTitle>最近任务</SectionTitle>
          <p className="rounded-lg border border-slate-800 bg-ink-900/60 p-3 text-xs text-slate-300">
            {agent.recentTask}
          </p>
        </section>
      </div>

      <div className="border-t border-slate-800/80 p-4">
        <Button
          variant={assigned ? "success" : "primary"}
          className="w-full"
          onClick={onAssign}
        >
          {assigned ? (
            <>
              <Check className="h-4 w-4" /> 已加入项目团队
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Assign to Project
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="callsign mb-2 text-[10px] text-slate-500">{children}</h4>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-md border border-line bg-ink-900/60 p-2.5">
      <div className="callsign text-[8px] text-slate-500">{label}</div>
      <div
        className={
          accent
            ? "font-mono text-sm font-semibold tabular text-command-soft"
            : "font-mono text-sm font-semibold tabular text-slate-200"
        }
      >
        {value}
      </div>
    </div>
  );
}
