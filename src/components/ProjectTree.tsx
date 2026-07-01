import { useEffect, useState } from 'react';
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode2,
  FileText,
  FileJson,
  File as FileIcon,
  Users,
  ListTodo,
  FolderGit2,
  Plus,
  CircleDot,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { getAgentById } from '@/data/agents';
import { NewProjectDialog } from '@/components/NewProjectDialog';
import { NewRequirementDialog } from '@/components/NewRequirementDialog';
import { cn } from '@/lib/utils';
import type { AgentStatus, DemoStage, FileNode } from '@/types';

const GROUPS = ['files', 'agents', 'tasks'] as const;

function defaultOpenKeys(projectId: string | null): string[] {
  if (!projectId) return [];
  return [`p:${projectId}`, ...GROUPS.map((g) => `g:${projectId}:${g}`), `d:${projectId}:src`];
}

const agentDotColor: Record<AgentStatus, string> = {
  idle: 'text-slate-500',
  working: 'text-command-soft',
  waiting: 'text-human',
  reviewing: 'text-violet-300',
  done: 'text-emerald-400',
};

const stageDotColor: Record<DemoStage, string> = {
  idle: 'bg-slate-600',
  team_configured: 'bg-command-soft',
  analyzing: 'bg-command-soft',
  workflow_recommended: 'bg-command-soft',
  executing: 'bg-blue-400',
  intervention: 'bg-human',
  council: 'bg-violet-400',
  delivery: 'bg-emerald-400',
};

const stageShort: Record<DemoStage, string> = {
  idle: '待开始',
  team_configured: '就绪',
  analyzing: '分析中',
  workflow_recommended: '已推荐',
  executing: '执行中',
  intervention: '介入',
  council: '议会',
  delivery: '已交付',
};

function fileIcon(name: string) {
  if (/\.(ts|tsx|js|jsx|go|py)$/.test(name)) return FileCode2;
  if (/\.json$/.test(name)) return FileJson;
  if (/\.(md|txt)$/.test(name)) return FileText;
  return FileIcon;
}

export function ProjectTree({ collapsed }: { collapsed: boolean }) {
  const projects = useDemoStore((s) => s.projects);
  const activeProjectId = useDemoStore((s) => s.activeProjectId);
  const activeTaskId = useDemoStore((s) => s.activeTaskId);
  const stage = useDemoStore((s) => s.stage);
  const tasks = useDemoStore((s) => s.tasks);
  const assignedAgentIds = useDemoStore((s) => s.assignedAgentIds);
  const openProject = useDemoStore((s) => s.openProject);
  const selectTask = useDemoStore((s) => s.selectTask);
  const selectAgent = useDemoStore((s) => s.selectAgent);
  const setPage = useDemoStore((s) => s.setPage);

  const [open, setOpen] = useState<Set<string>>(() => new Set(defaultOpenKeys(activeProjectId)));
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newReqOpen, setNewReqOpen] = useState(false);

  // 切换聚焦项目时，自动展开该项目的分组
  useEffect(() => {
    if (!activeProjectId) return;
    setOpen((prev) => {
      const next = new Set(prev);
      defaultOpenKeys(activeProjectId).forEach((k) => next.add(k));
      return next;
    });
  }, [activeProjectId]);

  const isOpen = (key: string) => open.has(key);
  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  if (collapsed) {
    return (
      <div className="space-y-1">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => openProject(p.id)}
            title={p.name}
            className={cn(
              'flex w-full items-center justify-center rounded-lg py-2 transition-colors',
              p.id === activeProjectId
                ? 'bg-command/15 text-command-soft ring-1 ring-command/30'
                : 'text-slate-400 hover:bg-ink-700 hover:text-slate-100',
            )}
          >
            <FolderGit2 className="h-4 w-4" />
          </button>
        ))}
      </div>
    );
  }

  const requestNewRequirement = (projectId: string) => {
    if (projectId !== activeProjectId) openProject(projectId);
    setNewReqOpen(true);
  };

  const openAgent = (projectId: string, agentId: string) => {
    if (projectId !== activeProjectId) openProject(projectId);
    selectAgent(agentId);
    setPage('agents');
  };

  return (
    <div>
      {/* 工作台标题 + 新建项目 */}
      <div className="mb-1 flex items-center justify-between px-2">
        <span className="callsign text-[9px] text-slate-600">// 工作台</span>
        <button
          onClick={() => setNewProjectOpen(true)}
          title="新建项目"
          className="rounded-md p-1 text-slate-500 transition-colors hover:bg-command/10 hover:text-command-soft"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-0.5">
        {projects.map((project) => {
          const projectOpen = isOpen(`p:${project.id}`);
          const isActive = project.id === activeProjectId;
          const projTasks = tasks.filter((t) => t.projectId === project.id);
          const agentIds = isActive ? assignedAgentIds : project.agentIds;

          return (
            <div key={project.id}>
              {/* 项目行 */}
              <div
                className={cn(
                  'flex items-center rounded-md pr-1 transition-colors',
                  isActive ? 'bg-command/10' : 'hover:bg-ink-700/70',
                )}
              >
                <button
                  onClick={() => toggle(`p:${project.id}`)}
                  className="p-1 text-slate-500 hover:text-slate-300"
                  aria-label={projectOpen ? '收起' : '展开'}
                >
                  <ChevronRight
                    className={cn('h-3.5 w-3.5 transition-transform', projectOpen && 'rotate-90')}
                  />
                </button>
                <button
                  onClick={() => openProject(project.id)}
                  className="flex min-w-0 flex-1 items-center gap-1.5 py-1.5 text-left"
                >
                  <FolderGit2
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isActive ? 'text-command-soft' : 'text-slate-400',
                    )}
                  />
                  <span
                    className={cn(
                      'min-w-0 flex-1 truncate font-mono text-[13px]',
                      isActive ? 'text-command-soft' : 'text-slate-200',
                    )}
                  >
                    {project.name}
                  </span>
                  {isActive && <CircleDot className="h-3 w-3 shrink-0 text-command-soft" />}
                </button>
              </div>

              {/* 项目子树 */}
              {projectOpen && (
                <div className="ml-3 border-l border-line pl-1.5">
                  {/* 文件 */}
                  <TreeGroup
                    icon={Folder}
                    label="文件"
                    count={countFiles(project.files)}
                    open={isOpen(`g:${project.id}:files`)}
                    onToggle={() => toggle(`g:${project.id}:files`)}
                  >
                    <FileTree
                      nodes={project.files}
                      projectId={project.id}
                      path=""
                      depth={0}
                      isOpen={isOpen}
                      toggle={toggle}
                      selectedFile={selectedFile}
                      onSelectFile={setSelectedFile}
                    />
                  </TreeGroup>

                  {/* Agents */}
                  <TreeGroup
                    icon={Users}
                    label="Agents"
                    count={agentIds.length}
                    open={isOpen(`g:${project.id}:agents`)}
                    onToggle={() => toggle(`g:${project.id}:agents`)}
                  >
                    {agentIds.map((id) => {
                      const a = getAgentById(id);
                      if (!a) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => openAgent(project.id, id)}
                          className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs text-slate-400 transition-colors hover:bg-ink-700 hover:text-slate-200"
                        >
                          <CircleDot className={cn('h-3 w-3 shrink-0', agentDotColor[a.status])} />
                          <span className="min-w-0 flex-1 truncate">{a.name}</span>
                        </button>
                      );
                    })}
                    {agentIds.length === 0 && <EmptyHint text="团队为空" />}
                  </TreeGroup>

                  {/* 任务 */}
                  <TreeGroup
                    icon={ListTodo}
                    label="任务"
                    count={projTasks.length}
                    open={isOpen(`g:${project.id}:tasks`)}
                    onToggle={() => toggle(`g:${project.id}:tasks`)}
                    action={
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          requestNewRequirement(project.id);
                        }}
                        title="新建需求"
                        className="rounded p-0.5 text-slate-500 hover:bg-command/10 hover:text-command-soft"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    }
                  >
                    {projTasks.map((t) => {
                      const liveStage = t.id === activeTaskId ? stage : t.stage;
                      const selected = t.id === activeTaskId;
                      return (
                        <button
                          key={t.id}
                          onClick={() => selectTask(t.id)}
                          className={cn(
                            'flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs transition-colors',
                            selected
                              ? 'bg-blue-600/20 text-blue-100'
                              : 'text-slate-400 hover:bg-ink-700 hover:text-slate-200',
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 shrink-0 rounded-full',
                              stageDotColor[liveStage],
                            )}
                          />
                          <span className="min-w-0 flex-1 truncate">{t.title}</span>
                          <span className="shrink-0 text-[10px] text-slate-500">
                            {stageShort[liveStage]}
                          </span>
                        </button>
                      );
                    })}
                    {projTasks.length === 0 && <EmptyHint text="暂无任务 · 点 ＋ 新建需求" />}
                  </TreeGroup>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <NewProjectDialog open={newProjectOpen} onClose={() => setNewProjectOpen(false)} />
      <NewRequirementDialog open={newReqOpen} onClose={() => setNewReqOpen(false)} />
    </div>
  );
}

function TreeGroup({
  icon: Icon,
  label,
  count,
  open,
  onToggle,
  action,
  children,
}: {
  icon: typeof Folder;
  label: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="group/g flex items-center rounded pr-1 hover:bg-ink-700/50">
        <button
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-1 py-1 pl-0.5 text-left"
        >
          <ChevronRight
            className={cn(
              'h-3 w-3 shrink-0 text-slate-600 transition-transform',
              open && 'rotate-90',
            )}
          />
          <Icon className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <span className="callsign text-[9px] text-slate-500">{label}</span>
          <span className="text-[9px] text-slate-600">{count}</span>
        </button>
        {action && (
          <span className="opacity-0 transition-opacity group-hover/g:opacity-100">{action}</span>
        )}
      </div>
      {open && <div className="ml-1">{children}</div>}
    </div>
  );
}

function FileTree({
  nodes,
  projectId,
  path,
  depth,
  isOpen,
  toggle,
  selectedFile,
  onSelectFile,
}: {
  nodes: FileNode[];
  projectId: string;
  path: string;
  depth: number;
  isOpen: (key: string) => boolean;
  toggle: (key: string) => void;
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
}) {
  return (
    <div>
      {nodes.map((node) => {
        const nodePath = path ? `${path}/${node.name}` : node.name;
        const isDir = !!node.children;
        const dirKey = `d:${projectId}:${nodePath}`;
        const dirOpen = isOpen(dirKey);
        const Icon = isDir ? (dirOpen ? FolderOpen : Folder) : fileIcon(node.name);
        const selected = !isDir && selectedFile === `${projectId}:${nodePath}`;
        return (
          <div key={nodePath}>
            <button
              onClick={() => (isDir ? toggle(dirKey) : onSelectFile(`${projectId}:${nodePath}`))}
              className={cn(
                'flex w-full items-center gap-1 rounded py-0.5 pr-1 text-left text-xs transition-colors',
                selected
                  ? 'bg-blue-600/20 text-blue-100'
                  : 'text-slate-400 hover:bg-ink-700 hover:text-slate-200',
              )}
              style={{ paddingLeft: `${depth * 12 + 4}px` }}
            >
              {isDir ? (
                <ChevronRight
                  className={cn(
                    'h-3 w-3 shrink-0 text-slate-600 transition-transform',
                    dirOpen && 'rotate-90',
                  )}
                />
              ) : (
                <span className="w-3 shrink-0" />
              )}
              <Icon
                className={cn(
                  'h-3.5 w-3.5 shrink-0',
                  isDir ? 'text-command-soft/70' : 'text-slate-500',
                )}
              />
              <span className="min-w-0 flex-1 truncate font-mono">{node.name}</span>
            </button>
            {isDir && dirOpen && (
              <FileTree
                nodes={node.children!}
                projectId={projectId}
                path={nodePath}
                depth={depth + 1}
                isOpen={isOpen}
                toggle={toggle}
                selectedFile={selectedFile}
                onSelectFile={onSelectFile}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <div className="px-2 py-1 text-[11px] text-slate-600">{text}</div>;
}

function countFiles(nodes: FileNode[]): number {
  return nodes.reduce((acc, n) => acc + (n.children ? countFiles(n.children) : 1), 0);
}
