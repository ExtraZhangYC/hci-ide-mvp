// 由 electron/preload.cjs 通过 contextBridge 注入的桌面桥接 API 类型
export {};

declare global {
  interface DesktopBridge {
    isDesktop: true;
    platform: NodeJS.Platform;
    versions: {
      electron: string;
      chrome: string;
      node: string;
    };
  }

  interface Window {
    /** 仅在 Electron 桌面壳中存在；浏览器里为 undefined */
    desktop?: DesktopBridge;
  }
}
