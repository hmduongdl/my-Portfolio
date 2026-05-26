import React, { useMemo } from 'react';
import { AppDefinition, AppID } from '../../types';
import { useOSStore } from '../../store/useOSStore';
import { SOCIAL_APPS } from '../../apps';

interface DockIconProps {
    id?: string;
    name: string;
    icon: React.ReactNode;
    onClick: () => void;
    isRunning?: boolean;
}

const DockIcon: React.FC<DockIconProps> = ({ id, name, icon, onClick, isRunning = false }) => {
    const isSPIcon = name.includes('Song Phương');
    const scaleClass = isSPIcon ? 'p-[1px] sm:p-[1.5px] scale-100' : 'p-0';

    return (
        <div
            id={id}
            className="group relative flex items-center justify-center w-[48px] h-[48px] md:w-[44px] md:h-[44px] flex-shrink-0 p-0 bg-transparent border-none shadow-none"
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
                className={`w-full h-full ${scaleClass} bg-transparent flex items-center justify-center overflow-visible cursor-pointer will-change-transform group-hover:[transform:scale(1.12)_translateY(-4px)] [&>img]:w-full [&>img]:h-full [&>img]:object-contain [&>img]:pointer-events-none`}
                style={{
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
    const socials = useOSStore((state) => state.socials);
    const runningIds = useMemo(() => windows.map((w) => w.id), [windows]);

    const handleSocialClick = (app: any) => {
        if (app.id === 'zalo') {
            onOpen('zalo');
            return;
        }
        const matchedSocial = socials.find(s => s.platform === app.id);
        const url = matchedSocial?.url;
        if (!url) {
            console.warn(`Missing database social URL for ${app.id}`);
            return;
        }
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="dock-wrap fixed bottom-[14px] md:bottom-1.5 left-1/2 -translate-x-1/2 z-[900] flex items-end pointer-events-none">
            <div
                className="dock flex w-max mx-auto items-center justify-center space-x-2.5 md:space-x-4 px-4 py-2 md:py-0 md:h-[54px] bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/10 shadow-[0_4px_6px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] rounded-2xl pointer-events-auto will-change-transform"
                style={{
                    transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {apps.map((app) => (
                    <DockIcon
                        key={app.id}
                        id={`dock-icon-${app.id}`}
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
                        id={`dock-icon-${app.id}`}
                        name={app.name}
                        icon={app.icon}
                        onClick={() => handleSocialClick(app)}
                        isRunning={app.id === 'zalo' ? runningIds.includes('zalo') : false}
                    />
                ))}
            </div>
        </div>
    );
};
