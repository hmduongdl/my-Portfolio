import React, { useMemo } from 'react';
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
      className="group relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 flex-shrink-0"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* Tooltip */}
      <div
        className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-paper-2/92 backdrop-blur-md text-ink text-xs font-medium px-2.5 py-1 rounded-md border border-black/15 shadow-[0_4px_12px_rgba(0,0,0,0.15)] opacity-0 pointer-events-none transition-all duration-150 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 whitespace-nowrap z-[910]"
      >
        {name}
      </div>

      {/* Icon Container - Pure CSS Hover with GPU Acceleration */}
      <div
        className="w-full h-full rounded-xl flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.2),0_0_0_0.5px_rgba(0,0,0,0.1)] overflow-hidden cursor-pointer will-change-transform"
        style={{
          background: bg || '#fff',
          transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.15) translateY(-5px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1) translateY(0)';
        }}
      >
        {icon}
      </div>

      {/* Active Running Indicator Dot - GPU Accelerated */}
      <div
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black/80 dark:bg-white/80 flex-shrink-0"
        style={{
          transform: isRunning ? 'scale(1)' : 'scale(0)',
          opacity: isRunning ? 1 : 0,
          transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform, opacity',
        }}
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
  magnify: _magnify = 1.4,
}) => {
  // Read windows dynamically from Zustand store to render running indicator dots
  const windows = useOSStore((state) => state.windows);
  const runningIds = useMemo(() => windows.map((w) => w.id), [windows]);

  const handleSocialClick = (app: any) => {
    const url = app.url || app.mailto;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // If autoHide is enabled, the dock is always visible
  // Removed mousemove event listener for better performance
  // Use CSS for transitions only

  return (
    <div
      className="dock-wrap fixed bottom-1.5 left-1/2 -translate-x-1/2 z-[900] flex items-end pointer-events-none"
    >
      {/* Main Dock Container - Glassmorphism Design with GPU-Accelerated Animations */}
      <div
        className="dock flex items-center gap-3 md:gap-4 p-1.5 h-12 md:h-[54px] bg-white/10 dark:bg-black/25 backdrop-blur-xl border border-white/15 dark:border-white/5 shadow-2xl rounded-2xl pointer-events-auto will-change-transform"
        style={{
          transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
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

        {/* Vertical Divider Line - Separator between System Apps and Social Links */}
        {apps.length > 0 && SOCIAL_APPS.length > 0 && (
          <div className="w-px h-6 md:h-8 bg-gradient-to-b from-white/0 via-white/20 to-white/0 dark:via-white/10 self-center flex-shrink-0" />
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
  );
};
