/** 方向 D · Hook / Gate API 类型 */

export type GateDecision = "allow" | "deny" | "ask" | "defer";

export type GateResult = {
  gate_result_id: string;
  gate_point: string;
  gate_id: string;
  subject_id: string;
  decision: GateDecision;
  reason: string;
  required_actions: string[];
  audit_ref: string;
  created_at: string;
};

export type HookEventType =
  | "task.created"
  | "task.claimed"
  | "task.started"
  | "task.progress"
  | "task.completed"
  | "task.failed"
  | "task.escalated"
  | "agent.checkpoint"
  | "agent.session_start"
  | "agent.session_end"
  | "agent.pre_tool_use"
  | "agent.message_send"
  | "council.started"
  | "council.proposal"
  | "council.review"
  | "council.diff_ready"
  | "council.decision"
  | "council.completed"
  | "lifecycle.human_gate"
  | "system.timeout"
  | "system.agent_crash";

export type HookEvent<T = Record<string, unknown>> = {
  event_id: string;
  event_type: HookEventType;
  subject_id: string;
  payload: T;
  created_at: string;
};

export type HumanGatePayload = {
  gate_id: string;
  gate_point: string;
  subject_id: string;
  gate_reason: string;
  decision_options: Array<{
    id: string;
    label: string;
    description?: string;
    recommended?: boolean;
  }>;
  context_pack_ref: string;
  timeout_seconds: number;
  agent_recommendation?: string;
  impact_summary?: string;
};

export type TaskProgressPayload = {
  task_id: string;
  agent_id: string;
  percent: number;
  progress_message: string;
  done_items: string[];
  in_progress_items: string[];
  blocked_items: string[];
};

export type HookResult = {
  event: HookEventType;
  decision: GateDecision;
  gate_results: GateResult[];
};
