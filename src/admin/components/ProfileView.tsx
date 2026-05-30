import React, { useState, useEffect } from 'react';
import { Globe, Code2, MessageCircle, Edit2, Trash2, Plus, X, Upload } from 'lucide-react';
import { api } from '../api';
import { useOSStore } from '../../store/useOSStore';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  titleVn: string;
  titleEn: string;
  bioVn: string;
  bioEn: string;
  websiteUrl: string;
  websiteVisible: boolean;
  githubUrl: string;
  githubVisible: boolean;
  facebookUrl: string;
  facebookVisible: boolean;
  zaloUrl: string;
  zaloVisible: boolean;
}

interface TimelineItem {
  id: string;
  role: string;
  organization: string;
  date: string;
  type: 'Work' | 'Education';
  description: string;
}

type TechCategory = 'Frontend' | 'Backend' | 'Design' | 'Tools';

interface TechStackItem {
  id: number;
  name: string;
  category: TechCategory;
  order_index: number;
}

interface ProfileViewProps {
  initialData?: any;
}

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
  <div 
    className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-white' : 'bg-zinc-700'}`}
    onClick={() => onChange(!checked)}
  >
    <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform ${checked ? 'translate-x-4 bg-black' : 'translate-x-0 bg-white'}`} />
  </div>
);

const SocialRow = ({ 
  icon: Icon, 
  label, 
  urlKey, 
  visibleKey,
  formData,
  handleChange
}: { 
  icon: any, 
  label: string, 
  urlKey: keyof ProfileData, 
  visibleKey: keyof ProfileData,
  formData: ProfileData,
  handleChange: (field: keyof ProfileData, value: any) => void
}) => (
  <div className="flex items-center gap-4 p-3 hover:bg-white/[0.02] rounded-xl transition-colors border border-transparent hover:border-white/5">
    <div className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-white/10 flex items-center justify-center shrink-0">
      <Icon size={18} className="text-zinc-400" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">{label}</div>
      <input 
        type="text" 
        value={formData[urlKey] as string}
        onChange={(e) => handleChange(urlKey, e.target.value)}
        className="w-full bg-transparent border-none p-0 text-[13px] text-white focus:ring-0 outline-none placeholder:text-zinc-600"
        placeholder={`Đường dẫn ${label}`}
      />
    </div>
    <div className="shrink-0 ml-4 flex items-center gap-3">
      <span className="text-[11px] text-zinc-500 font-medium">{formData[visibleKey] ? 'Hiện' : 'Ẩn'}</span>
      <Toggle checked={formData[visibleKey] as boolean} onChange={(v) => handleChange(visibleKey, v)} />
    </div>
  </div>
);

const TECH_CATEGORIES: TechCategory[] = ['Frontend', 'Backend', 'Design', 'Tools'];
const NEW_TECH_DEFAULT: Pick<TechStackItem, 'name' | 'category'> = { name: '', category: 'Frontend' };

export const ProfileView: React.FC<ProfileViewProps> = ({ initialData }) => {
  const [formData, setFormData] = useState<ProfileData>({
    name: '', email: '', phone: '', avatarUrl: '',
    titleVn: '', titleEn: '', bioVn: '', bioEn: '',
    websiteUrl: '', websiteVisible: true,
    githubUrl: '', githubVisible: true,
    facebookUrl: '', facebookVisible: true,
    zaloUrl: '', zaloVisible: true,
  });

  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [deletedTimelineIds, setDeletedTimelineIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [techStack, setTechStack] = useState<TechStackItem[]>([]);
  const [newTech, setNewTech] = useState(NEW_TECH_DEFAULT);
  const [isAddingTech, setIsAddingTech] = useState(false);
  const [techBusyId, setTechBusyId] = useState<number | null>(null);
  const [isTechSaving, setIsTechSaving] = useState(false);

  const fetchSocials = useOSStore(state => state.fetchSocials);

  const defaultTimeline: TimelineItem = { id: '', role: '', organization: '', date: '', type: 'Work', description: '' };
  const [modalForm, setModalForm] = useState<TimelineItem>(defaultTimeline);

  const applyProfileData = (profile: any) => {
    setFormData(prev => ({
      ...prev,
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      avatarUrl: profile?.avatar_url || profile?.avatarUrl || '',
      titleVn: profile?.title_vn || profile?.titleVn || '',
      titleEn: profile?.title_en || profile?.titleEn || '',
      bioVn: profile?.bio_vn || profile?.bioVn || '',
      bioEn: profile?.bio_en || profile?.bioEn || '',
      websiteUrl: profile?.songphuong_url || profile?.songphuongUrl || profile?.websiteUrl || '',
      githubUrl: profile?.github_url || profile?.githubUrl || '',
      facebookUrl: profile?.facebook_url || profile?.facebookUrl || '',
      zaloUrl: profile?.zalo_url || profile?.zaloUrl || '',
      websiteVisible: profile?.songphuong_visible ?? profile?.songphuongVisible ?? true,
      githubVisible: profile?.github_visible ?? profile?.githubVisible ?? true,
      facebookVisible: profile?.facebook_visible ?? profile?.facebookVisible ?? true,
      zaloVisible: profile?.zalo_visible ?? profile?.zaloVisible ?? true
    }));
  };

  useEffect(() => {
    // Load timeline from API
    api.get<any[]>('/admin/timeline').then(data => {
      const mapped: TimelineItem[] = data.map((t: any) => ({
        id: t.id.toString(),
        role: t.role_vn || t.role_en || '',
        organization: t.company || '',
        date: t.period_vn || t.period_en || '',
        type: t.type === 'education' ? 'Education' : 'Work',
        description: (t.desc_vn || t.desc_en || []).join('\n')
      }));
      setTimelineData(mapped);
    }).catch(console.error);

    api.get<TechStackItem[]>('/admin/tech-stack')
      .then(data => setTechStack(data))
      .catch(console.error);

    if (initialData) {
      applyProfileData(initialData);
    } else {
      api.get<any>('/admin/profile')
        .then(applyProfileData)
        .catch(console.error);
    }
  }, [initialData]);

  const handleChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        handleChange('avatarUrl', dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleModalSave = () => {
    if (editingItem) {
      setTimelineData(prev => prev.map(item => item.id === editingItem.id ? modalForm : item));
    } else {
      setTimelineData(prev => [...prev, { ...modalForm, id: `new_${Date.now()}` }]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTimeline = (id: string) => {
    if (!id.startsWith('new_')) {
      setDeletedTimelineIds(prev => [...prev, id]);
    }
    setTimelineData(prev => prev.filter(item => item.id !== id));
  };

  const handleAddTech = async () => {
    const name = newTech.name.trim();
    if (!name) return;
    setIsTechSaving(true);
    try {
      const created = await api.post<TechStackItem>('/admin/tech-stack', {
        name,
        category: newTech.category,
        order_index: techStack.length
      });
      setTechStack(prev => [...prev, created]);
      setNewTech(NEW_TECH_DEFAULT);
      setIsAddingTech(false);
      window.dispatchEvent(new Event('tech-stack-updated'));
    } catch (e: any) {
      console.error(e);
      alert(`Lỗi khi thêm Tech Stack: ${e.message || 'Unknown'}`);
    } finally {
      setIsTechSaving(false);
    }
  };

  const handleDeleteTech = async (id: number) => {
    setTechBusyId(id);
    try {
      await api.del('/admin/tech-stack', { id });
      setTechStack(prev => prev.filter(item => item.id !== id));
      window.dispatchEvent(new Event('tech-stack-updated'));
    } catch (e: any) {
      console.error(e);
      alert(`Lỗi khi xóa Tech Stack: ${e.message || 'Unknown'}`);
    } finally {
      setTechBusyId(null);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // 1. Lưu Profile & Socials
      const profilePayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatar_url: formData.avatarUrl,
        title_vn: formData.titleVn,
        title_en: formData.titleEn,
        bio_vn: formData.bioVn,
        bio_en: formData.bioEn,
        songphuong_url: formData.websiteUrl,
        github_url: formData.githubUrl,
        facebook_url: formData.facebookUrl,
        zalo_url: formData.zaloUrl,
        socialVisibility: {
          songphuong: formData.websiteVisible,
          github: formData.githubVisible,
          facebook: formData.facebookVisible,
          zalo: formData.zaloVisible
        }
      };
      await api.put('/admin/profile', profilePayload);

      // 2. Lưu Timeline
      for (const item of timelineData) {
        const payload = {
          role_vn: item.role,
          company: item.organization,
          period_vn: item.date,
          type: item.type.toLowerCase(),
          desc_vn: item.description.split('\n').filter(s => s.trim() !== '')
        };
        if (item.id.startsWith('new_')) {
          await api.post('/admin/timeline', payload);
        } else {
          await api.put('/admin/timeline', { ...payload, id: item.id });
        }
      }

      // Xóa timeline đã xóa
      for (const id of deletedTimelineIds) {
        await api.del('/admin/timeline', { id });
      }
      setDeletedTimelineIds([]);

      // 3. Đồng bộ state
      await fetchSocials();
      window.dispatchEvent(new Event('profile-updated'));
      window.dispatchEvent(new Event('social-links-updated'));
      
      alert('Đã lưu thay đổi thành công!');
    } catch (e: any) {
      console.error(e);
      alert(`Lỗi khi lưu: ${e.message || 'Unknown'}`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleSaveRequest = (event: Event) => {
      if (isSaving) return;
      (event as CustomEvent<{ promises: Promise<unknown>[] }>).detail?.promises.push(handleSaveAll());
    };

    window.addEventListener('global-save-triggered', handleSaveRequest);
    return () => window.removeEventListener('global-save-triggered', handleSaveRequest);
  }, [formData, timelineData, deletedTimelineIds, isSaving]);

  const inputClass = "w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-[13px] text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-colors";
  
  // Toggle and SocialRow helper component definitions removed from here

  return (
    <div className="space-y-6 pb-24 relative">
      {/* SECTION 1: THÔNG TIN CƠ BẢN */}
      <section>
        <h2 className="text-zinc-500 text-xs font-bold tracking-wider uppercase mb-3">Thông tin cơ bản</h2>
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Họ & Tên hiển thị</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={inputClass}
                placeholder="Họ và tên hiển thị"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={inputClass}
                placeholder="Địa chỉ email"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Số điện thoại</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={inputClass}
                placeholder="Số điện thoại"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Avatar</label>
            <div className="flex gap-4 items-center">
              <div className="shrink-0 w-16 h-16 rounded-full border border-white/10 overflow-hidden bg-zinc-800 flex items-center justify-center">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt={`${formData.name || 'Profile'} avatar preview`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <span className="text-zinc-500 text-[10px]">No img</span>
                )}
              </div>
              <div className="flex-1 flex gap-2">
                <input 
                  type="text" 
                  value={formData.avatarUrl}
                  onChange={(e) => handleChange('avatarUrl', e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="Đường dẫn ảnh đại diện"
                />
                <label className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-[13px] font-semibold text-zinc-300 hover:text-white cursor-pointer transition-colors">
                  <Upload size={15} />
                  <span>Tải lên</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CHỨC DANH & GIỚI THIỆU */}
      <section>
        <h2 className="text-zinc-500 text-xs font-bold tracking-wider uppercase mb-3">Chức danh & Giới thiệu</h2>
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 mb-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Job Title (VI)</label>
              <input 
                type="text" 
                value={formData.titleVn}
                onChange={(e) => handleChange('titleVn', e.target.value)}
                className={inputClass}
                placeholder="Chức danh tiếng Việt"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Job Title (EN)</label>
              <input 
                type="text" 
                value={formData.titleEn}
                onChange={(e) => handleChange('titleEn', e.target.value)}
                className={inputClass}
                placeholder="Chức danh tiếng Anh"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Bio (VI)</label>
            <div className="relative">
              <textarea 
                value={formData.bioVn}
                onChange={(e) => handleChange('bioVn', e.target.value)}
                className={`${inputClass} resize-none h-24`}
                placeholder="Giới thiệu ngắn gọn bằng tiếng Việt..."
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-zinc-500">{formData.bioVn.length}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Bio (EN)</label>
            <div className="relative">
              <textarea 
                value={formData.bioEn}
                onChange={(e) => handleChange('bioEn', e.target.value)}
                className={`${inputClass} resize-none h-24`}
                placeholder="Giới thiệu ngắn gọn bằng tiếng Anh..."
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-zinc-500">{formData.bioEn.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MẠNG XÃ HỘI & LIÊN KẾT */}
      <section>
        <h2 className="text-zinc-500 text-xs font-bold tracking-wider uppercase mb-3">Mạng xã hội & Liên kết</h2>
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 mb-6">
          <div className="space-y-1">
            <SocialRow icon={Globe} label="Website" urlKey="websiteUrl" visibleKey="websiteVisible" formData={formData} handleChange={handleChange} />
            <SocialRow icon={Code2} label="GitHub" urlKey="githubUrl" visibleKey="githubVisible" formData={formData} handleChange={handleChange} />
            <SocialRow icon={MessageCircle} label="Facebook" urlKey="facebookUrl" visibleKey="facebookVisible" formData={formData} handleChange={handleChange} />
            <SocialRow icon={MessageCircle} label="Zalo" urlKey="zaloUrl" visibleKey="zaloVisible" formData={formData} handleChange={handleChange} />
          </div>
        </div>
      </section>

      {/* SECTION 4: TECH STACK */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-zinc-500 text-xs font-bold tracking-wider uppercase">Tech Stack</h2>
          <button
            type="button"
            onClick={() => setIsAddingTech(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[12px] font-semibold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Plus size={14} />
            Thêm công nghệ mới
          </button>
        </div>

        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 mb-6">
          {isAddingTech && (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
              <input
                type="text"
                value={newTech.name}
                onChange={(e) => setNewTech(prev => ({ ...prev, name: e.target.value }))}
                className={inputClass}
                placeholder="Tên công nghệ"
              />
              <select
                value={newTech.category}
                onChange={(e) => setNewTech(prev => ({ ...prev, category: e.target.value as TechCategory }))}
                className={inputClass}
              >
                {TECH_CATEGORIES.map(category => (
                  <option key={category} value={category} className="bg-zinc-900 text-white">
                    {category}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddTech}
                  disabled={isTechSaving || !newTech.name.trim()}
                  className="px-4 py-2.5 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                >
                  {isTechSaving ? 'Đang thêm...' : 'Thêm'}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsAddingTech(false); setNewTech(NEW_TECH_DEFAULT); }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {techStack.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-white/10 rounded-xl text-zinc-500 text-[13px]">
                Chưa có công nghệ nào trong Tech Stack.
              </div>
            ) : (
              techStack.map(item => (
                <div key={item.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 p-3 rounded-xl border border-white/5 bg-black/20 hover:border-white/10 transition-colors">
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-white truncate">{item.name}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-semibold text-zinc-300">
                    {item.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTech(item.id)}
                    disabled={techBusyId === item.id}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 disabled:opacity-40 transition-colors"
                  >
                    {techBusyId === item.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={14} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: MỐC LỊCH SỬ (TIMELINE) */}
      <section>
        <h2 className="text-zinc-500 text-xs font-bold tracking-wider uppercase mb-3">Mốc lịch sử (Timeline)</h2>
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5">
          <div className="space-y-3 mb-5">
            {timelineData.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-white/10 rounded-xl text-zinc-500 text-[13px]">
                Chưa có mốc lịch sử nào. Hãy thêm mốc mới!
              </div>
            ) : (
              timelineData.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20 group hover:border-white/10 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                        {item.type}
                      </span>
                      <span className="text-[12px] text-zinc-400">{item.date}</span>
                    </div>
                    <div className="text-[14px] font-semibold text-white">{item.role}</div>
                    <div className="text-[13px] text-zinc-400">{item.organization}</div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setEditingItem(item); setModalForm(item); setIsModalOpen(true); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Edit2 size={14} strokeWidth={1.5} />
                    </button>
                    <button 
                      onClick={() => handleDeleteTimeline(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <button 
            onClick={() => { setEditingItem(null); setModalForm(defaultTimeline); setIsModalOpen(true); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/20 text-[13px] font-semibold text-zinc-300 hover:bg-white/5 hover:border-white/30 transition-all"
          >
            <Plus size={16} />
            Thêm mốc lịch sử
          </button>
        </div>
      </section>
      {/* TIMELINE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[15px] font-bold text-white uppercase tracking-wider">{editingItem ? 'Sửa mốc lịch sử' : 'Thêm mốc lịch sử'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Loại mốc</label>
                <div className="flex gap-4">
                  {(['Work', 'Education'] as const).map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="timelineType"
                        checked={modalForm.type === type}
                        onChange={() => setModalForm(prev => ({ ...prev, type }))}
                        className="accent-white"
                      />
                      <span className="text-[13px] text-zinc-300">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Vai trò / Chức danh</label>
                <input 
                  type="text" 
                  value={modalForm.role}
                  onChange={(e) => setModalForm(prev => ({ ...prev, role: e.target.value }))}
                  className={inputClass}
                  placeholder="Vai trò hoặc chức danh"
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Đơn vị / Tổ chức</label>
                <input 
                  type="text" 
                  value={modalForm.organization}
                  onChange={(e) => setModalForm(prev => ({ ...prev, organization: e.target.value }))}
                  className={inputClass}
                  placeholder="Đơn vị hoặc tổ chức"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Thời gian</label>
                <input 
                  type="text" 
                  value={modalForm.date}
                  onChange={(e) => setModalForm(prev => ({ ...prev, date: e.target.value }))}
                  className={inputClass}
                  placeholder="Thời gian"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Mô tả chi tiết</label>
                <textarea 
                  value={modalForm.description}
                  onChange={(e) => setModalForm(prev => ({ ...prev, description: e.target.value }))}
                  className={`${inputClass} h-24 resize-none`}
                  placeholder="Mô tả công việc hoặc thành tựu (mỗi dòng một ý)..."
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl text-[13px] font-semibold text-zinc-400 hover:bg-white/10 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleModalSave}
                className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                Lưu mốc này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
