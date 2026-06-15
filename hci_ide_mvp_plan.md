# HCI IDE MVP：Cursor 从零实现任务说明

> 目标：把本项目快速实现成一个可演示的 Web 交互原型。  
> 重点不是做真实 AI IDE，而是做一个 **Scripted IDE Simulator：假 IDE + 真实交互 + 预设 Agent 剧情**。

---

## 0. 给 Cursor 的总指令

请严格按以下原则实现：

1. 这是一个 **HCI 演示原型**，不是生产级 IDE。
2. 不接真实 LLM，不做真实 Agent，不做真实 Git，不做真实代码执行。
3. 所有 Agent 输出、任务进度、Council 方案、Delivery Report 都使用 mock data。
4. 演示流程必须稳定、可重复、可一键重置。
5. 优先保证核心交互完整，其次再做视觉细节。
6. 每一步完成后都保持项目可运行。

核心演示路径：

```text
Agent Board 组建团队
→ Task Board 输入任务
→ 系统分析需求
→ 推荐 Workflow
→ Agent 团队按泳道图执行
→ 用户实时介入
→ 触发 Council 决策
→ 用户裁决方案
→ 输出 Delivery Report
```

---

## 1. 产品目标

本 MVP 要验证的不是 AI 能不能真的写代码，而是：

> 用户是否可以通过 Agent 档案、任务泳道图、实时介入和 Council 裁决，像管理一个 AI 工程团队一样完成开发任务。

需要实现三个页面：

| 页面 | 目标 | 关键交互 |
|---|---|---|
| Agent Board | 展示 Agent 员工档案，完成项目组队 | 查看档案、Assign to Project |
| Task Board | 展示任务泳道图和执行进度 | Start Task、Workflow 推荐、Next Step、Auto Run、Intervene |
| Council Board | 展示多 Agent 方案对比，让用户裁决 | 查看方案、确认方案、返回任务流 |

---

## 2. 推荐技术栈

使用纯前端 Web App，从零搭建。

| 模块 | 技术 | 用途 |
|---|---|---|
| 构建工具 | Vite | 快速启动 React 项目 |
| 前端框架 | React + TypeScript | 实现交互原型 |
| 样式 | Tailwind CSS | 快速做暗色 IDE 风格 |
| UI 组件 | shadcn/ui | Dialog、Card、Button、Badge、Tabs 等 |
| 流程图 | @xyflow/react | 实现 Task Board 的泳道图 |
| 状态管理 | Zustand | 管理 Demo 状态机 |
| 图标 | lucide-react | 侧边栏和按钮图标 |

---

## 3. 从零初始化项目

### 3.1 创建项目

```bash
npm create vite@latest hci-ide-mvp -- --template react-ts
cd hci-ide-mvp
npm install
```

### 3.2 安装依赖

```bash
npm install @xyflow/react zustand lucide-react clsx tailwind-merge class-variance-authority
```

### 3.3 安装 Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

修改 `tailwind.config.js`：

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

修改 `src/index.css`：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
  background: #020617;
  color: #e5e7eb;
}
```

### 3.4 初始化 shadcn/ui

```bash
npx shadcn@latest init
```

推荐配置：

```text
Style: New York
Base color: Slate
CSS variables: yes
```

安装需要的组件：

```bash
npx shadcn@latest add button card badge dialog sheet tabs textarea progress separator scroll-area
```

### 3.5 启动项目

```bash
npm run dev
```

---

## 4. 项目目录结构

请按以下结构实现：

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── types/
│   └── index.ts
├── store/
│   └── useDemoStore.ts
├── data/
│   ├── agents.ts
│   ├── workflow.ts
│   ├── councilOptions.ts
│   ├── logs.ts
│   └── deliveryReport.ts
├── pages/
│   ├── AgentBoard.tsx
│   ├── TaskBoard.tsx
│   └── CouncilBoard.tsx
├── components/
│   ├── AppShell.tsx
│   ├── AgentCard.tsx
│   ├── AgentDetailPanel.tsx
│   ├── WorkflowCanvas.tsx
│   ├── NodeInspector.tsx
│   ├── InterveneDialog.tsx
│   ├── DeliveryReport.tsx
│   └── StatusPill.tsx
└── lib/
    └── utils.ts
```

---

## 5. TypeScript 数据类型

在 `src/types/index.ts` 中定义：

```ts
export type PageKey = "agents" | "tasks" | "council";

export type DemoStage =
  | "idle"
  | "team_configured"
  | "analyzing"
  | "workflow_recommended"
  | "executing"
  | "intervention"
  | "council"
  | "delivery";

export type AgentStatus = "idle" | "working" | "waiting" | "reviewing" | "done";

export type Agent = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  successRate: number;
  acceptedRate: number;
  avgCompletionTime: string;
  tokenCost: string;
  skills: string[];
  historicalTasks: number;
  failureCount: number;
  collaboration: "优秀" | "良好" | "一般";
  recentTask: string;
  description: string;
};

export type WorkflowNodeStatus = "pending" | "active" | "done" | "blocked" | "updated";

export type WorkflowNodeData = {
  id: string;
  label: string;
  lane: "User" | "System" | "Backend" | "Test" | "Security" | "Council";
  owner: string;
  status: WorkflowNodeStatus;
  summary: string;
  input: string[];
  output: string[];
  risk: string;
  nextAction: string;
};

export type CouncilOption = {
  id: string;
  title: string;
  proposedBy: string;
  summary: string;
  pros: string[];
  risks: string[];
  impactedFiles: string[];
  scores: Record<string, number>;
  recommended?: boolean;
};

export type InterventionRule = {
  text: string;
  scope: "current_step" | "current_agent" | "whole_workflow" | "project_rule";
  affectedAgents: string[];
};
```

---

## 6. Zustand 状态管理

在 `src/store/useDemoStore.ts` 实现全局状态。

必须包含：

```ts
currentPage: PageKey;
stage: DemoStage;
selectedAgentId: string | null;
assignedAgentIds: string[];
selectedNodeId: string | null;
activeStepIndex: number;
interventionRules: InterventionRule[];
confirmedCouncilOptionId: string | null;
```

必须包含 actions：

```ts
setPage(page: PageKey): void;
selectAgent(agentId: string): void;
assignAgent(agentId: string): void;
startTask(): void;
useRecommendedWorkflow(): void;
nextStep(): void;
autoRun(): void;
resetDemo(): void;
selectNode(nodeId: string): void;
addInterventionRule(rule: InterventionRule): void;
goToCouncil(): void;
confirmCouncilOption(optionId: string): void;
showDelivery(): void;
```

状态推进规则：

```text
idle
→ team_configured
→ analyzing
→ workflow_recommended
→ executing
→ intervention
→ council
→ delivery
```

`nextStep()` 每次推进一个 workflow 节点。  
当进入 `Council` 节点时，页面自动切到 Council Board。  
确认 Council 方案后，回到 Task Board，并继续到 Complete / Delivery Report。

---

## 7. Mock Data

### 7.1 agents.ts

创建 4 个 Agent：

```text
Backend Eng A
Frontend Eng B
Test Agent
Security Audit Agent
```

每个 Agent 至少包含：

```text
成功率
代码接受率
平均完成时间
技能标签
历史任务数
失败记录数
协作表现
Token 成本
最近任务
说明文字
```

### 7.2 workflow.ts

固定 10 个节点：

```text
Task Brief
Routing
Assignment
Plan
Work
Gate Check
Security Review
Human Gate
Council
Complete
```

固定 6 条 lane：

```text
User
System
Backend
Test
Security
Council
```

每个节点都要有：

```text
owner
summary
input
output
risk
nextAction
```

### 7.3 councilOptions.ts

创建三个方案：

```text
Option A：Use RBAC
Option B：Use Feature Flag Based Permission
Option C：Hybrid Strategy
```

Option A 标记为推荐方案。

### 7.4 deliveryReport.ts

交付报告内容固定：

```text
任务完成摘要：已完成登录后权限校验逻辑，并补充相关测试。

修改文件：
- authMiddleware.ts
- permissionService.ts
- userRole.ts
- authMiddleware.test.ts
- permissionService.test.ts

测试结果：
- 通过测试：28
- 失败测试：0
- 覆盖率变化：+8.4%

用户介入记录：
- Admin 角色默认拥有全部权限
- 该规则已同步给 Coding Agent、Test Agent、Security Audit Agent

风险与建议：
- 建议重点检查 Admin 角色权限范围是否符合产品预期
```

---

## 8. 页面实现任务

## 8.1 AppShell

实现暗色 IDE 布局：

```text
左侧 Sidebar：页面导航
中间 Main Workspace：当前页面
右侧 Inspector：详情面板
底部 Status Bar：当前 stage / active node / demo status
```

Sidebar 菜单：

```text
Agent Board
Task Board
Council Board
Reset Demo
```

视觉要求：

```text
深色背景
卡片式区域
蓝色作为主强调色
绿色表示 done
黄色表示 warning / human gate
红色表示 risk / blocked
紫色表示 council / collaboration
```

---

## 8.2 Agent Board

页面内容：

```text
顶部标题：Agent Board
副标题：Persistent AI employees for project delivery
中间：Agent 卡片网格
右侧：Agent Detail Panel
底部/右上：Project Team Summary
```

Agent 卡片展示：

```text
Agent 名称
角色
状态
成功率
技能标签
历史任务数
失败记录数
协作表现
Token 成本
Assign to Project 按钮
```

交互：

```text
点击卡片 → 选中 Agent → 右侧展示详情
点击 Assign to Project → 加入 assignedAgentIds
当已分配 3 个或以上 Agent → stage 变成 team_configured
```

验收标准：

```text
可以看到 4 个 Agent
可以点击任意 Agent 查看详情
可以 Assign Agent
Project Team Summary 会显示已加入团队的 Agent
```

---

## 8.3 Task Board

这是最重要的页面。

页面布局：

```text
顶部：Task Command Bar
中间：WorkflowCanvas
右侧：NodeInspector / TaskUnderstandingPanel / DeliveryReport
底部：Demo Controls
```

### Task Command Bar

包含：

```text
任务输入框
Start Task 按钮
Use Recommended Workflow 按钮
当前 stage badge
```

默认任务文案：

```text
为当前项目增加用户登录后的权限校验，并补充对应测试。
```

点击 Start Task 后：

```text
stage = analyzing
右侧显示 Task Understanding Panel
```

### Task Understanding Panel

分段展示 mock 分析结果：

```text
需求目标：增加登录态识别、角色权限判断和接口权限拦截
涉及模块：authMiddleware.ts, userRole.ts, permissionService.ts
测试目录：tests/auth/
潜在风险：Admin 权限、组织级权限、未授权访问
推荐 Workflow：功能开发 + 测试 + 安全审查 + Review
```

可以用静态展示，也可以用简单 setTimeout 动画。

### WorkflowCanvas

使用 `@xyflow/react` 实现。

要求：

```text
显示 6 条 lane
显示 10 个节点
节点之间有连线
active 节点高亮
done 节点显示完成态
updated 节点显示被用户介入影响过
节点可点击
点击节点后右侧显示 NodeInspector
```

如果 React Flow 泳道实现过慢，可以用 CSS Grid + 卡片模拟泳道图，但优先使用 React Flow。

### Demo Controls

包含：

```text
Next Step
Auto Run
Intervene
Go to Council
View Delivery Report
Reset Demo
```

按钮显示规则：

```text
Start Task：stage 为 idle 或 team_configured 时显示
Use Recommended Workflow：stage 为 analyzing 或 workflow_recommended 时显示
Next Step / Auto Run：stage 为 executing 时显示
Intervene：active node 为 Work 时显示
Go to Council：active node 为 Council 或 Human Gate 时显示
View Delivery Report：Complete 后显示
```

验收标准：

```text
可以输入任务并 Start Task
可以看到需求分析结果
可以看到泳道图
Next Step 可以让节点逐步高亮
点击节点可以看到详情
Auto Run 可以自动推进节点
```

---

## 8.4 用户实时介入 Intervene Dialog

这是最高优先级交互，必须完成。

触发条件：

```text
当前 active node 为 Work
```

点击 Intervene 后打开 Dialog。

Dialog 内容：

```text
标题：Intervene in Coding Agent
说明：将补充信息结构化注入到当前 Agent Workflow
Textarea 默认内容：
Admin 角色应该默认拥有全部权限，不要走普通用户权限限制逻辑。
```

作用范围选项：

```text
仅影响当前步骤
影响当前 Agent 后续执行
影响整个 Workflow
保存为项目长期规则
```

默认选择：

```text
影响整个 Workflow
```

确认后：

```text
1. 添加 interventionRules
2. 展示反馈文案：
   已识别为业务规则。该规则将同步给 Coding Agent、Test Agent 和 Security Audit Agent。
3. 将 Test / Security / Complete 相关节点标记为 updated
4. 右侧 Inspector 显示该业务规则
```

验收标准：

```text
Work 节点时可以打开介入弹窗
提交后可以看到明确反馈
后续节点视觉上出现 updated 状态
Inspector 中能看到用户介入规则
```

---

## 8.5 Council Board

触发场景：

```text
系统检测到当前项目存在两种权限策略：
1. Role-Based Access Control
2. Feature Flag Based Permission
需要用户选择本次需求采用的策略。
```

页面布局：

```text
左侧：Agent Discussion
中间：Option Comparison
右侧：Human Decision Panel
```

Agent Discussion 内容：

```text
Backend Eng A：建议使用 RBAC，因为当前用户角色模型已经存在。
Test Agent：RBAC 更容易补充覆盖测试。
Security Audit Agent：需要检查 Admin bypass 和未授权访问风险。
```

Option Comparison 展示三个方案：

```text
Option A：Use RBAC 推荐
Option B：Use Feature Flag Based Permission
Option C：Hybrid Strategy
```

每个方案展示：

```text
提出者
摘要
优点
风险
影响文件
Agent 评分
是否推荐
```

Human Decision Panel：

```text
当前选中方案
推荐理由
Confirm Option A 按钮
返回 Task Board 按钮
```

确认 Option A 后：

```text
confirmedCouncilOptionId = "option-a"
stage 回到 executing 或 delivery
页面跳回 Task Board
Council 节点变成 done
后续推进到 Complete
```

验收标准：

```text
可以看到三种方案
可以切换查看方案详情
可以确认 Option A
确认后能回到 Task Board 并继续完成任务
```

---

## 8.6 Delivery Report

任务完成后，在 Task Board 右侧或主区域展示 Delivery Report。

内容：

```text
任务完成摘要
修改文件列表
测试结果
用户介入记录
Council 决策记录
风险与建议
```

按钮：

```text
View Diff
Accept Changes
Request Revision
Run Another Workflow
```

按钮可以只做视觉反馈，不需要真实功能。

验收标准：

```text
任务 Complete 后能看到 Delivery Report
能看到用户介入规则
能看到 Council 选择结果
能看到修改文件和测试结果
```

---

## 9. 推荐实现顺序

请 Cursor 按以下顺序实现，不要跳步：

### Step 1：环境与基础布局

目标：项目能运行，有暗色 IDE 壳。

任务：

```text
初始化 Vite React TS
配置 Tailwind
安装依赖
实现 AppShell
实现 Sidebar 页面切换
实现基本 dark theme
```

完成标准：

```text
npm run dev 正常运行
左侧可以切换 Agent Board / Task Board / Council Board
```

---

### Step 2：类型与 Mock Data

目标：所有页面都从 mock data 渲染。

任务：

```text
创建 types/index.ts
创建 data/agents.ts
创建 data/workflow.ts
创建 data/councilOptions.ts
创建 data/deliveryReport.ts
```

完成标准：

```text
数据类型完整
没有 TypeScript 报错
```

---

### Step 3：Zustand Store

目标：Demo 状态可控。

任务：

```text
创建 useDemoStore.ts
实现 currentPage / stage / selectedAgentId / activeStepIndex 等状态
实现 setPage / nextStep / resetDemo 等 actions
```

完成标准：

```text
页面切换由 store 控制
Reset Demo 可恢复初始状态
```

---

### Step 4：Agent Board

目标：能组建 Agent 团队。

任务：

```text
实现 AgentCard
实现 AgentDetailPanel
实现 AgentBoard 页面
实现 Assign to Project
实现 Project Team Summary
```

完成标准：

```text
可以点击 Agent
可以查看详情
可以加入项目团队
```

---

### Step 5：Task Board 基础版

目标：能输入任务、看到分析结果和 workflow。

任务：

```text
实现 Task Command Bar
实现 Start Task
实现 Task Understanding Panel
实现 WorkflowCanvas
实现 NodeInspector
```

完成标准：

```text
Start Task 后 stage 变成 analyzing
显示需求分析结果
显示 workflow 节点
点击节点显示详情
```

---

### Step 6：Workflow 执行动画

目标：演示任务推进。

任务：

```text
实现 Next Step
实现 Auto Run
实现 active / done / pending / updated 节点视觉状态
实现底部状态栏
```

完成标准：

```text
Next Step 可以逐步推进
Auto Run 可以自动推进
active 节点高亮
已完成节点变成 done
```

---

### Step 7：Intervene 交互

目标：完成核心 HCI 创新点。

任务：

```text
实现 InterveneDialog
仅在 Work 节点显示 Intervene 按钮
提交后保存 intervention rule
提交后更新 downstream nodes
提交后右侧显示反馈
```

完成标准：

```text
用户可以介入 Coding Agent
系统能说明该规则影响哪些 Agent
后续节点出现 updated 状态
```

---

### Step 8：Council Board

目标：完成多方案裁决。

任务：

```text
实现 Agent Discussion
实现 Option Comparison
实现 Human Decision Panel
实现 Confirm Option A
确认后返回 Task Board
```

完成标准：

```text
用户可以查看三种方案
用户可以确认推荐方案
确认后任务流继续推进
```

---

### Step 9：Delivery Report

目标：完成闭环交付。

任务：

```text
实现 DeliveryReport 组件
Complete 后展示报告
展示修改文件、测试结果、用户介入、Council 决策
```

完成标准：

```text
完整演示路径能走到最终报告
```

---

### Step 10：视觉与演示打磨

目标：让 demo 看起来像真实产品。

任务：

```text
统一 spacing / border / hover states
优化暗色主题
添加 loading / progress / status badge
添加 Reset Demo
检查响应式布局
运行 npm run build
修复 TypeScript 错误
```

完成标准：

```text
npm run build 成功
demo 能稳定演示
```

---

## 10. 关键交互验收清单

最终必须能完成以下路径：

```text
1. 打开 Agent Board
2. 查看 Backend Eng A 详情
3. Assign Backend Eng A / Test Agent / Security Audit Agent 到项目
4. 切到 Task Board
5. 输入或使用默认任务
6. 点击 Start Task
7. 看到需求分析结果
8. 点击 Use Recommended Workflow
9. 看到泳道图
10. 点击 Next Step 或 Auto Run 推进节点
11. 执行到 Work 节点
12. 点击 Intervene
13. 输入 Admin 规则
14. 选择“影响整个 Workflow”
15. 看到规则被同步给 Coding / Test / Security Agent
16. 继续推进到 Council
17. 进入 Council Board
18. 查看三种方案
19. Confirm Option A：Use RBAC
20. 返回 Task Board
21. 继续到 Complete
22. 查看 Delivery Report
23. 点击 Reset Demo 可重新开始
```

---

## 11. 明确不要实现

请不要做以下内容：

```text
真实 LLM API 调用
真实 AI Agent 编排
真实代码生成
真实 Git diff / merge
真实终端执行
真实文件系统
真实登录 / 账号系统
数据库
后端服务
复杂拖拽组队
完整 Workflow Builder
完整 Agent Talent Pool
复杂权限系统
过度动画
```

这些都会拖慢进度，不属于本次 MVP。

---

## 12. 演示文案

实现完成后，演示时按这句话讲：

> 这个 Demo 展示的不是 AI 自动写代码，而是新的 HCI 范式：用户不再和单个 Agent 聊天，而是通过 Agent 档案、任务泳道图、实时介入和 Council 裁决，领导一支 AI 工程团队完成开发任务。

---

## 13. Cursor 执行建议

建议在 Cursor 中按以下方式推进：

1. 先把本 Markdown 文件放到项目根目录，命名为 `IMPLEMENTATION_TASKS.md`。
2. 对 Cursor 说：

```text
Read IMPLEMENTATION_TASKS.md carefully. Implement this project from zero. Follow the step order strictly. Do not implement real AI, backend, Git, or file system features. Use mock data and deterministic demo state transitions. After each step, keep the app runnable.
```

3. 每次只让 Cursor 完成一个 Step，例如：

```text
Now implement Step 1 only. After finishing, explain what files were created or changed and how to run the app.
```

4. Step 1 验收成功后，再继续 Step 2。

---

## 14. 最终成功标准

MVP 成功不是因为功能完整，而是因为观众能看懂这套交互范式：

```text
Agent Board = 组建 AI 团队
Task Board = 管理可观察、可介入的多 Agent 执行地图
Council Board = 让用户基于证据做最终裁决
Delivery Report = 像团队汇报一样交付结果
```

最终 Demo 必须稳定展示：

```text
组队 → 发任务 → 看计划 → 看执行 → 实时介入 → Council 裁决 → 交付报告
```
