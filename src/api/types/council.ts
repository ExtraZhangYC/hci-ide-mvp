/** 方向 C · Council API 类型 */

import type { RiskLevel } from "./coord";

export type CouncilStatus =
  | "created"
  | "context_packaging"
  | "profile_snapshotting"
  | "extracting"
  | "proposing"
  | "cross_reviewing"
  | "diffing"
  | "judging"
  | "deciding"
  | "completed"
  | "escalated_to_human"
  | "failed"
  | "timeout"
  | "cancelled";

export type CouncilParticipantProfileSnapshot = {
  participant_id: string;
  council_id: string;
  agent_id: string;
  role_id: string;
  driver_id: string;
  participant_role: "proposer" | "reviewer" | "judge" | "observer";
  capability_tags: string[];
  domain_experience_summary?: string;
  known_strengths?: string[];
  known_limits?: string[];
  review_specialties?: string[];
  conflict_of_interest_flags?: string[];
};

export type ClaimCluster = {
  cluster_id: string;
  normalized_claim: string;
  supporting_proposals: string[];
  evidence_refs: string[];
  risk_level: RiskLevel;
};

export type ConflictCluster = {
  cluster_id: string;
  conflict_type:
    | "same_range_text_conflict"
    | "api_contract_conflict"
    | "assumption_conflict"
    | "risk_policy_conflict"
    | "artifact_dependency_conflict";
  claims: string[];
  proposals: string[];
  severity: "blocker" | "high" | "medium" | "low";
};

export type NWayDiff = {
  diff_id: string;
  council_id: string;
  base_ref: string;
  full_consensus: ClaimCluster[];
  partial_agreement: ClaimCluster[];
  disagreement: ConflictCluster[];
  unique_findings: ClaimCluster[];
};

export type MergeAuthorization = {
  authorized: boolean;
  source: "human" | "deterministic_gate";
  selected_proposal_id?: string;
  target_branch: string;
  human_approval_ref?: string;
};

export type DecisionPacket = {
  decision_id: string;
  council_id?: string;
  mode: "advisory" | "evidence_only" | "human_gate";
  outcome:
    | "approve_merge"
    | "request_revision"
    | "choose_alternative"
    | "reject"
    | "defer";
  summary: string;
  recommended_option?: string;
  selected_proposal_id?: string;
  required_action: DecisionPacket["outcome"];
  artifact_refs: string[];
  approval_basis: string[];
  gate_refs: string[];
  merge_authorization_status: "none" | "pending_human" | "authorized";
  merge_authorization?: MergeAuthorization;
  rationale: string[];
  human_approval_ref?: string;
};

export type CouncilSession = {
  council_id: string;
  origin_task_id: string;
  status: CouncilStatus;
  question: string;
  decision_mode: DecisionPacket["mode"];
  participant_count: number;
  nway_diff?: NWayDiff;
  decision_packet?: DecisionPacket;
  participant_profiles: CouncilParticipantProfileSnapshot[];
};
