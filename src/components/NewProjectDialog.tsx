import { useState, type KeyboardEvent } from 'react';
import { FolderPlus, ArrowRight } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useDemoStore } from '@/store/useDemoStore';

/** 新建项目 · 仅需项目名（可选描述），创建后进入工作区 */
export function NewProjectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createProject = useDemoStore((s) => s.createProject);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const canSubmit = name.trim().length > 0;

  const reset = () => {
    setName('');
    setDescription('');
  };
  const handleClose = () => {
    reset();
    onClose();
  };
  const handleCreate = () => {
    if (!canSubmit) return;
    createProject(name, description);
    reset();
    onClose();
  };
  const onNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="max-w-md">
      <div className="p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-command/15 text-command-soft shadow-glow">
            <FolderPlus className="h-5 w-5" />
          </div>
          <div>
            <div className="callsign text-[9px] text-command-soft/80">NEW PROJECT</div>
            <h2 className="font-display text-base font-semibold text-white">新建项目</h2>
          </div>
        </div>

        <div className="mt-5">
          <label className="callsign mb-1.5 block text-[9px] text-slate-400">项目名称 · NAME</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onNameKeyDown}
            autoFocus
            placeholder="例如：order-service"
            className="w-full rounded-md border border-line-bright bg-ink-900 px-3 py-2 font-mono text-[13px] text-slate-100 placeholder:text-slate-600 focus:border-command focus:outline-none focus:ring-1 focus:ring-command/40"
          />
        </div>

        <div className="mt-4">
          <label className="callsign mb-1.5 block text-[9px] text-slate-400">描述 · 可选</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="一句话说明这个项目做什么…"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={!canSubmit}>
            创建并进入 <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
