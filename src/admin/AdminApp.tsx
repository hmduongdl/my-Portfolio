import React, { useState } from 'react';
import { api } from './api';
import { LoginPage } from './LoginPage';
import { ProfileEditor } from './ProfileEditor';
import { SocialEditor } from './SocialEditor';
import { ProductsEditor } from './ProductsEditor';

type Tab = 'profile' | 'social' | 'products';

const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'profile', label: 'Profile',
    icon: (
      <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="8" cy="5.5" r="2.5"/>
        <path d="M2.5 13.5c0-2.76 2.46-5 5.5-5s5.5 2.24 5.5 5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'social', label: 'Social Links',
    icon: (
      <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="3" cy="8" r="1.5"/>
        <circle cx="13" cy="3.5" r="1.5"/>
        <circle cx="13" cy="12.5" r="1.5"/>
        <path d="M4.4 7.2l7.2-3M4.4 8.8l7.2 3"/>
      </svg>
    ),
  },
  {
    id: 'products', label: 'Products',
    icon: (
      <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="2" width="5.5" height="5.5" rx="1"/>
        <rect x="8.5" y="2" width="5.5" height="5.5" rx="1"/>
        <rect x="2" y="8.5" width="5.5" height="5.5" rx="1"/>
        <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1"/>
      </svg>
    ),
  },
];

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

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-4 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow shadow-blue-600/30">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="white" strokeWidth="2">
                <path d="M13 2L6 9l-3-3"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">Admin Panel</p>
              <p className="text-[11px] text-gray-600 leading-tight">Portfolio CMS</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === item.id
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-600/25'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="px-2 pb-4 border-t border-gray-800 pt-3 space-y-0.5">
          <a
            href="/"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M8 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V8" strokeLinecap="round"/>
              <path d="M10 2h4v4M14 2L8 8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Xem Portfolio
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-900/15 transition-colors"
          >
            <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M10 2h3a1 1 0 011 1v10a1 1 0 01-1 1h-3M6.5 10.5L10 8l-3.5-2.5M10 8H2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {tab === 'profile'  && <ProfileEditor />}
        {tab === 'social'   && <SocialEditor />}
        {tab === 'products' && <ProductsEditor />}
      </main>
    </div>
  );
};
