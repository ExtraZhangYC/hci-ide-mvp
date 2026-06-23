import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

type Options = {
  /** 面板位于主内容的哪一侧（决定拖拽方向） */
  side: "left" | "right";
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  /** 提供则把宽度 / 折叠态持久化到 localStorage */
  storageKey?: string;
};

/** 可拖拽调宽 + 可折叠的宽度状态（左右侧通用） */
export function useResizableWidth({
  side,
  defaultWidth,
  minWidth,
  maxWidth,
  storageKey,
}: Options) {
  const [width, setWidth] = useState(() => {
    if (storageKey) {
      const v = Number(localStorage.getItem(`sidepanel:${storageKey}:w`));
      if (v) return clamp(v, minWidth, maxWidth);
    }
    return defaultWidth;
  });
  const [collapsed, setCollapsed] = useState(
    () =>
      storageKey != null &&
      localStorage.getItem(`sidepanel:${storageKey}:c`) === "1"
  );
  const dragging = useRef(false);

  useEffect(() => {
    if (storageKey)
      localStorage.setItem(`sidepanel:${storageKey}:w`, String(width));
  }, [width, storageKey]);
  useEffect(() => {
    if (storageKey)
      localStorage.setItem(`sidepanel:${storageKey}:c`, collapsed ? "1" : "0");
  }, [collapsed, storageKey]);

  const onResizeStart = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      const startX = e.clientX;
      const startWidth = width;
      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        // 右侧面板拖左边缘：向左移→变宽；左侧面板相反
        const delta =
          side === "right" ? startX - ev.clientX : ev.clientX - startX;
        setWidth(clamp(startWidth + delta, minWidth, maxWidth));
      };
      const onUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [side, width, minWidth, maxWidth]
  );

  return { width, collapsed, setCollapsed, onResizeStart, dragging };
}
