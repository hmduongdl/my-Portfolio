import React, { useState } from 'react';
import { useOSStore } from '../store/useOSStore';

export const WidgetSettings: React.FC = () => {
  const { tweaks, setTweak } = useOSStore();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');

  // local state to edit before saving
  const [stats, setStats] = useState(tweaks.aboutWidgetStats || {
    focusTitle: 'UI/UX', focusSub: 'Design',
    statusTitle: 'Open', statusSub: 'to work',
    locationTitle: 'DaLat, VN', locationSub: 'GMT+7'
  });

  const handleChange = (key: keyof typeof stats, val: string) => {
    setStats(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setTweak('aboutWidgetStats', stats);
      setSaveStatus('ok');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  return (
    <div className="p-window-padding space-y-6 select-text pb-24 relative">
      {/* ── Appearance & Wallpaper ─────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 px-1">
          Giao diện &amp; Hình nền
        </h2>
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-on-surface mb-2">Chế độ Hình nền</label>
              <div className="flex gap-4">
                {([
                  { value: 'image',         label: 'Hình tĩnh (Image)' },
                  { value: 'video',         label: 'Video Động'         },
                  { value: 'time-shifting', label: 'Tự động (Sáng/Tối)' },
                ] as const).map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="wallpaperType"
                      value={opt.value}
                      checked={tweaks.wallpaperType === opt.value}
                      onChange={() => setTweak('wallpaperType', opt.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-[13px] text-on-surface">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {tweaks.wallpaperType !== 'time-shifting' && (
              <div>
                <label className="block text-[12px] font-bold text-on-surface mb-1">
                  Đường dẫn Hình nền / Video
                </label>
                <input
                  type="text"
                  value={tweaks.wallpaperUrl || ''}
                  onChange={e => setTweak('wallpaperUrl', e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                  placeholder="e.g. /images/wallpapers/sonoma-light.jpg"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: 'Sonoma Sáng',  type: 'image', url: '/images/wallpapers/mobile-background.jpg' },
                { label: 'Sonoma Tối',   type: 'image', url: '/images/profile/profile-background.jpg'  },
                { label: 'Video Động',   type: 'video', url: '/bkgr.mp4'                   },
              ].map(preset => (
                <button
                  key={preset.label}
                  onClick={() => { setTweak('wallpaperType', preset.type as any); setTweak('wallpaperUrl', preset.url); }}
                  className="px-3 py-1.5 text-[11px] font-bold bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors text-on-surface border border-outline-variant/30"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Widget Config ─────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 px-1">
          Chỉ số About Me Widget
        </h2>
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl overflow-hidden shadow-sm">
          
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Focus */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-on-surface">Focus Title</label>
              <input type="text" value={stats.focusTitle} onChange={e => handleChange('focusTitle', e.target.value)} className="w-full bg-surface-container/30 border rounded-md px-3 py-1.5 text-[13px]" />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-on-surface">Focus Sub</label>
              <input type="text" value={stats.focusSub} onChange={e => handleChange('focusSub', e.target.value)} className="w-full bg-surface-container/30 border rounded-md px-3 py-1.5 text-[13px]" />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-on-surface">Status Title</label>
              <input type="text" value={stats.statusTitle} onChange={e => handleChange('statusTitle', e.target.value)} className="w-full bg-surface-container/30 border rounded-md px-3 py-1.5 text-[13px]" />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-on-surface">Status Sub</label>
              <input type="text" value={stats.statusSub} onChange={e => handleChange('statusSub', e.target.value)} className="w-full bg-surface-container/30 border rounded-md px-3 py-1.5 text-[13px]" />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-on-surface">Location Title</label>
              <input type="text" value={stats.locationTitle} onChange={e => handleChange('locationTitle', e.target.value)} className="w-full bg-surface-container/30 border rounded-md px-3 py-1.5 text-[13px]" />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-on-surface">Location Sub</label>
              <input type="text" value={stats.locationSub} onChange={e => handleChange('locationSub', e.target.value)} className="w-full bg-surface-container/30 border rounded-md px-3 py-1.5 text-[13px]" />
            </div>

          </div>

        </div>
      </section>

      {/* ── Sticky Save Bar ────────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 md:left-64 h-16 md:h-16 bg-surface/90 backdrop-blur-xl flex items-center justify-end px-window-padding gap-3 border-t border-outline-variant/40 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[max(env(safe-area-inset-bottom,16px),16px)] md:pb-0">
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={`px-6 py-1.5 rounded-xl text-[13px] font-bold shadow-sm active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5 ${
            saveStatus === 'ok'    ? 'bg-green-600 text-white' :
            saveStatus === 'error' ? 'bg-error text-on-error'  :
            'bg-primary text-on-primary hover:brightness-105 shadow-primary/20'
          }`}
        >
          {saveStatus === 'saving' && (
            <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          {saveStatus === 'saving' ? 'Đang lưu...' :
           saveStatus === 'ok'     ? '✓ Đã lưu'   :
           saveStatus === 'error'  ? '✗ Thử lại'   :
           'Lưu thay đổi'}
        </button>
      </footer>
    </div>
  );
};
