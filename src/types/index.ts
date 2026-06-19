export type PageKey = "agents" | "tasks" | "council";

/** 单个任务及其泳道图执行状态 */
export type DemoTask = {
  id: string;
  title: string;
  taskText: string;
  stage: DemoStage;
  analysisReady: boolean;
  nodes: WorkflowNodeData[];
  revealedNodeCount: number;
  activeStepIndex: number;
  selectedNodeId: string | null;
  interventionRules: InterventionRule[];
  confirmedCouncilOptionId: string | null;
  interventionFeedback: string | null;
  timeline: TimelineEvent[];
};

export type DemoStage =
  | "idle"
  | "team_configured"
  | "analyzing"
  | "workflow_recommended"
  | "executing"
  | "intervention"
  | "council"
  | "delivery";

export type AgentStatus = "idle" | "working" | "waiting" | "reviewing" | "done";

export type Agent = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  successRate: number;
  acceptedRate: number;
  avgCompletionTime: string;
  tokenCost: string;
  skills: string[];
  historicalTasks: number;
  failureCount: number;
  collaboration: "优秀" | "良好" | "一般";
  recentTask: string;
  description: string;
};

export type WorkflowNodeStatus =
  | "pending"
  | "active"
  | "done"
  | "blocked"
  | "updated";

export type Lane = "User" | "System" | "Backend" | "Test" | "Security" | "Council";

export type WorkflowNodeData = {
  id: string;
  label: string;
  lane: Lane;
  owner: string;
  status: WorkflowNodeStatus;
  summary: string;
  input: string[];
  output: string[];
  risk: string;
  nextAction: string;
};

export type CouncilOption = {
  id: string;
  title: string;
  proposedBy: string;
  summary: string;
  pros: string[];
  risks: string[];
  impactedFiles: string[];
  scores: Record<string, number>;
  recommended?: boolean;
};

export type InterventionScope =
  | "current_step"
  | "current_agent"
  | "whole_workflow"
  | "project_rule";

export type InterventionRule = {
  text: string;
  scope: InterventionScope;
  affectedAgents: string[];
};

export type DiscussionMessage = {
  agent: string;
  role: string;
  message: string;
  accent: "backend" | "test" | "security" | "system";
};

export type LogLevel = "info" | "success" | "warning" | "council";

export type LogEntry = {
  time: string;
  source: string;
  text: string;
  level: LogLevel;
};

export type TimelineCheckpoint = {
  label: string;
  description: string;
};

/** 可回溯的 Demo 执行快照 */
export type DemoSnapshot = {
  stage: DemoStage;
  currentPage: PageKey;
  nodes: WorkflowNodeData[];
  revealedNodeCount: number;
  activeStepIndex: number;
  selectedNodeId: string | null;
  interventionRules: InterventionRule[];
  confirmedCouncilOptionId: string | null;
  interventionFeedback: string | null;
};

export type TimelineEvent = LogEntry & {
  id: string;
  checkpoint?: TimelineCheckpoint;
  snapshot: DemoSnapshot;
};

export type NodeExecLogLevel = LogLevel | "debug";

/** 单条节点内部执行日志 */
export type NodeExecLogLine = {
  time: string;
  tag: string;
  message: string;
  level: NodeExecLogLevel;
};

/** 某节点的完整执行日志（mock） */
export type NodeExecutionLogDetail = {
  duration?: string;
  tokenUsage?: string;
  lines: NodeExecLogLine[];
};
