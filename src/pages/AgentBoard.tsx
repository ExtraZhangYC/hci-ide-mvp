import { ArrowRight, Users2, CheckCircle2 } from "lucide-react";
import { agents, getAgentById } from "@/data/agents";
import { useDemoStore } from "@/store/useDemoStore";
import { AgentCard } from "@/components/AgentCard";
import { AgentDetailPanel } from "@/components/AgentDetailPanel";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function AgentBoard() {
  const selectedAgentId = useDemoStore((s) => s.selectedAgentId);
  const assignedAgentIds = useDemoStore((s) => s.assignedAgentIds);
  const selectAgent = useDemoStore((s) => s.selectAgent);
  const assignAgent = useDemoStore((s) => s.assignAgent);
  const setPage = useDemoStore((s) => s.setPage);

  const selectedAgent = selectedAgentId
    ? getAgentById(selectedAgentId) ?? null
    : null;
  const teamReady = assignedAgentIds.length >= 3;

  return (
    <div className="grid h-full grid-cols-[1fr_360px] overflow-hidden">
      {/* Left: header + grid */}
      <div className="flex min-w-0 flex-col overflow-hidden">
        <header className="flex items-end justify-between border-b border-slate-800/80 px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold text-white">Agent Board</h1>
            <p className="text-sm text-slate-500">
              Persistent AI employees for project delivery · 组建你的 AI 工程团队
            </p>
          </div>
          <TeamSummary count={assignedAgentIds.length} ready={teamReady} />
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                selected={selectedAgentId === agent.id}
                assigned={assignedAgentIds.includes(agent.id)}
                onSelect={() => selectAgent(agent.id)}
                onAssign={() => assignAgent(agent.id)}
              />
            ))}
          </div>

          {/* Project Team Summary */}
          <div className="mt-6 rounded-xl border border-slate-800/80 bg-ink-850/60 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Users2 className="h-4 w-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-slate-100">
                Project Team Summary
              </h2>
              <span className="ml-2 text-xs text-slate-500">
                至少加入 3 名 Agent 即可开始任务
              </span>
            </div>

            {assignedAgentIds.length === 0 ? (
              <p className="text-sm text-slate-500">
                尚未加入任何 Agent。点击卡片上的 “Assign to Project” 组建团队。
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {assignedAgentIds.map((id) => {
                  const a = getAgentById(id);
                  if (!a) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-600/10 px-3 py-1.5 text-sm text-blue-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {a.name}
                      <span className="text-xs text-blue-400/70">{a.role}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {teamReady && (
              <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-600/10 px-4 py-3">
                <span className="text-sm text-emerald-200">
                  团队已就绪，可前往 Task Board 下发任务。
                </span>
                <Button variant="primary" size="sm" onClick={() => setPage("tasks")}>
                  前往 Task Board <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: detail panel */}
      <aside className="min-h-0 border-l border-slate-800/80 bg-ink-900/40">
        <AgentDetailPanel
          agent={selectedAgent}
          assigned={
            selectedAgent ? assignedAgentIds.includes(selectedAgent.id) : false
          }
          onAssign={() => selectedAgent && assignAgent(selectedAgent.id)}
        />
      </aside>
    </div>
  );
}

function TeamSummary({ count, ready }: { count: number; ready: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-2.5",
        ready
          ? "border-emerald-500/40 bg-emerald-600/10"
          : "border-slate-700 bg-ink-850/60"
      )}
    >
      <div className="text-right">
        <div className="text-[11px] text-slate-500">已组建团队</div>
        <div
          className={cn(
            "text-lg font-bold leading-none",
            ready ? "text-emerald-300" : "text-slate-200"
          )}
        >
          {count}
          <span className="text-xs font-normal text-slate-500"> / 4</span>
        </div>
      </div>
      <div
        className={cn(
          "rounded-lg px-2 py-1 text-[11px] font-medium",
          ready ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700/50 text-slate-400"
        )}
      >
        {ready ? "团队就绪" : "组队中"}
      </div>
    </div>
  );
}
