/** 方向 B · Agent 角色与记忆 API 类型 */

export type PersonaDef = {
  role_id: string;
  version: number;
  summary: string;
  skills_overview: string;
  experience_coverage: string;
  recent_performance: string;
  notes: string;
  generated_at: string;
};

export type AgentMetrics = {
  role_id: string;
  period_start: string;
  period_end: string;
  total_tasks: number;
  success_rate: number;
  average_confidence: number;
  skill_count: number;
  experience_count: number;
  token_cost_total: number;
  intervention_count: number;
  council_win_rate: number;
  failure_types: string[];
  collaboration_score: string;
};

export type DriverInfo = {
  driver_id: string;
  name: string;
  auth_strategy: "none" | "env-auto" | "pre-configured" | "interactive";
  connected: boolean;
  capabilities: string[];
};

export type AgentRuntimeState = {
  agent_id: string;
  role_id: string;
  status: "idle" | "working" | "waiting" | "reviewing" | "done";
  current_task_id?: string;
  current_node_id?: string;
  current_action?: string;
  current_files?: string[];
  driver_id: string;
  worktree_id?: string;
};
