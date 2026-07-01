// 应用内自动更新：electron-updater + GitHub Releases（发布时生成的 latest.yml 为更新源）。
// 启动后后台检查/下载新版本，通过 IPC 把状态推给渲染层，由 UpdateBanner 呈现。
const { app, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");

const SIX_HOURS = 6 * 60 * 60 * 1000;

function setupAutoUpdater(getWindow) {
  // 仅在打包后的应用启用（dev 下没有更新元数据，会直接报错）
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  const send = (type, payload = {}) => {
    const win = getWindow();
    if (win && !win.isDestroyed()) {
      win.webContents.send("update:event", { type, ...payload });
    }
  };

  autoUpdater.on("checking-for-update", () => send("checking"));
  autoUpdater.on("update-available", (info) => send("available", { version: info?.version }));
  autoUpdater.on("update-not-available", () => send("not-available"));
  autoUpdater.on("download-progress", (p) =>
    send("progress", { percent: Math.round(p?.percent ?? 0) })
  );
  autoUpdater.on("update-downloaded", (info) => send("downloaded", { version: info?.version }));
  autoUpdater.on("error", (err) => send("error", { message: String(err?.message || err) }));

  // 渲染层可主动触发：立即重启安装 / 手动检查
  ipcMain.handle("update:restart", () => autoUpdater.quitAndInstall());
  ipcMain.handle("update:check", () => autoUpdater.checkForUpdates().catch(() => {}));

  // 启动 3s 后检查一次（避开首屏渲染），之后每 6 小时检查一次
  setTimeout(() => autoUpdater.checkForUpdates().catch(() => {}), 3000);
  setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), SIX_HOURS);
}

module.exports = { setupAutoUpdater };
