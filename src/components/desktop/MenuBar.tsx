import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { APP_DEFS } from '../../apps';
import { profileService } from '../../services/profileService';
import { profileVN } from '../../data/profileData';

const AppleLogo: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M17.05 20.28c-.98.95-2.05.94-3.08.41c-1.09-.55-2.09-.58-3.24 0c-1.44.74-2.2.53-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8c1.18-.24 2.31-.93 3.57-.84c1.51.12 2.65.72 3.4 1.8c-3.12 1.87-2.38 5.98.48 7.13c-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25c.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

export const MenuBar: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const activeAppName = useOSStore((state) => state.activeAppName);
  const openMenu = useOSStore((state) => state.openMenu);
  const setOpenMenu = useOSStore((state) => state.setOpenMenu);
  const openApp = useOSStore((state) => state.openApp);
  const language = useOSStore((state) => state.language);
  const [profile, setProfile] = useState<any>(profileVN);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const loadProfile = () => {
      profileService.getProfile(language)
        .then((p) => {
          if (p) setProfile(p);
        })
        .catch(() => {});
    };

    loadProfile();

    window.addEventListener('profile-updated', loadProfile);
    return () => {
      window.removeEventListener('profile-updated', loadProfile);
    };
  }, [language]);

  const day = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const clock = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const menus = ['File', 'Edit', 'View', 'Window', 'Help'];

  const appleMenu = [
    { label: 'About This Mac', action: () => openApp('about', APP_DEFS) },
    { divider: true },
    { label: 'Website Song Phương', action: () => window.open(profile?.songphuongUrl || 'https://songphuong.vn', '_blank') },
    { label: 'Contact Mail', action: () => window.open(`mailto:${profile?.email || 'duonghm.work@gmail.com'}`, '_blank') },
    { divider: true },
    { label: 'System Settings…', shortcut: '' },
    { label: 'App Store…' },
    { divider: true },
    { label: 'Recent Items' },
    { divider: true },
    { label: 'Force Quit…', shortcut: '⌥⌘⎋' },
    { divider: true },
    { label: 'Sleep' },
    { label: 'Restart…' },
    { label: 'Shut Down…' },
    { divider: true },
    { label: 'Lock Screen', shortcut: '⌃⌘Q' },
    { label: 'Log Out…', shortcut: '⇧⌘Q' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 h-[26px] z-[1000] bg-white/55 backdrop-blur-mac-menu border-b border-black/12 flex items-center px-3 text-[13px] text-ink font-medium select-none">
      <div className="flex items-center h-full gap-0 relative" onClick={(e) => e.stopPropagation()}>
        <div
          className="px-2 py-0.5 h-5 flex items-center cursor-default rounded hover:bg-black/8"
          onClick={() => setOpenMenu(openMenu === 'apple' ? null : 'apple')}
          style={{ backgroundColor: openMenu === 'apple' ? 'rgba(0,0,0,0.08)' : '' }}
        >
          <AppleLogo />
        </div>
        <div className="px-2.5 py-0.5 h-5 flex items-center cursor-default rounded text-[13px] tracking-tight font-semibold hover:bg-black/8">{activeAppName}</div>
        {menus.map((m) => (
          <div key={m} className="px-2.5 py-0.5 h-5 flex items-center cursor-default rounded text-[13px] tracking-tight hover:bg-black/8">{m}</div>
        ))}

        {openMenu === 'apple' && (
          <div className="absolute top-[26px] left-1.5 bg-paper/78 backdrop-blur-mac-dropdown border border-black/18 rounded-md p-1 min-w-[220px] shadow-[0_8px_28px_rgba(0,0,0,0.18),0_0_0_0.5px_rgba(0,0,0,0.05)] text-[13px] z-[1100]">
            {appleMenu.map((row, i) =>
              row.divider ? (
                <div key={i} className="h-[1px] bg-black/12 my-1 mx-2" />
              ) : (
                <div
                  key={i}
                  className="px-3 py-0.5 h-[22px] rounded flex justify-between items-center cursor-default text-ink hover:bg-primary hover:text-white"
                  onClick={() => {
                    if (row.action) row.action();
                    setOpenMenu(null);
                  }}
                >
                  <span>{row.label}</span>
                  {row.shortcut && <span className="text-[12px] opacity-70 ml-6 font-sans">{row.shortcut}</span>}
                </div>
              )
            )}
          </div>
        )}
      </div>
      
      <div className="ml-auto flex items-center gap-0.5">
        <div className="px-2 py-0.5 h-5 flex items-center cursor-default rounded hover:bg-black/8" title="Battery">
          <svg viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1" className="w-[22px] h-[11px]">
            <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" />
            <rect x="2" y="2" width="14" height="8" rx="1" fill="currentColor" />
            <rect x="21" y="3.5" width="2" height="5" rx="0.6" fill="currentColor" />
          </svg>
        </div>
        <div className="px-1.5 py-0.5 h-5 flex items-center cursor-default rounded hover:bg-black/8" title="Wi-Fi">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M8 13a1 1 0 100-2 1 1 0 000 2zm0-3.2a2.2 2.2 0 011.56.65l.7-.7a3.2 3.2 0 00-4.52 0l.7.7A2.2 2.2 0 018 9.8zm0-2.4c1.1 0 2.16.44 2.94 1.22l.71-.7a5.2 5.2 0 00-7.3 0l.71.7A4.2 4.2 0 018 7.4zm0-2.4a7.2 7.2 0 015.1 2.12l.7-.71a8.2 8.2 0 00-11.6 0l.71.71A7.2 7.2 0 018 5z"/>
          </svg>
        </div>
        <div className="px-1.5 py-0.5 h-5 flex items-center cursor-default rounded hover:bg-black/8" title="Search">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-3.5 h-3.5">
            <circle cx="7" cy="7" r="4.5"/>
            <path d="M10.5 10.5L13 13"/>
          </svg>
        </div>
        <div className="px-1.5 py-0.5 h-5 flex items-center cursor-default rounded hover:bg-black/8" title="Control Center">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-3.5 h-3.5">
            <rect x="2" y="3" width="12" height="3.2" rx="1.6"/>
            <rect x="2" y="9.8" width="12" height="3.2" rx="1.6"/>
            <circle cx="11" cy="4.6" r="0.9" fill="currentColor"/>
            <circle cx="5" cy="11.4" r="0.9" fill="currentColor"/>
          </svg>
        </div>
        <div className="px-2 py-0.5 text-[13px] tracking-tight font-medium cursor-default">{day}  {clock}</div>
      </div>
    </div>
  );
};
