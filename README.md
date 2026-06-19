# HCI IDE MVP · AI 工程团队驾驶舱

一个**可演示的 Web 交互原型**：把「与单个 AI 聊天」升级为「像管理一支 AI 工程团队一样完成开发任务」。

本项目是 **Scripted IDE Simulator**（假 IDE + 真实交互 + 预设 Agent 剧情）：不接真实 LLM / Agent / Git / 代码执行，所有数据均为 mock，演示流程稳定、可重复、可一键重置。

> 界面已对齐后端协作链路规范：Task Board 完整建模 **N0–N18 端到端主链路**与 **11 态协调器状态机**，字段、状态、Gate 决策、事件均取自 `api/` 下的规范文档。

## 规范对齐（Single Source of Truth）

| 规范文档 | 用途 |
|---|---|
| `api/前端字段清单.json` | 每个节点前端可拿到的 `decided`（已定）/ `tbd`（待定）字段、11 个核心 `TaskStatus`、Gate `allow/deny/ask/defer` → 状态落点、14 个标准事件 |
| `api/需求到处理-全流程图与状态机.md` | 端到端流程图、Task 主状态机、合并边界、Checkpoint、Council 状态机 |

术语约定：**英文规范术语 + 中文释义**（如 `running · 执行中`、`verdict=select`）。
当后端字段冻结/变更时，只需同步更新 `src/data/workflow.ts` 各节点的 `decided` / `tbd` / `events`。

### N0–N18 主链路与责任方

7 条泳道 = 责任方分区：**User · 用户 / 前端** ／ **C · 协调编排** ／ **B · 角色记忆** ／ **A · Driver 执行** ／ **D · Hook/Gate** ／ **Council · 议会** ／ **Merger · 合并边界**。

```
N0 需求到达 → N1 分诊 → N2 创建 Task → N3 创建 Run → N4 认领 → N5 ContextPack
   → N6 启动 Driver → N7 执行中 → N8 Driver 结果 → N9 注册 Artifact → N10 task.completed
   → N11/12 Hook+GateRequest → N13 Gate 决策 →(defer) N14 Council → N15 合并授权
   → N16 Checkpoint → N17 合并边界 → N18 Run 完成
```

- **N13 Gate** 展示 `allow/deny/ask/defer` 四分支 → 状态落点映射；demo 走 `defer → Council`（权限策略分歧）。
- **N14 Council** 产出 `CouncilDecision`：`verdict ∈ {select, needs_human, request_revision, reject}` + `evidence_refs` + `risk_signals`；仅 `select`（delegated 模式）会生成 `MergeAuthorization` 继续主链路。
- **Node Inspector** 展示每个节点的编号、责任方、冻结度（🟢frozen / 🟡partial / 🔴tbd / reserved）、`TaskStatus`、Gate 分支、`decided` / `tbd` 字段表、emit 事件。

### 方向冻结状态与对齐策略

原则：**已冻结的字段直接按规范字段名对齐；未冻结的先 mock 并在 UI 上标注**（🟢 已对齐 / `mock · 待冻结`）。

| 方向 | 负责对象（节点） | 冻结度 | 前端策略 | 体现位置 |
|---|---|---|---|---|
| **C** | Task / Run / Event / ArtifactRef / Checkpoint / MergeAuthorization（N2/N3/N4/N9/N10/N15/N16/N18） | 🟢 frozen | 直接对齐字段名 | Task Board 节点 + Node Inspector `decided` |
| **D** | HookResult / GateRequest / GateResult（N11/N12/N13） | 🟢 frozen | 直接对齐；展示 `allow/deny/ask/defer` → 状态落点 | N13 Gate Inspector |
| **C / Council** | CouncilDecision（N14：`verdict` / `selected_proposal_id` / `evidence_refs` / `risk_signals`） | 🟡 partial | 已定字段对齐；N-way Diff / PPC 可视化后置（mock/暂无） | Council Board |
| **A** | Driver（N6/N7/N8） | 🟡 partial | `DriverRunResultForCoordination` 入口对齐；`tool_events` / `budget_usage` / 实时进度 mock | N6–N8 Inspector `tbd` |
| **B** | 角色画像 / 技能 / 经验（N5：`role_profile_id`、`capability_tags`） | 🟡 partial | 已定的 `role_profile_id` / `capability_tags` 对齐 | Agent Board · `capability_tags` |
| **B** | Agent 画像 schema / 绩效指标（`AgentMetrics`、`persona_ref` / `skill_refs` / `experience_refs`） | 🔴 tbd | **全部先 mock**，标注「mock · 待 B 冻结」 | Agent Board · 核心指标 / 技能 / 协作 / 最近任务 |
| **User / 前端** | 需求文本 / 分诊结果（N0/N1） | 🔴 tbd | 按「文本 + 可选元信息」mock，留扩展位 | N0/N1 Inspector `tbd` |
| **B / N4** | AgentRecord 身份（`agent_id` / `role_id` / `driver_id` / `session_id` / `worktree_id` / `last_heartbeat`）+ `file_lease` | 🟢 frozen | 直接对齐字段名 | Agent Board · Identity & Runtime / file_lease |

> Agent Board 上 **🟢 已对齐** 的区块来自字段清单已冻结字段；标 **`mock · 待 B 冻结`** 的区块属于 B 方向尚未冻结的画像/指标域，等 B 正式 Spec 冻结后再对齐到 `AgentMetrics`。

## 技术栈

- Vite + React + TypeScript
- Tailwind CSS（暗色 "Command Console" 风格）
- @xyflow/react（Task Board 泳道图）
- Zustand（Demo 状态机）
- lucide-react（图标）

## 启动方式

需要 Node 18+：

```bash
npm install        # 首次运行
npm run dev        # http://localhost:5173/
```

构建生产版本：`npm run build`，预览：`npm run preview`。

> 若本机未全局安装 Node，项目可能内置一份本地运行时（`.node/`）。此时可运行 `./start.sh`，或先 `export PATH="$PWD/.node/bin:$PATH"` 再执行上面的命令。

## 三个页面

| 页面 | 作用 | 关键交互 |
|---|---|---|
| Agent Board | 组建 AI 团队 | 查看 Agent 档案与 **Identity & Runtime（N4/N6 字段：agent_id / role_id / driver_id / session_id / file_lease / capability_tags）**、Assign to Project |
| Task Board | 可观察、可介入的 N0–N18 执行地图 | Start Task → 需求分析 → 推荐 Workflow → Next Step / Auto Run → 在 N7 Intervene → Node Inspector |
| Council Board | 基于证据组装 CouncilDecision | 对比三方案、选择 `verdict`、查看 `evidence_refs` / `risk_signals`、提交 select |

## 推荐演示路径

1. **Agent Board**：查看 `Backend Eng A` 详情（含 Identity & Runtime / file_lease / capability_tags），依次 Assign `Backend Eng A` / `Test Agent` / `Security Audit Agent`（≥3 人 → 团队就绪）
2. 切到 **Task Board**，使用默认任务，点击 **Start Task** → 查看需求分析
3. 点击 **Use Recommended Workflow** → 沿 7 条 Lane 生成 N0–N18 全链路泳道图
4. **Next Step / Auto Run** 逐步推进；点击任意节点查看 Node Inspector（含 decided/tbd 字段与事件）
5. 推进到 **N7 Executing** → 点击 **Intervene** → 注入 Admin 规则（作用范围：整个 Workflow）→ 下游 N13/N15/N18 标记「已被介入」
6. 推进到 **N13 Gate**（decision=defer）→ **Go to Council** → 在 Council Board 选择 `verdict=select` → 采纳 `option-a · Use RBAC`
7. 返回 Task Board，推进到 **N18 Run Complete** → **View Delivery Report**
8. **Reset Demo** 可随时一键重置

## 目录结构

```text
api/                          # 后端协作链路规范（字段清单 + 流程图/状态机）— UI 的对齐基准
src/
├── App.tsx / main.tsx / index.css
├── types/index.ts            # 全局类型（含 TaskStatusCore / GateDecision / CouncilVerdict / AgentRuntime）
├── store/useDemoStore.ts     # Zustand 演示状态机
├── data/                     # 全部 mock data（workflow.ts = N0–N18 节点定义）
├── pages/                    # AgentBoard / TaskBoard / CouncilBoard
├── components/               # AppShell / WorkflowCanvas / NodeInspector / InterveneDialog / DeliveryReport ...
└── lib/utils.ts
```
