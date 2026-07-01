// 由 electron/preload.cjs 通过 contextBridge 注入的桌面桥接 API 类型
export {};

declare global {
  /** 主进程推送的自动更新事件 */
  type UpdateEvent =
    | { type: 'checking' }
    | { type: 'available'; version?: string }
    | { type: 'not-available' }
    | { type: 'progress'; percent: number }
    | { type: 'downloaded'; version?: string }
    | { type: 'error'; message: string };

  interface DesktopBridge {
    isDesktop: true;
    platform: NodeJS.Platform;
    versions: {
      electron: string;
      chrome: string;
      node: string;
    };
    updates: {
      /** 订阅更新事件；返回取消订阅函数 */
      onEvent: (cb: (event: UpdateEvent) => void) => () => void;
      /** 用户确认后开始下载更新 */
      download: () => Promise<void>;
      /** 立即重启并安装已下载的更新 */
      restart: () => Promise<void>;
      /** 手动触发一次检查 */
      check: () => Promise<void>;
    };
  }

  interface Window {
    /** 仅在 Electron 桌面壳中存在；浏览器里为 undefined */
    desktop?: DesktopBridge;
  }
}
