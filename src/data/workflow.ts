import type { Lane, WorkflowNodeData } from "@/types";

export const lanes: Lane[] = [
  "User",
  "System",
  "Backend",
  "Test",
  "Security",
  "Council",
];

export const laneLabels: Record<Lane, string> = {
  User: "User · 用户",
  System: "System · 调度",
  Backend: "Backend · 后端",
  Test: "Test · 测试",
  Security: "Security · 安全",
  Council: "Council · 议会",
};

/**
 * 固定 10 个节点的初始定义。store 会基于此创建可变副本。
 */
export const workflowNodes: WorkflowNodeData[] = [
  {
    id: "task-brief",
    label: "Task Brief",
    lane: "User",
    owner: "用户 / Product",
    status: "pending",
    summary: "接收并结构化用户提出的开发任务，明确目标与验收口径。",
    input: ["用户原始任务描述", "当前项目上下文"],
    output: ["结构化任务卡", "验收标准草案"],
    risk: "需求歧义可能导致后续返工。",
    nextAction: "进入 Routing 进行需求路由分析。",
  },
  {
    id: "routing",
    label: "Routing",
    lane: "System",
    owner: "Orchestrator",
    status: "pending",
    summary: "分析任务类型与涉及模块，决定需要哪些 Agent 能力。",
    input: ["结构化任务卡"],
    output: ["能力需求清单", "推荐 Workflow 模板"],
    risk: "路由错误会分配到不合适的 Agent。",
    nextAction: "进入 Assignment 进行人员编排。",
  },
  {
    id: "assignment",
    label: "Assignment",
    lane: "System",
    owner: "Orchestrator",
    status: "pending",
    summary: "把任务分配给已组建团队中的对应 Agent，并锁定责任人。",
    input: ["能力需求清单", "项目团队成员"],
    output: ["任务-Agent 分配表"],
    risk: "团队缺少某项能力时需回退到 Agent Board 补员。",
    nextAction: "进入 Plan 由后端 Agent 制定实现方案。",
  },
  {
    id: "plan",
    label: "Plan",
    lane: "Backend",
    owner: "Backend Eng A",
    status: "pending",
    summary: "制定登录后权限校验的实现方案，拆解为可执行步骤。",
    input: ["任务-Agent 分配表", "现有鉴权代码"],
    output: ["实现计划", "受影响文件清单"],
    risk: "存在两种权限策略尚未确定，可能需要 Council 裁决。",
    nextAction: "进入 Work 开始编码实现。",
  },
  {
    id: "work",
    label: "Work",
    lane: "Backend",
    owner: "Backend Eng A",
    status: "pending",
    summary: "实现登录态识别、角色权限判断与接口权限拦截逻辑。",
    input: ["实现计划", "用户实时介入规则"],
    output: ["authMiddleware.ts", "permissionService.ts", "userRole.ts"],
    risk: "Admin 角色权限边界、组织级越权需要明确规则。",
    nextAction: "可在此节点 Intervene 注入业务规则，随后进入 Gate Check。",
  },
  {
    id: "gate-check",
    label: "Gate Check",
    lane: "Test",
    owner: "Test Agent",
    status: "pending",
    summary: "为新增权限逻辑补充并运行测试，进行质量门禁。",
    input: ["实现产出代码", "用户介入规则"],
    output: ["测试用例", "覆盖率报告"],
    risk: "未覆盖未授权访问路径会留下漏洞。",
    nextAction: "通过后进入 Security Review。",
  },
  {
    id: "security-review",
    label: "Security Review",
    lane: "Security",
    owner: "Security Audit Agent",
    status: "pending",
    summary: "审查权限实现的安全风险，重点检查 Admin bypass 与越权。",
    input: ["实现产出代码", "测试报告", "用户介入规则"],
    output: ["安全审查结论", "风险等级评估"],
    risk: "Admin 默认全权限规则需评估是否带来越权面扩大。",
    nextAction: "进入 Human Gate 等待用户确认关键决策。",
  },
  {
    id: "human-gate",
    label: "Human Gate",
    lane: "User",
    owner: "用户 / Tech Lead",
    status: "pending",
    summary: "系统发现存在两种权限策略，需要用户做关键决策。",
    input: ["安全审查结论", "策略冲突说明"],
    output: ["进入 Council 的决策请求"],
    risk: "若直接默认策略可能与产品预期不符。",
    nextAction: "进入 Council Board 对比方案并裁决。",
  },
  {
    id: "council",
    label: "Council",
    lane: "Council",
    owner: "Multi-Agent Council",
    status: "pending",
    summary: "多 Agent 提出权限策略方案，由用户基于证据最终裁决。",
    input: ["策略方案 A/B/C", "Agent 讨论与评分"],
    output: ["用户确认的权限策略"],
    risk: "策略一旦选定将影响整体权限模型。",
    nextAction: "用户确认方案后回到主流程进入 Complete。",
  },
  {
    id: "complete",
    label: "Complete",
    lane: "System",
    owner: "Orchestrator",
    status: "pending",
    summary: "汇总所有产出、测试、介入与裁决记录，生成交付报告。",
    input: ["代码产出", "测试结果", "介入记录", "Council 决策"],
    output: ["Delivery Report"],
    risk: "建议交付后重点复核 Admin 角色权限范围。",
    nextAction: "查看 Delivery Report，完成本次任务闭环。",
  },
];

export const WORK_NODE_INDEX = workflowNodes.findIndex((n) => n.id === "work");
export const COUNCIL_NODE_INDEX = workflowNodes.findIndex(
  (n) => n.id === "council"
);
export const HUMAN_GATE_NODE_INDEX = workflowNodes.findIndex(
  (n) => n.id === "human-gate"
);
