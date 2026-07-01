import type { FileNode, Project } from '@/types';

/** 新建项目时的默认起步文件树 */
export function defaultProjectFiles(): FileNode[] {
  return [
    {
      name: 'src',
      children: [{ name: 'index.ts' }, { name: 'app.ts' }],
    },
    { name: 'package.json' },
    { name: 'README.md' },
  ];
}

/** 启动页「最近打开」的种子项目（mock） */
export const initialProjects: Project[] = [
  {
    id: 'proj-order',
    name: 'order-service',
    description: '订单核心服务 · 下单 / 履约 / 退款主链路',
    lastOpened: '2 小时前',
    tags: ['Node', 'PostgreSQL'],
    agentIds: ['backend-a', 'test-agent', 'security-agent', 'frontend-b'],
    files: [
      {
        name: 'src',
        children: [
          { name: 'index.ts' },
          { name: 'order.service.ts' },
          { name: 'auth.middleware.ts' },
          {
            name: 'routes',
            children: [{ name: 'order.routes.ts' }, { name: 'refund.routes.ts' }],
          },
        ],
      },
      {
        name: 'tests',
        children: [{ name: 'order.spec.ts' }],
      },
      { name: 'package.json' },
      { name: 'README.md' },
    ],
  },
  {
    id: 'proj-auth',
    name: 'auth-gateway',
    description: '统一鉴权网关 · OAuth2 / RBAC',
    lastOpened: '昨天',
    tags: ['Go', 'OAuth2'],
    agentIds: ['backend-a', 'security-agent', 'test-agent'],
    files: [
      {
        name: 'src',
        children: [
          { name: 'main.go' },
          {
            name: 'oauth',
            children: [{ name: 'provider.go' }, { name: 'token.go' }],
          },
          {
            name: 'rbac',
            children: [{ name: 'policy.go' }, { name: 'enforcer.go' }],
          },
        ],
      },
      { name: 'go.mod' },
      { name: 'README.md' },
    ],
  },
  {
    id: 'proj-billing',
    name: 'billing-web',
    description: '计费前端 · 订阅与账单管理',
    lastOpened: '3 天前',
    tags: ['React', 'TypeScript'],
    agentIds: ['frontend-b', 'backend-a', 'test-agent'],
    files: [
      {
        name: 'src',
        children: [
          { name: 'App.tsx' },
          {
            name: 'pages',
            children: [{ name: 'Billing.tsx' }, { name: 'Invoice.tsx' }],
          },
          {
            name: 'components',
            children: [{ name: 'PlanCard.tsx' }],
          },
        ],
      },
      { name: 'package.json' },
      { name: 'README.md' },
    ],
  },
];

/** 默认聚焦项目（Reset / 首个 demo 任务所属） */
export const DEFAULT_PROJECT_ID = 'proj-order';
