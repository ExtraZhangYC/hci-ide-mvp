// 预加载脚本：在隔离上下文里向渲染层暴露一个最小、安全的桌面 API。
// 后续真实文件系统 / 终端 / agent 能力都从这里桥接到主进程。
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("desktop", {
  isDesktop: true,
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
});
