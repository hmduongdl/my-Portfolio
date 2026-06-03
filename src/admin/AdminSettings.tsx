import React, { useEffect, useState } from 'react';
import { api } from './api';
import { TimelineEditor } from './TimelineEditor';
import { useOSStore } from '../store/useOSStore';
import { ProfileView } from './components/ProfileView';
import { SEOSettingsView } from './components/SEOSettingsView';
import { ContentView } from './components/ContentView';
import { GalleryManagerView } from './components/GalleryManagerView';

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────
interface ProfileData {
  name: string;
  title_en: string;
  title_vn: string;
  bio_en: string;
  bio_vn: string;
  avatar_url: string;
  email: string;
  phone: string;
  github_url: string;
  facebook_url: string;
  zalo_url: string;
  songphuong_url: string;
}

interface ProfileApiResponse extends Partial<ProfileData> {
  titleEn?: string;
  titleVn?: string;
  bioEn?: string;
  bioVn?: string;
  avatarUrl?: string;
  githubUrl?: string;
  facebookUrl?: string;
  zaloUrl?: string;
  songphuongUrl?: string;
}

const EMPTY: ProfileData = {
  name: '', title_en: '', title_vn: '', bio_en: '', bio_vn: '',
  avatar_url: '', email: '', phone: '',
  github_url: '', facebook_url: '', zalo_url: '', songphuong_url: '',
};

type SaveStatus = 'idle' | 'saving' | 'ok' | 'error';
type AuditStatus = 'idle' | 'checking' | 'syncing';

interface ContactAudit {
  sourceOfTruth: string;
  mismatches: Array<{
    platform: string;
    profileDerivedUrl: string;
    tblSocialLinksUrl: string;
  }>;
  legacyTables: Record<string, unknown[]>;
  expectedSocialLinks: Array<{
    platform: string;
    label: string;
    url: string;
  }>;
}

const getErrorMessage = (error: unknown, fallback = 'Lỗi không xác định') =>
  error instanceof Error ? error.message : fallback;

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────

/** Divider with left indent to align with content */
const Divider = () => <div className="h-[1px] bg-outline-variant/25 ml-[52px]" />;

/** Section label heading */
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="px-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
    {children}
  </h2>
);

/** iOS-style settings group card */
const SettingsCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl overflow-hidden shadow-sm">
    {children}
  </div>
);

/** A single row with icon, label, and input/value */
const SettingsRow: React.FC<{
  icon: string;
  iconBg: string;
  iconColor?: string;
  label: string;
  children: React.ReactNode;
  last?: boolean;
}> = ({ icon, iconBg, iconColor = 'text-white', label, children, last }) => (
  <>
    <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface-container-low/50 transition-colors group">
      <div className={`w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 ${iconBg}`}>
        <span className={`material-symbols-outlined text-[18px] ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}>
          {icon}
        </span>
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[12px] font-semibold text-on-surface leading-none mb-1">{label}</span>
        {children}
      </div>
    </div>
    {!last && <Divider />}
  </>
);

/** Inline text input styled for settings rows */
const InlineInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="w-full bg-transparent border-none p-0 text-[13px] text-on-surface-variant focus:text-on-surface focus:ring-0 outline-none placeholder:text-on-surface-variant/30 transition-colors"
  />
);

// ────────────────────────────────────────────────────────────────────────────
// Toast notification (Apple-style pill)
// ────────────────────────────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  type: 'ok' | 'error';
}
const Toast: React.FC<ToastProps> = ({ message, type }) => (
  <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-5 py-2.5 rounded-full shadow-xl border backdrop-blur-xl text-[13px] font-semibold transition-all animate-in fade-in slide-in-from-top-2 ${
    type === 'ok'
      ? 'bg-white/95 dark:bg-zinc-800/95 border-black/[0.06] dark:border-white/10 text-neutral-800 dark:text-neutral-100 shadow-black/10'
      : 'bg-red-50/95 dark:bg-red-950/95 border-red-200/50 dark:border-red-800/50 text-red-700 dark:text-red-300'
  }`}>
    <span className={`text-[15px] ${type === 'ok' ? 'text-green-500' : 'text-red-500'}`}>
      {type === 'ok' ? '✓' : '✗'}
    </span>
    {message}
  </div>
);

const reloadRuntimeProfileState = async () => {
  window.dispatchEvent(new Event('profile-updated'));
  window.dispatchEvent(new Event('social-links-updated'));
  await useOSStore.getState().fetchSocials();
};

// ────────────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────────────
export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'seo' | 'content' | 'gallery_manager'>('profile');
  const [isGalleryDirty, setIsGalleryDirty] = useState(false);
  const [data, setData] = useState<ProfileData>(EMPTY);
  const [original, setOriginal] = useState<ProfileData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [auditStatus, setAuditStatus] = useState<AuditStatus>('idle');
  const [audit, setAudit] = useState<ContactAudit | null>(null);
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = (message: string, type: 'ok' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      const d = await api.get<ProfileApiResponse>('/profile');
      if (!d) return;
      // Map camelCase API response to our snake_case interface
      const mapped: ProfileData = {
        name: d.name || '',
        title_en: d.title_en || d.titleEn || '',
        title_vn: d.title_vn || d.titleVn || '',
        bio_en: d.bio_en || d.bioEn || '',
        bio_vn: d.bio_vn || d.bioVn || '',
        avatar_url: d.avatar_url || d.avatarUrl || '',
        email: d.email || '',
        phone: d.phone || '',
        github_url: d.github_url || d.githubUrl || '',
        facebook_url: d.facebook_url || d.facebookUrl || '',
        zalo_url: d.zalo_url || d.zaloUrl || '',
        songphuong_url: d.songphuong_url || d.songphuongUrl || '',
      };
      setData(mapped);
      setOriginal(mapped);
    } catch (e) {
      console.error(e);
      showToast('Không tải được hồ sơ từ database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const runAudit = async () => {
    setAuditStatus('checking');
    try {
      const result = await api.get<ContactAudit>('/admin/contact-audit');
      setAudit(result);
      showToast(
        result.mismatches.length === 0 ? 'Liên hệ đang đồng bộ' : `Phát hiện ${result.mismatches.length} mục lệch`,
        result.mismatches.length === 0 ? 'ok' : 'error'
      );
    } catch (e) {
      console.error(e);
      showToast(`Không kiểm tra được DB: ${getErrorMessage(e)}`, 'error');
    } finally {
      setAuditStatus('idle');
    }
  };

  const syncContacts = async () => {
    setAuditStatus('syncing');
    try {
      await api.put('/admin/profile', data);
      setOriginal(data);
      await reloadRuntimeProfileState();
      await runAudit();
      showToast('Đã đồng bộ thông tin liên hệ', 'ok');
    } catch (e) {
      console.error(e);
      showToast(`Không đồng bộ được: ${getErrorMessage(e)}`, 'error');
    } finally {
      setAuditStatus('idle');
    }
  };

  const set = (k: keyof ProfileData) => (v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  const isDirty = JSON.stringify(data) !== JSON.stringify(original) || isGalleryDirty;
  const cleanEmail = data.email.replace(/^mailto:/i, '').trim();
  const cleanPhone = data.phone.replace(/^tel:/i, '').trim();
  const mailtoPreview = cleanEmail ? `mailto:${cleanEmail}` : '';
  const phonePreview = cleanPhone ? `tel:${cleanPhone}` : '';
  const zaloPreview = data.zalo_url.trim() || (cleanPhone ? `https://zalo.me/${cleanPhone.replace(/[^\d+]/g, '')}` : '');
  const legacyTableNames = audit ? Object.keys(audit.legacyTables) : [];

  const save = async () => {
    setStatus('saving');
    try {
      const saveEvent = new CustomEvent<{ promises: Promise<unknown>[] }>('global-save-triggered', {
        detail: { promises: [] },
      });
      window.dispatchEvent(saveEvent);
      await Promise.all(saveEvent.detail.promises);
      setIsGalleryDirty(false);

      await api.put('/admin/profile', data);
      setOriginal(data);
      setStatus('ok');
      showToast('Đã cập nhật hồ sơ và đồng bộ liên hệ', 'ok');
      await reloadRuntimeProfileState();
      void runAudit();
      setTimeout(() => setStatus('idle'), 2000);
    } catch (e) {
      setStatus('error');
      showToast(`Lỗi cập nhật: ${getErrorMessage(e, 'Thử lại sau.')}`, 'error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleCancel = () => {
    setData(original);
    setStatus('idle');
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-3 text-on-surface-variant min-h-[200px]">
        <div className="w-6 h-6 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
        <span className="text-[13px]">Đang tải hồ sơ...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24 relative">

      {/* Toast */}
      {toast && <Toast {...toast} />}

      <div className="mb-6 inline-flex rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-colors ${
            activeTab === 'profile' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Hồ sơ
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-colors ${
            activeTab === 'content' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Nội dung & Dự án
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-colors ${
            activeTab === 'seo' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          SEO
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gallery_manager')}
          className={`px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-colors ${
            activeTab === 'gallery_manager' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          🖼️ Quản lý Album ảnh
        </button>
      </div>

      {activeTab === 'seo' ? (
        <SEOSettingsView />
      ) : activeTab === 'content' ? (
        <ContentView />
      ) : activeTab === 'gallery_manager' ? (
        <GalleryManagerView onDirtyChange={setIsGalleryDirty} />
      ) : (
        <>
      <ProfileView initialData={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
      {/* ── Social & Links ─────────────────────────────────────── */}
      <section className="space-y-1.5">
        <SectionLabel>Mạng xã hội &amp; Liên kết</SectionLabel>
        <SettingsCard>
          <SettingsRow icon="language" iconBg="bg-gradient-to-br from-[#667eea] to-[#764ba2]" label="Song Phương Website">
            <InlineInput
              value={data.songphuong_url}
              onChange={e => set('songphuong_url')(e.target.value)}
              placeholder="Đường dẫn website"
            />
          </SettingsRow>
          <SettingsRow icon="code" iconBg="bg-[#1A1C1E]" label="GitHub">
            <InlineInput
              value={data.github_url}
              onChange={e => set('github_url')(e.target.value)}
              placeholder="Đường dẫn GitHub"
            />
          </SettingsRow>
          <SettingsRow icon="thumb_up" iconBg="bg-[#1877F2]" label="Facebook">
            <InlineInput
              value={data.facebook_url}
              onChange={e => set('facebook_url')(e.target.value)}
              placeholder="Đường dẫn Facebook"
            />
          </SettingsRow>
          <SettingsRow icon="chat" iconBg="bg-[#0068FF]" label="Zalo" last>
            <InlineInput
              value={data.zalo_url}
              onChange={e => set('zalo_url')(e.target.value)}
              placeholder="Đường dẫn Zalo"
            />
          </SettingsRow>
        </SettingsCard>
        <p className="px-2 text-[11px] leading-relaxed text-on-surface-variant/60">
          Nguồn chuẩn là hồ sơ cá nhân. Khi lưu, hệ thống tự đồng bộ các shortcut Gmail, Phone, Zalo, GitHub và Facebook trong bảng social links.
        </p>
      </section>

      <section className="space-y-1.5">
        <SectionLabel>Đồng bộ dữ liệu liên hệ</SectionLabel>
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="rounded-xl bg-surface-container-low/60 border border-outline-variant/30 p-3 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">Gmail app</p>
                <p className="mt-1 text-[12px] text-on-surface truncate">{mailtoPreview || 'Chưa có email'}</p>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-outline-variant/30 p-3 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">Phone shortcut</p>
                <p className="mt-1 text-[12px] text-on-surface truncate">{phonePreview || 'Chưa có số điện thoại'}</p>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-outline-variant/30 p-3 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">Zalo shortcut</p>
                <p className="mt-1 text-[12px] text-on-surface truncate">{zaloPreview || 'Chưa có Zalo URL'}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-[12px] text-on-surface-variant">
                <p>
                  Nguồn chuẩn: <span className="font-semibold text-on-surface">{audit?.sourceOfTruth || 'tbl_profile'}</span>
                </p>
                <p className="mt-1">
                  {audit ? (
                    audit.mismatches.length > 0
                      ? `${audit.mismatches.length} mục đang lệch với social links`
                      : 'Không có lệch dữ liệu trong social links'
                  ) : (
                    'Chưa kiểm tra dữ liệu liên hệ'
                  )}
                </p>
                {audit && legacyTableNames.length > 0 && (
                  <p className="mt-1 text-amber-600 dark:text-amber-400">
                    Bảng cũ còn tồn tại: {legacyTableNames.join(', ')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={runAudit}
                  disabled={auditStatus !== 'idle'}
                  className="px-3 py-1.5 rounded-xl border border-outline-variant/50 bg-surface-container-highest/40 text-[12px] font-semibold text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50"
                >
                  {auditStatus === 'checking' ? 'Đang kiểm tra...' : 'Kiểm tra DB'}
                </button>
                <button
                  type="button"
                  onClick={syncContacts}
                  disabled={auditStatus !== 'idle' || status === 'saving'}
                  className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-[12px] font-semibold hover:brightness-105 transition-all disabled:opacity-50"
                >
                  {auditStatus === 'syncing' ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}
                </button>
              </div>
            </div>

            {audit && audit.mismatches.length > 0 && (
              <div className="space-y-2 border-t border-outline-variant/25 pt-3">
                {audit.mismatches.map((item) => (
                  <div key={item.platform} className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-3">
                    <p className="text-[12px] font-semibold text-red-600 dark:text-red-300">{item.platform}</p>
                    <p className="mt-1 text-[11px] text-on-surface-variant break-all">tbl_profile: {item.profileDerivedUrl || 'Trống'}</p>
                    <p className="mt-0.5 text-[11px] text-on-surface-variant break-all">tbl_social_links: {item.tblSocialLinksUrl || 'Trống'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

        </div>
      </div>

      {/* ── Action Bar ─────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 px-6 py-3 pb-[max(env(safe-area-inset-bottom,16px),12px)] md:pb-3 flex items-center justify-between z-40">
        <div className="text-[12px] text-on-surface-variant">
          {isDirty ? (
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Có thay đổi chưa lưu
            </span>
          ) : (
            <span className="text-on-surface-variant/50">Hồ sơ đã đồng bộ</span>
          )}
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={handleCancel}
            disabled={!isDirty || status === 'saving'}
            className="px-5 py-1.5 bg-surface-container-highest/40 text-on-surface font-semibold text-[13px] rounded-xl hover:bg-surface-container-high transition-colors border border-outline-variant/40 disabled:opacity-40"
          >
            Hủy
          </button>
          <button
            onClick={save}
            disabled={status === 'saving' || !isDirty}
            className={`px-6 py-1.5 font-semibold text-[13px] rounded-xl transition-all active:scale-95 shadow-sm disabled:opacity-50 flex items-center gap-1.5 ${
              status === 'ok'   ? 'bg-green-600 text-white' :
              status === 'error'? 'bg-error text-on-error' :
              'bg-primary text-on-primary hover:brightness-105'
            }`}
          >
            {status === 'saving' ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Đang lưu...
              </>
            ) : status === 'ok' ? '✓ Đã lưu' :
              status === 'error' ? '✗ Thử lại' :
              'Lưu thay đổi'}
          </button>
        </div>
      </div>

      {/* ── Timeline Section ───────────────────────────────────── */}
      <section>
        <div className="border-t border-outline-variant/30 pt-6">
          <TimelineEditor />
        </div>
      </section>
        </>
      )}

    </div>
  );
};
