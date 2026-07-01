import { PROJECT_EXPORT_FORMAT, type ProjectExport } from '@/store/useDemoStore';

/** 触发浏览器/Electron 下载，把数据存成 .json 文件到磁盘。 */
export function downloadJson(filename: string, data: unknown): void {
  const text = JSON.stringify(data, null, 2);
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** 弹出文件选择框，读取一个 .json 文件的文本内容（取消返回 null）。 */
export function openJsonFile(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    };
    input.click();
  });
}

/** 校验并解析项目存盘文件；不是本应用导出的文件则返回 null。 */
export function parseProjectExport(text: string): ProjectExport | null {
  try {
    const data = JSON.parse(text);
    if (
      data &&
      data.format === PROJECT_EXPORT_FORMAT &&
      data.project &&
      Array.isArray(data.tasks)
    ) {
      return data as ProjectExport;
    }
  } catch {
    // 非法 JSON，走 null
  }
  return null;
}

/** 项目名 → 安全文件名。 */
export function projectFileName(projectName: string): string {
  const safe = projectName.trim().replace(/[\\/:*?"<>|]+/g, '_') || 'project';
  return `${safe}.hci.json`;
}
