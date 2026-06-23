import type { DemoTask, WorkflowNodeData } from "@/types";
import {
  workflowNodes as baseWorkflowNodes,
  primaryIndexInColumn,
  revealedCountThroughColumn,
} from "@/data/workflow";
import { DEFAULT_TASK_TEXT } from "@/data/deliveryReport";

const cloneNodes = (): WorkflowNodeData[] =>
  baseWorkflowNodes.map((n) => ({
    ...n,
    input: [...n.input],
    output: [...n.output],
  }));

/** 进度到第 activeCol 列：之前列 done，该列 active（并行列两节点同时点亮），其余 pending */
function nodesProgressAtColumn(activeCol: number): WorkflowNodeData[] {
  return cloneNodes().map((n) => {
    if (n.column < activeCol) return { ...n, status: "done" as const };
    if (n.column === activeCol) return { ...n, status: "active" as const };
    return n;
  });
}

function allDoneNodes(): WorkflowNodeData[] {
  return cloneNodes().map((n) => ({ ...n, status: "done" as const }));
}

const TOTAL_NODES = baseWorkflowNodes.length;
const COMPLETE_INDEX = baseWorkflowNodes.findIndex(
  (n) => n.id === "n18-run-complete"
);
/** 执行段（N7 执行中）所在列 */
const EXEC_COLUMN = 7;

export const initialTasks: DemoTask[] = [
  {
    id: "task-permission",
    title: "权限校验功能",
    taskText: DEFAULT_TASK_TEXT,
    stage: "executing",
    analysisReady: true,
    nodes: nodesProgressAtColumn(EXEC_COLUMN),
    revealedNodeCount: revealedCountThroughColumn(baseWorkflowNodes, EXEC_COLUMN),
    activeStepIndex: primaryIndexInColumn(baseWorkflowNodes, EXEC_COLUMN),
    selectedNodeId: "n7-executing-be",
    interventionRules: [],
    confirmedCouncilOptionId: null,
    interventionFeedback: null,
    timeline: [],
  },
  {
    id: "task-api-docs",
    title: "API 文档生成",
    taskText: "为现有 REST API 自动生成 OpenAPI 文档并补充示例。",
    stage: "idle",
    analysisReady: false,
    nodes: cloneNodes(),
    revealedNodeCount: 0,
    activeStepIndex: -1,
    selectedNodeId: null,
    interventionRules: [],
    confirmedCouncilOptionId: null,
    interventionFeedback: null,
    timeline: [],
  },
  {
    id: "task-login-refactor",
    title: "登录流程重构",
    taskText: "重构 OAuth 登录流程，支持第三方账号绑定与单点登录。",
    stage: "delivery",
    analysisReady: true,
    nodes: allDoneNodes(),
    revealedNodeCount: TOTAL_NODES,
    activeStepIndex: COMPLETE_INDEX,
    selectedNodeId: "n18-run-complete",
    interventionRules: [],
    confirmedCouncilOptionId: "option-a",
    interventionFeedback: null,
    timeline: [],
  },
  {
    id: "task-payment",
    title: "支付模块集成",
    taskText: "集成 Stripe 支付网关，支持订阅与一次性付款。",
    stage: "analyzing",
    analysisReady: true,
    nodes: cloneNodes(),
    revealedNodeCount: 0,
    activeStepIndex: -1,
    selectedNodeId: null,
    interventionRules: [],
    confirmedCouncilOptionId: null,
    interventionFeedback: null,
    timeline: [],
  },
];

export const DEFAULT_TASK_ID = "task-permission";
