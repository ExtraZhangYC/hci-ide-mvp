import { useEffect, useState } from 'react';
import { Download, RefreshCw, RotateCw, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type Status =
  | { kind: 'idle' }
  | { kind: 'downloading'; percent: number; version?: string }
  | { kind: 'ready'; version?: string };

/**
 * 应用内自动更新提示条（右下角）。
 * 仅在 Electron 桌面壳中生效（浏览器里 window.desktop 为空，直接不渲染）。
 */
export function UpdateBanner() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [dismissed, setDismissed] = useState(false);
  const [restarting, setRestarting] = useState(false);

  useEffect(() => {
    const api = window.desktop?.updates;
    if (!api) return;
    return api.onEvent((e) => {
      switch (e.type) {
        case 'available':
          setDismissed(false);
          setStatus({ kind: 'downloading', percent: 0, version: e.version });
          break;
        case 'progress':
          setStatus((s) => (s.kind === 'downloading' ? { ...s, percent: e.percent } : s));
          break;
        case 'downloaded':
          setDismissed(false);
          setStatus({ kind: 'ready', version: e.version });
          break;
        // checking / not-available / error 不打扰用户
        default:
          break;
      }
    });
  }, []);

  if (dismissed || status.kind === 'idle') return null;

  const version = status.version ? `v${status.version}` : '新版本';

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-72 animate-fade-in rounded-lg border border-line-bright bg-ink-850 p-4 shadow-2xl shadow-black/60">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
        aria-label="关闭"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {status.kind === 'downloading' ? (
        <>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 shrink-0 animate-spin text-command-soft" />
            <div className="callsign text-[9px] text-command-soft/80">AUTO UPDATE</div>
          </div>
          <div className="mt-2 text-sm text-slate-200">正在下载 {version}…</div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
            <div
              className="h-full rounded-full bg-command transition-all"
              style={{ width: `${status.percent}%` }}
            />
          </div>
          <div className="mt-1 text-right font-mono text-[10px] text-slate-500">
            {status.percent}%
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 shrink-0 text-emerald-400" />
            <div className="callsign text-[9px] text-emerald-300/80">UPDATE READY</div>
          </div>
          <div className="mt-2 text-sm text-slate-200">{version} 已下载，重启即可更新。</div>
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
              稍后
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={restarting}
              onClick={() => {
                setRestarting(true);
                window.desktop?.updates.restart();
              }}
            >
              <RotateCw className="h-3.5 w-3.5" /> 重启更新
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
