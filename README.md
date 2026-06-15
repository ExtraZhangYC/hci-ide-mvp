# HCI IDE MVP · AI 工程团队驾驶舱

一个**可演示的 Web 交互原型**：把「与单个 AI 聊天」升级为「像管理一支 AI 工程团队一样完成开发任务」。

本项目是 **Scripted IDE Simulator**（假 IDE + 真实交互 + 预设 Agent 剧情）：不接真实 LLM / Agent / Git / 代码执行，所有数据均为 mock，演示流程稳定、可重复、可一键重置。

## 技术栈

- Vite + React + TypeScript
- Tailwind CSS（暗色 IDE 风格）
- @xyflow/react（Task Board 泳道图）
- Zustand（Demo 状态机）
- lucide-react（图标）

## 启动方式

本机未全局安装 Node，项目已内置一份本地 Node 运行时（`.node/` 目录）。

最简单方式：

```bash
./start.sh
```

或手动启动：

```bash
export PATH="$PWD/.node/bin:$PATH"   # 使用内置 Node
npm install                           # 首次运行
npm run dev                           # http://localhost:5173/
```

如果你的机器已全局安装 Node（18+），可直接 `npm install && npm run dev`。

构建生产版本：`npm run build`，预览：`npm run preview`。

## 三个页面

| 页面 | 作用 | 关键交互 |
|---|---|---|
| Agent Board | 组建 AI 团队 | 查看 Agent 档案、Assign to Project |
| Task Board | 可观察、可介入的多 Agent 执行地图 | Start Task → 需求分析 → 推荐 Workflow → Next Step / Auto Run → Intervene |
| Council Board | 基于证据做最终裁决 | 对比三种方案、Confirm Option |

## 推荐演示路径

1. Agent Board：查看 `Backend Eng A` 详情，依次 Assign `Backend Eng A` / `Test Agent` / `Security Audit Agent`（≥3 人 → 团队就绪）
2. 切到 Task Board，使用默认任务，点击 **Start Task** → 查看需求分析
3. 点击 **Use Recommended Workflow** → 出现 6 Lane × 10 节点泳道图
4. **Next Step / Auto Run** 逐步推进；点击任意节点查看 Node Inspector
5. 推进到 **Work** 节点 → 点击 **Intervene** → 注入 Admin 规则（作用范围：影响整个 Workflow）→ 下游节点变为「已被介入」
6. 继续推进到 **Council** → 自动进入 Council Board → 对比方案 → **Confirm Option A · Use RBAC**
7. 返回 Task Board，推进到 **Complete** → **View Delivery Report**
8. **Reset Demo** 可随时一键重置

## 目录结构

```text
src/
├── App.tsx / main.tsx / index.css
├── types/index.ts          # 全局类型
├── store/useDemoStore.ts   # Zustand 演示状态机
├── data/                   # 全部 mock data
├── pages/                  # AgentBoard / TaskBoard / CouncilBoard
├── components/             # AppShell / WorkflowCanvas / NodeInspector / InterveneDialog / DeliveryReport ...
└── lib/utils.ts
```
