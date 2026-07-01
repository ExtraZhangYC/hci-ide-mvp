// 预加载脚本：在隔离上下文里向渲染层暴露一个最小、安全的桌面 API。
// 后续真实文件系统 / 终端 / agent 能力都从这里桥接到主进程。
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desktop", {
  isDesktop: true,
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
  updates: {
    /** 订阅更新事件；返回取消订阅函数 */
    onEvent: (cb) => {
      const listener = (_event, payload) => cb(payload);
      ipcRenderer.on("update:event", listener);
      return () => ipcRenderer.removeListener("update:event", listener);
    },
    /** 用户确认后开始下载更新 */
    download: () => ipcRenderer.invoke("update:download"),
    /** 立即重启并安装已下载的更新 */
    restart: () => ipcRenderer.invoke("update:restart"),
    /** 手动触发一次检查 */
    check: () => ipcRenderer.invoke("update:check"),
  },
});
