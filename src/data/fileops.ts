import type { FileOpObservation, FilePermissionOutcome } from '@/api/types';
import { ACP_FS_METHOD_SCOPE, SCHEMA_VERSION } from '@/api/types';

/**
 * N7 执行期的文件操作观测流（mock 剧本）。
 *
 * 数据形状严格走契约镜像 `FileOpObservation`（./api/types/fileops.ts）：
 * A 的 ACP 方法/权限请求 + C 的租约/产物 + D 的 Gate 判定。E 只观测渲染，
 * 唯一回传的是权限确认里人选的 optionId（见 store.resolveFilePermission）。
 *
 * 剧本贴合演示场景（RBAC 权限校验）：Backend 泳道改源码，Test 泳道建测试；
 * Backend 链上留了一次"创建新文件"的写入权限请求，作为文件层的人机确认时刻。
 * `required_scope` 恒取自 ACP_FS_METHOD_SCOPE，保持编译期护栏被真实引用。
 */

const at = (mmss: string) => `2026-07-02T10:${mmss}:00.000Z`;

const op = (
  partial: Omit<FileOpObservation, 'required_scope' | 'schema_version'>,
): FileOpObservation => ({
  ...partial,
  required_scope: ACP_FS_METHOD_SCOPE[partial.method],
  schema_version: SCHEMA_VERSION,
});

/** 按（含 -be/-te 后缀的）节点 id 提供该节点的文件操作观测流。 */
export const nodeFileOps: Record<string, FileOpObservation[]> = {
  'n7-executing-be': [
    op({
      tool_event_id: 'fop-be-01',
      method: 'fs/read_text_file',
      intent: 'read',
      path: 'src/auth/authMiddleware.ts',
      lease_id: 'lease-be-01',
      status: 'completed',
      summary: '读取现有鉴权中间件，定位注入点',
      created_at: at('14'),
    }),
    op({
      tool_event_id: 'fop-be-02',
      method: 'fs/read_text_file',
      intent: 'read',
      path: 'src/auth/userRole.ts',
      lease_id: 'lease-be-01',
      status: 'completed',
      summary: '复用既有用户角色模型（RBAC 方案依据）',
      created_at: at('14'),
    }),
    op({
      tool_event_id: 'fop-be-03',
      method: 'fs/write_text_file',
      intent: 'write',
      path: 'src/auth/permissionService.ts',
      lease_id: 'lease-be-02',
      gate_decision: 'allow',
      status: 'completed',
      summary: '写入角色→权限解析逻辑',
      artifact_ref: {
        artifact_id: 'art-diff-101',
        type: 'diff',
        uri: 'artifact://task/diff/art-diff-101',
        producer_id: 'agent-backend',
        created_at: at('15'),
        schema_version: SCHEMA_VERSION,
      },
      created_at: at('15'),
    }),
    op({
      tool_event_id: 'fop-be-04',
      method: 'fs/write_text_file',
      intent: 'create',
      path: 'src/auth/permissionMatrix.ts',
      lease_id: 'lease-be-02',
      gate_decision: 'ask',
      status: 'pending',
      summary: '创建角色-资源权限矩阵（新文件，写入前请求确认）',
      permission: {
        title: '允许创建 src/auth/permissionMatrix.ts？',
        message: 'Agent 将新建权限矩阵文件（约 60 行），声明各角色对订单资源的操作权限。',
        options: [
          { optionId: 'allow-once', name: '允许本次' },
          { optionId: 'allow-always', name: '本任务内始终允许' },
          { optionId: 'reject', name: '拒绝' },
        ],
      },
      created_at: at('16'),
    }),
  ],
  'n7-executing-te': [
    op({
      tool_event_id: 'fop-te-01',
      method: 'fs/list_directory',
      intent: 'list',
      path: 'tests/auth/',
      lease_id: 'lease-te-01',
      status: 'completed',
      summary: '枚举既有测试，避免重复用例',
      created_at: at('14'),
    }),
    op({
      tool_event_id: 'fop-te-02',
      method: 'fs/read_text_file',
      intent: 'read',
      path: 'src/auth/permissionService.ts',
      lease_id: 'lease-te-01',
      status: 'completed',
      summary: '读取被测实现，提取断言面',
      created_at: at('15'),
    }),
    op({
      tool_event_id: 'fop-te-03',
      method: 'fs/write_text_file',
      intent: 'create',
      path: 'tests/auth/permissionService.test.ts',
      lease_id: 'lease-te-02',
      gate_decision: 'allow',
      status: 'completed',
      summary: '新建权限服务单测（含 403 未授权用例）',
      artifact_ref: {
        artifact_id: 'art-diff-102',
        type: 'diff',
        uri: 'artifact://task/diff/art-diff-102',
        producer_id: 'agent-test',
        created_at: at('16'),
        schema_version: SCHEMA_VERSION,
      },
      created_at: at('16'),
    }),
  ],
};

/**
 * 合成渲染态：把人机确认结果（store 持久化）叠加回观测流。
 * 权限请求被确认后，该操作视为完成（拒绝则 failed）——这是 mock 侧的既成事实
 * 合成；真后端下 status 由 A 的工具事件推进，E 不自行推演。
 */
export function fileOpsForNode(
  nodeId: string,
  outcomes: Record<string, FilePermissionOutcome>,
): FileOpObservation[] {
  const ops = nodeFileOps[nodeId];
  if (!ops) return [];
  return ops.map((o) => {
    const outcome = outcomes[o.tool_event_id];
    if (!o.permission || !outcome) return o;
    return {
      ...o,
      permission_outcome: outcome,
      status:
        outcome.outcome === 'selected' && outcome.optionId !== 'reject' ? 'completed' : 'failed',
    };
  });
}
