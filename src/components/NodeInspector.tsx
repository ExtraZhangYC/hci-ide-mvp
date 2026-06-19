import {
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  ArrowRight,
  MousePointerSquareDashed,
  ShieldCheck,
} from "lucide-react";
import { useDemoStore } from "@/store/useDemoStore";
import { NodeStatusPill } from "@/components/StatusPill";
import { NodeExecutionLog } from "@/components/NodeExecutionLog";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { InterventionScope } from "@/types";

const scopeLabels: Record<InterventionScope, string> = {
  current_step: "仅当前步骤",
  current_agent: "当前 Agent 后续",
  whole_workflow: "整个 Workflow",
  project_rule: "项目长期规则",
};

export function NodeInspector() {
  const nodes = useDemoStore((s) => s.nodes);
  const selectedNodeId = useDemoStore((s) => s.selectedNodeId);
  const rules = useDemoStore((s) => s.interventionRules);
  const feedback = useDemoStore((s) => s.interventionFeedback);

  const node = nodes.find((n) => n.id === selectedNodeId) ?? null;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Intervention feedback banner */}
      {feedback && (
        <div className="m-3 mb-0 rounded-md border border-human/40 bg-human/10 p-3 shadow-glow-human">
          <div className="callsign flex items-center gap-2 text-[10px] text-human">
            <ShieldCheck className="h-4 w-4" /> 介入已生效
          </div>
          <p className="mt-1 text-xs leading-relaxed text-human-soft/90">
            {feedback}
          </p>
        </div>
      )}

      {/* Node detail */}
      <div className="p-4">
        <div className="callsign mb-2 flex items-center gap-2 text-[10px] text-slate-500">
          <MousePointerSquareDashed className="h-3.5 w-3.5" />
          Node Inspector
        </div>

        {!node ? (
          <p className="text-sm text-slate-500">点击泳道图中的节点查看详情。</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-base font-semibold text-white">
                  {node.label}
                </div>
                <div className="callsign text-[10px] text-slate-500">
                  {node.lane} · {node.owner}
                </div>
              </div>
              <NodeStatusPill status={node.status} />
            </div>

            <p className="rounded-md border border-line bg-ink-900/60 p-3 text-xs leading-relaxed text-slate-300">
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

            <div className="rounded-md border border-command/20 bg-command/5 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-command-soft">
                <ArrowRight className="h-3.5 w-3.5" /> 下一步
              </div>
              <p className="mt-1 text-xs text-slate-300">{node.nextAction}</p>
            </div>

            <NodeExecutionLog nodeId={node.id} status={node.status} />
          </div>
        )}
      </div>

      {/* Intervention rules */}
      {rules.length > 0 && (
        <div className="border-t border-line p-4">
          <div className="callsign mb-2 flex items-center gap-2 text-[10px] text-human">
            <ShieldCheck className="h-3.5 w-3.5" />
            用户介入规则 · {rules.length}
          </div>
          <div className="space-y-2">
            {rules.map((r, i) => (
              <div
                key={i}
                className="rounded-md border border-human/30 bg-human/5 p-3"
              >
                <p className="text-xs text-human-soft">{r.text}</p>
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
