import { useState, useEffect } from 'react';
import { WindowInstance } from '../types';

interface DragState {
  kind: string;
  startX: number;
  startY: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
}

export const useWindowDragResize = (
  win: WindowInstance,
  onChange: (next: Partial<WindowInstance>) => void,
  onFocus: () => void
) => {
  const [drag, setDrag] = useState<DragState | null>(null);

  const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid dragging when clicking traffic lights or elements with .no-drag class
    const target = e.target as HTMLElement;
    if (target.closest('.traffic-light') || target.closest('.no-drag')) return;
    
    onFocus();
    setDrag({
      kind: 'move',
      startX: e.clientX,
      startY: e.clientY,
      x: win.x,
      y: win.y
    });
  };

  const startResize = (kind: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onFocus();
    setDrag({
      kind,
      startX: e.clientX,
      startY: e.clientY,
      x: win.x,
      y: win.y,
      w: win.w,
      h: win.h
    });
  };

  useEffect(() => {
    if (!drag) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const next: Partial<WindowInstance> = {};

      if (drag.kind === 'move') {
        next.x = Math.max(0, drag.x + dx);
        next.y = Math.max(26, drag.y + dy);
      } else {
        const minW = win.minW || 360;
        const minH = win.minH || 240;
        const w = drag.w ?? win.w;
        const h = drag.h ?? win.h;

        if (drag.kind.includes('e')) next.w = Math.max(minW, w + dx);
        if (drag.kind.includes('s')) next.h = Math.max(minH, h + dy);
        
        if (drag.kind.includes('w')) {
          const newW = Math.max(minW, w - dx);
          next.x = drag.x + (w - newW);
          next.w = newW;
        }
        
        if (drag.kind.includes('n')) {
          const newH = Math.max(minH, h - dy);
          next.y = Math.max(26, drag.y + (h - newH));
          next.h = newH;
        }
      }

      onChange(next);
    };

    const handleMouseUp = () => setDrag(null);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [drag, win, onChange]);

  return {
    isDragging: drag?.kind === 'move',
    startDrag,
    startResize
  };
};
