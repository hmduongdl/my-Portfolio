import React, { useEffect, useState } from 'react';
import { api } from './api';


// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────
interface SocialLink {
  id?: number;
  platform: string;
  label: string;
  url: string;
  visible: boolean;
  order_index: number;
}

interface SeoSettings {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image: string;
  twitter_card: string;
  tech_stack_options?: string;
}

interface TechOption {
  name: string;
  icon: string;
  category: string;
}

interface TechStackOptionsData {
  categories: string[];
  techs: TechOption[];
}

type SaveStatus = 'idle' | 'saving' | 'ok' | 'error';

// ────────────────────────────────────────────────────────────────────────────
// Social platform config (icon, color, placeholder)
// ────────────────────────────────────────────────────────────────────────────
const PLATFORM_CONFIG: Record<string, { icon: string; bg: string; label: string; placeholder: string }> = {
  github:   { icon: 'code',     bg: 'bg-[#24292F]', label: 'GitHub',    placeholder: 'https://github.com/username'         },
  facebook: { icon: 'public',   bg: 'bg-[#1877F2]', label: 'Facebook',  placeholder: 'https://facebook.com/yourpage'        },
  zalo:     { icon: 'chat',     bg: 'bg-[#0068FF]', label: 'Zalo',      placeholder: 'https://zalo.me/yourprofile'          },
  gmail:    { icon: 'mail',     bg: 'bg-[#EA4335]', label: 'Gmail',     placeholder: 'mailto:email@example.com'             },
  phone:    { icon: 'call',     bg: 'bg-[#34C759]', label: 'Phone',     placeholder: 'tel:+84xxx'                           },
};

const PLATFORM_ORDER = ['github', 'facebook', 'zalo', 'gmail', 'phone'];

// ────────────────────────────────────────────────────────────────────────────
// Toggle Switch Component (iOS-style)
// ────────────────────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
}
const Toggle: React.FC<ToggleProps> = ({ checked, onChange, id }) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
      checked ? 'bg-[#34C759]' : 'bg-outline-variant/40'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

// ────────────────────────────────────────────────────────────────────────────
// Toast notification
// ────────────────────────────────────────────────────────────────────────────
interface ToastState { msg: string; type: 'ok' | 'error' }

// ────────────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────────────
export const SettingsEditor: React.FC = () => {
  const [socials, setSocials] = useState<Record<string, { url: string; visible: boolean; label: string; order_index: number }>>({
    zalo:     { url: '', visible: true,  label: 'Zalo',     order_index: 4 },
    facebook: { url: '', visible: true,  label: 'Facebook', order_index: 1 },
    github:   { url: '', visible: true,  label: 'GitHub',   order_index: 0 },
    gmail:    { url: '', visible: true,  label: 'Gmail',    order_index: 2 },
    phone:    { url: '', visible: true,  label: 'Phone',    order_index: 3 },
  });

  const [seo, setSeo] = useState<SeoSettings>({
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    og_image: '',
    twitter_card: 'summary_large_image',
    tech_stack_options: '{"categories":[],"techs":[]}',
  });

  const [techOptions, setTechOptions] = useState<TechStackOptionsData>({ categories: [], techs: [] });
  const [newCategory, setNewCategory] = useState('');
  const [newTech, setNewTech] = useState<TechOption>({ name: '', icon: '', category: '' });

  const [keywords, setKeywords]     = useState<string[]>([]);
  const [kwInput, setKwInput]       = useState('');
  const [loading, setLoading]       = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [toast, setToast]           = useState<ToastState | null>(null);

  // removed unused useOSStore

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showToast = (msg: string, type: 'ok' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ socialLinks: SocialLink[]; seoSettings: SeoSettings }>('/admin/settings');
      if (data) {
        const mappedSocials = { ...socials };
        data.socialLinks.forEach(link => {
          mappedSocials[link.platform] = {
            url: link.url,
            visible: link.visible,
            label: link.label,
            order_index: link.order_index,
          };
        });
        setSocials(mappedSocials);
        setSeo(data.seoSettings);
        const kwStr = data.seoSettings.seo_keywords || '';
        setKeywords(kwStr.split(',').map(s => s.trim()).filter(Boolean));
        if (data.seoSettings.tech_stack_options) {
          try {
            setTechOptions(JSON.parse(data.seoSettings.tech_stack_options));
          } catch (e) {
            console.error('Failed to parse tech_stack_options');
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSettings(); }, []);

  const handleUpdateSocial = (platform: string, field: 'url' | 'visible', value: string | boolean) => {
    setSocials(prev => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
  };

  const handleUpdateSeo = (key: keyof SeoSettings, val: string) =>
    setSeo(prev => ({ ...prev, [key]: val }));

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && kwInput.trim()) {
      e.preventDefault();
      const cleanKw = kwInput.trim();
      if (!keywords.includes(cleanKw)) {
        const newKws = [...keywords, cleanKw];
        setKeywords(newKws);
        handleUpdateSeo('seo_keywords', newKws.join(', '));
      }
      setKwInput('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    const newKws = keywords.filter(k => k !== kw);
    setKeywords(newKws);
    handleUpdateSeo('seo_keywords', newKws.join(', '));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // 1. Save social links via dedicated /admin/socials endpoint
      const socialLinksToSend = Object.keys(socials).map(platform => ({
        platform,
        label: socials[platform].label,
        url: socials[platform].url,
        visible: socials[platform].visible,
        order_index: socials[platform].order_index,
      }));

      await api.put('/admin/socials', { socialLinks: socialLinksToSend });

      // 2. Save SEO settings via /admin/settings
      await api.put('/admin/settings', {
        socialLinks: socialLinksToSend,
        seoSettings: { ...seo, seo_keywords: keywords.join(', '), tech_stack_options: JSON.stringify(techOptions) },
      });

      setSaveStatus('ok');
      showToast('Đã lưu cấu hình thành công', 'ok');
      window.dispatchEvent(new Event('profile-updated'));
      window.dispatchEvent(new Event('social-links-updated'));
      await loadSettings();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e: any) {
      console.error(e);
      setSaveStatus('error');
      showToast(`Lỗi: ${e.message || 'Không thể lưu.'}`, 'error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-window-padding flex flex-col items-center justify-center gap-3 text-on-surface-variant min-h-[300px]">
        <div className="w-5 h-5 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
        <span className="text-[13px]">Đang tải cài đặt...</span>
      </div>
    );
  }

  return (
    <div className="p-window-padding space-y-6 select-text pb-24 relative">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-5 py-2.5 rounded-full shadow-xl border backdrop-blur-xl text-[13px] font-semibold ${
          toast.type === 'ok'
            ? 'bg-white/95 dark:bg-zinc-800/95 border-black/[0.06] dark:border-white/10 text-neutral-800 dark:text-neutral-100'
            : 'bg-red-50/95 dark:bg-red-950/95 border-red-200/50 text-red-700 dark:text-red-300'
        }`}>
          <span className={toast.type === 'ok' ? 'text-green-500' : 'text-red-500'}>
            {toast.type === 'ok' ? '✓' : '✗'}
          </span>
          {toast.msg}
        </div>
      )}



      {/* ── Social Networks & Contacts ─────────────────────────── */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            Mạng xã hội &amp; Liên hệ
          </h2>
          <span className="text-[10px] text-on-surface-variant/50">
            Toggle = hiển thị trên trang
          </span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl overflow-hidden shadow-sm divide-y divide-outline-variant/20">
          {PLATFORM_ORDER.map((platform) => {
            const cfg = PLATFORM_CONFIG[platform] ?? {
              icon: 'link', bg: 'bg-gray-500', label: platform, placeholder: '',
            };
            const social = socials[platform] ?? { url: '', visible: true, label: cfg.label, order_index: 0 };

            return (
              <div key={platform} className="flex items-center gap-3 px-3 py-3 hover:bg-surface-container-low/40 transition-colors group">
                {/* Platform icon */}
                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 ${cfg.bg} shadow-sm`}>
                  <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {cfg.icon}
                  </span>
                </div>

                {/* Label + input */}
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider mb-1">
                    {cfg.label}
                  </label>
                  <input
                    type="text"
                    value={social.url}
                    onChange={e => handleUpdateSocial(platform, 'url', e.target.value)}
                    placeholder={cfg.placeholder}
                    className="w-full bg-transparent border-none p-0 text-[13px] text-on-surface focus:ring-0 placeholder:text-on-surface-variant/30 outline-none"
                  />
                </div>

                {/* Visible state badge */}
                <span className={`text-[10px] font-medium shrink-0 hidden group-hover:inline sm:inline transition-all ${
                  social.visible ? 'text-green-600 dark:text-green-400' : 'text-on-surface-variant/40'
                }`}>
                  {social.visible ? 'Hiển thị' : 'Ẩn'}
                </span>

                {/* Toggle switch */}
                <Toggle
                  id={`toggle-${platform}`}
                  checked={social.visible}
                  onChange={v => handleUpdateSocial(platform, 'visible', v)}
                />
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-on-surface-variant/50 px-1">
          💡 Nhấn toggle để ẩn/hiện nền tảng mạng xã hội tương ứng trên trang portfolio.
        </p>
      </section>

      {/* ── SEO Configuration ──────────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 px-1">
          Cấu hình SEO &amp; Metadata
        </h2>
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl overflow-hidden shadow-sm divide-y divide-outline-variant/20">

          {/* SEO Title */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[12px] font-bold text-on-surface">SEO Title</label>
              <span className={`text-[10px] font-mono tabular-nums ${
                seo.seo_title.length > 60 ? 'text-red-500' : 'text-on-surface-variant/50'
              }`}>
                {seo.seo_title.length} / 60
              </span>
            </div>
            <input
              type="text"
              value={seo.seo_title}
              onChange={e => handleUpdateSeo('seo_title', e.target.value)}
              className="w-full bg-surface-container/30 border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              placeholder="Hoàng Minh Dương — Portfolio | Web Developer..."
            />
          </div>

          {/* SEO Description */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[12px] font-bold text-on-surface">SEO Description</label>
              <span className={`text-[10px] font-mono tabular-nums ${
                seo.seo_description.length > 160 ? 'text-red-500' : 'text-on-surface-variant/50'
              }`}>
                {seo.seo_description.length} / 160
              </span>
            </div>
            <textarea
              value={seo.seo_description}
              onChange={e => handleUpdateSeo('seo_description', e.target.value)}
              rows={3}
              className="w-full bg-surface-container/30 border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none resize-none"
              placeholder="Describe your site details for search engines..."
            />
          </div>

          {/* SEO Keywords */}
          <div className="p-4">
            <label className="block text-[12px] font-bold text-on-surface mb-2">SEO Keywords</label>
            <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[28px]">
              {keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1 font-medium select-none border border-primary/20"
                >
                  {kw}
                  <button
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:text-error transition-colors leading-none"
                  >
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </button>
                </span>
              ))}
              {keywords.length === 0 && (
                <span className="text-[11px] text-on-surface-variant/40 italic">Chưa có từ khoá...</span>
              )}
            </div>
            <input
              type="text"
              value={kwInput}
              onChange={e => setKwInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              placeholder="Nhấn Enter để thêm từ khoá..."
              className="w-full bg-surface-container/30 border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          {/* OG Image */}
          <div className="p-4">
            <label className="block text-[12px] font-bold text-on-surface mb-3">
              Open Graph Image (og:image)
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="relative w-36 h-20 bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/30 flex items-center justify-center shrink-0">
                {seo.og_image ? (
                  <img src={seo.og_image} alt="OG Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[28px] text-on-surface-variant/30">image</span>
                )}
              </div>
              <div className="flex-1 space-y-1.5 w-full">
                <input
                  type="text"
                  value={seo.og_image}
                  onChange={e => handleUpdateSeo('og_image', e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-surface-container/30 border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none font-mono"
                />
                <p className="text-[11px] text-on-surface-variant/60">
                  Kích thước khuyên dùng: 1200×630 px. Định dạng: JPG, PNG hoặc WebP.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Tech Stack Options Configuration ──────────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 px-1">
          Quản lý Tech Stack
        </h2>
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl overflow-hidden shadow-sm divide-y divide-outline-variant/20">
          
          <div className="p-4">
            <label className="block text-[12px] font-bold text-on-surface mb-2">Danh mục (Categories)</label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {techOptions.categories.map((cat, idx) => (
                <span key={idx} className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1 font-medium select-none border border-primary/20">
                  {cat}
                  <button onClick={() => setTechOptions(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }))} className="hover:text-error transition-colors leading-none">
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newCategory.trim() && !techOptions.categories.includes(newCategory.trim())) {
                    setTechOptions(prev => ({ ...prev, categories: [...prev.categories, newCategory.trim()] }));
                    setNewCategory('');
                  }
                }}
                placeholder="Thêm danh mục (VD: Frontend)..."
                className="flex-1 bg-surface-container/30 border border-outline-variant/50 rounded-lg px-3 py-1.5 text-[13px] text-on-surface focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="p-4">
            <label className="block text-[12px] font-bold text-on-surface mb-2">Công nghệ (Tech Items)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {techOptions.techs.map((tech, idx) => (
                <div key={idx} className="bg-surface-container border border-outline-variant/50 rounded-lg p-2 text-[11px] flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">{tech.name}</span>
                    <span className="text-on-surface-variant/70">{tech.category} | Icon: {tech.icon || 'none'}</span>
                  </div>
                  <button onClick={() => setTechOptions(prev => ({ ...prev, techs: prev.techs.filter((_, i) => i !== idx) }))} className="text-on-surface-variant hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-col sm:flex-row">
              <input type="text" value={newTech.name} onChange={e => setNewTech(prev => ({ ...prev, name: e.target.value }))} placeholder="Tên (VD: React)" className="flex-1 bg-surface-container/30 border border-outline-variant/50 rounded-lg px-3 py-1.5 text-[13px]" />
              <input type="text" value={newTech.icon} onChange={e => setNewTech(prev => ({ ...prev, icon: e.target.value }))} placeholder="Icon name" className="w-24 bg-surface-container/30 border border-outline-variant/50 rounded-lg px-3 py-1.5 text-[13px]" />
              <select value={newTech.category} onChange={e => setNewTech(prev => ({ ...prev, category: e.target.value }))} className="w-32 bg-surface-container/30 border border-outline-variant/50 rounded-lg px-3 py-1.5 text-[13px]">
                <option value="">-- Chọn DM --</option>
                {techOptions.categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button 
                onClick={() => {
                  if (newTech.name && newTech.category) {
                    setTechOptions(prev => ({ ...prev, techs: [...prev.techs, newTech] }));
                    setNewTech({ name: '', icon: '', category: '' });
                  }
                }}
                className="bg-surface-container-high px-3 py-1.5 rounded-lg text-[13px] font-semibold hover:bg-surface-container-highest transition-colors border border-outline-variant/50"
              >
                Thêm
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── Sticky Save Bar ────────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl flex items-center justify-end px-window-padding gap-3 border-t border-outline-variant/40 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <button
          onClick={loadSettings}
          disabled={saveStatus === 'saving'}
          className="px-4 py-1.5 text-[13px] text-on-surface-variant hover:text-on-surface transition-colors font-medium border border-outline-variant/50 bg-surface-container-lowest rounded-xl disabled:opacity-40"
        >
          Hủy
        </button>
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
