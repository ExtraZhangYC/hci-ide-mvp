import { useState, type KeyboardEvent } from 'react';
import { FilePlus2, ArrowRight } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useDemoStore } from '@/store/useDemoStore';

/**
 * N0 Intake · 需求输入
 * 接收用户的原始需求文本（raw_spec_text），提交后创建新 Task 并进入需求分析。
 */
export function NewRequirementDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createTask = useDemoStore((s) => s.createTask);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');

  const canSubmit = text.trim().length > 0;

  const reset = () => {
    setText('');
    setTitle('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCreate = () => {
    if (!canSubmit) return;
    createTask(text, title);
    reset();
    onClose();
  };

  const onTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // ⌘/Ctrl + Enter 快捷提交
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="max-w-xl">
      <div className="p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-command/15 text-command-soft shadow-glow">
            <FilePlus2 className="h-5 w-5" />
          </div>
          <div>
            <div className="callsign text-[9px] text-command-soft/80">REQUIREMENT INTAKE</div>
            <h2 className="font-display text-base font-semibold text-white">
              新建需求 · N0 Intake
            </h2>
            <p className="text-xs text-slate-500">
              输入原始需求文本，Agent 将分析并推荐执行 Workflow
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label className="callsign mb-1.5 block text-[9px] text-slate-400">
            任务标题 · 可选（留空自动生成）
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：权限校验功能"
            className="w-full rounded-md border border-line-bright bg-ink-900 px-3 py-2 font-mono text-[13px] text-slate-100 placeholder:text-slate-600 focus:border-command focus:outline-none focus:ring-1 focus:ring-command/40"
          />
        </div>

        <div className="mt-4">
          <label className="callsign mb-1.5 block text-[9px] text-slate-400">
            原始需求文本 · RAW_SPEC_TEXT
          </label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onTextareaKeyDown}
            rows={5}
            autoFocus
            placeholder="描述你想实现的需求，例如：为订单接口增加基于角色的权限校验，未授权访问返回 403…"
          />
          <p className="mt-1.5 text-[11px] text-slate-600">
            提交后进入需求分析（N1 Triage），你可采用推荐 Workflow 或自行组建。
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={!canSubmit}>
            创建任务 <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
