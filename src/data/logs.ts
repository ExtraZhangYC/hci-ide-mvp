export type LogEntry = {
  time: string;
  source: string;
  text: string;
  level: "info" | "success" | "warning" | "council";
};

/**
 * 每个 workflow 节点完成时追加的事件日志（mock）。
 * key 为节点 id。
 */
export const nodeLogs: Record<string, LogEntry> = {
  "task-brief": {
    time: "00:01",
    source: "Orchestrator",
    text: "已接收任务并生成结构化任务卡。",
    level: "info",
  },
  routing: {
    time: "00:03",
    source: "Orchestrator",
    text: "需求路由完成：识别为「权限校验 + 测试 + 安全审查」类任务。",
    level: "info",
  },
  assignment: {
    time: "00:05",
    source: "Orchestrator",
    text: "已分配：Backend Eng A 主实现，Test / Security Agent 协同。",
    level: "info",
  },
  plan: {
    time: "00:08",
    source: "Backend Eng A",
    text: "实现计划就绪：识别到两种候选权限策略，可能触发 Council。",
    level: "warning",
  },
  work: {
    time: "00:14",
    source: "Backend Eng A",
    text: "正在实现鉴权中间件与权限服务……",
    level: "info",
  },
  "gate-check": {
    time: "00:19",
    source: "Test Agent",
    text: "已补充测试用例，质量门禁通过（28 passed / 0 failed）。",
    level: "success",
  },
  "security-review": {
    time: "00:23",
    source: "Security Audit Agent",
    text: "安全审查完成：检测到 Admin 权限策略需用户裁决。",
    level: "warning",
  },
  "human-gate": {
    time: "00:25",
    source: "Orchestrator",
    text: "存在两种权限策略冲突，已升级至 Human Gate。",
    level: "warning",
  },
  council: {
    time: "00:26",
    source: "Council",
    text: "Multi-Agent Council 已就绪，等待用户裁决权限策略。",
    level: "council",
  },
  complete: {
    time: "00:31",
    source: "Orchestrator",
    text: "全部节点完成，已生成 Delivery Report。",
    level: "success",
  },
};
