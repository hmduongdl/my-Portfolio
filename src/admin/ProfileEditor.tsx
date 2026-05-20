import React, { useEffect, useState } from 'react';
import { api } from './api';

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

const Field: React.FC<{
  label: string; value: string;
  onChange: (v: string) => void;
  type?: string; mono?: boolean;
}> = ({ label, value, onChange, type = 'text', mono }) => (
  <div>
    <label className="text-xs text-gray-500 block mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors ${mono ? 'font-mono' : ''}`}
    />
  </div>
);

const Textarea: React.FC<{
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}> = ({ label, value, onChange, rows = 3 }) => (
  <div>
    <label className="text-xs text-gray-500 block mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors resize-none"
    />
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
    <h2 className="text-sm font-semibold text-gray-300 mb-4">{title}</h2>
    {children}
  </div>
);

export const ProfileEditor: React.FC = () => {
  const [data, setData] = useState<ProfileData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    api.get<ProfileData>('/profile')
      .then((d) => setData(d ?? EMPTY))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = (k: keyof ProfileData) => (v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  const save = async () => {
    setStatus('saving');
    try {
      await api.put('/profile', data);
      setStatus('ok');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-2 text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
        Đang tải...
      </div>
    );
  }

  const btnLabel =
    status === 'saving' ? 'Đang lưu...'
    : status === 'ok'   ? '✓ Đã lưu'
    : status === 'error' ? '✗ Lỗi'
    : 'Lưu thay đổi';

  const btnClass =
    status === 'ok'    ? 'bg-green-600 hover:bg-green-500'
    : status === 'error' ? 'bg-red-600 hover:bg-red-500'
    : 'bg-blue-600 hover:bg-blue-500';

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Thông tin cá nhân hiển thị trên portfolio</p>
        </div>
        <button
          onClick={save}
          disabled={status === 'saving'}
          className={`flex items-center gap-2 px-4 py-2 ${btnClass} disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors`}
        >
          {btnLabel}
        </button>
      </div>

      {/* Avatar */}
      <Section title="Avatar">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-800 shrink-0 border border-gray-700">
            {data.avatar_url
              ? <img src={data.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-600 text-3xl">?</div>}
          </div>
          <div className="flex-1">
            <Field label="URL ảnh" value={data.avatar_url} onChange={set('avatar_url')} mono />
            <p className="text-xs text-gray-600 mt-1.5">
              Dùng path tương đối <code className="text-gray-500">/my-avatar.jpg</code> hoặc URL đầy đủ.
            </p>
          </div>
        </div>
      </Section>

      {/* Personal info */}
      <Section title="Thông tin cá nhân">
        <div className="space-y-3">
          <Field label="Họ tên" value={data.name} onChange={set('name')} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Chức danh (EN)" value={data.title_en} onChange={set('title_en')} />
            <Field label="Chức danh (VN)" value={data.title_vn} onChange={set('title_vn')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Textarea label="Bio (EN)" value={data.bio_en} onChange={set('bio_en')} />
            <Textarea label="Bio (VN)" value={data.bio_vn} onChange={set('bio_vn')} />
          </div>
        </div>
      </Section>

      {/* Contact & Social */}
      <Section title="Liên hệ & Mạng xã hội">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email" value={data.email} onChange={set('email')} type="email" />
          <Field label="Số điện thoại (tel:+84...)" value={data.phone} onChange={set('phone')} mono />
          <Field label="GitHub URL" value={data.github_url} onChange={set('github_url')} mono />
          <Field label="Facebook URL" value={data.facebook_url} onChange={set('facebook_url')} mono />
          <Field label="Zalo URL (zalo.me/...)" value={data.zalo_url} onChange={set('zalo_url')} mono />
          <Field label="Song Phương URL" value={data.songphuong_url} onChange={set('songphuong_url')} mono />
        </div>
      </Section>
    </div>
  );
};
