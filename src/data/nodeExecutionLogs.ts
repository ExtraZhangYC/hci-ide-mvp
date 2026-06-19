import type { NodeExecutionLogDetail } from "@/types";

/**
 * 各 workflow 节点的详细执行日志（mock）。
 * 在 Node Inspector 的「节点执行日志」面板中展示。
 */
export const nodeExecutionLogs: Record<string, NodeExecutionLogDetail> = {
  "task-brief": {
    duration: "1.2s",
    tokenUsage: "420 tokens",
    lines: [
      { time: "00:00:42", tag: "INIT", message: "接收用户任务描述，启动需求结构化流程", level: "info" },
      { time: "00:00:43", tag: "PARSE", message: "解析任务关键词：权限校验、登录态、测试覆盖", level: "debug" },
      { time: "00:00:44", tag: "OUTPUT", message: "生成结构化任务卡 · TASK-2024-AUTH-017", level: "info" },
      { time: "00:00:44", tag: "OUTPUT", message: "提取验收标准：未授权访问拦截率 100%、Admin 边界明确", level: "info" },
      { time: "00:00:45", tag: "DONE", message: "Task Brief 完成，移交 Orchestrator 路由", level: "success" },
    ],
  },
  routing: {
    duration: "2.1s",
    tokenUsage: "680 tokens",
    lines: [
      { time: "00:01:02", tag: "INPUT", message: "读取结构化任务卡 TASK-2024-AUTH-017", level: "info" },
      { time: "00:01:03", tag: "CLASSIFY", message: "任务分类：feature + test + security_review", level: "info" },
      { time: "00:01:04", tag: "MATCH", message: "匹配 Workflow 模板：Full-Stack Auth Pipeline v2", level: "info" },
      { time: "00:01:05", tag: "CAPABILITY", message: "识别所需能力：Backend 实现 / 测试 / 安全审查 / 用户裁决", level: "info" },
      { time: "00:01:06", tag: "DONE", message: "路由完成，推荐 6-Lane · 10-Step Workflow", level: "success" },
    ],
  },
  assignment: {
    duration: "1.8s",
    tokenUsage: "510 tokens",
    lines: [
      { time: "00:01:22", tag: "INPUT", message: "读取能力需求清单与项目团队成员", level: "info" },
      { time: "00:01:23", tag: "ASSIGN", message: "Backend Eng A → 主实现（Plan + Work）", level: "info" },
      { time: "00:01:24", tag: "ASSIGN", message: "Test Agent → Gate Check 质量门禁", level: "info" },
      { time: "00:01:24", tag: "ASSIGN", message: "Security Audit Agent → Security Review", level: "info" },
      { time: "00:01:25", tag: "LOCK", message: "锁定责任人，生成任务-Agent 分配表", level: "info" },
      { time: "00:01:26", tag: "DONE", message: "Assignment 完成，通知各 Agent 就绪", level: "success" },
    ],
  },
  plan: {
    duration: "4.6s",
    tokenUsage: "2,840 tokens",
    lines: [
      { time: "00:02:08", tag: "INPUT", message: "加载现有鉴权代码：authMiddleware.ts, userRole.ts", level: "info" },
      { time: "00:02:10", tag: "ANALYZE", message: "分析影响范围：3 个核心文件 + tests/auth/ 目录", level: "info" },
      { time: "00:02:12", tag: "PLAN", message: "步骤 1：扩展 login session 解析与角色绑定", level: "info" },
      { time: "00:02:13", tag: "PLAN", message: "步骤 2：实现 permissionService 接口级拦截", level: "info" },
      { time: "00:02:14", tag: "PLAN", message: "步骤 3：补充未授权 / Admin bypass 测试用例", level: "info" },
      { time: "00:02:15", tag: "WARN", message: "检测到策略分歧：ACL vs RBAC，标记可能触发 Council", level: "warning" },
      { time: "00:02:16", tag: "DONE", message: "实现计划就绪，等待进入 Work 节点", level: "success" },
    ],
  },
  work: {
    duration: "—",
    tokenUsage: "—",
    lines: [
      { time: "00:03:42", tag: "INIT", message: "Backend Eng A 开始编码，加载实现计划", level: "info" },
      { time: "00:03:45", tag: "EDIT", message: "创建 authMiddleware.ts — 登录态解析中间件", level: "info" },
      { time: "00:03:52", tag: "EDIT", message: "创建 permissionService.ts — 角色权限判断服务", level: "info" },
      { time: "00:04:01", tag: "EDIT", message: "更新 userRole.ts — 扩展 Admin / Member 角色枚举", level: "info" },
      { time: "00:04:08", tag: "LINT", message: "静态检查通过，0 error / 2 warning", level: "debug" },
      { time: "00:04:12", tag: "RUN", message: "本地编译验证通过，等待用户介入或继续推进", level: "info" },
    ],
  },
  "gate-check": {
    duration: "3.2s",
    tokenUsage: "1,120 tokens",
    lines: [
      { time: "00:05:18", tag: "INPUT", message: "接收 Backend 产出：3 个文件变更", level: "info" },
      { time: "00:05:20", tag: "TEST", message: "生成测试用例：tests/auth/permission.test.ts (+12 cases)", level: "info" },
      { time: "00:05:22", tag: "TEST", message: "运行测试套件：28 passed / 0 failed", level: "info" },
      { time: "00:05:23", tag: "COVER", message: "覆盖率：auth 模块 87.3%（阈值 80% ✓）", level: "info" },
      { time: "00:05:24", tag: "GATE", message: "质量门禁检查：lint ✓ · test ✓ · coverage ✓", level: "success" },
      { time: "00:05:25", tag: "DONE", message: "Gate Check 通过，移交 Security Audit Agent", level: "success" },
    ],
  },
  "security-review": {
    duration: "5.4s",
    tokenUsage: "3,560 tokens",
    lines: [
      { time: "00:06:02", tag: "INPUT", message: "加载代码变更 + 测试报告 + 用户介入规则", level: "info" },
      { time: "00:06:05", tag: "SCAN", message: "SAST 扫描：未发现 SQL 注入 / XSS 高危项", level: "info" },
      { time: "00:06:08", tag: "REVIEW", message: "审查 Admin 角色默认权限范围", level: "info" },
      { time: "00:06:10", tag: "WARN", message: "发现策略冲突：Admin 全权限 vs 组织级隔离需求", level: "warning" },
      { time: "00:06:12", tag: "RISK", message: "风险等级：Medium — 需用户裁决权限模型", level: "warning" },
      { time: "00:06:14", tag: "DONE", message: "安全审查完成，升级至 Human Gate", level: "success" },
    ],
  },
  "human-gate": {
    duration: "0.8s",
    tokenUsage: "180 tokens",
    lines: [
      { time: "00:06:32", tag: "INPUT", message: "接收安全审查结论与策略冲突说明", level: "info" },
      { time: "00:06:33", tag: "ALERT", message: "检测到 2 种候选权限策略，无法自动选择", level: "warning" },
      { time: "00:06:33", tag: "NOTIFY", message: "通知用户 / Tech Lead：需人工决策", level: "info" },
      { time: "00:06:34", tag: "ESCALATE", message: "升级至 Multi-Agent Council 进行方案对比", level: "info" },
      { time: "00:06:34", tag: "DONE", message: "Human Gate 完成，等待 Council 裁决", level: "success" },
    ],
  },
  council: {
    duration: "—",
    tokenUsage: "—",
    lines: [
      { time: "00:07:02", tag: "INIT", message: "Multi-Agent Council 启动，加载 3 套候选方案", level: "council" },
      { time: "00:07:05", tag: "DEBATE", message: "Backend Eng A 提出 Option A · RBAC 策略", level: "info" },
      { time: "00:07:08", tag: "DEBATE", message: "Security Audit Agent 提出 Option B · 最小权限", level: "info" },
      { time: "00:07:11", tag: "DEBATE", message: "Test Agent 提出 Option C · 渐进式 rollout", level: "info" },
      { time: "00:07:14", tag: "SCORE", message: "综合评分完成，Option A 推荐度最高（4.2/5）", level: "info" },
      { time: "00:07:15", tag: "WAIT", message: "等待用户在 Council Board 确认最终方案", level: "council" },
    ],
  },
  complete: {
    duration: "2.4s",
    tokenUsage: "920 tokens",
    lines: [
      { time: "00:08:42", tag: "INPUT", message: "汇总代码产出、测试结果、介入记录、Council 决策", level: "info" },
      { time: "00:08:44", tag: "AGG", message: "聚合 3 文件变更 · 28 测试 · 1 条介入规则 · RBAC 策略", level: "info" },
      { time: "00:08:45", tag: "REPORT", message: "生成 Delivery Report v1.0", level: "info" },
      { time: "00:08:46", tag: "CHECK", message: "交付检查清单：功能 ✓ · 测试 ✓ · 安全 ✓ · 文档 ✓", level: "success" },
      { time: "00:08:47", tag: "DONE", message: "任务闭环完成，建议复核 Admin 角色权限范围", level: "success" },
    ],
  },
};

/** 用户介入相关的动态日志行 */
export function buildInterventionLogLines(ruleText: string) {
  return [
    {
      time: "00:04:15",
      tag: "INTERVENE",
      message: `收到用户介入规则：${ruleText}`,
      level: "warning" as const,
    },
    {
      time: "00:04:16",
      tag: "SYNC",
      message: "规则已同步至 Coding / Test / Security Agent 上下文",
      level: "info" as const,
    },
    {
      time: "00:04:17",
      tag: "APPLY",
      message: "下游节点 Gate Check / Security Review / Complete 已标记「已被介入」",
      level: "warning" as const,
    },
  ];
}

/** Council 裁决确认后的动态日志行 */
export function buildCouncilConfirmLogLines(optionLabel: string) {
  return [
    {
      time: "00:07:28",
      tag: "DECIDE",
      message: `用户确认方案：${optionLabel}`,
      level: "council" as const,
    },
    {
      time: "00:07:29",
      tag: "APPLY",
      message: "RBAC 策略已写入 permissionService 配置",
      level: "success" as const,
    },
    {
      time: "00:07:30",
      tag: "DONE",
      message: "Council 裁决完成，流程回到主路径",
      level: "success" as const,
    },
  ];
}

/** 受介入影响但尚未执行的节点提示行 */
export function buildUpdatedPendingLines() {
  return [
    {
      time: "—",
      tag: "PENDING",
      message: "节点尚未开始执行，但已收到用户介入规则，启动时将自动应用",
      level: "warning" as const,
    },
  ];
}
