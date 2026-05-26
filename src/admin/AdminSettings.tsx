import React, { useEffect, useState } from 'react';
import { api } from './api';
import { TimelineEditor } from './TimelineEditor';
import { ImageWithFallback } from '../components/desktop/ImageWithFallback';

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

const EMPTY: ProfileData = {
  name: '', title_en: '', title_vn: '', bio_en: '', bio_vn: '',
  avatar_url: '', email: '', phone: '',
  github_url: '', facebook_url: '', zalo_url: '', songphuong_url: '',
};

type SaveStatus = 'idle' | 'saving' | 'ok' | 'error';

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

/** Inline textarea for bio fields */
const InlineTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className="w-full bg-surface-container-low/50 border border-outline-variant/30 rounded-lg p-2.5 text-[13px] text-on-surface focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none resize-none placeholder:text-on-surface-variant/30 transition-all"
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

// ────────────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────────────
export const AdminSettings: React.FC = () => {
  const [data, setData] = useState<ProfileData>(EMPTY);
  const [original, setOriginal] = useState<ProfileData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = (message: string, type: 'ok' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    api.get<any>('/profile')
      .then((d) => {
        if (!d) return;
        // Map camelCase API response to our snake_case interface
        const mapped: ProfileData = {
          name: d.name || d.name || '',
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
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = (k: keyof ProfileData) => (v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  const isDirty = JSON.stringify(data) !== JSON.stringify(original);

  const save = async () => {
    setStatus('saving');
    try {
      await api.put('/admin/profile', data);
      setOriginal(data);
      setStatus('ok');
      showToast('Đã cập nhật hồ sơ cá nhân', 'ok');
      window.dispatchEvent(new Event('profile-updated'));
      setTimeout(() => setStatus('idle'), 2000);
    } catch (e: any) {
      setStatus('error');
      showToast(`Lỗi cập nhật: ${e.message || 'Thử lại sau.'}`, 'error');
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* ── Avatar & Name Card ─────────────────────────────────── */}
          <section className="space-y-1.5">
        <SectionLabel>Hồ sơ cá nhân</SectionLabel>
        <SettingsCard>
          {/* Avatar preview row */}
          <div className="flex items-center gap-4 px-4 py-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-primary-container overflow-hidden ring-2 ring-outline-variant/30 shadow-sm">
                <ImageWithFallback
                  src={data.avatar_url}
                  fallbackText={data.name}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-on-primary text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-on-surface leading-snug truncate">{data.name || 'Chưa đặt tên'}</p>
              <p className="text-[12px] text-on-surface-variant mt-0.5 truncate">{data.title_vn || data.title_en || 'Chưa có chức danh'}</p>
              <p className="text-[11px] text-primary mt-1 truncate">{data.email || 'Chưa có email'}</p>
            </div>
          </div>

          <Divider />

          {/* Avatar URL */}
          <SettingsRow icon="photo_camera" iconBg="bg-[#007AFF]" label="Avatar URL">
            <InlineInput
              value={data.avatar_url}
              onChange={e => set('avatar_url')(e.target.value)}
              placeholder="/my-avatar.jpg hoặc https://..."
            />
          </SettingsRow>

          {/* Display Name */}
          <SettingsRow icon="badge" iconBg="bg-[#34C759]" label="Tên hiển thị">
            <InlineInput
              value={data.name}
              onChange={e => set('name')(e.target.value)}
              placeholder="Hoàng Minh Dương"
            />
          </SettingsRow>

          {/* Email */}
          <SettingsRow icon="mail" iconBg="bg-[#FF3B30]" label="Email">
            <InlineInput
              type="email"
              value={data.email}
              onChange={e => set('email')(e.target.value)}
              placeholder="example@gmail.com"
            />
          </SettingsRow>

          {/* Phone */}
          <SettingsRow icon="call" iconBg="bg-[#34C759]" label="Số điện thoại" last>
            <InlineInput
              value={data.phone}
              onChange={e => set('phone')(e.target.value)}
              placeholder="tel:+84xxx"
            />
          </SettingsRow>
        </SettingsCard>
      </section>

      {/* ── Job Title ──────────────────────────────────────────── */}
      <section className="space-y-1.5">
        <SectionLabel>Chức danh nghề nghiệp</SectionLabel>
        <SettingsCard>
          <SettingsRow icon="work" iconBg="bg-[#FF9500]" label="Chức danh (Tiếng Việt)">
            <InlineInput
              value={data.title_vn}
              onChange={e => set('title_vn')(e.target.value)}
              placeholder="Nhà phát triển Web · Sinh viên CNTT"
            />
          </SettingsRow>
          <SettingsRow icon="translate" iconBg="bg-[#5856D6]" label="Job Title (English)" last>
            <InlineInput
              value={data.title_en}
              onChange={e => set('title_en')(e.target.value)}
              placeholder="Web Developer · IT Student"
            />
          </SettingsRow>
        </SettingsCard>
      </section>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6">
          {/* ── Bio ────────────────────────────────────────────────── */}
          <section className="space-y-1.5">
        <SectionLabel>Giới thiệu bản thân</SectionLabel>
        <div className="space-y-3">
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <span className="text-[16px]">🇻🇳</span> Bio (Tiếng Việt)
              </label>
              <InlineTextarea
                value={data.bio_vn}
                onChange={e => set('bio_vn')(e.target.value)}
                rows={3}
                placeholder="Giới thiệu ngắn gọn về bản thân bằng tiếng Việt..."
              />
            </div>
            <div className="border-t border-outline-variant/20 pt-3">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <span className="text-[16px]">🇺🇸</span> Bio (English)
              </label>
              <InlineTextarea
                value={data.bio_en}
                onChange={e => set('bio_en')(e.target.value)}
                rows={3}
                placeholder="A brief introduction about yourself in English..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Social & Links ─────────────────────────────────────── */}
      <section className="space-y-1.5">
        <SectionLabel>Mạng xã hội &amp; Liên kết</SectionLabel>
        <SettingsCard>
          <SettingsRow icon="language" iconBg="bg-gradient-to-br from-[#667eea] to-[#764ba2]" label="Song Phương Website">
            <InlineInput
              value={data.songphuong_url}
              onChange={e => set('songphuong_url')(e.target.value)}
              placeholder="https://songphuong.vn"
            />
          </SettingsRow>
          <SettingsRow icon="code" iconBg="bg-[#1A1C1E]" label="GitHub">
            <InlineInput
              value={data.github_url}
              onChange={e => set('github_url')(e.target.value)}
              placeholder="https://github.com/username"
            />
          </SettingsRow>
          <SettingsRow icon="thumb_up" iconBg="bg-[#1877F2]" label="Facebook">
            <InlineInput
              value={data.facebook_url}
              onChange={e => set('facebook_url')(e.target.value)}
              placeholder="https://facebook.com/page"
            />
          </SettingsRow>
          <SettingsRow icon="chat" iconBg="bg-[#0068FF]" label="Zalo" last>
            <InlineInput
              value={data.zalo_url}
              onChange={e => set('zalo_url')(e.target.value)}
              placeholder="https://zalo.me/..."
            />
          </SettingsRow>
        </SettingsCard>
      </section>

        </div>
      </div>

      {/* ── Action Bar ─────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 px-6 py-3 flex items-center justify-between z-40">
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

    </div>
  );
};
