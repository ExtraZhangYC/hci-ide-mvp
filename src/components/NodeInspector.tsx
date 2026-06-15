import {
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  ArrowRight,
  MousePointerSquareDashed,
  ShieldCheck,
  ScrollText,
} from "lucide-react";
import { useDemoStore } from "@/store/useDemoStore";
import { NodeStatusPill } from "@/components/StatusPill";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { InterventionScope } from "@/types";

const scopeLabels: Record<InterventionScope, string> = {
  current_step: "仅当前步骤",
  current_agent: "当前 Agent 后续",
  whole_workflow: "整个 Workflow",
  project_rule: "项目长期规则",
};

const logLevelColor: Record<string, string> = {
  info: "text-slate-400",
  success: "text-emerald-300",
  warning: "text-amber-300",
  council: "text-violet-300",
};

export function NodeInspector() {
  const nodes = useDemoStore((s) => s.nodes);
  const selectedNodeId = useDemoStore((s) => s.selectedNodeId);
  const rules = useDemoStore((s) => s.interventionRules);
  const feedback = useDemoStore((s) => s.interventionFeedback);
  const logs = useDemoStore((s) => s.logs);

  const node = nodes.find((n) => n.id === selectedNodeId) ?? null;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Intervention feedback banner */}
      {feedback && (
        <div className="m-3 mb-0 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-200">
            <ShieldCheck className="h-4 w-4" /> 介入已生效
          </div>
          <p className="mt-1 text-xs leading-relaxed text-amber-100/90">
            {feedback}
          </p>
        </div>
      )}

      {/* Node detail */}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          <MousePointerSquareDashed className="h-3.5 w-3.5" />
          Node Inspector
        </div>

        {!node ? (
          <p className="text-sm text-slate-500">点击泳道图中的节点查看详情。</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-white">
                  {node.label}
                </div>
                <div className="text-xs text-slate-500">
                  {node.lane} · {node.owner}
                </div>
              </div>
              <NodeStatusPill status={node.status} />
            </div>

            <p className="rounded-lg border border-slate-800 bg-ink-900/60 p-3 text-xs leading-relaxed text-slate-300">
              {node.summary}
            </p>

            <InfoList
              icon={ArrowDownToLine}
              title="输入"
              items={node.input}
              tone="blue"
            />
            <InfoList
              icon={ArrowUpFromLine}
              title="输出"
              items={node.output}
              tone="green"
            />

            <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-300">
                <AlertTriangle className="h-3.5 w-3.5" /> 风险
              </div>
              <p className="mt-1 text-xs text-rose-100/80">{node.risk}</p>
            </div>

            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-300">
                <ArrowRight className="h-3.5 w-3.5" /> 下一步
              </div>
              <p className="mt-1 text-xs text-blue-100/80">{node.nextAction}</p>
            </div>
          </div>
        )}
      </div>

      {/* Intervention rules */}
      {rules.length > 0 && (
        <div className="border-t border-slate-800/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            用户介入规则 · {rules.length}
          </div>
          <div className="space-y-2">
            {rules.map((r, i) => (
              <div
                key={i}
                className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3"
              >
                <p className="text-xs text-amber-100">{r.text}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge variant="amber">{scopeLabels[r.scope]}</Badge>
                  {r.affectedAgents.map((a) => (
                    <Badge key={a} variant="slate">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event log */}
      {logs.length > 0 && (
        <div className="border-t border-slate-800/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <ScrollText className="h-3.5 w-3.5" />
            执行日志
          </div>
          <div className="space-y-1.5">
            {logs.map((l, i) => (
              <div key={i} className="flex gap-2 text-[11px]">
                <span className="shrink-0 font-mono text-slate-600">
                  {l.time}
                </span>
                <span className="shrink-0 text-slate-500">{l.source}</span>
                <span className={cn(logLevelColor[l.level])}>{l.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoList({
  icon: Icon,
  title,
  items,
  tone,
}: {
  icon: typeof ArrowDownToLine;
  title: string;
  items: string[];
  tone: "blue" | "green";
}) {
  return (
    <div>
      <div
        className={cn(
          "mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold",
          tone === "blue" ? "text-blue-300" : "text-emerald-300"
        )}
      >
        <Icon className="h-3.5 w-3.5" /> {title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span
            key={it}
            className="rounded-md border border-slate-800 bg-ink-900/60 px-2 py-1 text-[11px] text-slate-300"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
