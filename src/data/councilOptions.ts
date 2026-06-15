import type { CouncilOption, DiscussionMessage } from "@/types";

export const councilContext = {
  title: "权限策略冲突需要裁决",
  description:
    "系统检测到当前项目存在两种权限策略：Role-Based Access Control 与 Feature Flag Based Permission。本次需求需要用户选择采用的策略。",
};

export const discussion: DiscussionMessage[] = [
  {
    agent: "Backend Eng A",
    role: "后端工程 Agent",
    message:
      "建议使用 RBAC。当前用户角色模型已经存在，userRole.ts 可直接复用，改动面最小、落地最快。",
    accent: "backend",
  },
  {
    agent: "Test Agent",
    role: "测试 Agent",
    message:
      "RBAC 的权限边界清晰、可枚举，更容易补充覆盖测试，回归成本低。Feature Flag 方案组合爆炸，难以穷举。",
    accent: "test",
  },
  {
    agent: "Security Audit Agent",
    role: "安全审查 Agent",
    message:
      "无论哪种方案，都需要重点检查 Admin bypass 与未授权访问风险。RBAC 配合最小权限原则更可控。",
    accent: "security",
  },
];

export const councilOptions: CouncilOption[] = [
  {
    id: "option-a",
    title: "Option A · Use RBAC",
    proposedBy: "Backend Eng A",
    summary:
      "基于已有用户角色模型实现基于角色的访问控制，在中间件层做统一权限拦截。",
    pros: [
      "复用现有 userRole 模型，改动面最小",
      "权限边界清晰、可枚举，易于测试",
      "符合最小权限原则，安全可控",
    ],
    risks: ["需要为 Admin 角色单独定义权限范围", "角色粒度较粗，细分场景需扩展"],
    impactedFiles: ["authMiddleware.ts", "permissionService.ts", "userRole.ts"],
    scores: { 落地速度: 9, 可测试性: 9, 安全性: 8, 灵活性: 6 },
    recommended: true,
  },
  {
    id: "option-b",
    title: "Option B · Feature Flag Based Permission",
    proposedBy: "Frontend Eng B",
    summary:
      "通过特性开关动态控制每个能力点的可见与可用，权限以 flag 维度配置。",
    pros: ["灰度与按用户精细控制能力强", "可在不发版的情况下调整权限"],
    risks: [
      "flag 组合爆炸，难以穷举测试",
      "权限语义分散，安全审计困难",
      "与现有角色模型割裂，改动面大",
    ],
    impactedFiles: [
      "featureFlagService.ts",
      "permissionService.ts",
      "authMiddleware.ts",
    ],
    scores: { 落地速度: 5, 可测试性: 4, 安全性: 6, 灵活性: 9 },
  },
  {
    id: "option-c",
    title: "Option C · Hybrid Strategy",
    proposedBy: "Security Audit Agent",
    summary:
      "以 RBAC 为基座做粗粒度权限，叠加少量 Feature Flag 处理灰度场景。",
    pros: ["兼顾稳定权限模型与灰度灵活性", "可平滑演进，未来可扩展"],
    risks: [
      "两套机制叠加，复杂度与维护成本上升",
      "边界划分不当会产生权限重叠或盲区",
    ],
    impactedFiles: [
      "authMiddleware.ts",
      "permissionService.ts",
      "userRole.ts",
      "featureFlagService.ts",
    ],
    scores: { 落地速度: 6, 可测试性: 6, 安全性: 7, 灵活性: 8 },
  },
];

export const recommendedReason =
  "Backend、Test、Security 三个 Agent 在落地速度、可测试性与安全性上一致更看好 RBAC：复用现有角色模型、权限边界可枚举、便于补充覆盖测试，并符合最小权限原则。";

export function getCouncilOption(id: string): CouncilOption | undefined {
  return councilOptions.find((o) => o.id === id);
}
