import React, { useEffect, useState } from 'react';
import { api } from './api';
import { TimelineEditor } from './TimelineEditor';
import { ImageWithFallback } from '../components/desktop/ImageWithFallback';

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

const Divider = () => <div className="h-[1px] bg-outline-variant/30 ml-[54px]" />;

export const AdminSettings: React.FC = () => {
  const [data, setData] = useState<ProfileData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    api.get<ProfileData>('/profile')
      .then((d) => setData(d ?? EMPTY))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = (k: keyof ProfileData) => (v: string) => setData((d) => ({ ...d, [k]: v }));

  const save = async () => {
    setStatus('saving');
    try {
      await api.put('/admin/profile', data);
      setStatus('ok');
      window.dispatchEvent(new Event('profile-updated'));
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (loading) {
    return <div className="p-8 text-on-surface-variant text-[13px]">Đang tải...</div>;
  }

  return (
    <div className="p-6 max-w-[640px] mx-auto space-y-[32px] pb-20 relative">
      {status === 'ok' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-black/5 dark:border-white/10 shadow-lg text-[13px] font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 z-50 transition-all duration-300 animate-bounce">
          <span className="text-green-500 font-bold">✓</span>
          <span>Đã cập nhật hồ sơ cá nhân</span>
        </div>
      )}
      
      {/* Profile Group */}
      <div className="space-y-2">
        <h2 className="px-2 text-[13px] leading-[20px] font-bold text-on-surface-variant">Account Basics</h2>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          
          {/* Avatar Row */}
          <div className="flex items-center justify-between p-[12px] hover:bg-surface-container-low transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden shrink-0">
                <ImageWithFallback src={data.avatar_url} fallbackText={data.name} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-on-surface leading-[18px]">Profile Picture</span>
                <input 
                  type="text" 
                  value={data.avatar_url} 
                  onChange={e => set('avatar_url')(e.target.value)} 
                  className="bg-transparent border-none p-0 text-[11px] text-primary focus:ring-0 w-64 outline-none"
                  placeholder="URL ảnh (/my-avatar.jpg)"
                />
              </div>
            </div>
          </div>
          
          <Divider />
          
          {/* Name Row */}
          <div className="flex items-center justify-between p-[12px] hover:bg-surface-container-low transition-colors">
            <div className="flex flex-col w-full">
              <span className="text-[13px] font-semibold text-on-surface leading-[18px]">Display Name</span>
              <input 
                type="text" 
                value={data.name} 
                onChange={e => set('name')(e.target.value)}
                className="mt-1 bg-transparent border-none p-0 text-[13px] text-on-surface-variant focus:ring-0 w-full outline-none" 
              />
            </div>
            <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: '18px' }}>edit</span>
          </div>

          <Divider />

          {/* Title Row (EN & VN) */}
          <div className="p-[12px] hover:bg-surface-container-low transition-colors grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-on-surface leading-[18px]">Job Title (EN)</span>
              <input type="text" value={data.title_en} onChange={e => set('title_en')(e.target.value)} className="mt-1 bg-transparent border-none p-0 text-[13px] text-on-surface-variant focus:ring-0 w-full outline-none" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-on-surface leading-[18px]">Job Title (VN)</span>
              <input type="text" value={data.title_vn} onChange={e => set('title_vn')(e.target.value)} className="mt-1 bg-transparent border-none p-0 text-[13px] text-on-surface-variant focus:ring-0 w-full outline-none" />
            </div>
          </div>

          <Divider />

          {/* Bio Row */}
          <div className="p-[12px] hover:bg-surface-container-low transition-colors">
            <span className="text-[13px] font-semibold text-on-surface leading-[18px]">Bio (EN)</span>
            <textarea 
              value={data.bio_en} 
              onChange={e => set('bio_en')(e.target.value)}
              className="mt-2 w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2 text-[13px] text-on-surface-variant focus:ring-1 focus:ring-primary outline-none resize-none" 
              rows={3} 
            />
            <span className="text-[13px] font-semibold text-on-surface leading-[18px] mt-4 block">Bio (VN)</span>
            <textarea 
              value={data.bio_vn} 
              onChange={e => set('bio_vn')(e.target.value)}
              className="mt-2 w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2 text-[13px] text-on-surface-variant focus:ring-1 focus:ring-primary outline-none resize-none" 
              rows={3} 
            />
          </div>
        </div>
      </div>

      {/* Social & Links */}
      <div className="space-y-2">
        <h2 className="px-2 text-[13px] leading-[20px] font-bold text-on-surface-variant">Social & Links</h2>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          
          <div className="flex items-center justify-between p-[12px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E1E4E8] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">language</span>
              </div>
              <span className="text-[13px] text-on-surface">Song Phương URL</span>
            </div>
            <input type="text" value={data.songphuong_url} onChange={e => set('songphuong_url')(e.target.value)} className="bg-transparent border-none text-right text-[13px] text-primary focus:ring-0 outline-none w-64" placeholder="https://songphuong.vn" />
          </div>

          <Divider />
          
          <div className="flex items-center justify-between p-[12px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1A1C1E] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-white">code</span>
              </div>
              <span className="text-[13px] text-on-surface">GitHub URL</span>
            </div>
            <input type="text" value={data.github_url} onChange={e => set('github_url')(e.target.value)} className="bg-transparent border-none text-right text-[13px] text-primary focus:ring-0 outline-none w-64" placeholder="https://github.com/..." />
          </div>

          <Divider />

          <div className="flex items-center justify-between p-[12px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-white">thumb_up</span>
              </div>
              <span className="text-[13px] text-on-surface">Facebook URL</span>
            </div>
            <input type="text" value={data.facebook_url} onChange={e => set('facebook_url')(e.target.value)} className="bg-transparent border-none text-right text-[13px] text-primary focus:ring-0 outline-none w-64" placeholder="https://facebook.com/..." />
          </div>

          <Divider />

          <div className="flex items-center justify-between p-[12px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-white">chat</span>
              </div>
              <span className="text-[13px] text-on-surface">Zalo URL</span>
            </div>
            <input type="text" value={data.zalo_url} onChange={e => set('zalo_url')(e.target.value)} className="bg-transparent border-none text-right text-[13px] text-primary focus:ring-0 outline-none w-64" placeholder="https://zalo.me/..." />
          </div>

          <Divider />

          <div className="flex items-center justify-between p-[12px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-white">mail</span>
              </div>
              <span className="text-[13px] text-on-surface">Email</span>
            </div>
            <input type="email" value={data.email} onChange={e => set('email')(e.target.value)} className="bg-transparent border-none text-right text-[13px] text-primary focus:ring-0 outline-none w-64" placeholder="example@gmail.com" />
          </div>

          <Divider />

          <div className="flex items-center justify-between p-[12px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-white">call</span>
              </div>
              <span className="text-[13px] text-on-surface">Phone Number</span>
            </div>
            <input type="text" value={data.phone} onChange={e => set('phone')(e.target.value)} className="bg-transparent border-none text-right text-[13px] text-primary focus:ring-0 outline-none w-64" placeholder="tel:+84..." />
          </div>

        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button className="px-6 py-1.5 bg-surface-container-highest/30 text-on-surface font-semibold text-[13px] rounded-lg hover:bg-surface-container-highest transition-colors border border-outline-variant/50">
          Cancel
        </button>
        <button 
          onClick={save}
          disabled={status === 'saving'}
          className={`px-6 py-1.5 font-semibold text-[13px] rounded-lg transition-all active:scale-95 shadow-sm disabled:opacity-50 ${
            status === 'ok' ? 'bg-green-600 text-white' :
            status === 'error' ? 'bg-red-600 text-white' :
            'bg-primary text-on-primary hover:bg-primary-container'
          }`}
        >
          {status === 'saving' ? 'Saving...' : status === 'ok' ? '✓ Saved' : status === 'error' ? '✗ Error' : 'Save Changes'}
        </button>
      </div>

      <hr className="border-outline-variant/30 my-8" />
      
      {/* Timeline Group */}
      <TimelineEditor />

    </div>
  );
};
