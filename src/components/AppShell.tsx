import { useState, type ReactNode } from "react";
import {
  Users,
  Network,
  Scale,
  RotateCcw,
  CircleDot,
  Boxes,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useDemoStore } from "@/store/useDemoStore";
import type { DemoStage, PageKey } from "@/types";
import { cn } from "@/lib/utils";

const otherNavItems: { key: PageKey; label: string; icon: typeof Users }[] = [
  { key: "agents", label: "Agent Board", icon: Users },
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
  team_configured: "text-blue-300",
  analyzing: "text-blue-300",
  workflow_recommended: "text-blue-300",
  executing: "text-blue-300",
  intervention: "text-amber-300",
  council: "text-violet-300",
  delivery: "text-emerald-300",
};

const taskStageShort: Record<DemoStage, string> = {
  idle: "待开始",
  team_configured: "就绪",
  analyzing: "分析中",
  workflow_recommended: "已推荐",
  executing: "执行中",
  intervention: "介入",
  council: "议会",
  delivery: "已交付",
};

export function AppShell({ children }: { children: ReactNode }) {
  const currentPage = useDemoStore((s) => s.currentPage);
  const setPage = useDemoStore((s) => s.setPage);
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const stage = useDemoStore((s) => s.stage);
  const nodes = useDemoStore((s) => s.nodes);
  const activeStepIndex = useDemoStore((s) => s.activeStepIndex);
  const assignedAgentIds = useDemoStore((s) => s.assignedAgentIds);
  const tasks = useDemoStore((s) => s.tasks);
  const activeTaskId = useDemoStore((s) => s.activeTaskId);
  const selectTask = useDemoStore((s) => s.selectTask);

  const [taskBoardExpanded, setTaskBoardExpanded] = useState(true);

  const activeNode = activeStepIndex >= 0 ? nodes[activeStepIndex] : null;
  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const isTaskPage = currentPage === "tasks";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-ink-950 text-slate-200">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-800/80 bg-ink-900/60">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-900/40">
            <Boxes className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">HCI IDE</div>
            <div className="text-[11px] text-slate-500">AI 工程团队驾驶舱</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          <div className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            工作台
          </div>

          {/* Agent Board */}
          {otherNavItems
            .filter((item) => item.key === "agents")
            .map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setPage(item.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-blue-600/15 text-blue-200 ring-1 ring-blue-500/30"
                      : "text-slate-400 hover:bg-ink-700 hover:text-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}

          {/* Task Board — expandable */}
          <div>
            <div className="flex items-center">
              <button
                onClick={() => setPage("tasks")}
                className={cn(
                  "flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isTaskPage
                    ? "bg-blue-600/15 text-blue-200 ring-1 ring-blue-500/30"
                    : "text-slate-400 hover:bg-ink-700 hover:text-slate-100"
                )}
              >
                <Network className="h-4 w-4" />
                Task Board
              </button>
              <button
                onClick={() => setTaskBoardExpanded((v) => !v)}
                className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-ink-700 hover:text-slate-300"
                aria-label={taskBoardExpanded ? "收起任务列表" : "展开任务列表"}
              >
                {taskBoardExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {taskBoardExpanded && (
              <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-800/80 pl-2">
                {tasks.map((task) => {
                  const selected = isTaskPage && task.id === activeTaskId;
                  const hasWorkflow =
                    task.stage !== "idle" &&
                    task.stage !== "team_configured" &&
                    task.stage !== "analyzing";
                  return (
                    <button
                      key={task.id}
                      onClick={() => selectTask(task.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                        selected
                          ? "bg-blue-600/20 text-blue-100"
                          : "text-slate-400 hover:bg-ink-700 hover:text-slate-200"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          hasWorkflow ? "bg-blue-400" : "bg-slate-600"
                        )}
                      />
                      <span className="min-w-0 flex-1 truncate">{task.title}</span>
                      <span
                        className={cn(
                          "shrink-0 text-[10px]",
                          stageColors[task.stage]
                        )}
                      >
                        {taskStageShort[task.stage]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Council Board */}
          {otherNavItems
            .filter((item) => item.key === "council")
            .map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setPage(item.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-blue-600/15 text-blue-200 ring-1 ring-blue-500/30"
                      : "text-slate-400 hover:bg-ink-700 hover:text-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
        </nav>

        <div className="border-t border-slate-800/80 p-3">
          <div className="mb-2 px-2 text-[11px] text-slate-500">
            已组建团队 · {assignedAgentIds.length} 名 Agent
          </div>
          <button
            onClick={resetDemo}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-rose-600/15 hover:text-rose-200"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Demo
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>

        {/* Status Bar */}
        <footer className="flex h-8 shrink-0 items-center gap-6 border-t border-slate-800/80 bg-ink-900/80 px-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <CircleDot className={cn("h-3 w-3", stageColors[stage])} />
            Stage:
            <span className={cn("font-medium", stageColors[stage])}>
              {stageLabels[stage]}
            </span>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            Task:{" "}
            <span className="font-medium text-slate-200">
              {activeTask?.title ?? "—"}
            </span>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            Active Node:{" "}
            <span className="font-medium text-slate-200">
              {activeNode ? activeNode.label : "—"}
            </span>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            Owner:{" "}
            <span className="text-slate-300">
              {activeNode ? activeNode.owner : "—"}
            </span>
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse-ring rounded-full bg-emerald-400" />
            Demo Ready
          </span>
        </footer>
      </div>
    </div>
  );
}
