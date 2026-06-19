import type { ReactNode } from "react";
import {
  Users,
  Network,
  Scale,
  RotateCcw,
  CircleDot,
  Boxes,
} from "lucide-react";
import { useDemoStore } from "@/store/useDemoStore";
import type { DemoStage, PageKey } from "@/types";
import { cn } from "@/lib/utils";

const navItems: { key: PageKey; label: string; icon: typeof Users }[] = [
  { key: "agents", label: "Agent Board", icon: Users },
  { key: "tasks", label: "Task Board", icon: Network },
  { key: "council", label: "Council Board", icon: Scale },
];

const stageLabels: Record<DemoStage, string> = {
  idle: "待组队",
  team_configured: "团队就绪",
  analyzing: "需求分析中",
  workflow_recommended: "已推荐流程",
  executing: "执行中",
  intervention: "用户介入",
  council: "议会裁决中",
  delivery: "已交付",
};

const stageColors: Record<DemoStage, string> = {
  idle: "text-slate-400",
  team_configured: "text-command-soft",
  analyzing: "text-command-soft",
  workflow_recommended: "text-command-soft",
  executing: "text-command-soft",
  intervention: "text-human",
  council: "text-violet-300",
  delivery: "text-emerald-300",
};

// stages where the human holds the controls — the LIVE thread glows warm
const humanStages: DemoStage[] = ["intervention", "council"];

const navMeta: Record<PageKey, string> = {
  agents: "组队",
  tasks: "执行",
  council: "裁决",
};

export function AppShell({ children }: { children: ReactNode }) {
  const currentPage = useDemoStore((s) => s.currentPage);
  const setPage = useDemoStore((s) => s.setPage);
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const stage = useDemoStore((s) => s.stage);
  const nodes = useDemoStore((s) => s.nodes);
  const activeStepIndex = useDemoStore((s) => s.activeStepIndex);
  const assignedAgentIds = useDemoStore((s) => s.assignedAgentIds);

  const activeNode = activeStepIndex >= 0 ? nodes[activeStepIndex] : null;
  const humanLive = humanStages.includes(stage);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-ink-950 text-slate-200">
      {/* Command deck */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-ink-900/70">
        <div className="flex items-center gap-3 border-b border-line px-5 py-[18px]">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-command shadow-glow">
            <Boxes className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold tracking-tight text-white">
              HCI · IDE
            </div>
            <div className="callsign text-[9px] text-slate-500">
              AGENT TEAM CONSOLE
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <div className="callsign px-2 pb-2 text-[9px] text-slate-600">
            // 工作台
          </div>
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-command/12 text-command-soft"
                    : "text-slate-400 hover:bg-ink-700 hover:text-slate-100"
                )}
              >
                {/* left LED rail marks the active station */}
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full transition-all",
                    active ? "led bg-command" : "bg-transparent"
                  )}
                />
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                <span className="callsign text-[9px] text-slate-600 tabular">
                  {String(i + 1).padStart(2, "0")} {navMeta[item.key]}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-line p-3">
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="callsign text-[9px] text-slate-600">CREW</span>
            <span className="font-mono text-[11px] text-slate-400 tabular">
              {String(assignedAgentIds.length).padStart(2, "0")} / 04
            </span>
          </div>
          <button
            onClick={resetDemo}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-rose-600/15 hover:text-rose-200"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Demo
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>

        {/* Telemetry strip */}
        <footer className="flex h-8 shrink-0 items-center gap-0 border-t border-line bg-ink-900/90 px-3 font-mono text-[11px] text-slate-400">
          <span className="flex items-center gap-2 pr-4">
            <CircleDot className={cn("h-3 w-3", stageColors[stage])} />
            <span className="callsign text-[9px] text-slate-600">STAGE</span>
            <span className={cn("font-medium", stageColors[stage])}>
              {stageLabels[stage]}
            </span>
          </span>
          <span className="h-3.5 w-px bg-line-bright" />
          <span className="flex items-center gap-2 px-4">
            <span className="callsign text-[9px] text-slate-600">NODE</span>
            <span className="font-medium text-slate-200">
              {activeNode ? activeNode.label : "—"}
            </span>
          </span>
          <span className="h-3.5 w-px bg-line-bright" />
          <span className="flex items-center gap-2 px-4">
            <span className="callsign text-[9px] text-slate-600">OWNER</span>
            <span className="text-slate-300">
              {activeNode ? activeNode.owner : "—"}
            </span>
          </span>
          <span className="ml-auto flex items-center gap-2 pl-4">
            <span
              className={cn(
                "led h-2 w-2",
                humanLive ? "animate-blink bg-human" : "bg-emerald-400"
              )}
            />
            <span
              className={cn(
                "callsign text-[10px]",
                humanLive ? "text-human" : "text-emerald-300"
              )}
            >
              {humanLive ? "HUMAN IN COMMAND" : "SYSTEM NOMINAL"}
            </span>
          </span>
        </footer>
      </div>
    </div>
  );
}
