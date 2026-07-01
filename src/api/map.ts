/**
 * UI 展示词表 ↔ 后端契约枚举 的桥接层（防腐层）。
 *
 * 前端有些状态机刻意用了自己的展示词表（如 `TaskStatusCore` 的 pending_gate/
 * pending_council、`CouncilVerdict` 的 select/needs_human），与后端契约枚举并不逐一对应。
 * 这里用 `Record<UI枚举, 契约枚举>` 显式映射：
 *   - UI 侧新增/删改成员 → 缺键或多键，编译报错；
 *   - 后端契约枚举漂移（改名/删值）→ 映射目标非法，编译报错。
 * 因此这层是"后端契约漂移在前端咬住"的关键落点，务必保持被真实引用（勿变死代码）。
 *
 * 映射方向恒为 UI → 契约（有损收敛）：UI 词表更细，向后端较粗的 v0 枚举收拢。
 */
import type { CouncilVerdict, TaskStatusCore } from '@/types';
import type { CouncilDecision, TaskStatus } from '@/api/types';

/**
 * 协调器主状态：UI 展示态 → 契约 `TaskStatus`。
 * UI 的 waiting_input/pending_gate/pending_council 是展示细分，向 v0 契约态收敛。
 */
export const UI_TO_CONTRACT_TASK_STATUS: Record<TaskStatusCore, TaskStatus> = {
  created: 'created',
  claimed: 'claimed',
  running: 'running',
  waiting_input: 'waiting_help',
  pending_gate: 'blocked',
  pending_council: 'reviewing',
  reviewing: 'reviewing',
  blocked: 'blocked',
  completed: 'completed',
  failed: 'failed',
  cancelled: 'cancelled',
};

/** 契约 v0 的 Council 决策取值：'accept' | 'reject' | 'defer'。 */
export type ContractCouncilVerdict = CouncilDecision['verdict'];

/**
 * Council 决策：UI 四态 verdict → 契约 v0 三态。
 * needs_human 收敛为 defer（挂起转人工），request_revision 收敛为 reject（本轮不合入）。
 * 说明：这是有损映射；若后端未来把 CouncilDecision.verdict 扩成更细的取值，
 * 应回到这里放开对应分支，而不是在 UI 侧硬编码。
 */
export const UI_TO_CONTRACT_COUNCIL_VERDICT: Record<CouncilVerdict, ContractCouncilVerdict> = {
  select: 'accept',
  needs_human: 'defer',
  request_revision: 'reject',
  reject: 'reject',
};
