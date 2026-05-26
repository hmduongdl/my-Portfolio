import React, { useState } from 'react';
import { api } from './api';
import { LoginPage } from './LoginPage';
import { AdminSettings } from './AdminSettings';
import { SettingsEditor } from './SettingsEditor';
import { ProductsEditor } from './ProductsEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { WidgetSettings } from './WidgetSettings';

type Tab = 'profile' | 'products' | 'projects' | 'settings' | 'ui';

export const AdminApp: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(api.isLoggedIn());
  const [tab, setTab] = useState<Tab>('profile');

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  const handleLogout = () => {
    api.logout();
    setLoggedIn(false);
  };

  const navItems: { id: Tab; label: string; icon: string; iconBg: string; iconColor: string; content: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile & Timeline', icon: 'person', iconBg: 'bg-primary dark:bg-primary-container', iconColor: 'text-on-primary dark:text-on-primary-container', content: <AdminSettings /> },
    { id: 'products', label: 'Products', icon: 'shopping_bag', iconBg: 'bg-[#64D2FF]', iconColor: 'text-white', content: <ProductsEditor /> },
    { id: 'projects', label: 'Projects', icon: 'folder', iconBg: 'bg-[#FF9F0A]', iconColor: 'text-white', content: <ProjectsEditor /> },
    { id: 'ui', label: 'Giao diện & Widget', icon: 'palette', iconBg: 'bg-[#FF3B30]', iconColor: 'text-white', content: <WidgetSettings /> },
    { id: 'settings', label: 'System & SEO', icon: 'settings', iconBg: 'bg-[#8E8E93]', iconColor: 'text-white', content: <SettingsEditor /> },
  ];

  const currentTab = navItems.find(item => item.id === tab);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] font-['Inter'] overflow-hidden relative">
      
      {/* Background layer for full app if needed, currently gradient handles it */}
      
      {/* Mac Window */}
      <div className="w-[75vw] min-w-[1024px] max-w-[1200px] h-[70vh] min-h-[600px] max-h-[640px] rounded-xl bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden ring-1 ring-black/5">
        
        {/* Top Header */}
        <header className="h-12 border-b border-black/5 dark:border-white/5 px-4 flex items-center justify-between bg-neutral-100 dark:bg-zinc-800 shrink-0">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Song Phương Admin Panel
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-3 py-1.5 bg-neutral-500/10 hover:bg-neutral-500/20 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 border border-neutral-500/15 dark:border-white/10 backdrop-blur-md text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>🔙</span> Quay lại trang chủ
          </button>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-[260px] h-full bg-surface-container-low/80 backdrop-blur-[40px] flex flex-col p-4 gap-2 border-r border-outline-variant relative shrink-0">

          {/* Search Bar */}
          <div className="relative px-2 mb-4">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>search</span>
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-surface-container-highest/50 border-none rounded-lg py-1.5 pl-8 pr-2 text-[13px] text-on-surface focus:ring-1 focus:ring-primary outline-none transition-shadow"
            />
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = tab === item.id;
              return (
                <div 
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-lg cursor-pointer transition-all scale-100 active:scale-95 ${
                    isActive 
                      ? 'bg-primary text-on-primary font-semibold shadow-sm' 
                      : 'text-on-surface-variant hover:bg-surface-container-highest/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-white/20' : item.iconBg + ' ' + item.iconColor
                  }`}>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>{item.icon}</span>
                  </div>
                  <span className={`text-[13px] leading-[18px] ${isActive ? 'font-semibold' : 'font-normal'}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </nav>

          {/* Footer Action */}
          <div className="mt-auto border-t border-outline-variant/30 pt-4">
            <div 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-1.5 text-on-surface-variant hover:bg-surface-container-highest/50 rounded-lg cursor-pointer transition-colors scale-100 active:scale-90"
            >
              <div className="w-6 h-6 rounded-md bg-secondary/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px] text-red-500" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>logout</span>
              </div>
              <span className="text-[13px] leading-[18px] text-red-600 font-medium">Log out</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-background flex flex-col min-w-0">
          <header className="h-12 shrink-0 border-b border-outline-variant flex justify-between items-center px-6 bg-surface/80 backdrop-blur-md sticky top-0 z-10">
            <h1 className="text-[13px] font-bold text-on-surface leading-[16px] tracking-tight">{currentTab?.label}</h1>
            <div className="flex items-center gap-4">
              <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">share</span>
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            {currentTab?.content}
          </div>
        </main>
        </div>
      </div>

      {/* Add Material Symbols font to the document if not present */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </div>
  );
};
