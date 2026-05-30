import React, { useState, useEffect } from 'react';
import { api } from './api';
import { LoginPage } from './LoginPage';
import { SettingsEditor } from './SettingsEditor';
import { AppearanceView } from './components/AppearanceView';
import { ChatbotEditor } from './ChatbotEditor';
import { DashboardView } from './components/DashboardView';
import { ProfileView } from './components/ProfileView';
import { ContentView } from './components/ContentView';
import { LayoutDashboard, UserCircle, FolderDot, MessageSquare, Palette, Settings, LogOut, Loader2, Menu, X } from 'lucide-react';

type Tab = 'dashboard' | 'profile' | 'content' | 'chatbot' | 'ui' | 'settings';

export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(api.isLoggedIn());
  const [tab, setTab] = useState<Tab>('dashboard');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    api.onUnauthorized(() => {
      setIsAuthenticated(false);
    });
    return () => {
      api.onUnauthorized(() => {});
    };
  }, []);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
  };

  const navGroups = [
    {
      title: 'TỔNG QUAN',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          content: <DashboardView setActiveTab={(nextTab) => setTab(nextTab === 'appearance' ? 'ui' : nextTab)} />,
        },
      ]
    },
    {
      title: 'DANH TÍNH',
      items: [
        { id: 'profile', label: 'Hồ sơ cá nhân', icon: UserCircle, content: <ProfileView /> },
      ]
    },
    {
      title: 'NỘI DUNG',
      items: [
        { id: 'content', label: 'Nội dung & Dự án', icon: FolderDot, content: <ContentView /> },
      ]
    },
    {
      title: 'TƯƠNG TÁC',
      items: [
        { id: 'chatbot', label: 'Chatbot & Liên hệ', icon: MessageSquare, content: <ChatbotEditor /> },
      ]
    },
    {
      title: 'GIAO DIỆN',
      items: [
        { id: 'ui', label: 'Giao diện & Widget', icon: Palette, content: <AppearanceView /> },
      ]
    },
    {
      title: 'HỆ THỐNG',
      items: [
        { id: 'settings', label: 'Cài đặt & SEO', icon: Settings, content: <SettingsEditor /> },
      ]
    }
  ];

  const currentTabItem = navGroups.flatMap(g => g.items).find(item => item.id === tab);
  const handleGlobalSave = async () => {
    setIsSaving(true);
    const saveEvent = new CustomEvent<{ promises: Promise<unknown>[] }>('global-save-triggered', {
      detail: { promises: [] },
    });
    window.dispatchEvent(saveEvent);

    try {
      await Promise.all(saveEvent.detail.promises);
      setIsDirty(false);
    } catch (error) {
      console.error('Global save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-dark h-screen w-screen flex items-center justify-center bg-zinc-950 text-white font-['Inter'] overflow-hidden relative selection:bg-blue-500/30">
      
      {/* Container Window */}
      <div className="w-full h-full md:w-[1100px] md:h-[680px] bg-zinc-900 md:rounded-2xl shadow-2xl border-none md:border border-white/10 flex flex-col overflow-hidden relative">
        
        {/* NEW FLAT HEADER */}
        <header className="h-12 border-b border-white/5 px-4 flex items-center justify-between bg-zinc-900 shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-1 -ml-1 text-zinc-400 hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span className="text-[10px] md:text-xs font-bold text-zinc-400 tracking-wider hidden sm:inline-block">CẤU HÌNH HỆ THỐNG PORTFOLIO</span>
            <span className="text-[10px] md:text-xs font-bold text-zinc-400 tracking-wider sm:hidden">ADMIN</span>
            {isDirty && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-orange-400/80 hidden sm:inline-block">Chưa lưu thay đổi</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => {
              // Close admin app logic
              window.location.href = '/';
            }}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg border border-white/5 transition-colors"
          >
            🔙 Quay lại trang chủ
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Mobile Overlay */}
          <div 
            className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar (Drawer on mobile) */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-white/5 p-5 flex flex-col justify-between transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shrink-0 shadow-2xl md:shadow-none`}>
            <div className="flex flex-col">
              <div className="flex items-center justify-between md:hidden mb-4">
                <span className="text-xs font-bold text-zinc-400 tracking-wider">MENU</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-400 hover:text-white p-1">
                  <X size={20} />
                </button>
              </div>
              {/* Navigation Groups */}
            <nav className="flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar">
              {navGroups.map((group, gIdx) => (
                <div key={gIdx} className="mb-4 last:mb-0">
                  <h3 className="text-[10px] font-bold text-zinc-500 tracking-wider mb-2 mt-4 ml-2">
                    {group.title}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {group.items.map((item) => {
                      const isActive = tab === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setTab(item.id as Tab);
                            setIsSidebarOpen(false);
                          }}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-left w-full ${
                            isActive 
                              ? 'bg-blue-500/10 text-blue-400 font-medium' 
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 font-normal'
                          }`}
                        >
                          <Icon size={16} className={isActive ? 'text-blue-400' : 'text-zinc-500'} />
                          <span className="text-[13px]">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Footer / Logout */}
          <div className="mt-auto pt-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors w-full text-left"
            >
              <LogOut size={16} />
              <span className="text-[13px] font-medium">Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main 
          className="flex-1 bg-zinc-950 p-6 overflow-y-auto relative"
          onChange={() => setIsDirty(true)}
          onKeyUp={() => setIsDirty(true)}
        >
          {currentTabItem?.content}
        </main>
        </div>
        
        {/* GLOBAL SAVE BAR */}
        <div className={`absolute bottom-0 right-0 left-0 md:left-64 z-20 bg-zinc-900/95 backdrop-blur-md border-t border-white/5 py-3.5 px-4 md:px-6 flex items-center justify-end space-x-3 transition-transform duration-300 pb-[max(env(safe-area-inset-bottom,16px),16px)] md:pb-3.5 ${isDirty ? 'translate-y-0' : 'translate-y-full'}`}>
          <button 
            onClick={() => {
              setIsDirty(false);
              // In a real app we'd reset the form states here. For now we just reload to discard.
              window.location.reload();
            }} 
            disabled={isSaving}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleGlobalSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};
