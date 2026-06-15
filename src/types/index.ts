export type PageKey = "agents" | "tasks" | "council";

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
