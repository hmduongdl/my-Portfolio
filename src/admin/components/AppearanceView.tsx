import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Image, Film, SunMoon, Monitor, MapPin, Save, Moon, Sun } from 'lucide-react';
import { api } from '../api';

type WallpaperMode = 'image' | 'video' | 'time-shifting';

/* ── Badge color palette for Tools preview ─────────────── */
const TOOL_COLORS = [
  { bg: 'bg-purple-950/40', text: 'text-purple-300' },
  { bg: 'bg-blue-950/40',   text: 'text-blue-300'   },
  { bg: 'bg-green-950/40',  text: 'text-green-300'  },
  { bg: 'bg-amber-950/40',  text: 'text-amber-300'  },
  { bg: 'bg-rose-950/40',   text: 'text-rose-300'   },
  { bg: 'bg-cyan-950/40',   text: 'text-cyan-300'   },
];

export const AppearanceView: React.FC = () => {
  const { tweaks, setTweak } = useOSStore();

  // ── Section 1 state (Wallpaper) ──────────────────────
  const [mode, setMode] = useState<WallpaperMode>(tweaks.wallpaperType || 'image');
  const [url, setUrl] = useState(tweaks.wallpaperUrl || '');
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── Section 2 state (About Me Widget) ────────────────
  const existingStats = tweaks.aboutWidgetStats || {
    focusTitle: 'UI/UX', focusSub: 'Design',
    statusTitle: 'Open', statusSub: 'to work',
    locationTitle: 'DaLat, VN', locationSub: 'GMT+7'
  };
  const [widgetForm, setWidgetForm] = useState({
    focusTitle:    existingStats.focusTitle    || '',
    focusSub:      existingStats.focusSub      || '',
    stack:         (tweaks as any).aboutWidgetStack    || 'React',
    statusTitle:   existingStats.statusTitle   || '',
    statusSub:     existingStats.statusSub     || '',
    locationTitle: existingStats.locationTitle || '',
    locationSub:   existingStats.locationSub   || '',
    tools:         (tweaks as any).aboutWidgetTools    || 'Figma, VS Code, Git',
  });
  // ── Section 3 state (Theme & Accent Color) ───────────
  const [accentColor, setAccentColor] = useState((tweaks as any).accentColor || '#007AFF');
  const [isDarkMode, setIsDarkMode] = useState((tweaks as any).themeMode !== 'light');
  const [globalSaveStatus, setGlobalSaveStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');

  const wf = (field: keyof typeof widgetForm, value: string) =>
    setWidgetForm(prev => ({ ...prev, [field]: value }));

  const toolsList = widgetForm.tools
    .split(',')
    .map((t: string) => t.trim())
    .filter(Boolean);

  const applyAccentColor = (color: string) => {
    setAccentColor(color);
    setTweak('accentColor' as any, color);
    document.documentElement.style.setProperty('--primary-accent', color);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    setTweak('themeMode' as any, newTheme ? 'dark' : 'light');
    if (newTheme) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const handleGlobalSave = async () => {
    setGlobalSaveStatus('saving');
    try {
      await api.put('/admin/settings', {
        appSettings: {
          wallpaperType: mode,
          wallpaperUrl: url,
          aboutWidgetStats: JSON.stringify({
            focusTitle: widgetForm.focusTitle,
            focusSub: widgetForm.focusSub,
            statusTitle: widgetForm.statusTitle,
            statusSub: widgetForm.statusSub,
            locationTitle: widgetForm.locationTitle,
            locationSub: widgetForm.locationSub,
          }),
          aboutWidgetStack: widgetForm.stack,
          aboutWidgetTools: widgetForm.tools,
          accentColor: accentColor,
          themeMode: isDarkMode ? 'dark' : 'light'
        }
      });
      setGlobalSaveStatus('ok');
      setTimeout(() => setGlobalSaveStatus('idle'), 2000);
    } catch (e) {
      console.error(e);
      setGlobalSaveStatus('error');
    }
  };

  // Keep local state in sync when store changes externally
  useEffect(() => {
    setMode(tweaks.wallpaperType || 'image');
    setUrl(tweaks.wallpaperUrl || '');
  }, [tweaks.wallpaperType, tweaks.wallpaperUrl]);

  const applyPreset = (presetMode: WallpaperMode, presetUrl: string) => {
    setMode(presetMode);
    setUrl(presetUrl);
    setTweak('wallpaperType', presetMode);
    setTweak('wallpaperUrl', presetUrl);
  };

  const handleModeChange = (newMode: WallpaperMode) => {
    setMode(newMode);
    setTweak('wallpaperType', newMode);
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setTweak('wallpaperUrl', newUrl);
  };

  const isVideo = mode === 'video' || url.endsWith('.webm') || url.endsWith('.mp4');

  const modeOptions: { value: WallpaperMode; label: string; icon: React.ReactNode }[] = [
    { value: 'image',         label: 'Hình nền tĩnh',       icon: <Image size={15} /> },
    { value: 'video',         label: 'Video động (.webm)',   icon: <Film size={15} /> },
    { value: 'time-shifting', label: 'Tự động (Sáng/Tối)',   icon: <SunMoon size={15} /> },
  ];

  const presets = [
    { label: 'Sonoma Light', mode: 'image' as WallpaperMode, url: '/wallpapers/sonoma-light.jpg' },
    { label: 'Sonoma Dark',  mode: 'image' as WallpaperMode, url: '/wallpapers/sonoma-dark.jpg' },
    { label: 'Video Wave',   mode: 'video' as WallpaperMode, url: '/wallpapers/wave.webm' },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* SECTION 1: HÌNH NỀN HỆ THỐNG */}
      <section>
        <h2 className="text-zinc-500 text-xs font-bold tracking-wider uppercase mb-3">
          Hình nền hệ thống
        </h2>

        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row gap-6">

            {/* ── Left Column: Form Controls ─────────────────── */}
            <div className="flex-1 space-y-5">

              {/* Radio Mode Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-2.5 uppercase tracking-wider">
                  Chế độ hình nền
                </label>
                <div className="space-y-2">
                  {modeOptions.map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all border ${
                        mode === opt.value
                          ? 'bg-white/[0.08] border-white/15 text-white'
                          : 'border-transparent text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="wallpaperMode"
                        value={opt.value}
                        checked={mode === opt.value}
                        onChange={() => handleModeChange(opt.value)}
                        className="sr-only"
                      />
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        mode === opt.value ? 'bg-white/10' : 'bg-zinc-800/50'
                      }`}>
                        {opt.icon}
                      </div>
                      <span className="text-[13px] font-medium">{opt.label}</span>
                      {mode === opt.value && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.5)]" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* URL Input */}
              {mode !== 'time-shifting' && (
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Đường dẫn tệp {mode === 'video' ? 'Video' : 'Hình ảnh'}
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={e => handleUrlChange(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-[13px] text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-colors"
                    placeholder={mode === 'video' ? '/wallpapers/wave.webm' : '/wallpapers/sonoma-light.jpg'}
                  />
                </div>
              )}

              {/* Preset Buttons */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                  Gán nhanh
                </label>
                <div className="flex flex-wrap gap-2">
                  {presets.map(p => {
                    const isActive = url === p.url && mode === p.mode;
                    return (
                      <button
                        key={p.label}
                        onClick={() => applyPreset(p.mode, p.url)}
                        className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all border ${
                          isActive
                            ? 'bg-white/10 border-white/20 text-white'
                            : 'bg-black/20 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200 hover:border-white/10'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Right Column: Live Preview ─────────────────── */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Xem trước
              </label>
              <div className="rounded-lg bg-zinc-950 aspect-video w-56 border border-white/10 overflow-hidden relative shadow-lg group">
                {/* Desktop Preview Content */}
                {mode === 'time-shifting' ? (
                  /* Time-shifting preview: split light/dark */
                  <div className="absolute inset-0 flex">
                    <div
                      className="w-1/2 h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(/wallpapers/sonoma-light.jpg)` }}
                    />
                    <div
                      className="w-1/2 h-full bg-cover bg-center border-l border-white/10"
                      style={{ backgroundImage: `url(/wallpapers/sonoma-dark.jpg)` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5">
                        <SunMoon size={10} className="text-amber-300" />
                        <span className="text-[9px] font-semibold text-white/80">Auto</span>
                      </div>
                    </div>
                  </div>
                ) : isVideo && url ? (
                  <video
                    ref={videoRef}
                    src={url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => {}}
                  />
                ) : url ? (
                  <img
                    src={url}
                    alt="Wallpaper preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                    <Monitor size={24} className="mb-1.5 opacity-40" />
                    <span className="text-[9px] font-medium">Chưa có hình nền</span>
                  </div>
                )}

                {/* Mini fake menu bar overlay */}
                <div className="absolute top-0 left-0 right-0 h-3 bg-black/30 backdrop-blur-sm flex items-center px-1.5 gap-1 z-10">
                  <div className="w-1 h-1 rounded-full bg-red-400/70" />
                  <div className="w-1 h-1 rounded-full bg-yellow-400/70" />
                  <div className="w-1 h-1 rounded-full bg-green-400/70" />
                </div>

                {/* Mini fake dock overlay */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-2.5 bg-white/10 backdrop-blur-sm rounded-full px-2 flex items-center gap-0.5 z-10">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-sm bg-white/30" />
                  ))}
                </div>
              </div>

              {/* Current info label */}
              <div className="text-center">
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  {mode === 'time-shifting' ? 'Sáng/Tối tự động' :
                   isVideo ? 'Video nền động' : 'Hình nền tĩnh'}
                </p>
                {url && mode !== 'time-shifting' && (
                  <p className="text-[9px] text-zinc-600 truncate max-w-[200px] mt-0.5">
                    {url}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 2: ABOUT ME WIDGET                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section>
        <h2 className="text-zinc-500 text-xs font-bold tracking-wider uppercase mb-3">
          About Me Widget
        </h2>

        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Left Column: Form ──────────────────────────── */}
            <div className="flex-1 space-y-4 min-w-0">
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Chỉnh sửa nội dung hiển thị trên Widget "About Me" di động. Mọi thay đổi sẽ phản ánh ngay lên khung xem trước bên phải.
              </p>

              {/* Focus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Focus Title</label>
                  <input type="text" value={widgetForm.focusTitle} onChange={e => wf('focusTitle', e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-[13px] text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-colors"
                    placeholder="UI/UX" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Focus Sub</label>
                  <input type="text" value={widgetForm.focusSub} onChange={e => wf('focusSub', e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-[13px] text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-colors"
                    placeholder="Design" />
                </div>
              </div>

              {/* Stack */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Công nghệ chính (Stack)</label>
                <input type="text" value={widgetForm.stack} onChange={e => wf('stack', e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-[13px] text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-colors"
                  placeholder="React, TypeScript, Node.js" />
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Status Title</label>
                  <input type="text" value={widgetForm.statusTitle} onChange={e => wf('statusTitle', e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-[13px] text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-colors"
                    placeholder="Open" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Status Sub</label>
                  <input type="text" value={widgetForm.statusSub} onChange={e => wf('statusSub', e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-[13px] text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-colors"
                    placeholder="to work" />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Location</label>
                  <input type="text" value={widgetForm.locationTitle} onChange={e => wf('locationTitle', e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-[13px] text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-colors"
                    placeholder="DaLat, VN" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Timezone</label>
                  <input type="text" value={widgetForm.locationSub} onChange={e => wf('locationSub', e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-[13px] text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-colors"
                    placeholder="GMT+7" />
                </div>
              </div>

              {/* Tools */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Tools <span className="text-zinc-600 font-normal normal-case">(phân cách bằng dấu phẩy)</span>
                </label>
                <input type="text" value={widgetForm.tools} onChange={e => wf('tools', e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-[13px] text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-colors"
                  placeholder="Figma, VS Code, Git" />
              </div>

            </div>

            {/* ── Right Column: Live Widget Preview ──────────── */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Live Preview
              </label>

              {/* Widget Replica */}
              <div className="w-[280px] bg-zinc-900/75 backdrop-blur-lg rounded-3xl p-4 pb-3 shadow-2xl border border-white/20 flex flex-col space-y-3.5 select-none">

                {/* 1. Header */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full border border-white/50 bg-zinc-700 flex items-center justify-center overflow-hidden">
                      <img src="/songphuong-logo.png" className="w-full h-full object-cover" alt="" onError={e => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">ABOUT ME</span>
                      <span className="text-base font-bold text-white mt-0.5 leading-none">Preview</span>
                      <span className="text-[11px] text-zinc-400 mt-1">{widgetForm.stack || 'Developer'}</span>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981] animate-pulse" />
                </div>

                {/* 2. Sub-cards Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                  {/* Focus */}
                  <div className="bg-indigo-950/30 p-2.5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[8px] font-bold text-indigo-300 tracking-wider">FOCUS</span>
                    <div className="flex flex-col mt-2">
                      <span className="text-sm font-extrabold text-indigo-200 leading-none">{widgetForm.focusTitle || '—'}</span>
                      <span className="text-[9px] text-indigo-400/80 mt-0.5">{widgetForm.focusSub || '—'}</span>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="bg-blue-950/30 p-2.5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[8px] font-bold text-blue-300 tracking-wider">EXPERIENCE</span>
                    <div className="flex flex-col mt-2">
                      <span className="text-sm font-extrabold text-blue-200 leading-none">{Math.max(1, new Date().getFullYear() - 2025)}+</span>
                      <span className="text-[9px] text-blue-400/80 mt-0.5">Years coding</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-emerald-950/30 p-2.5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[8px] font-bold text-emerald-300 tracking-wider">STATUS</span>
                    <div className="flex flex-col mt-2">
                      <span className="text-sm font-extrabold text-emerald-200 leading-none">{widgetForm.statusTitle || '—'}</span>
                      <span className="text-[9px] text-emerald-400/80 mt-0.5">{widgetForm.statusSub || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Row 2: Location + Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                  {/* Location */}
                  <div className="bg-zinc-800/40 p-3 rounded-2xl border border-zinc-800/50 flex items-center justify-between">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[8px] font-bold text-zinc-500 tracking-wider">LOCATION</span>
                      <span className="text-xs font-bold text-white mt-1 leading-none truncate">{widgetForm.locationTitle || '—'}</span>
                      <span className="text-[9px] text-gray-500 mt-0.5">{widgetForm.locationSub || '—'}</span>
                    </div>
                    <MapPin className="w-4 h-4 text-zinc-500 shrink-0" strokeWidth={2.5} />
                  </div>

                  {/* Tools */}
                  <div className="bg-zinc-800/40 p-3 rounded-2xl border border-zinc-800/50 flex flex-col justify-between">
                    <span className="text-[8px] font-bold text-zinc-500 tracking-wider">TOOLS</span>
                    <div className="flex items-center flex-wrap gap-1 mt-1">
                      {toolsList.length > 0 ? toolsList.map((tool: string, i: number) => {
                        const color = TOOL_COLORS[i % TOOL_COLORS.length];
                        return (
                          <span key={i} className={`${color.bg} ${color.text} text-[8px] font-bold px-1.5 py-0.5 rounded-md inline-block`}>
                            {tool}
                          </span>
                        );
                      }) : (
                        <span className="text-[9px] text-zinc-600">—</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. CTA Button */}
                <div className="w-full bg-[#007AFF] text-white rounded-[14px] py-2.5 flex justify-center items-center font-semibold text-[13px] shadow-[0_4px_12px_rgba(0,122,255,0.3)]">
                  Liên hệ ngay
                </div>
              </div>

              <p className="text-[10px] text-zinc-500 text-center max-w-[260px] leading-relaxed mt-1">
                Đây là bản giả lập Widget hiển thị trên trang chủ di động. Gõ phím thay đổi sẽ phản ánh ngay lập tức.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 3: MÀU CHỦ ĐẠO & CHỦ ĐỀ                      */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section>
        <h2 className="text-zinc-500 text-xs font-bold tracking-wider uppercase mb-3">
          Màu chủ đạo & Chủ đề
        </h2>

        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* ── Accent Colors ──────────────────────────── */}
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
                Màu hệ thống (Accent Color)
              </label>
              <div className="flex flex-wrap items-center gap-4">
                {[
                  { name: 'Blue', hex: '#007AFF' },
                  { name: 'Cyan', hex: '#06b6d4' },
                  { name: 'Purple', hex: '#a855f7' },
                  { name: 'Amber', hex: '#f59e0b' },
                ].map(c => (
                  <button
                    key={c.hex}
                    onClick={() => applyAccentColor(c.hex)}
                    className={`w-10 h-10 rounded-full border-2 transition-transform shadow-lg ${
                      accentColor === c.hex ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
                
                {/* Custom Hex */}
                <div className="flex items-center gap-2 ml-4">
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase">Custom</div>
                  <input 
                    type="color" 
                    value={accentColor}
                    onChange={(e) => applyAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-full border border-white/10 bg-transparent cursor-pointer overflow-hidden p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  />
                </div>
              </div>
            </div>

            {/* ── Dark/Light Mode ──────────────────────────── */}
            <div className="shrink-0 w-48 border-l border-white/5 pl-8">
              <label className="block text-[11px] font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
                Chủ đề hiển thị
              </label>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-1 bg-black/40 border border-white/10 rounded-full cursor-pointer relative"
              >
                <div 
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full transition-all duration-300 ease-in-out shadow-sm ${
                    isDarkMode ? 'left-[calc(50%+2px)]' : 'left-1'
                  }`} 
                />
                
                <div className={`flex-1 flex justify-center py-2 z-10 transition-colors ${!isDarkMode ? 'text-black' : 'text-zinc-500'}`}>
                  <Sun size={14} className={!isDarkMode ? 'fill-black' : ''} />
                </div>
                <div className={`flex-1 flex justify-center py-2 z-10 transition-colors ${isDarkMode ? 'text-black' : 'text-zinc-500'}`}>
                  <Moon size={14} className={isDarkMode ? 'fill-black' : ''} />
                </div>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── Sticky Save Bar ────────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 md:left-64 h-16 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-end px-6 gap-3 border-t border-white/5 z-40 pb-[max(env(safe-area-inset-bottom,16px),16px)] md:pb-0">
        <button
          onClick={handleGlobalSave}
          disabled={globalSaveStatus === 'saving'}
          className={`px-6 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2 ${
            globalSaveStatus === 'ok'    ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            globalSaveStatus === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30'  :
            'bg-white text-black hover:bg-zinc-200'
          }`}
          style={globalSaveStatus === 'idle' ? { backgroundColor: accentColor, color: '#fff' } : undefined}
        >
          {globalSaveStatus === 'saving' && (
            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
          {globalSaveStatus === 'saving' ? 'Đang lưu...' :
           globalSaveStatus === 'ok'     ? '✓ Đã lưu tất cả'   :
           globalSaveStatus === 'error'  ? '✗ Lỗi lưu trữ'   :
           <><Save size={16} /> Lưu Thay Đổi Giao Diện</>}
        </button>
      </footer>
    </div>
  );
};
