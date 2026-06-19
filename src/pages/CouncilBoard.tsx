import { useState } from "react";
import {
  MessagesSquare,
  Scale,
  CheckCircle2,
  ArrowLeft,
  Star,
  ThumbsUp,
  AlertTriangle,
  FileCode2,
  Gavel,
} from "lucide-react";
import { useDemoStore } from "@/store/useDemoStore";
import {
  councilContext,
  discussion,
  councilOptions,
  recommendedReason,
  getCouncilOption,
} from "@/data/councilOptions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { DiscussionMessage } from "@/types";

const accentColor: Record<DiscussionMessage["accent"], string> = {
  backend: "border-l-cyan-500/60 bg-cyan-500/5",
  test: "border-l-emerald-500/60 bg-emerald-500/5",
  security: "border-l-rose-500/60 bg-rose-500/5",
  system: "border-l-slate-500/60 bg-slate-500/5",
};

export function CouncilBoard() {
  const confirmCouncilOption = useDemoStore((s) => s.confirmCouncilOption);
  const confirmedId = useDemoStore((s) => s.confirmedCouncilOptionId);
  const setPage = useDemoStore((s) => s.setPage);

  const [selectedId, setSelectedId] = useState(
    councilOptions.find((o) => o.recommended)?.id ?? councilOptions[0].id
  );
  const selectedOption = getCouncilOption(selectedId)!;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-line px-6 py-4">
        <div className="callsign mb-1 text-[10px] text-violet-300">
          // 03 · 裁决
        </div>
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-violet-400" />
          <h1 className="font-display text-lg font-semibold tracking-tight text-white">
            Council Board
          </h1>
          <Badge variant="violet">需要用户裁决</Badge>
        </div>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          {councilContext.description}
        </p>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[300px_1fr_340px] overflow-hidden">
        {/* Left: Agent Discussion */}
        <div className="flex min-h-0 flex-col border-r border-slate-800/80">
          <PanelTitle icon={MessagesSquare}>Agent Discussion</PanelTitle>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {discussion.map((d, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg border border-slate-800 border-l-4 p-3",
                  accentColor[d.accent]
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-100">
                    {d.agent}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">{d.role}</span>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                  {d.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Option Comparison */}
        <div className="flex min-h-0 flex-col">
          <PanelTitle icon={Scale}>Option Comparison</PanelTitle>
          <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 xl:grid-cols-3">
            {councilOptions.map((opt) => {
              const active = selectedId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedId(opt.id)}
                  className={cn(
                    "flex flex-col rounded-md border p-4 text-left transition-all",
                    active
                      ? "border-violet-500/60 bg-violet-600/10 ring-1 ring-violet-500/40"
                      : "border-line bg-ink-850/60 hover:border-line-bright"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-display text-sm font-semibold text-white">
                      {opt.title}
                    </span>
                    {opt.recommended && (
                      <Badge variant="violet" className="shrink-0">
                        <Star className="h-3 w-3" /> 推荐
                      </Badge>
                    )}
                  </div>
                  <span className="mt-0.5 text-[11px] text-slate-500">
                    提出者：{opt.proposedBy}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {opt.summary}
                  </p>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                        <ThumbsUp className="h-3 w-3" /> 优点
                      </div>
                      <ul className="space-y-0.5 text-slate-400">
                        {opt.pros.map((p) => (
                          <li key={p}>· {p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-rose-300">
                        <AlertTriangle className="h-3 w-3" /> 风险
                      </div>
                      <ul className="space-y-0.5 text-slate-400">
                        {opt.risks.map((r) => (
                          <li key={r}>· {r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-blue-300">
                      <FileCode2 className="h-3 w-3" /> 影响文件
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {opt.impactedFiles.map((f) => (
                        <span
                          key={f}
                          className="rounded bg-ink-900/70 px-1.5 py-0.5 font-mono text-[10px] text-slate-400"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 border-t border-slate-800 pt-2">
                    <div className="mb-1 text-[11px] font-semibold text-slate-400">
                      Agent 评分
                    </div>
                    <div className="space-y-1">
                      {Object.entries(opt.scores).map(([k, v]) => (
                        <ScoreBar key={k} label={k} value={v} />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Human Decision Panel */}
        <div className="flex min-h-0 flex-col border-l border-slate-800/80 bg-ink-900/40">
          <PanelTitle icon={Gavel}>Human Decision</PanelTitle>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div>
              <div className="text-[11px] text-slate-500">当前选中方案</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-base font-semibold text-white">
                  {selectedOption.title}
                </span>
                {selectedOption.recommended && (
                  <Badge variant="violet">
                    <Star className="h-3 w-3" /> 推荐
                  </Badge>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
              <div className="text-[11px] font-semibold text-violet-300">
                推荐理由
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                {selectedOption.recommended
                  ? recommendedReason
                  : "该方案非系统推荐，确认前请评估其风险与维护成本。"}
              </p>
            </div>

            {confirmedId && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-600/10 p-3 text-xs text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                已确认 {getCouncilOption(confirmedId)?.title}，任务流已继续。
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-line p-4">
            <div className="callsign mb-1 text-[9px] text-human/80">
              ▸ 最终裁决权属于你
            </div>
            <Button
              variant="warning"
              className="w-full"
              disabled={!!confirmedId}
              onClick={() => confirmCouncilOption(selectedId)}
            >
              <Gavel className="h-4 w-4" />
              {selectedId === "option-a"
                ? "Confirm Option A"
                : `Confirm ${selectedOption.title.split(" · ")[0]}`}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setPage("tasks")}
            >
              <ArrowLeft className="h-4 w-4" /> 返回 Task Board
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelTitle({
  icon: Icon,
  children,
}: {
  icon: typeof Scale;
  children: React.ReactNode;
}) {
  return (
    <div className="callsign flex items-center gap-2 border-b border-line px-4 py-3 text-[10px] text-slate-400">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-[10px] text-slate-500">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700">
        <div
          className="h-full rounded-full bg-violet-500"
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className="w-5 shrink-0 text-right text-[10px] font-medium text-slate-300">
        {value}
      </span>
    </div>
  );
}
