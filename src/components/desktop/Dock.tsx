import React, { useMemo } from 'react';
import { AppDefinition, AppID } from '../../types';
import { useOSStore } from '../../store/useOSStore';
import { SOCIAL_APPS } from '../../apps';

interface DockIconProps {
    name: string;
    icon: React.ReactNode;
    onClick: () => void;
    isRunning?: boolean;
}

const DockIcon: React.FC<DockIconProps> = ({ name, icon, onClick, isRunning = false }) => {
    return (
        <div
            className="group relative flex items-center justify-center w-[38px] h-[38px] md:w-[46px] md:h-[46px] flex-shrink-0"
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <div
                className="absolute bottom-full mb-[12px] left-1/2 -translate-x-1/2 bg-neutral-900/95 dark:bg-black/95 text-white border border-white/15 dark:border-white/10 text-[11px] font-medium tracking-wide antialiased px-2.5 py-1 rounded-md shadow-[0_8px_16px_rgba(0,0,0,0.6)] opacity-0 scale-95 pointer-events-none transition-all duration-200 ease-out origin-bottom group-hover:opacity-100 group-hover:scale-100 whitespace-nowrap z-[910]"
            >
                {name}
            </div>

            <div
                className="w-full h-full flex items-center justify-center overflow-visible cursor-pointer will-change-transform group-hover:scale-[1.12] group-hover:-translate-y-1 rounded-[22%]"
                style={{
                    background: 'transparent',
                    transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {icon}
            </div>

            <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black/80 dark:bg-white/80 flex-shrink-0"
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
    onOpen: (id: AppID) => void;
}

export const Dock: React.FC<DockProps> = ({ apps, onOpen }) => {
    const windows = useOSStore((state) => state.windows);
    const runningIds = useMemo(() => windows.map((w) => w.id), [windows]);

    const handleSocialClick = (app: any) => {
        const url = app.url || app.mailto;
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="dock-wrap fixed bottom-1.5 left-1/2 -translate-x-1/2 z-[900] flex items-end pointer-events-none">
            <div
                className="dock flex items-center space-x-3 md:space-x-4 px-3 h-[48px] md:h-[54px] bg-white/10 dark:bg-black/25 backdrop-blur-xl border border-white/15 dark:border-white/5 shadow-[0_4px_6px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] rounded-2xl pointer-events-auto will-change-transform"
                style={{
                    transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {apps.map((app) => (
                    <DockIcon
                        key={app.id}
                        name={app.name}
                        icon={app.icon}
                        onClick={() => onOpen(app.id)}
                        isRunning={runningIds.includes(app.id)}
                    />
                ))}

                {apps.length > 0 && SOCIAL_APPS.length > 0 && (
                    <div className="w-px h-7 md:h-8 bg-black/10 dark:bg-white/10 self-center flex-shrink-0" />
                )}

                {SOCIAL_APPS.map((app) => (
                    <DockIcon
                        key={app.id}
                        name={app.name}
                        icon={app.icon}
                        onClick={() => handleSocialClick(app)}
                        isRunning={false}
                    />
                ))}
            </div>
        </div>
    );
};
