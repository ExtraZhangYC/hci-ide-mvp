import type { LogEntry, TimelineCheckpoint } from "@/types";

export type { LogEntry };

/**
 * 每个 workflow 节点激活/完成时追加的事件日志（mock）。
 * key 为节点 id。带 checkpoint 的条目可回溯到该时刻。
 */
export const nodeLogs: Record<
  string,
  LogEntry & { checkpoint?: TimelineCheckpoint }
> = {
  "task-brief": {
    time: "00:01",
    source: "Orchestrator",
    text: "已接收任务并生成结构化任务卡。",
    level: "info",
    checkpoint: {
      label: "流程启动",
      description: "Workflow 已创建，Task Brief 执行中",
    },
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
    checkpoint: {
      label: "方案就绪",
      description: "实现计划已生成，即将进入开发节点",
    },
  },
  work: {
    time: "00:14",
    source: "Backend Eng A",
    text: "正在实现鉴权中间件与权限服务……",
    level: "info",
    checkpoint: {
      label: "开发节点",
      description: "可在此回溯并重试 Intervene 注入规则",
    },
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
    checkpoint: {
      label: "裁决前",
      description: "安全审查完成，即将进入 Council 裁决",
    },
  },
  council: {
    time: "00:26",
    source: "Council",
    text: "Multi-Agent Council 已就绪，等待用户裁决权限策略。",
    level: "council",
    checkpoint: {
      label: "Council 就绪",
      description: "多 Agent 方案已生成，等待用户选择",
    },
  },
  complete: {
    time: "00:31",
    source: "Orchestrator",
    text: "全部节点完成，已生成 Delivery Report。",
    level: "success",
    checkpoint: {
      label: "交付完成",
      description: "全流程执行完毕，可查看 Delivery Report",
    },
  },
};

export const interventionCheckpoint: TimelineCheckpoint = {
  label: "用户介入",
  description: "已注入业务规则，下游节点已标记为「已被介入」",
};

export const councilConfirmCheckpoint: TimelineCheckpoint = {
  label: "裁决完成",
  description: "用户已确认权限策略，流程回到主路径",
};
