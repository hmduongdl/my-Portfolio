import React, { useEffect, useState } from 'react';
import { api } from './api';
import { useOSStore } from '../store/useOSStore';

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
}

type SaveStatus = 'idle' | 'saving' | 'ok' | 'error';

export const SettingsEditor: React.FC = () => {
  const [socials, setSocials] = useState<Record<string, { url: string; visible: boolean; label: string; order_index: number }>>({
    zalo: { url: '', visible: true, label: 'Zalo', order_index: 4 },
    facebook: { url: '', visible: true, label: 'Facebook', order_index: 1 },
    github: { url: '', visible: true, label: 'GitHub', order_index: 0 },
    gmail: { url: '', visible: true, label: 'Gmail', order_index: 2 },
    phone: { url: '', visible: true, label: 'Phone', order_index: 3 },
  });

  const [seo, setSeo] = useState<SeoSettings>({
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    og_image: '',
    twitter_card: 'summary_large_image',
  });

  const [keywords, setKeywords] = useState<string[]>([]);
  const [kwInput, setKwInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const { tweaks, setTweak } = useOSStore();

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ socialLinks: SocialLink[]; seoSettings: SeoSettings }>('/admin/settings');
      
      if (data) {
        // Map social links
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

        // Map SEO
        setSeo(data.seoSettings);

        // Parse keywords
        const kwStr = data.seoSettings.seo_keywords || '';
        const parsedKws = kwStr.split(',').map(s => s.trim()).filter(Boolean);
        setKeywords(parsedKws);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleUpdateSocial = (platform: string, url: string) => {
    setSocials(prev => ({
      ...prev,
      [platform]: { ...prev[platform], url }
    }));
  };

  const handleUpdateSeo = (key: keyof SeoSettings, val: string) => {
    setSeo(prev => ({
      ...prev,
      [key]: val
    }));
  };

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
      const socialLinksToSend = Object.keys(socials).map(platform => ({
        platform,
        label: socials[platform].label,
        url: socials[platform].url,
        visible: socials[platform].visible,
        order_index: socials[platform].order_index
      }));

      await api.put('/admin/settings', {
        socialLinks: socialLinksToSend,
        seoSettings: {
          ...seo,
          seo_keywords: keywords.join(', ')
        }
      });

      setSaveStatus('ok');
      await loadSettings();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      console.error(e);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-window-padding flex items-center justify-center gap-2 text-on-surface-variant text-[13px]">
        <div className="w-4 h-4 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="p-window-padding space-y-6 select-text pb-20">
      
      {/* Appearance & Wallpaper */}
      <section className="space-y-2">
        <h2 className="text-section-header font-section-header text-on-surface-variant px-1">Giao diện &amp; Hình nền</h2>
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm divide-y divide-outline-variant/30">
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-on-surface mb-2">Chế độ Hình nền</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="wallpaperType" value="image" checked={tweaks.wallpaperType === 'image'} onChange={() => setTweak('wallpaperType', 'image')} className="text-primary focus:ring-primary" />
                  <span className="text-[13px] text-on-surface">Hình tĩnh (Image)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="wallpaperType" value="video" checked={tweaks.wallpaperType === 'video'} onChange={() => setTweak('wallpaperType', 'video')} className="text-primary focus:ring-primary" />
                  <span className="text-[13px] text-on-surface">Video Động</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="wallpaperType" value="time-shifting" checked={tweaks.wallpaperType === 'time-shifting'} onChange={() => setTweak('wallpaperType', 'time-shifting')} className="text-primary focus:ring-primary" />
                  <span className="text-[13px] text-on-surface">Tự động (Sáng/Tối)</span>
                </label>
              </div>
            </div>

            {tweaks.wallpaperType !== 'time-shifting' && (
              <div>
                <label className="block text-[12px] font-bold text-on-surface mb-1">Đường dẫn Hình nền / Video</label>
                <input
                  type="text"
                  value={tweaks.wallpaperUrl || ''}
                  onChange={e => setTweak('wallpaperUrl', e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/50 rounded-md px-3 py-1.5 text-[13px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                  placeholder="e.g. /wallpapers/sonoma-light.jpg"
                />
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => { setTweak('wallpaperType', 'image'); setTweak('wallpaperUrl', '/wallpapers/sonoma-light.jpg'); }} className="px-3 py-1.5 text-[11px] font-bold bg-surface-container rounded-md hover:bg-surface-container-high transition-colors text-on-surface">Ảnh Sonoma Sáng</button>
              <button onClick={() => { setTweak('wallpaperType', 'image'); setTweak('wallpaperUrl', '/wallpapers/sonoma-dark.jpg'); }} className="px-3 py-1.5 text-[11px] font-bold bg-surface-container rounded-md hover:bg-surface-container-high transition-colors text-on-surface">Ảnh Sonoma Tối</button>
              <button onClick={() => { setTweak('wallpaperType', 'video'); setTweak('wallpaperUrl', '/bkgr.mp4'); }} className="px-3 py-1.5 text-[11px] font-bold bg-surface-container rounded-md hover:bg-surface-container-high transition-colors text-on-surface">Video Động</button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Networks & Contacts */}
      <section className="space-y-2">
        <h2 className="text-section-header font-section-header text-on-surface-variant px-1">Cấu hình Mạng xã hội &amp; Liên hệ</h2>
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm divide-y divide-outline-variant/30">
          
          {/* Zalo */}
          <div className="flex items-center p-3 hover:bg-surface-container-low/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#0068FF] flex items-center justify-center mr-3 shrink-0">
              <span className="material-symbols-outlined text-white text-[18px]">chat</span>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase">Zalo Profile Link / ID</label>
              <input
                type="text"
                value={socials.zalo.url}
                onChange={e => handleUpdateSocial('zalo', e.target.value)}
                placeholder="Nhập số điện thoại Zalo hoặc Link Zalo"
                className="w-full bg-transparent border-none p-0 text-[13px] text-on-surface focus:ring-0 placeholder:text-outline-variant/40 outline-none"
              />
            </div>
          </div>

          {/* Facebook */}
          <div className="flex items-center p-3 hover:bg-surface-container-low/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#1877F2] flex items-center justify-center mr-3 shrink-0">
              <span className="material-symbols-outlined text-white text-[18px]">public</span>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase">Facebook URL</label>
              <input
                type="text"
                value={socials.facebook.url}
                onChange={e => handleUpdateSocial('facebook', e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="w-full bg-transparent border-none p-0 text-[13px] text-on-surface focus:ring-0 placeholder:text-outline-variant/40 outline-none"
              />
            </div>
          </div>

          {/* Github */}
          <div className="flex items-center p-3 hover:bg-surface-container-low/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#24292F] flex items-center justify-center mr-3 shrink-0">
              <span className="material-symbols-outlined text-white text-[18px]">code</span>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase">Github Repository</label>
              <input
                type="text"
                value={socials.github.url}
                onChange={e => handleUpdateSocial('github', e.target.value)}
                placeholder="https://github.com/username"
                className="w-full bg-transparent border-none p-0 text-[13px] text-on-surface focus:ring-0 placeholder:text-outline-variant/40 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center p-3 hover:bg-surface-container-low/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#EA4335] flex items-center justify-center mr-3 shrink-0">
              <span className="material-symbols-outlined text-white text-[18px]">mail</span>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase">Email Liên hệ</label>
              <input
                type="text"
                value={socials.gmail.url}
                onChange={e => handleUpdateSocial('gmail', e.target.value)}
                placeholder="mailto:email@example.com"
                className="w-full bg-transparent border-none p-0 text-[13px] text-on-surface focus:ring-0 placeholder:text-outline-variant/40 outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center p-3 hover:bg-surface-container-low/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#34C759] flex items-center justify-center mr-3 shrink-0">
              <span className="material-symbols-outlined text-white text-[18px]">call</span>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase">Số điện thoại</label>
              <input
                type="text"
                value={socials.phone.url}
                onChange={e => handleUpdateSocial('phone', e.target.value)}
                placeholder="tel:09xx xxx xxx"
                className="w-full bg-transparent border-none p-0 text-[13px] text-on-surface focus:ring-0 placeholder:text-outline-variant/40 outline-none"
              />
            </div>
          </div>

        </div>
      </section>

      {/* SEO Configuration */}
      <section className="space-y-2">
        <h2 className="text-section-header font-section-header text-on-surface-variant px-1">Cấu hình SEO &amp; Metadata</h2>
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm divide-y divide-outline-variant/30">
          
          {/* SEO Title */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[12px] font-bold text-on-surface">SEO Title</label>
              <span className="text-[10px] text-on-surface-variant/50 font-mono">
                {seo.seo_title.length} / 60
              </span>
            </div>
            <input
              type="text"
              value={seo.seo_title}
              onChange={e => handleUpdateSeo('seo_title', e.target.value)}
              className="w-full bg-surface-container/30 border border-outline-variant/50 rounded-md px-3 py-1.5 text-[13px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              placeholder="System Settings | Professional macOS Management Console"
            />
          </div>

          {/* SEO Description */}
          <div className="p-4">
            <label className="block text-[12px] font-bold text-on-surface mb-1">SEO Description</label>
            <textarea
              value={seo.seo_description}
              onChange={e => handleUpdateSeo('seo_description', e.target.value)}
              rows={3}
              className="w-full bg-surface-container/30 border border-outline-variant/50 rounded-md px-3 py-1.5 text-[13px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none resize-none"
              placeholder="Describe your site details for search engines..."
            />
          </div>

          {/* SEO Keywords */}
          <div className="p-4">
            <label className="block text-[12px] font-bold text-on-surface mb-1.5">SEO Keywords</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {keywords.map((kw, idx) => (
                <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] flex items-center gap-1 font-medium select-none">
                  {kw}
                  <button onClick={() => handleRemoveKeyword(kw)} className="hover:text-primary-container leading-none">
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={kwInput}
              onChange={e => setKwInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              placeholder="Nhấn Enter để thêm từ khoá..."
              className="w-full bg-surface-container/30 border border-outline-variant/50 rounded-md px-3 py-1.5 text-[13px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          {/* OG Image */}
          <div className="p-4">
            <label className="block text-[12px] font-bold text-on-surface mb-3">Open Graph Image (og:image)</label>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="relative w-40 h-24 bg-surface-container-high rounded-lg overflow-hidden border border-outline-variant/30 flex items-center justify-center shrink-0">
                {seo.og_image ? (
                  <img src={seo.og_image} alt="OG Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[24px] text-on-surface-variant/40">image</span>
                )}
              </div>
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={seo.og_image}
                  onChange={e => handleUpdateSeo('og_image', e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-surface-container/30 border border-outline-variant/50 rounded-md px-3 py-1.5 text-[13px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none font-mono"
                />
                <p className="text-[11px] text-on-surface-variant opacity-75">Kích thước khuyên dùng: 1200 x 630 px. Định dạng: JPG, PNG hoặc WebP.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer Save Changes Bar */}
      <footer className="absolute bottom-0 left-0 right-0 h-16 bg-surface/85 backdrop-blur-md flex items-center justify-end px-window-padding gap-3 border-t border-outline-variant/60 z-35">
        <button
          onClick={loadSettings}
          className="px-4 py-1.5 text-[13px] text-on-surface-variant hover:text-on-surface transition-colors font-medium border border-outline-variant bg-surface-container-lowest rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="px-6 py-1.5 bg-primary text-on-primary rounded-md text-[13px] font-bold shadow-md shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5"
        >
          {saveStatus === 'saving' && (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {saveStatus === 'saving' ? 'Saving...' : 
           saveStatus === 'ok' ? '✓ Saved' : 
           saveStatus === 'error' ? '✗ Error' : 'Save Changes'}
        </button>
      </footer>
      
    </div>
  );
};
