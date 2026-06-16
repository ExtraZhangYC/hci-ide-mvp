import type { DemoTask, WorkflowNodeData } from "@/types";
import { workflowNodes as baseWorkflowNodes } from "@/data/workflow";
import { DEFAULT_TASK_TEXT } from "@/data/deliveryReport";

const cloneNodes = (): WorkflowNodeData[] =>
  baseWorkflowNodes.map((n) => ({
    ...n,
    input: [...n.input],
    output: [...n.output],
  }));

function nodesWithProgress(
  doneCount: number,
  activeIndex: number
): WorkflowNodeData[] {
  return cloneNodes().map((n, i) => {
    if (i < doneCount) return { ...n, status: "done" as const };
    if (i === activeIndex) return { ...n, status: "active" as const };
    return n;
  });
}

function allDoneNodes(): WorkflowNodeData[] {
  return cloneNodes().map((n) => ({ ...n, status: "done" as const }));
}

export const initialTasks: DemoTask[] = [
  {
    id: "task-permission",
    title: "权限校验功能",
    taskText: DEFAULT_TASK_TEXT,
    stage: "executing",
    analysisReady: true,
    nodes: nodesWithProgress(4, 4),
    revealedNodeCount: 5,
    activeStepIndex: 4,
    selectedNodeId: "work",
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
    revealedNodeCount: 10,
    activeStepIndex: 9,
    selectedNodeId: "complete",
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
