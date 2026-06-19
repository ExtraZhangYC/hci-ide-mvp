import { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeProps,
  type NodeMouseHandler,
} from "@xyflow/react";
import type { WorkflowNodeData } from "@/types";
import { lanes, laneLabels } from "@/data/workflow";
import { useDemoStore } from "@/store/useDemoStore";
import { cn } from "@/lib/utils";

const LANE_HEIGHT = 116;
const NODE_W = 178;
const COL_GAP = 212;
const X_OFFSET = 170;

const laneAccent: Record<string, string> = {
  User: "border-l-human/70", // the human's own lane glows warm
  Coord: "border-l-command/70", // C · 协调编排 — command azure
  Context: "border-l-teal-500/60", // B · 角色记忆
  Driver: "border-l-sky-500/60", // A · Driver 执行
  Gate: "border-l-indigo-500/60", // D · Hook/Gate
  Council: "border-l-violet-500/60",
  Merge: "border-l-emerald-500/60",
};

// 责任方角标配色（A/B/C/D/User/Merger）
const directionStyles: Record<string, string> = {
  User: "bg-human/15 text-human-soft",
  A: "bg-sky-500/15 text-sky-300",
  B: "bg-teal-500/15 text-teal-300",
  C: "bg-command/15 text-command-soft",
  D: "bg-indigo-500/15 text-indigo-300",
  Merger: "bg-emerald-500/15 text-emerald-300",
};

const statusStyles: Record<
  WorkflowNodeData["status"],
  { box: string; dot: string; label: string }
> = {
  pending: {
    box: "border-line-bright bg-ink-850 text-slate-400",
    dot: "bg-slate-600",
    label: "待执行",
  },
  active: {
    box: "border-command bg-command/15 text-slate-100 shadow-glow",
    dot: "bg-command animate-pulse-ring",
    label: "执行中",
  },
  done: {
    box: "border-emerald-500/60 bg-emerald-600/10 text-emerald-100",
    dot: "bg-emerald-400",
    label: "已完成",
  },
  blocked: {
    box: "border-rose-500/70 bg-rose-600/10 text-rose-100",
    dot: "bg-rose-400",
    label: "已阻塞",
  },
  updated: {
    box: "border-dashed border-human/70 bg-human/10 text-human-soft shadow-glow-human",
    dot: "bg-human",
    label: "已被介入",
  },
};

type StepNodeData = {
  wf: WorkflowNodeData;
  selected: boolean;
  isNew?: boolean;
};

function StepNode({ data }: NodeProps<Node<StepNodeData>>) {
  const { wf, selected, isNew } = data;
  const s = statusStyles[wf.status];
  // 节点上展示的状态码：优先 canonical TaskStatus，否则用 statusNote 占位
  const statusCode = wf.taskStatus ?? wf.statusNote ?? "—";
  return (
    <div
      className={cn(
        "w-[182px] rounded-md border px-3 py-2.5 transition-all cursor-pointer",
        s.box,
        selected && "ring-2 ring-white/40",
        isNew && "animate-fade-in"
      )}
    >
      <Handle type="target" position={Position.Left} className="!opacity-0" />
      <div className="flex items-center justify-between gap-1">
        <span className="flex items-center gap-1">
          <span className="font-mono text-[9px] font-semibold text-slate-300">
            {wf.code}
          </span>
          <span
            className={cn(
              "rounded px-1 py-px font-mono text-[8px] font-semibold",
              directionStyles[wf.direction] ?? "bg-slate-700/40 text-slate-400"
            )}
          >
            {wf.direction}
          </span>
        </span>
        <span className={cn("led h-2 w-2", s.dot)} />
      </div>
      <div className="mt-1 font-display text-[13px] font-semibold leading-tight">
        {wf.label}
      </div>
      <div className="truncate text-[10px] text-slate-400">{wf.labelCn}</div>
      <div className="mt-1.5 truncate font-mono text-[9px] text-slate-500">
        {statusCode}
      </div>
      <Handle type="source" position={Position.Right} className="!opacity-0" />
    </div>
  );
}

function LaneNode({ data }: NodeProps<Node<{ label: string; lane: string; width: number }>>) {
  return (
    <div
      className={cn(
        "h-[116px] rounded-r-md border-l-[3px] bg-ink-900/30",
        laneAccent[data.lane] ?? "border-l-slate-600"
      )}
      style={{ width: data.width }}
    >
      <div className="callsign px-3 py-2 text-[10px] text-slate-400">
        {data.label}
      </div>
    </div>
  );
}

const nodeTypes = {
  step: StepNode,
  lane: LaneNode,
};

function WorkflowCanvasInner() {
  const allNodes = useDemoStore((s) => s.nodes);
  const revealedNodeCount = useDemoStore((s) => s.revealedNodeCount);
  const selectedNodeId = useDemoStore((s) => s.selectedNodeId);
  const selectNode = useDemoStore((s) => s.selectNode);
  const { fitView } = useReactFlow();

  const wfNodes = useMemo(
    () => allNodes.slice(0, revealedNodeCount),
    [allNodes, revealedNodeCount]
  );

  const totalWidth = X_OFFSET + Math.max(wfNodes.length, 1) * COL_GAP;

  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.15, maxZoom: 1, duration: 300 }), 50);
    return () => clearTimeout(t);
  }, [revealedNodeCount, fitView]);

  const { nodes, edges } = useMemo(() => {
    const laneIndex = (lane: string) => lanes.indexOf(lane as never);

    const laneNodes: Node[] = lanes.map((lane, i) => ({
      id: `lane-${lane}`,
      type: "lane",
      position: { x: 0, y: i * LANE_HEIGHT },
      data: { label: laneLabels[lane], lane, width: totalWidth },
      draggable: false,
      selectable: false,
      zIndex: 0,
      style: { zIndex: 0 },
    }));

    const stepNodes: Node[] = wfNodes.map((wf, i) => ({
      id: wf.id,
      type: "step",
      position: {
        x: X_OFFSET + i * COL_GAP,
        y: laneIndex(wf.lane) * LANE_HEIGHT + 26,
      },
      data: {
        wf,
        selected: selectedNodeId === wf.id,
        isNew: i === wfNodes.length - 1,
      },
      draggable: false,
      zIndex: 5,
      style: { zIndex: 5, width: NODE_W },
    }));

    const stepEdges: Edge[] = [];
    for (let i = 0; i < wfNodes.length - 1; i++) {
      const from = wfNodes[i];
      const to = wfNodes[i + 1];
      const animated = from.status === "done" && to.status === "active";
      stepEdges.push({
        id: `${from.id}-${to.id}`,
        source: from.id,
        target: to.id,
        animated,
        style: {
          stroke: from.status === "done" ? "#3b82f6" : "#334155",
          strokeWidth: 1.5,
        },
      });
    }

    return { nodes: [...laneNodes, ...stepNodes], edges: stepEdges };
  }, [wfNodes, selectedNodeId, totalWidth]);

  const onNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (node.type === "step") selectNode(node.id);
    },
    [selectNode]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15, maxZoom: 1 }}
        minZoom={0.4}
        maxZoom={1.4}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        elementsSelectable
        panOnScroll
        className="bg-ink-950"
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#1e293b" />
        <Controls
          showInteractive={false}
          className="!bg-ink-800 !border-slate-700 [&_button]:!bg-ink-700 [&_button]:!border-slate-700 [&_button]:!text-slate-300"
        />
      </ReactFlow>
    </div>
  );
}

export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
}
