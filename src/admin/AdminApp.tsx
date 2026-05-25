import React, { useState } from 'react';
import { api } from './api';
import { LoginPage } from './LoginPage';
import { AdminSettings } from './AdminSettings';
import { SettingsEditor } from './SettingsEditor';
import { ProductsEditor } from './ProductsEditor';
import { ProjectsEditor } from './ProjectsEditor';

type Tab = 'profile' | 'products' | 'projects' | 'settings';

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
    { id: 'settings', label: 'System & SEO', icon: 'settings', iconBg: 'bg-[#8E8E93]', iconColor: 'text-white', content: <SettingsEditor /> },
  ];

  const currentTab = navItems.find(item => item.id === tab);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] font-['Inter'] overflow-hidden relative">
      
      {/* Background layer for full app if needed, currently gradient handles it */}
      
      {/* Mac Window */}
      <div className="w-[980px] h-[720px] max-w-full max-h-full rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex overflow-hidden ring-1 ring-black/5">
        
        {/* Sidebar */}
        <aside className="w-[260px] h-full bg-surface-container-low/80 backdrop-blur-[40px] flex flex-col p-4 gap-2 border-r border-outline-variant relative shrink-0">
          {/* Traffic Lights */}
          <div className="flex gap-2 mb-6 px-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-red-500 cursor-pointer transition-colors shadow-inner" onClick={() => window.location.href = '/'} title="Close Admin"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-yellow-400 cursor-pointer transition-colors shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-green-500 cursor-pointer transition-colors shadow-inner"></div>
          </div>

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
