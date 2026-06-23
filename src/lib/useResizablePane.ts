import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

type Side = 'left' | 'right' | 'top' | 'bottom';

type Options = {
  /**
   * 面板相对主内容的位置，决定拖拽手柄所在的内边缘与放大方向：
   * left/right → 横向调宽；top/bottom → 纵向调高。
   */
  side: Side;
  defaultSize: number;
  minSize: number;
  maxSize: number;
  /** 提供则把尺寸 / 折叠态持久化到 localStorage */
  storageKey?: string;
};

/** 可拖拽调整尺寸 + 可折叠的面板（左右调宽 / 上下调高通用） */
export function useResizablePane({ side, defaultSize, minSize, maxSize, storageKey }: Options) {
  const [size, setSize] = useState(() => {
    if (storageKey) {
      const v = Number(localStorage.getItem(`sidepanel:${storageKey}:w`));
      if (v) return clamp(v, minSize, maxSize);
    }
    return defaultSize;
  });
  const [collapsed, setCollapsed] = useState(
    () => storageKey != null && localStorage.getItem(`sidepanel:${storageKey}:c`) === '1',
  );
  const dragging = useRef(false);

  useEffect(() => {
    if (storageKey) localStorage.setItem(`sidepanel:${storageKey}:w`, String(size));
  }, [size, storageKey]);
  useEffect(() => {
    if (storageKey) localStorage.setItem(`sidepanel:${storageKey}:c`, collapsed ? '1' : '0');
  }, [collapsed, storageKey]);

  const onResizeStart = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      const horizontal = side === 'left' || side === 'right';
      // right/bottom 面板：手柄朝向较小坐标方向移动 → 变大；left/top 相反
      const grows = side === 'right' || side === 'bottom';
      const start = horizontal ? e.clientX : e.clientY;
      const startSize = size;
      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const cur = horizontal ? ev.clientX : ev.clientY;
        const delta = grows ? start - cur : cur - start;
        setSize(clamp(startSize + delta, minSize, maxSize));
      };
      const onUp = () => {
        dragging.current = false;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      document.body.style.cursor = horizontal ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    },
    [side, size, minSize, maxSize],
  );

  return { size, collapsed, setCollapsed, onResizeStart, dragging };
}
