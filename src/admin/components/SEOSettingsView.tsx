import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api';

interface SEOSettings {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image: string;
}

type SaveStatus = 'idle' | 'saving' | 'ok' | 'error';

const EMPTY_SEO: SEOSettings = {
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  og_image: '',
};

const SITE_URL = 'hmduongdl.github.io/Minimalist-Design-Portfolio';

const FieldCounter: React.FC<{ value: string; max: number }> = ({ value, max }) => {
  const isOver = value.length > max;
  return (
    <span className={`text-[11px] font-mono tabular-nums ${isOver ? 'text-red-500' : 'text-on-surface-variant/55'}`}>
      {value.length} / {max}
    </span>
  );
};

const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  max?: number;
  multiline?: boolean;
}> = ({ label, value, onChange, placeholder, max, multiline }) => (
  <label className="block">
    <div className="mb-2 flex items-center justify-between gap-4">
      <span className="text-[12px] font-bold text-on-surface">{label}</span>
      {max && <FieldCounter value={value} max={max} />}
    </div>
    {multiline ? (
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl border border-outline-variant/45 bg-surface-container-lowest px-4 py-3 text-[14px] leading-relaxed text-on-surface outline-none transition-all placeholder:text-on-surface-variant/35 focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-outline-variant/45 bg-surface-container-lowest px-4 py-3 text-[14px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/35 focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    )}
  </label>
);

export const SEOSettingsView: React.FC = () => {
  const [seo, setSeo] = useState<SEOSettings>(EMPTY_SEO);
  const [original, setOriginal] = useState<SEOSettings>(EMPTY_SEO);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const isDirty = JSON.stringify(seo) !== JSON.stringify(original);
  const previewTitle = seo.seo_title.trim() || 'SEO Title';
  const previewDescription = seo.seo_description.trim() || 'Meta description will appear here in Google search results.';

  const ogHost = useMemo(() => {
    if (!seo.og_image.trim()) return '';
    try {
      return new URL(seo.og_image).host;
    } catch {
      return '';
    }
  }, [seo.og_image]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ seoSettings?: Partial<SEOSettings> }>('/admin/settings');
      const nextSeo = {
        seo_title: data?.seoSettings?.seo_title ?? '',
        seo_description: data?.seoSettings?.seo_description ?? '',
        seo_keywords: data?.seoSettings?.seo_keywords ?? '',
        og_image: data?.seoSettings?.og_image ?? '',
      };
      setSeo(nextSeo);
      setOriginal(nextSeo);
    } catch (error) {
      console.error(error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateField = (key: keyof SEOSettings) => (value: string) => {
    setSeo((current) => ({ ...current, [key]: value }));
  };

  const saveSettings = async () => {
    setSaveStatus('saving');
    try {
      await api.put('/admin/settings', {
        seoSettings: {
          seo_title: seo.seo_title,
          seo_description: seo.seo_description,
          seo_keywords: seo.seo_keywords,
          og_image: seo.og_image,
        },
      });
      setOriginal(seo);
      setSaveStatus('ok');
      window.dispatchEvent(new Event('seo-updated'));
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error(error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    const handleSaveRequest = (event: Event) => {
      if (!isDirty || saveStatus === 'saving') return;
      (event as CustomEvent<{ promises: Promise<unknown>[] }>).detail?.promises.push(saveSettings());
    };

    window.addEventListener('global-save-triggered', handleSaveRequest);
    return () => window.removeEventListener('global-save-triggered', handleSaveRequest);
  }, [isDirty, saveStatus, seo]);

  if (loading) {
    return (
      <div className="min-h-[320px] p-8 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
        <div className="w-5 h-5 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
        <span className="text-[13px]">Đang tải SEO Metadata...</span>
      </div>
    );
  }

  return (
    <div className="p-window-padding pb-24 max-w-5xl mx-auto space-y-7">
      <header className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold text-on-surface">SEO Metadata</h2>
        <p className="text-[13px] text-on-surface-variant">Quản lý tiêu đề, mô tả và ảnh chia sẻ cho portfolio.</p>
      </header>

      <section className="rounded-2xl border border-outline-variant/45 bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 gap-5 p-5">
          <TextField
            label="SEO Title"
            value={seo.seo_title}
            onChange={updateField('seo_title')}
            placeholder="Hoàng Minh Dương - Portfolio | Web Developer"
            max={60}
          />
          <TextField
            label="Meta Description"
            value={seo.seo_description}
            onChange={updateField('seo_description')}
            placeholder="Mô tả ngắn gọn nội dung trang để hiển thị trên công cụ tìm kiếm..."
            max={160}
            multiline
          />
          <TextField
            label="Keywords"
            value={seo.seo_keywords}
            onChange={updateField('seo_keywords')}
            placeholder="portfolio, web developer, react, typescript"
          />
          <TextField
            label="OpenGraph Image"
            value={seo.og_image}
            onChange={updateField('og_image')}
            placeholder="https://example.com/og-image.png"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="px-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
          Google Search Snippet Preview
        </h3>
        <div className="rounded-2xl border border-outline-variant/45 bg-white px-6 py-5 shadow-sm">
          <div className="max-w-[680px] font-sans">
            <div className="text-[20px] leading-6 text-[#1a0dab] hover:underline cursor-default">
              {previewTitle}
            </div>
            <div className="mt-1 text-[13px] leading-5 text-[#006621] truncate">
              https://{SITE_URL}
            </div>
            <p className="mt-1.5 text-[14px] leading-[1.55] text-[#4d5156]">
              {previewDescription}
            </p>
          </div>
        </div>
      </section>

      {seo.og_image.trim() && (
        <section className="rounded-2xl border border-outline-variant/45 bg-surface-container-lowest p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-56 aspect-[1.91/1] rounded-xl overflow-hidden border border-outline-variant/40 bg-surface-container-low flex items-center justify-center">
              <img src={seo.og_image} alt="OpenGraph preview" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/65">OpenGraph Image</p>
              <p className="mt-1 text-[13px] text-on-surface break-all">{seo.og_image}</p>
              {ogHost && <p className="mt-2 text-[12px] text-on-surface-variant">Nguồn ảnh: {ogHost}</p>}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
