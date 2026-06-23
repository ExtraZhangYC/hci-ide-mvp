import { ArrowRight, Users2, CheckCircle2 } from "lucide-react";
import { agents, getAgentById } from "@/data/agents";
import { useDemoStore } from "@/store/useDemoStore";
import { AgentCard } from "@/components/AgentCard";
import { AgentDetailPanel } from "@/components/AgentDetailPanel";
import { SidePanel } from "@/components/SidePanel";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function AgentBoard() {
  const selectedAgentId = useDemoStore((s) => s.selectedAgentId);
  const assignedAgentIds = useDemoStore((s) => s.assignedAgentIds);
  const selectAgent = useDemoStore((s) => s.selectAgent);
  const assignAgent = useDemoStore((s) => s.assignAgent);
  const teamCustomizationEnabled = useDemoStore((s) => s.teamCustomizationEnabled);
  const enableTeamCustomization = useDemoStore((s) => s.enableTeamCustomization);
  const resetTeamToRecommended = useDemoStore((s) => s.resetTeamToRecommended);
  const setPage = useDemoStore((s) => s.setPage);

  const selectedAgent = selectedAgentId
    ? getAgentById(selectedAgentId) ?? null
    : null;
  const teamReady = assignedAgentIds.length >= 3;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: header + grid */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-end justify-between border-b border-line px-6 py-5">
          <div>
            <div className="callsign mb-1 text-[10px] text-command-soft">
              // 01 · 组队
            </div>
            <h1 className="font-display text-xl font-semibold tracking-tight text-white">
              Agent Board
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Persistent AI employees for project delivery · 组建你的 AI 工程团队
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TeamSummary count={assignedAgentIds.length} ready={teamReady} />
            {teamCustomizationEnabled ? (
              <Button variant="secondary" size="sm" onClick={resetTeamToRecommended}>
                恢复推荐团队
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={enableTeamCustomization}>
                自定义团队
              </Button>
            )}
          </div>
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
                showAssign={teamCustomizationEnabled}
              />
            ))}
          </div>

          {/* Project Team Summary */}
          <div className="mt-6 rounded-lg border border-line bg-ink-850/60 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Users2 className="h-4 w-4 text-command-soft" />
              <h2 className="font-display text-sm font-semibold text-slate-100">
                Project Team Summary
              </h2>
              <span className="ml-2 text-xs text-slate-500">
                系统已默认推荐团队（可点击右上角“自定义团队”调整）
              </span>
            </div>

            {assignedAgentIds.length === 0 ? (
              <p className="text-sm text-slate-500">
                当前团队为空。建议保持至少 3 名 Agent。
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
      <SidePanel
        side="right"
        title="Agent 详情 · Detail"
        defaultWidth={360}
        minWidth={300}
        maxWidth={560}
        storageKey="agent-detail"
      >
        <AgentDetailPanel
          agent={selectedAgent}
          assigned={
            selectedAgent ? assignedAgentIds.includes(selectedAgent.id) : false
          }
          onAssign={() => selectedAgent && assignAgent(selectedAgent.id)}
          showAssign={teamCustomizationEnabled}
        />
      </SidePanel>
    </div>
  );
}

function TeamSummary({ count, ready }: { count: number; ready: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border px-4 py-2.5",
        ready
          ? "border-emerald-500/40 bg-emerald-600/10"
          : "border-line-bright bg-ink-850/60"
      )}
    >
      <div className="text-right">
        <div className="callsign text-[9px] text-slate-500">CREW</div>
        <div
          className={cn(
            "font-mono text-lg font-bold leading-none tabular",
            ready ? "text-emerald-300" : "text-slate-200"
          )}
        >
          {String(count).padStart(2, "0")}
          <span className="text-xs font-normal text-slate-500"> / 04</span>
        </div>
      </div>
      <div
        className={cn(
          "callsign rounded px-2 py-1 text-[9px]",
          ready ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700/50 text-slate-400"
        )}
      >
        {ready ? "团队就绪" : "组队中"}
      </div>
    </div>
  );
}
