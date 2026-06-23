import { create } from "zustand";
import type {
  DemoStage,
  DemoTask,
  InterventionRule,
  LogEntry,
  PageKey,
  TimelineCheckpoint,
  TimelineEvent,
  WorkflowNodeData,
} from "@/types";
import {
  councilConfirmCheckpoint,
  interventionCheckpoint,
  nodeLogs,
} from "@/data/logs";
import { DEFAULT_TASK_ID, initialTasks } from "@/data/tasks";
import {
  MAX_COLUMN,
  NODE_IDS,
  indicesInColumn,
  primaryIndexInColumn,
  revealedCountThroughColumn,
} from "@/data/workflow";
import { captureSnapshot, nextTimelineId, resetTimelineSeq } from "@/lib/snapshot";

const DOWNSTREAM_UPDATED_IDS = [
  NODE_IDS.gate,
  "n15-merge-auth",
  NODE_IDS.complete,
];

/** 并行节点 id 形如 `<原id>-be|-te`，剥去后缀以复用同 code 的日志/资源 */
const stripParallelSuffix = (id: string) => id.replace(/-(be|te)$/, "");
const getNodeLog = (id: string) =>
  nodeLogs[id] ?? nodeLogs[stripParallelSuffix(id)];

type PartialExecState = {
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

type TaskFields = Pick<
  DemoTask,
  | "taskText"
  | "stage"
  | "analysisReady"
  | "nodes"
  | "revealedNodeCount"
  | "activeStepIndex"
  | "selectedNodeId"
  | "interventionRules"
  | "confirmedCouncilOptionId"
  | "interventionFeedback"
  | "timeline"
>;

function cloneTask(task: DemoTask): DemoTask {
  return {
    ...task,
    nodes: task.nodes.map((n) => ({
      ...n,
      input: [...n.input],
      output: [...n.output],
    })),
    interventionRules: task.interventionRules.map((r) => ({
      ...r,
      affectedAgents: [...r.affectedAgents],
    })),
    timeline: [...task.timeline],
  };
}

function extractTaskFields(state: TaskFields): TaskFields {
  return {
    taskText: state.taskText,
    stage: state.stage,
    analysisReady: state.analysisReady,
    nodes: state.nodes,
    revealedNodeCount: state.revealedNodeCount,
    activeStepIndex: state.activeStepIndex,
    selectedNodeId: state.selectedNodeId,
    interventionRules: state.interventionRules,
    confirmedCouncilOptionId: state.confirmedCouncilOptionId,
    interventionFeedback: state.interventionFeedback,
    timeline: state.timeline,
  };
}

function syncTasks(
  tasks: DemoTask[],
  activeTaskId: string,
  fields: TaskFields
): DemoTask[] {
  return tasks.map((t) =>
    t.id === activeTaskId ? { ...t, ...fields } : t
  );
}

function taskToState(task: DemoTask): TaskFields {
  return cloneTask(task);
}

function buildTimelineEvent(
  entry: LogEntry,
  exec: PartialExecState,
  checkpoint?: TimelineCheckpoint
): TimelineEvent {
  return {
    id: nextTimelineId(),
    ...entry,
    checkpoint,
    snapshot: captureSnapshot(exec),
  };
}

type DemoState = PartialExecState &
  TaskFields & {
    selectedAgentId: string | null;
    assignedAgentIds: string[];
    teamCustomizationEnabled: boolean;
    isAutoRunning: boolean;
    tasks: DemoTask[];
    activeTaskId: string;

    setPage: (page: PageKey) => void;
    selectTask: (taskId: string) => void;
    selectAgent: (agentId: string) => void;
    assignAgent: (agentId: string) => void;
    enableTeamCustomization: () => void;
    disableTeamCustomization: () => void;
    resetTeamToRecommended: () => void;
    setTaskText: (text: string) => void;
    startTask: () => void;
    useRecommendedWorkflow: () => void;
    nextStep: () => void;
    autoRun: () => void;
    stopAutoRun: () => void;
    resetDemo: () => void;
    selectNode: (nodeId: string) => void;
    addInterventionRule: (rule: InterventionRule) => void;
    goToCouncil: () => void;
    confirmCouncilOption: (optionId: string) => void;
    showDelivery: () => void;
    restoreCheckpoint: (eventId: string) => void;
  };

const defaultTask = initialTasks.find((t) => t.id === DEFAULT_TASK_ID)!;
const defaultTaskState = taskToState(defaultTask);

const RECOMMENDED_AGENT_IDS = [
  "backend-a",
  "test-agent",
  "security-agent",
  "frontend-b",
] as const;

const initialState = {
  currentPage: "agents" as PageKey,
  selectedAgentId: null as string | null,
  assignedAgentIds: [...RECOMMENDED_AGENT_IDS] as string[],
  teamCustomizationEnabled: false,
  isAutoRunning: false,
  tasks: initialTasks.map(cloneTask),
  activeTaskId: DEFAULT_TASK_ID,
  ...defaultTaskState,
};

let autoRunTimer: ReturnType<typeof setTimeout> | null = null;

export const useDemoStore = create<DemoState>((set, get) => ({
  ...initialState,

  setPage: (page) => set({ currentPage: page }),

  enableTeamCustomization: () => set({ teamCustomizationEnabled: true }),
  disableTeamCustomization: () => set({ teamCustomizationEnabled: false }),
  resetTeamToRecommended: () =>
    set((state) => {
      let stage = state.stage;
      if (stage === "idle" || stage === "team_configured") {
        stage = RECOMMENDED_AGENT_IDS.length >= 3 ? "team_configured" : "idle";
      }
      const patch = {
        assignedAgentIds: [...RECOMMENDED_AGENT_IDS] as string[],
        teamCustomizationEnabled: false,
        stage,
      };
      const taskFields = extractTaskFields({ ...state, ...patch });
      return {
        ...patch,
        tasks: syncTasks(state.tasks, state.activeTaskId, taskFields),
      };
    }),

  selectTask: (taskId) => {
    const state = get();
    if (taskId === state.activeTaskId) {
      set({ currentPage: "tasks" });
      return;
    }
    get().stopAutoRun();
    const taskFields = extractTaskFields(state);
    const tasks = syncTasks(state.tasks, state.activeTaskId, taskFields);
    const next = tasks.find((t) => t.id === taskId);
    if (!next) return;
    set({
      tasks,
      activeTaskId: taskId,
      currentPage: "tasks",
      ...taskToState(next),
      isAutoRunning: false,
    });
  },

  selectAgent: (agentId) => set({ selectedAgentId: agentId }),

  assignAgent: (agentId) =>
    set((state) => {
      const already = state.assignedAgentIds.includes(agentId);
      const assignedAgentIds = already
        ? state.assignedAgentIds.filter((id) => id !== agentId)
        : [...state.assignedAgentIds, agentId];
      let stage = state.stage;
      if (state.stage === "idle" || state.stage === "team_configured") {
        stage = assignedAgentIds.length >= 3 ? "team_configured" : "idle";
      }
      const taskFields = extractTaskFields({ ...state, stage });
      return {
        assignedAgentIds,
        stage,
        tasks: syncTasks(state.tasks, state.activeTaskId, taskFields),
      };
    }),

  setTaskText: (text) =>
    set((state) => {
      const taskFields = extractTaskFields({ ...state, taskText: text });
      return {
        taskText: text,
        tasks: syncTasks(state.tasks, state.activeTaskId, taskFields),
      };
    }),

  startTask: () =>
    set((state) => {
      const taskFields = extractTaskFields({
        ...state,
        stage: "analyzing",
        analysisReady: true,
      });
      return {
        currentPage: "tasks",
        stage: "analyzing",
        analysisReady: true,
        tasks: syncTasks(state.tasks, state.activeTaskId, taskFields),
      };
    }),

  useRecommendedWorkflow: () =>
    set((state) => {
      const nodes = state.nodes.map((n, i) =>
        i === 0 ? { ...n, status: "active" as const } : n
      );
      const nodeLog = nodeLogs[nodes[0].id];
      const exec: PartialExecState = {
        stage: "executing",
        currentPage: state.currentPage,
        nodes,
        revealedNodeCount: 1,
        activeStepIndex: 0,
        selectedNodeId: nodes[0].id,
        interventionRules: state.interventionRules,
        confirmedCouncilOptionId: state.confirmedCouncilOptionId,
        interventionFeedback: state.interventionFeedback,
      };
      const { checkpoint, ...entry } = nodeLog ?? {
        time: "00:01",
        source: "Orchestrator",
        text: "Workflow 已启动。",
        level: "info" as const,
      };
      const timeline = nodeLog
        ? [buildTimelineEvent(entry, exec, checkpoint)]
        : [];
      const taskFields = extractTaskFields({
        ...state,
        ...exec,
        timeline,
      });
      return {
        ...exec,
        timeline,
        tasks: syncTasks(state.tasks, state.activeTaskId, taskFields),
      };
    }),

  nextStep: () => {
    const state = get();
    if (state.stage !== "executing") return;
    const cur = state.activeStepIndex;
    if (cur < 0) return;
    const curCol = state.nodes[cur].column;

    // 活跃列为 Council 且尚未裁决 → 进入议会
    if (
      state.nodes[cur].id === NODE_IDS.council &&
      !state.confirmedCouncilOptionId
    ) {
      get().goToCouncil();
      return;
    }

    const nodes = state.nodes.map((n) => ({ ...n }));
    // 当前列整列置 done（并行列两节点一起完成）
    indicesInColumn(nodes, curCol).forEach((i) => {
      nodes[i] = { ...nodes[i], status: "done" };
    });

    // 末列：进入交付
    if (curCol >= MAX_COLUMN) {
      const exec: PartialExecState = {
        stage: "delivery",
        currentPage: state.currentPage,
        nodes,
        revealedNodeCount: nodes.length,
        activeStepIndex: cur,
        selectedNodeId: nodes[cur].id,
        interventionRules: state.interventionRules,
        confirmedCouncilOptionId: state.confirmedCouncilOptionId,
        interventionFeedback: state.interventionFeedback,
      };
      const taskFields = extractTaskFields({ ...state, ...exec });
      set({
        ...exec,
        tasks: syncTasks(state.tasks, state.activeTaskId, taskFields),
      });
      get().stopAutoRun();
      return;
    }

    // 推进到下一列：整列置 active（并行列两节点一起点亮）
    const nextCol = curCol + 1;
    indicesInColumn(nodes, nextCol).forEach((i) => {
      nodes[i] = { ...nodes[i], status: "active" };
    });
    const primaryIndex = primaryIndexInColumn(nodes, nextCol);
    const primaryNode = nodes[primaryIndex];
    const nodeLog = getNodeLog(primaryNode.id);

    let stage: DemoStage = "executing";
    let currentPage = state.currentPage;
    if (primaryNode.id === NODE_IDS.council) {
      stage = "council";
      currentPage = "council";
      get().stopAutoRun();
    }

    const exec: PartialExecState = {
      stage,
      currentPage,
      nodes,
      revealedNodeCount: revealedCountThroughColumn(nodes, nextCol),
      activeStepIndex: primaryIndex,
      selectedNodeId: primaryNode.id,
      interventionRules: state.interventionRules,
      confirmedCouncilOptionId: state.confirmedCouncilOptionId,
      interventionFeedback: state.interventionFeedback,
    };

    const timeline = nodeLog
      ? [
          ...state.timeline,
          buildTimelineEvent(
            { time: nodeLog.time, source: nodeLog.source, text: nodeLog.text, level: nodeLog.level },
            exec,
            nodeLog.checkpoint
          ),
        ]
      : state.timeline;

    const taskFields = extractTaskFields({ ...state, ...exec, timeline });
    set({
      ...exec,
      timeline,
      tasks: syncTasks(state.tasks, state.activeTaskId, taskFields),
    });
  },

  autoRun: () => {
    const tick = () => {
      const state = get();
      if (state.stage !== "executing") {
        set({ isAutoRunning: false });
        autoRunTimer = null;
        return;
      }
      state.nextStep();
      const after = get();
      if (after.stage === "executing" && after.isAutoRunning) {
        autoRunTimer = setTimeout(tick, 950);
      } else {
        set({ isAutoRunning: false });
        autoRunTimer = null;
      }
    };
    set({ isAutoRunning: true });
    autoRunTimer = setTimeout(tick, 400);
  },

  stopAutoRun: () => {
    if (autoRunTimer) {
      clearTimeout(autoRunTimer);
      autoRunTimer = null;
    }
    set({ isAutoRunning: false });
  },

  resetDemo: () => {
    if (autoRunTimer) {
      clearTimeout(autoRunTimer);
      autoRunTimer = null;
    }
    resetTimelineSeq();
    const tasks = initialTasks.map(cloneTask);
    const task = tasks.find((t) => t.id === DEFAULT_TASK_ID)!;
    set({
      currentPage: "agents",
      selectedAgentId: null,
      assignedAgentIds: [...RECOMMENDED_AGENT_IDS] as string[],
      teamCustomizationEnabled: false,
      isAutoRunning: false,
      tasks,
      activeTaskId: DEFAULT_TASK_ID,
      ...taskToState(task),
    });
  },

  selectNode: (nodeId) =>
    set((state) => {
      const taskFields = extractTaskFields({ ...state, selectedNodeId: nodeId });
      return {
        selectedNodeId: nodeId,
        tasks: syncTasks(state.tasks, state.activeTaskId, taskFields),
      };
    }),

  addInterventionRule: (rule) =>
    set((state) => {
      const nodes = state.nodes.map((n) => {
        if (DOWNSTREAM_UPDATED_IDS.includes(n.id) && n.status === "pending") {
          return { ...n, status: "updated" as const };
        }
        return n;
      });
      const feedback =
        "已识别为业务规则。该规则将同步给 Coding Agent、Test Agent 和 Security Audit Agent。";
      const log: LogEntry = {
        time: "00:15",
        source: "用户介入",
        text: `注入业务规则：${rule.text}`,
        level: "warning",
      };
      const exec: PartialExecState = {
        stage: state.stage,
        currentPage: state.currentPage,
        nodes,
        revealedNodeCount: state.revealedNodeCount,
        activeStepIndex: state.activeStepIndex,
        selectedNodeId: state.selectedNodeId,
        interventionRules: [...state.interventionRules, rule],
        confirmedCouncilOptionId: state.confirmedCouncilOptionId,
        interventionFeedback: feedback,
      };
      const timeline = [
        ...state.timeline,
        buildTimelineEvent(log, exec, interventionCheckpoint),
      ];
      const taskFields = extractTaskFields({
        ...state,
        ...exec,
        timeline,
      });
      return {
        ...exec,
        timeline,
        tasks: syncTasks(state.tasks, state.activeTaskId, taskFields),
      };
    }),

  goToCouncil: () => {
    const state = get();
    const councilIdx = state.nodes.findIndex((n) => n.id === NODE_IDS.council);
    if (councilIdx < 0) return;
    const councilCol = state.nodes[councilIdx].column;
    const nodes = state.nodes.map((n) => {
      if (n.column < councilCol) {
        return n.status === "done" ? n : { ...n, status: "done" as const };
      }
      if (n.id === NODE_IDS.council) return { ...n, status: "active" as const };
      return n;
    });
    const nodeLog = nodeLogs[NODE_IDS.council];
    const alreadyHasCouncil = state.timeline.some(
      (e) => e.source === "Council" && e.text.includes("已就绪")
    );
    const exec: PartialExecState = {
      stage: "council",
      currentPage: "council",
      nodes,
      activeStepIndex: councilIdx,
      selectedNodeId: NODE_IDS.council,
      revealedNodeCount: Math.max(
        state.revealedNodeCount,
        revealedCountThroughColumn(nodes, councilCol)
      ),
      interventionRules: state.interventionRules,
      confirmedCouncilOptionId: state.confirmedCouncilOptionId,
      interventionFeedback: state.interventionFeedback,
    };
    const timeline =
      alreadyHasCouncil || !nodeLog
        ? state.timeline
        : [
            ...state.timeline,
            buildTimelineEvent(
              { time: nodeLog.time, source: nodeLog.source, text: nodeLog.text, level: nodeLog.level },
              exec,
              nodeLog.checkpoint
            ),
          ];
    const taskFields = extractTaskFields({ ...state, ...exec, timeline });
    set({
      ...exec,
      timeline,
      tasks: syncTasks(state.tasks, state.activeTaskId, taskFields),
    });
    get().stopAutoRun();
  },

  confirmCouncilOption: (optionId) => {
    const state = get();
    const completeIdx = state.nodes.findIndex((n) => n.id === NODE_IDS.complete);
    // 裁决后：议会与中间合并节点(N15–N17)收束为 done，直达 N18 complete
    const nodes = state.nodes.map((n) =>
      n.column < MAX_COLUMN
        ? { ...n, status: "done" as const }
        : { ...n, status: "active" as const }
    );
    const log: LogEntry = {
      time: "00:28",
      source: "Council",
      text: "用户已裁决：采用 Option A · RBAC 策略，回到主流程。",
      level: "council",
    };
    const exec: PartialExecState = {
      stage: "executing",
      currentPage: "tasks",
      nodes,
      activeStepIndex: completeIdx,
      selectedNodeId: nodes[completeIdx].id,
      revealedNodeCount: state.nodes.length,
      interventionRules: state.interventionRules,
      confirmedCouncilOptionId: optionId,
      interventionFeedback: state.interventionFeedback,
    };
    const timeline = [
      ...state.timeline,
      buildTimelineEvent(log, exec, councilConfirmCheckpoint),
    ];
    const taskFields = extractTaskFields({ ...state, ...exec, timeline });
    set({
      ...exec,
      timeline,
      tasks: syncTasks(state.tasks, state.activeTaskId, taskFields),
    });
  },

  showDelivery: () =>
    set((state) => {
      const completeIdx = state.nodes.findIndex(
        (n) => n.id === NODE_IDS.complete
      );
      const nodes = state.nodes.map((n) =>
        n.column === MAX_COLUMN ? { ...n, status: "done" as const } : n
      );
      const nodeLog = nodeLogs[NODE_IDS.complete];
      const alreadyHasComplete = state.timeline.some(
        (e) => e.source === "Orchestrator" && e.text.includes("Delivery Report")
      );
      const exec: PartialExecState = {
        stage: "delivery",
        currentPage: "tasks",
        nodes,
        activeStepIndex: completeIdx,
        selectedNodeId: nodes[completeIdx].id,
        revealedNodeCount: nodes.length,
        interventionRules: state.interventionRules,
        confirmedCouncilOptionId: state.confirmedCouncilOptionId,
        interventionFeedback: state.interventionFeedback,
      };
      const timeline =
        alreadyHasComplete || !nodeLog
          ? state.timeline
          : [
              ...state.timeline,
              buildTimelineEvent(
                { time: nodeLog.time, source: nodeLog.source, text: nodeLog.text, level: nodeLog.level },
                exec,
                nodeLog.checkpoint
              ),
            ];
      const taskFields = extractTaskFields({ ...state, ...exec, timeline });
      return {
        ...exec,
        timeline,
        tasks: syncTasks(state.tasks, state.activeTaskId, taskFields),
      };
    }),

  restoreCheckpoint: (eventId) => {
    const state = get();
    const idx = state.timeline.findIndex((e) => e.id === eventId);
    if (idx < 0) return;
    const event = state.timeline[idx];
    if (!event.checkpoint) return;

    get().stopAutoRun();
    const snap = event.snapshot;
    const taskFields = extractTaskFields({
      ...state,
      stage: snap.stage,
      nodes: snap.nodes.map((n) => ({
        ...n,
        input: [...n.input],
        output: [...n.output],
      })),
      revealedNodeCount: snap.revealedNodeCount,
      activeStepIndex: snap.activeStepIndex,
      selectedNodeId: snap.selectedNodeId,
      interventionRules: snap.interventionRules.map((r) => ({
        ...r,
        affectedAgents: [...r.affectedAgents],
      })),
      confirmedCouncilOptionId: snap.confirmedCouncilOptionId,
      interventionFeedback: snap.interventionFeedback,
      timeline: state.timeline.slice(0, idx + 1),
    });
    set({
      stage: snap.stage,
      currentPage: snap.currentPage,
      nodes: taskFields.nodes,
      revealedNodeCount: taskFields.revealedNodeCount,
      activeStepIndex: taskFields.activeStepIndex,
      selectedNodeId: taskFields.selectedNodeId,
      interventionRules: taskFields.interventionRules,
      confirmedCouncilOptionId: taskFields.confirmedCouncilOptionId,
      interventionFeedback: taskFields.interventionFeedback,
      timeline: taskFields.timeline,
      tasks: syncTasks(state.tasks, state.activeTaskId, taskFields),
      isAutoRunning: false,
    });
  },
}));
