import type { Agent } from "@/types";

export const agents: Agent[] = [
  {
    id: "backend-a",
    name: "Backend Eng A",
    role: "后端工程 Agent",
    status: "idle",
    successRate: 94,
    acceptedRate: 88,
    avgCompletionTime: "12 分钟",
    tokenCost: "≈ 32K tokens / 任务",
    skills: ["Node.js", "权限系统", "中间件", "REST API", "PostgreSQL"],
    historicalTasks: 142,
    failureCount: 6,
    collaboration: "优秀",
    recentTask: "重构订单服务的鉴权中间件",
    description:
      "擅长服务端业务逻辑与权限模型实现，熟悉 RBAC 与多租户场景，输出的代码结构清晰、可测试性强。是本类登录鉴权任务的首选执行者。",
  },
  {
    id: "frontend-b",
    name: "Frontend Eng B",
    role: "前端工程 Agent",
    status: "idle",
    successRate: 91,
    acceptedRate: 85,
    avgCompletionTime: "10 分钟",
    tokenCost: "≈ 28K tokens / 任务",
    skills: ["React", "TypeScript", "状态管理", "可访问性", "设计系统"],
    historicalTasks: 118,
    failureCount: 9,
    collaboration: "良好",
    recentTask: "实现权限受控的路由守卫组件",
    description:
      "聚焦交互层与组件实现，能根据后端权限契约快速落地受控 UI，注重细节与一致性。本次任务中主要承担前端权限态联调。",
  },
  {
    id: "test-agent",
    name: "Test Agent",
    role: "测试 Agent",
    status: "idle",
    successRate: 96,
    acceptedRate: 92,
    avgCompletionTime: "8 分钟",
    tokenCost: "≈ 21K tokens / 任务",
    skills: ["单元测试", "集成测试", "覆盖率分析", "边界用例", "Vitest"],
    historicalTasks: 167,
    failureCount: 4,
    collaboration: "优秀",
    recentTask: "为支付回调补充 23 个边界用例",
    description:
      "负责为产出代码补齐测试覆盖，擅长识别权限绕过、未授权访问等高风险路径，并生成可读性强的测试报告。",
  },
  {
    id: "security-agent",
    name: "Security Audit Agent",
    role: "安全审查 Agent",
    status: "idle",
    successRate: 89,
    acceptedRate: 90,
    avgCompletionTime: "9 分钟",
    tokenCost: "≈ 25K tokens / 任务",
    skills: ["威胁建模", "越权检测", "依赖审计", "最小权限", "审计日志"],
    historicalTasks: 98,
    failureCount: 7,
    collaboration: "良好",
    recentTask: "审计后台管理接口的越权风险",
    description:
      "在交付前进行安全门禁审查，重点检查 Admin bypass、组织级越权与未授权访问，给出风险等级与修复建议。",
  },
];

export function getAgentById(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}
