import React, { useRef } from 'react';
import { WindowInstance } from '../../types';
import { useWindowDragResize } from '../../hooks/useWindowDragResize';
import { APP_DEFS } from '../../apps';

interface TrafficLightsProps {
  onClose: () => void;
  onMin: () => void;
  onMax: () => void;
  isResizable?: boolean;
}

const TrafficLights: React.FC<TrafficLightsProps> = ({ onClose, onMin, onMax, isResizable }) => {
  return (
    <div className="traffic-lights flex gap-2 items-center group-hover:visible">
      <div
        className="traffic-light traffic-close w-3 h-3 rounded-full flex items-center justify-center cursor-pointer border border-black/15 bg-[#FF5F57] relative"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <svg viewBox="0 0 6 6" className="w-[6px] h-[6px] opacity-0 hover:opacity-100 text-black/65 absolute">
          <path d="M1 1l4 4M5 1l-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="traffic-light traffic-min w-3 h-3 rounded-full flex items-center justify-center cursor-pointer border border-black/15 bg-[#FEBC2E] relative"
        onClick={(e) => {
          e.stopPropagation();
          onMin();
        }}
      >
        <svg viewBox="0 0 6 6" className="w-[6px] h-[6px] opacity-0 hover:opacity-100 text-black/65 absolute">
          <path d="M1 3h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className={`traffic-light traffic-max w-3 h-3 rounded-full flex items-center justify-center border border-black/15 bg-[#28C840] relative ${
          isResizable === false ? 'opacity-50 pointer-events-none cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          if (isResizable !== false) {
            onMax();
          }
        }}
      >
        {isResizable !== false && (
          <svg viewBox="0 0 6 6" className="w-[6px] h-[6px] opacity-0 hover:opacity-100 text-black/65 absolute">
            <path d="M1.5 1.5L4.5 1.5L4.5 4.5z M4.5 4.5L1.5 4.5L1.5 1.5z" fill="currentColor" />
          </svg>
        )}
      </div>
    </div>
  );
};

interface WindowProps {
  win: WindowInstance;
  onClose: () => void;
  onMin: () => void;
  onMax: () => void;
  onFocus: () => void;
  onChange: (next: Partial<WindowInstance>) => void;
  focused: boolean;
  windowStyle: 'sonoma' | 'bigsur' | 'monterey';
}

export const Window: React.FC<WindowProps> = ({
  win,
  onClose,
  onMin,
  onMax,
  onFocus,
  onChange,
  focused,
  windowStyle,
}) => {
  const winRef = useRef<HTMLDivElement>(null);
  const { isDragging, startDrag, startResize } = useWindowDragResize(win, onChange, onFocus);

  // Retrieve content from app list based on win.id
  const appDef = APP_DEFS.find((a) => a.id === win.id);
  const ContentComponent = appDef ? appDef.Component : () => null;

  return (
    <div
      ref={winRef}
      className={`window absolute flex flex-col rounded-lg overflow-hidden select-none bg-paper shadow-[0_0_0_0.5px_rgba(0,0,0,0.3),0_22px_60px_rgba(0,0,0,0.35),0_8px_20px_rgba(0,0,0,0.18)] transition-all ease-calm duration-200 ${
        focused ? '' : 'unfocused shadow-[0_0_0_0.5px_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.18)]'
      } ${win.minimized ? 'minimized scale-0 translate-y-[400px] opacity-0 pointer-events-none' : ''} style-${windowStyle}`}
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
      }}
      onMouseDown={onFocus}
    >
      {/* Titlebar */}
      <div
        className={`titlebar h-[38px] flex items-center px-3 bg-paper-2 border-b border-rule flex-shrink-0 relative select-none cursor-grab ${
          isDragging ? 'dragging cursor-grabbing' : ''
        }`}
        onMouseDown={startDrag}
      >
        <TrafficLights onClose={onClose} onMin={onMin} onMax={onMax} isResizable={win.isResizable} />
        <div className="window-title absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[13px] font-semibold text-ink-2 tracking-tight pointer-events-none select-none">
          {win.title}
        </div>
      </div>

      {/* Window Body Container */}
      <div className="window-body flex-1 overflow-auto bg-paper select-text">
        <ContentComponent />
      </div>

      {/* 8-Directional Resize handles */}
      {win.isResizable !== false && (
        <>
          <div className="resize-handle resize-n absolute z-[5] top-[-3px] left-0 right-0 h-1.5 cursor-ns-resize" onMouseDown={startResize('n')} />
          <div className="resize-handle resize-s absolute z-[5] bottom-[-3px] left-0 right-0 h-1.5 cursor-ns-resize" onMouseDown={startResize('s')} />
          <div className="resize-handle resize-e absolute z-[5] right-[-3px] top-0 bottom-0 w-1.5 cursor-ew-resize" onMouseDown={startResize('e')} />
          <div className="resize-handle resize-w absolute z-[5] left-[-3px] top-0 bottom-0 w-1.5 cursor-ew-resize" onMouseDown={startResize('w')} />
          <div className="resize-handle resize-ne absolute z-[5] right-[-3px] top-[-3px] w-3 h-3 cursor-nesw-resize" onMouseDown={startResize('ne')} />
          <div className="resize-handle resize-nw absolute z-[5] left-[-3px] top-[-3px] w-3 h-3 cursor-nwse-resize" onMouseDown={startResize('nw')} />
          <div className="resize-handle resize-se absolute z-[5] right-[-3px] bottom-[-3px] w-3 h-3 cursor-nwse-resize" onMouseDown={startResize('se')} />
          <div className="resize-handle resize-sw absolute z-[5] left-[-3px] bottom-[-3px] w-3 h-3 cursor-nesw-resize" onMouseDown={startResize('sw')} />
        </>
      )}
    </div>
  );
};
