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
  ChevronLeft,
} from "lucide-react";
import { useDemoStore } from "@/store/useDemoStore";
import type { DemoStage, PageKey } from "@/types";
import { cn } from "@/lib/utils";
import { useResizableWidth } from "@/lib/useResizableWidth";

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
  const {
    width: navWidth,
    collapsed: navCollapsed,
    setCollapsed: setNavCollapsed,
    onResizeStart: onNavResizeStart,
    dragging: navDragging,
  } = useResizableWidth({
    side: "left",
    defaultWidth: 240,
    minWidth: 184,
    maxWidth: 360,
    storageKey: "nav",
  });

  const activeNode = activeStepIndex >= 0 ? nodes[activeStepIndex] : null;
  const humanLive = humanStages.includes(stage);
  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const isTaskPage = currentPage === "tasks";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-ink-950 text-slate-200">
      {/* Command deck */}
      <aside
        className={cn(
          "relative flex shrink-0 flex-col border-r border-line bg-ink-900/70",
          !navDragging.current && "transition-[width] duration-150"
        )}
        style={{ width: navCollapsed ? 64 : navWidth }}
      >
        {/* 折叠 / 展开把手 */}
        <button
          type="button"
          onClick={() => setNavCollapsed((v) => !v)}
          title={navCollapsed ? "展开工作台" : "收起工作台"}
          className="absolute -right-3 top-7 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-ink-850 text-slate-400 shadow-md transition-colors hover:border-slate-500 hover:text-slate-200"
        >
          {navCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        <div
          className={cn(
            "flex items-center gap-3 border-b border-line py-[18px]",
            navCollapsed ? "justify-center px-0" : "px-5"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-command shadow-glow">
            <Boxes className="h-5 w-5 text-white" />
          </div>
          {!navCollapsed && (
            <div className="leading-tight">
              <div className="font-display text-sm font-semibold tracking-tight text-white">
                HCI · IDE
              </div>
              <div className="callsign text-[9px] text-slate-500">
                AGENT TEAM CONSOLE
              </div>
            </div>
          )}
        </div>

        <nav
          className={cn(
            "flex-1 space-y-1 overflow-y-auto py-4",
            navCollapsed ? "px-2" : "px-3"
          )}
        >
          {!navCollapsed && (
            <div className="callsign px-2 pb-2 text-[9px] text-slate-600">
              // 工作台
            </div>
          )}

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
                  title={navCollapsed ? item.label : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg py-2 text-sm transition-colors",
                    navCollapsed ? "justify-center px-0" : "px-3",
                    active
                      ? "bg-blue-600/15 text-blue-200 ring-1 ring-blue-500/30"
                      : "text-slate-400 hover:bg-ink-700 hover:text-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!navCollapsed && item.label}
                </button>
              );
            })}

          {/* Task Board — expandable */}
          <div>
            <div className="flex items-center">
              <button
                onClick={() => setPage("tasks")}
                title={navCollapsed ? "Task Board" : undefined}
                className={cn(
                  "flex flex-1 items-center gap-3 rounded-lg py-2 text-sm transition-colors",
                  navCollapsed ? "justify-center px-0" : "px-3",
                  isTaskPage
                    ? "bg-blue-600/15 text-blue-200 ring-1 ring-blue-500/30"
                    : "text-slate-400 hover:bg-ink-700 hover:text-slate-100"
                )}
              >
                <Network className="h-4 w-4 shrink-0" />
                {!navCollapsed && "Task Board"}
              </button>
              {!navCollapsed && (
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
              )}
            </div>

            {!navCollapsed && taskBoardExpanded && (
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
                  title={navCollapsed ? item.label : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg py-2 text-sm transition-colors",
                    navCollapsed ? "justify-center px-0" : "px-3",
                    active
                      ? "bg-blue-600/15 text-blue-200 ring-1 ring-blue-500/30"
                      : "text-slate-400 hover:bg-ink-700 hover:text-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!navCollapsed && item.label}
                </button>
              );
            })}
        </nav>

        <div className="border-t border-line p-3">
          {!navCollapsed && (
            <div className="mb-2 flex items-center justify-between px-2">
              <span className="callsign text-[9px] text-slate-600">CREW</span>
              <span className="font-mono text-[11px] text-slate-400 tabular">
                {String(assignedAgentIds.length).padStart(2, "0")} / 04
              </span>
            </div>
          )}
          <button
            onClick={resetDemo}
            title={navCollapsed ? "Reset Demo" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-md py-2 text-sm text-slate-400 transition-colors hover:bg-rose-600/15 hover:text-rose-200",
              navCollapsed ? "justify-center px-0" : "px-3"
            )}
          >
            <RotateCcw className="h-4 w-4 shrink-0" />
            {!navCollapsed && "Reset Demo"}
          </button>
        </div>

        {/* 拖拽调宽手柄（右内边缘，仅展开时） */}
        {!navCollapsed && (
          <div
            onMouseDown={onNavResizeStart}
            title="拖拽调整宽度"
            className="group absolute inset-y-0 right-0 z-20 w-1.5 cursor-col-resize"
          >
            <div className="h-full w-full transition-colors group-hover:bg-command/40" />
          </div>
        )}
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
            <span className="callsign text-[9px] text-slate-600">TASK</span>
            <span className="text-slate-300">{activeTask?.title ?? "—"}</span>
          </span>
          <span className="h-3.5 w-px bg-line-bright" />
          <span className="flex items-center gap-2 px-4">
            <span className="callsign text-[9px] text-slate-600">NODE</span>
            <span className="font-medium text-slate-200">
              {activeNode ? `${activeNode.code} ${activeNode.label}` : "—"}
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
