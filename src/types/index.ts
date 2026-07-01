export type PageKey = 'agents' | 'tasks' | 'council';

/** 文件树节点：有 children 即目录，无则为文件 */
export type FileNode = {
  name: string;
  children?: FileNode[];
};

/** 一个工作项目（IDE 启动页选择/新建的单位） */
export type Project = {
  id: string;
  name: string;
  description?: string;
  /** 最近打开时间的人读展示串（mock） */
  lastOpened: string;
  /** 技术栈 / 标签，用于列表展示 */
  tags: string[];
  /** 项目文件树（mock） */
  files: FileNode[];
  /** 项目 Agent 团队（引用全局 Agent 池的 id 子集） */
  agentIds: string[];
};

/** 单个任务及其泳道图执行状态 */
export type DemoTask = {
  id: string;
  /** 所属项目 id */
  projectId: string;
  title: string;
  taskText: string;
  stage: DemoStage;
  analysisReady: boolean;
  nodes: WorkflowNodeData[];
  revealedNodeCount: number;
  activeStepIndex: number;
  selectedNodeId: string | null;
  interventionRules: InterventionRule[];
  confirmedCouncilOptionId: string | null;
  interventionFeedback: string | null;
  timeline: TimelineEvent[];
};

export type DemoStage =
  | 'idle'
  | 'team_configured'
  | 'analyzing'
  | 'workflow_recommended'
  | 'executing'
  | 'intervention'
  | 'council'
  | 'delivery';

export type AgentStatus = 'idle' | 'working' | 'waiting' | 'reviewing' | 'done';

/** N4 认领时签发的文件租约 FileLease（字段清单 N4.file_lease） */
export type FileLease = {
  lease_id: string;
  path_glob: string;
  scope: 'read' | 'write';
  expires_at: string;
  status: string;
};

/** N4 AgentRecord + N6 Driver Session 的运行态身份（字段清单 N4.agent / N6） */
export type AgentRuntime = {
  agent_id: string;
  role_id: string;
  driver_id: string;
  /** Driver 展示名（字段清单外，便于人读） */
  driver_name: string;
  session_id?: string;
  worktree_id?: string;
  last_heartbeat?: string;
};

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
  collaboration: '优秀' | '良好' | '一般';
  recentTask: string;
  description: string;
  /** N4/N6 运行态身份 */
  runtime: AgentRuntime;
  /** N5 ContextPack.capability_tags */
  capabilityTags: string[];
  /** 当前持有的文件租约（未认领时为空） */
  fileLease?: FileLease;
};

export type WorkflowNodeStatus = 'pending' | 'active' | 'done' | 'blocked' | 'updated';

/** 泳道 = 执行角色分区（User / 调度 / 后端 / 测试 / 安全 / 议会） */
export type Lane = 'User' | 'System' | 'Backend' | 'Test' | 'Security' | 'Council';

/** 协调器 Task 主状态机的 11 个核心态（见 需求到处理状态机 §3） */
export type TaskStatusCore =
  | 'created'
  | 'claimed'
  | 'running'
  | 'waiting_input'
  | 'pending_gate'
  | 'pending_council'
  | 'reviewing'
  | 'blocked'
  | 'completed'
  | 'failed'
  | 'cancelled';

/** Gate 四种决策（见 字段清单 N13） */
export type GateDecision = 'allow' | 'deny' | 'ask' | 'defer';

/** 节点责任方：A=Driver执行 B=角色记忆 C=主链路编排 D=Hook/Gate */
export type NodeDirection = 'User' | 'A' | 'B' | 'C' | 'D' | 'Merger';

/** 冻结度：frozen=可直接对接 partial=部分待定 tbd=尚未冻结 reserved=后置 */
export type FrozenLevel = 'frozen' | 'partial' | 'tbd' | 'reserved';

/** 字段清单中的一条字段（key + 中文释义/类型说明） */
export type FieldSpec = { key: string; desc: string };

export type WorkflowNodeData = {
  id: string;
  /** 流程图节点编号，如 N0 / N13 */
  code: string;
  label: string;
  /** 节点中文名 */
  labelCn: string;
  lane: Lane;
  /** 责任方 A/B/C/D/User/Merger（Spec 归属，与泳道角色解耦） */
  direction: NodeDirection;
  /** 网格列号（x 轴）；并行兄弟节点共用同一 column */
  column: number;
  /** 前驱节点 id 列表，作为连线与揭示门控的真相源 */
  deps: string[];
  owner: string;
  status: WorkflowNodeStatus;
  /** 该节点对应的协调器主状态（N0/N1/N16/N17 无核心态时为 null） */
  taskStatus: TaskStatusCore | null;
  /** 状态补充说明（如 N13 的分支落点、N17 的 reserved 提示） */
  statusNote?: string;
  frozen: FrozenLevel;
  summary: string;
  input: string[];
  output: string[];
  /** 字段清单中该节点 decided（已定）字段 */
  decided: FieldSpec[];
  /** 字段清单中该节点 tbd（待定）字段 */
  tbd: FieldSpec[];
  /** 该节点 emit 的标准事件类型 */
  events: string[];
  /** 仅 N13 Gate：本次 demo 走的决策分支 */
  gateDecision?: GateDecision;
  risk: string;
  nextAction: string;
};

/** N14 CouncilDecision.verdict（字段清单 N14） */
export type CouncilVerdict = 'select' | 'needs_human' | 'request_revision' | 'reject';

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

export type InterventionScope =
  | 'current_step'
  | 'current_agent'
  | 'whole_workflow'
  | 'project_rule';

export type InterventionRule = {
  text: string;
  scope: InterventionScope;
  affectedAgents: string[];
};

export type DiscussionMessage = {
  agent: string;
  role: string;
  message: string;
  accent: 'backend' | 'test' | 'security' | 'system';
};

export type LogLevel = 'info' | 'success' | 'warning' | 'council';

export type LogEntry = {
  time: string;
  source: string;
  text: string;
  level: LogLevel;
};

export type TimelineCheckpoint = {
  label: string;
  description: string;
};

/** 可回溯的 Demo 执行快照 */
export type DemoSnapshot = {
  stage: DemoStage;
  currentPage: PageKey;
  nodes: WorkflowNodeData[];
  revealedNodeCount: number;
  activeStepIndex: number;
  selectedNodeId: string | null;
  interventionRules: InterventionRule[];
  confirmedCouncilOptionId: string | null;
  interventionFeedback: string | null;
};

export type TimelineEvent = LogEntry & {
  id: string;
  checkpoint?: TimelineCheckpoint;
  snapshot: DemoSnapshot;
};

export type NodeExecLogLevel = LogLevel | 'debug';

/** 单条节点内部执行日志 */
export type NodeExecLogLine = {
  time: string;
  tag: string;
  message: string;
  level: NodeExecLogLevel;
};

/** 某节点的完整执行日志（mock） */
export type NodeExecutionLogDetail = {
  duration?: string;
  tokenUsage?: string;
  lines: NodeExecLogLine[];
};
