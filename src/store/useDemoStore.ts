import { create } from "zustand";
import type {
  DemoStage,
  InterventionRule,
  PageKey,
  WorkflowNodeData,
} from "@/types";
import {
  workflowNodes as initialWorkflowNodes,
} from "@/data/workflow";
import { nodeLogs, type LogEntry } from "@/data/logs";
import { DEFAULT_TASK_TEXT } from "@/data/deliveryReport";

const cloneNodes = (): WorkflowNodeData[] =>
  initialWorkflowNodes.map((n) => ({ ...n, input: [...n.input], output: [...n.output] }));

const DOWNSTREAM_UPDATED_IDS = ["gate-check", "security-review", "complete"];

type DemoState = {
  currentPage: PageKey;
  stage: DemoStage;
  selectedAgentId: string | null;
  assignedAgentIds: string[];
  selectedNodeId: string | null;
  activeStepIndex: number;
  interventionRules: InterventionRule[];
  confirmedCouncilOptionId: string | null;

  nodes: WorkflowNodeData[];
  taskText: string;
  analysisReady: boolean;
  interventionFeedback: string | null;
  isAutoRunning: boolean;
  logs: LogEntry[];

  setPage: (page: PageKey) => void;
  selectAgent: (agentId: string) => void;
  assignAgent: (agentId: string) => void;
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
};

const initialState = {
  currentPage: "agents" as PageKey,
  stage: "idle" as DemoStage,
  selectedAgentId: null as string | null,
  assignedAgentIds: [] as string[],
  selectedNodeId: null as string | null,
  activeStepIndex: -1,
  interventionRules: [] as InterventionRule[],
  confirmedCouncilOptionId: null as string | null,
  nodes: cloneNodes(),
  taskText: DEFAULT_TASK_TEXT,
  analysisReady: false,
  interventionFeedback: null as string | null,
  isAutoRunning: false,
  logs: [] as LogEntry[],
};

let autoRunTimer: ReturnType<typeof setTimeout> | null = null;

export const useDemoStore = create<DemoState>((set, get) => ({
  ...initialState,

  setPage: (page) => set({ currentPage: page }),

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
      return { assignedAgentIds, stage };
    }),

  setTaskText: (text) => set({ taskText: text }),

  startTask: () =>
    set({
      currentPage: "tasks",
      stage: "analyzing",
      analysisReady: true,
    }),

  useRecommendedWorkflow: () =>
    set((state) => {
      const nodes = state.nodes.map((n, i) =>
        i === 0 ? { ...n, status: "active" as const } : n
      );
      const firstLog = nodeLogs[nodes[0].id];
      return {
        stage: "executing",
        activeStepIndex: 0,
        selectedNodeId: nodes[0].id,
        nodes,
        logs: firstLog ? [firstLog] : [],
      };
    }),

  nextStep: () => {
    const state = get();
    if (state.stage !== "executing") return;
    const cur = state.activeStepIndex;
    if (cur < 0) return;
    const node = state.nodes[cur];

    // Council 节点需要先裁决
    if (node.id === "council" && !state.confirmedCouncilOptionId) {
      get().goToCouncil();
      return;
    }

    const nodes = state.nodes.map((n) => ({ ...n }));
    nodes[cur] = { ...nodes[cur], status: "done" };

    // 已是最后一个节点 (Complete)
    if (cur >= nodes.length - 1) {
      set({
        nodes,
        stage: "delivery",
        selectedNodeId: nodes[cur].id,
      });
      get().stopAutoRun();
      return;
    }

    const nextIndex = cur + 1;
    nodes[nextIndex] = { ...nodes[nextIndex], status: "active" };
    const nextNode = nodes[nextIndex];
    const log = nodeLogs[nextNode.id];

    const patch: Partial<DemoState> = {
      nodes,
      activeStepIndex: nextIndex,
      selectedNodeId: nextNode.id,
      logs: log ? [...state.logs, log] : state.logs,
    };

    // 进入 Council 节点：自动切到 Council Board
    if (nextNode.id === "council") {
      patch.stage = "council";
      patch.currentPage = "council";
      get().stopAutoRun();
    }

    set(patch);
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
    set({ ...initialState, nodes: cloneNodes(), logs: [] });
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

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
      return {
        nodes,
        interventionRules: [...state.interventionRules, rule],
        interventionFeedback: feedback,
        logs: [...state.logs, log],
      };
    }),

  goToCouncil: () => {
    const state = get();
    const councilIdx = state.nodes.findIndex((n) => n.id === "council");
    if (councilIdx < 0) return;
    const nodes = state.nodes.map((n, i) => {
      if (i < councilIdx) {
        return n.status === "done" ? n : { ...n, status: "done" as const };
      }
      if (i === councilIdx) return { ...n, status: "active" as const };
      return n;
    });
    const log = nodeLogs["council"];
    set({
      nodes,
      activeStepIndex: councilIdx,
      selectedNodeId: "council",
      stage: "council",
      currentPage: "council",
      logs: state.logs.some((l) => l.source === "Council")
        ? state.logs
        : log
          ? [...state.logs, log]
          : state.logs,
    });
    get().stopAutoRun();
  },

  confirmCouncilOption: (optionId) => {
    const state = get();
    const councilIdx = state.nodes.findIndex((n) => n.id === "council");
    const completeIdx = state.nodes.length - 1;
    const nodes = state.nodes.map((n, i) => {
      if (i === councilIdx) return { ...n, status: "done" as const };
      if (i === completeIdx) return { ...n, status: "active" as const };
      return n;
    });
    const log: LogEntry = {
      time: "00:28",
      source: "Council",
      text: "用户已裁决：采用 Option A · RBAC 策略，回到主流程。",
      level: "council",
    };
    set({
      confirmedCouncilOptionId: optionId,
      nodes,
      activeStepIndex: completeIdx,
      selectedNodeId: nodes[completeIdx].id,
      stage: "executing",
      currentPage: "tasks",
      logs: [...state.logs, log],
    });
  },

  showDelivery: () =>
    set((state) => {
      const completeIdx = state.nodes.length - 1;
      const nodes = state.nodes.map((n, i) =>
        i === completeIdx ? { ...n, status: "done" as const } : n
      );
      const log = nodeLogs["complete"];
      return {
        nodes,
        stage: "delivery",
        currentPage: "tasks",
        selectedNodeId: nodes[completeIdx].id,
        logs:
          log && !state.logs.includes(log) ? [...state.logs, log] : state.logs,
      };
    }),
}));
