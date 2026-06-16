import { useRef, useEffect } from "react";
import { Flag, RotateCcw, ScrollText } from "lucide-react";
import { useDemoStore } from "@/store/useDemoStore";
import type { LogLevel, TimelineEvent } from "@/types";
import { cn } from "@/lib/utils";

const levelDot: Record<LogLevel, string> = {
  info: "bg-slate-500 border-slate-400",
  success: "bg-emerald-500 border-emerald-400",
  warning: "bg-amber-500 border-amber-400",
  council: "bg-violet-500 border-violet-400",
};

const levelText: Record<LogLevel, string> = {
  info: "text-slate-300",
  success: "text-emerald-300",
  warning: "text-amber-300",
  council: "text-violet-300",
};

export function ExecutionTimeline() {
  const timeline = useDemoStore((s) => s.timeline);
  const restoreCheckpoint = useDemoStore((s) => s.restoreCheckpoint);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [timeline.length]);

  if (timeline.length === 0) return null;

  const latestId = timeline[timeline.length - 1]?.id;

  return (
    <div className="shrink-0 border-t border-slate-800/80 bg-ink-900/70">
      <div className="flex items-center gap-2 px-4 py-2">
        <ScrollText className="h-3.5 w-3.5 text-slate-500" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          执行时间轴
        </span>
        <span className="text-[10px] text-slate-600">
          · 点击 ◆ Checkpoint 可回溯到该状态
        </span>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto px-4 pb-3 scrollbar-thin"
      >
        <div className="relative flex min-w-max items-start gap-0 pt-1">
          {/* 连接线 */}
          <div
            className="absolute left-4 right-4 top-[18px] h-px bg-slate-700/80"
            aria-hidden
          />

          {timeline.map((event, i) => (
            <TimelineItem
              key={event.id}
              event={event}
              isLatest={event.id === latestId}
              isLast={i === timeline.length - 1}
              onRestore={restoreCheckpoint}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  event,
  isLatest,
  isLast,
  onRestore,
}: {
  event: TimelineEvent;
  isLatest: boolean;
  isLast: boolean;
  onRestore: (id: string) => void;
}) {
  const isCheckpoint = Boolean(event.checkpoint);

  return (
    <div
      className={cn(
        "group relative flex w-[168px] shrink-0 flex-col items-center px-1",
        !isLast && "mr-1"
      )}
    >
      {/* 节点标记 */}
      <div className="relative z-10 flex h-9 items-center justify-center">
        {isCheckpoint ? (
          <button
            type="button"
            onClick={() => onRestore(event.id)}
            title={`回溯到「${event.checkpoint!.label}」\n${event.checkpoint!.description}`}
            className={cn(
              "flex h-7 w-7 rotate-45 items-center justify-center rounded-sm border-2 transition-all",
              "border-amber-400/80 bg-amber-500/20 hover:border-amber-300 hover:bg-amber-500/35 hover:shadow-lg hover:shadow-amber-900/30",
              isLatest && "ring-2 ring-amber-400/50 ring-offset-2 ring-offset-ink-900"
            )}
          >
            <Flag className="-rotate-45 h-3 w-3 text-amber-200" />
          </button>
        ) : (
          <div
            className={cn(
              "h-3 w-3 rounded-full border-2",
              levelDot[event.level],
              isLatest && "ring-2 ring-blue-400/40 ring-offset-2 ring-offset-ink-900"
            )}
          />
        )}
      </div>

      {/* 时间 */}
      <span className="mt-1 font-mono text-[10px] text-slate-600">
        {event.time}
      </span>

      {/* Checkpoint 标签 */}
      {isCheckpoint && (
        <div className="mt-0.5 flex items-center gap-0.5">
          <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
            {event.checkpoint!.label}
          </span>
        </div>
      )}

      {/* 内容 */}
      <div
        className={cn(
          "mt-1 w-full rounded-md border px-2 py-1.5 text-center transition-colors",
          isCheckpoint
            ? "border-amber-500/20 bg-amber-500/5 group-hover:border-amber-500/40"
            : "border-slate-800/80 bg-ink-900/50",
          isLatest && !isCheckpoint && "border-blue-500/30 bg-blue-500/5"
        )}
      >
        <div className="truncate text-[10px] font-medium text-slate-400">
          {event.source}
        </div>
        <p
          className={cn(
            "mt-0.5 line-clamp-2 text-[10px] leading-snug",
            levelText[event.level]
          )}
        >
          {event.text}
        </p>
      </div>

      {/* 回溯提示 */}
      {isCheckpoint && (
        <button
          type="button"
          onClick={() => onRestore(event.id)}
          className="mt-1 flex items-center gap-0.5 text-[10px] text-amber-400/0 transition-all group-hover:text-amber-400/90"
        >
          <RotateCcw className="h-2.5 w-2.5" />
          回溯
        </button>
      )}
    </div>
  );
}
