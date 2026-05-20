import React, { useState, useEffect, useRef } from 'react';
import { AppDefinition } from '../../types';

interface DockIconProps {
  app: AppDefinition;
  mouseX: number | null;
  onOpen: (id: any) => void;
  isRunning: boolean;
  dockSize: number;
  magnify: number;
}

const DockIcon: React.FC<DockIconProps> = ({
  app,
  mouseX,
  onOpen,
  isRunning,
  dockSize,
  magnify,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    if (!ref.current || mouseX === null) {
      setScale(1);
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const dist = Math.abs(mouseX - center);
    const range = 110;
    if (dist > range) {
      setScale(1);
      return;
    }
    const t = 1 - dist / range;
    setScale(1 + (magnify - 1) * t);
  }, [mouseX, magnify]);

  return (
    <div
      className="dock-item relative"
      onClick={() => onOpen(app.id)}
      ref={ref}
      style={{ width: dockSize, height: dockSize }}
    >
      <div
        className="dock-tooltip absolute left-1/2 -translate-x-1/2 bg-paper-2/92 backdrop-blur-md text-ink text-[12px] font-medium px-2.5 py-1 rounded-md border border-black/15 shadow-[0_4px_12px_rgba(0,0,0,0.15)] opacity-0 pointer-events-none transition-all duration-120 hover-tooltip whitespace-nowrap"
        style={{ bottom: dockSize * scale + 10 }}
      >
        {app.name}
      </div>
      <div
        className="dock-icon absolute bottom-0 left-1/2 -translate-x-1/2 rounded-xl flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.2),0_0_0_0.5px_rgba(0,0,0,0.1)] overflow-hidden transition-all ease-calm duration-180 cursor-pointer"
        style={{
          width: dockSize * scale,
          height: dockSize * scale,
          background: app.bg || '#fff',
        }}
      >
        {app.icon}
      </div>
      <div
        className="dock-running w-1 h-1 rounded-full bg-black/60 absolute left-1/2 -translate-x-1/2 transition-opacity duration-200"
        style={{
          opacity: isRunning ? 1 : 0,
          bottom: -8,
        }}
      />
    </div>
  );
};

interface DockProps {
  apps: AppDefinition[];
  runningIds: string[];
  onOpen: (id: any) => void;
  dockSize?: number;
  magnify?: number;
  autoHide?: boolean;
}

export const Dock: React.FC<DockProps> = ({
  apps,
  runningIds,
  onOpen,
  dockSize = 52,
  magnify = 1.55,
  autoHide = false,
}) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [hidden, setHidden] = useState<boolean>(autoHide);

  useEffect(() => {
    if (!autoHide) {
      setHidden(false);
      return;
    }
    const handleMouseMove = (e: MouseEvent) => {
      setHidden(e.clientY < window.innerHeight - 60);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [autoHide]);

  return (
    <>
      {autoHide && (
        <div
          className="fixed bottom-0 left-0 right-0 h-2 z-[899]"
          onMouseEnter={() => setHidden(false)}
        />
      )}
      <div
        className={`dock-wrap fixed bottom-1.5 left-1/2 -translate-x-1/2 z-[900] flex items-end pointer-events-none transition-all duration-320 ease-calm ${
          hidden ? 'translate-y-[120%] opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div
          className="dock flex items-end gap-1.5 p-1.5 bg-white/32 backdrop-blur-mac-dock border border-white/40 rounded-[22px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.18),0_16px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.5)] pointer-events-auto box-content"
          style={{ height: dockSize + 12 }}
          onMouseEnter={() => setHidden(false)}
          onMouseMove={(e) => setMouseX(e.clientX)}
          onMouseLeave={() => setMouseX(null)}
        >
          {apps.map((app) => (
            <DockIcon
              key={app.id}
              app={app}
              mouseX={mouseX}
              onOpen={onOpen}
              isRunning={runningIds.includes(app.id)}
              dockSize={dockSize}
              magnify={magnify}
            />
          ))}
        </div>
      </div>
    </>
  );
};
