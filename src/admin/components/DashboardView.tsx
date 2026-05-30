import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Database,
  FolderKanban,
  MonitorCog,
  Package,
  Palette,
  UserRound,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/desktop/ImageWithFallback';
import { api } from '../api';

type DashboardTargetTab = 'profile' | 'content' | 'appearance';

interface DashboardViewProps {
  setActiveTab: (tab: DashboardTargetTab) => void;
}

interface ProjectRow {
  visible?: boolean;
}

interface ProductRow {
  id: number | string;
}

interface ProfileRow {
  name?: string;
  avatar_url?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
}

const DEFAULT_PROFILE = {
  name: 'Chưa cập nhật',
  avatarUrl: '',
  email: 'Chưa cập nhật',
  phone: 'Chưa cập nhật',
};

const cardClass = 'rounded-2xl bg-zinc-900/40 border border-white/5 p-5';

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [projectRows, productRows, profileRow] = await Promise.all([
        api.get<ProjectRow[]>('/admin/projects'),
        api.get<ProductRow[]>('/admin/products'),
        api.get<ProfileRow>('/profile'),
      ]);

      setProjects(Array.isArray(projectRows) ? projectRows : []);
      setProducts(Array.isArray(productRows) ? productRows : []);
      setProfile({
        name: profileRow?.name || DEFAULT_PROFILE.name,
        avatarUrl: profileRow?.avatar_url || profileRow?.avatarUrl || DEFAULT_PROFILE.avatarUrl,
        email: profileRow?.email || DEFAULT_PROFILE.email,
        phone: profileRow?.phone || DEFAULT_PROFILE.phone,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboardData();

    window.addEventListener('projects-updated', loadDashboardData);
    window.addEventListener('products-updated', loadDashboardData);
    window.addEventListener('profile-updated', loadDashboardData);

    return () => {
      window.removeEventListener('projects-updated', loadDashboardData);
      window.removeEventListener('products-updated', loadDashboardData);
      window.removeEventListener('profile-updated', loadDashboardData);
    };
  }, []);

  const visibleProjects = useMemo(
    () => projects.filter((project) => project.visible === true).length,
    [projects]
  );

  const stats = [
    {
      icon: FolderKanban,
      label: 'Dự án cá nhân',
      value: projects.length,
      detail: `${visibleProjects} dự án đang trực tuyến`,
    },
    {
      icon: Package,
      label: 'PC & Laptop Song Phương',
      value: products.length,
      detail: 'Tổng sản phẩm trong hệ thống',
    },
    {
      icon: Database,
      label: 'Neon SQL',
      value: 'Hoạt động',
      detail: 'Neon Database Cloud - v2.0',
    },
  ];

  const shortcuts = [
    { icon: UserRound, label: 'Cập nhật Hồ sơ cá nhân', tab: 'profile' as const },
    { icon: MonitorCog, label: 'Quản lý sản phẩm', tab: 'content' as const },
    { icon: Palette, label: 'Thay đổi hình nền', tab: 'appearance' as const },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-zinc-900/50 border border-white/5 p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <ImageWithFallback
            src={profile.avatarUrl}
            alt={profile.name}
            fallbackText={profile.name}
            className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-[17px] font-semibold text-white truncate">{profile.name}</h2>
            <p className="text-[13px] text-zinc-400 truncate">{profile.email}</p>
            <p className="text-[13px] text-zinc-500 truncate">{profile.phone}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/10 px-3 py-1.5 text-[12px] font-medium text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
          Kết nối xanh
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className={cardClass}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-medium text-zinc-500">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{loading ? '--' : item.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-300">
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-4 text-[13px] text-zinc-400">{item.detail}</p>
            </article>
          );
        })}
      </section>

      <section className={cardClass}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[15px] font-semibold text-white">Phím tắt thao tác nhanh</h3>
            <p className="mt-1 text-[12px] text-zinc-500">Đi nhanh tới các khu vực quản trị thường dùng.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <button
                key={shortcut.label}
                type="button"
                onClick={() => setActiveTab(shortcut.tab)}
                className="group min-h-[72px] rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-white/[0.06] hover:border-white/10 transition-colors"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-300 flex items-center justify-center shrink-0">
                    <Icon size={17} />
                  </span>
                  <span className="text-[13px] font-medium text-zinc-200 leading-snug">{shortcut.label}</span>
                </span>
                <ArrowRight size={16} className="text-zinc-500 group-hover:text-zinc-200 shrink-0 transition-colors" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
