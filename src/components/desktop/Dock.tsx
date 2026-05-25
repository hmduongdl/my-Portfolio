import React, { useState, useEffect } from 'react';
import { AppDefinition, AppID } from '../../types';
import { useOSStore } from '../../store/useOSStore';
import { SOCIAL_APPS } from '../../apps';

interface DockIconProps {
  name: string;
  icon: React.ReactNode;
  bg?: string;
  onClick: () => void;
  isRunning?: boolean;
}

const DockIcon: React.FC<DockIconProps> = ({
  name,
  icon,
  bg,
  onClick,
  isRunning = false,
}) => {
  return (
    <div
      className="group relative flex items-center justify-center w-[36px] h-[36px] md:w-[40px] md:h-[40px]"
      onClick={onClick}
    >
      {/* Tooltip */}
      <div
        className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-paper-2/92 backdrop-blur-md text-ink text-[12px] font-medium px-2.5 py-1 rounded-md border border-black/15 shadow-[0_4px_12px_rgba(0,0,0,0.15)] opacity-0 pointer-events-none transition-all duration-150 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 whitespace-nowrap z-[910]"
      >
        {name}
      </div>

      {/* Icon Wrapper */}
      <div
        className="w-full h-full rounded-xl flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.2),0_0_0_0.5px_rgba(0,0,0,0.1)] overflow-hidden cursor-pointer transition-[transform] duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform transform hover:scale-[1.15] hover:-translate-y-[5px]"
        style={{
          background: bg || '#fff',
        }}
      >
        {icon}
      </div>

      {/* Active Running Indicator Dot */}
      <div
        className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black/80 dark:bg-white/80 transition-all duration-200 ${
          isRunning ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
      />
    </div>
  );
};

interface DockProps {
  apps: AppDefinition[];
  runningIds?: string[];
  onOpen: (id: AppID) => void;
  dockSize?: number;
  magnify?: number;
  autoHide?: boolean;
}

export const Dock: React.FC<DockProps> = ({
  apps,
  runningIds: _runningIdsProp,
  onOpen,
  dockSize: _dockSize = 52,
  magnify: _magnify = 1.55,
  autoHide = false,
}) => {
  const [hidden, setHidden] = useState<boolean>(autoHide);

  // Read windows dynamically from Zustand store to render running indicator dots
  const windows = useOSStore((state) => state.windows);
  const runningIds = windows.map((w) => w.id);

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

  const handleSocialClick = (app: any) => {
    const url = app.url || app.mailto;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

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
          className="dock flex items-center gap-3 md:gap-4 p-1.5 h-[48px] md:h-[54px] bg-white/10 dark:bg-black/25 backdrop-blur-xl border border-white/15 dark:border-white/5 shadow-2xl rounded-2xl pointer-events-auto"
          onMouseEnter={() => setHidden(false)}
        >
          {/* System Apps Group */}
          {apps.map((app) => (
            <DockIcon
              key={app.id}
              name={app.name}
              icon={app.icon}
              bg={app.bg}
              onClick={() => onOpen(app.id)}
              isRunning={runningIds.includes(app.id)}
            />
          ))}

          {/* Vertical Divider Line */}
          {apps.length > 0 && SOCIAL_APPS.length > 0 && (
            <div className="w-[1px] h-6 md:h-8 bg-white/20 self-center" />
          )}

          {/* Social Links Group */}
          {SOCIAL_APPS.map((app) => (
            <DockIcon
              key={app.id}
              name={app.name}
              icon={app.icon}
              bg={app.bg}
              onClick={() => handleSocialClick(app)}
              isRunning={false}
            />
          ))}
        </div>
      </div>
    </>
  );
};
