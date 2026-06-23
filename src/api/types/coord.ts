/** 方向 C · 长程协调 API 类型 */

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type TaskStatus =
  | "created"
  | "triaged"
  | "ready"
  | "claimed"
  | "running"
  | "waiting_help"
  | "blocked"
  | "escalated"
  | "reviewing"
  | "merging"
  | "completed"
  | "failed"
  | "cancelled";

export type CoordTask = {
  task_id: string;
  parent_id?: string;
  status: TaskStatus;
  spec: string;
  role_id?: string;
  risk_level: RiskLevel;
  owner_agent_id?: string;
  completion_criteria: string[];
  created_at: string;
  updated_at: string;
};

export type SemanticHandoff = {
  done: string[];
  in_progress: string[];
  blocked_on: string[];
  assumptions: string[];
  next_steps: string[];
  known_risks: string[];
};

export type CheckpointRecord = {
  checkpoint_id: string;
  parent_checkpoint_id?: string;
  checkpoint_type: "full" | "incremental";
  schema_version: string;
  task_id: string;
  agent_id: string;
  trigger: string;
  semantic_handoff: SemanticHandoff;
  artifact_refs: string[];
  created_at: string;
};

export type AgentMessageType =
  | "ask_help"
  | "review_request"
  | "proposal"
  | "critique"
  | "handoff"
  | "status_update"
  | "decision_request"
  | "decision_response";

export type AgentMessage = {
  message_id: string;
  thread_id: string;
  from_agent_id: string;
  type: AgentMessageType;
  payload: Record<string, unknown>;
  artifact_refs?: string[];
  requires_ack: boolean;
  deadline_seconds?: number;
  created_at: string;
};

export type ArtifactRef = {
  artifact_id: string;
  type: string;
  uri: string;
  sha256?: string;
  producer_id?: string;
  task_id?: string;
};

export type ResumeRequest = {
  task_id: string;
  checkpoint_id: string;
};

export type ResumeResponse = {
  task_id: string;
  restored_state: "ready" | "running";
  resume_cursor: string;
};
