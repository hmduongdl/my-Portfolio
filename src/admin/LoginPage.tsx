import React, { useState } from 'react';
import { api } from './api';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  onLogin: () => void;
}

export const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const username = 'duongadmin'; // Tên tài khoản cố định

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.login(username, password);
      onLogin();
    } catch {
      setError('Mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900/90 relative font-['Inter']">
      {/* Blurred desktop wallpaper background */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-md opacity-40 pointer-events-none"
        style={{ backgroundImage: `url('/images/profile/my-avatar.png')` }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl" />

      <div className="relative z-10 w-full max-w-[280px] flex flex-col items-center select-none">
        {/* Rounded Avatar */}
        <div className="w-[84px] h-[84px] rounded-full overflow-hidden border border-white/20 shadow-lg mb-3.5 bg-zinc-800 shrink-0">
          <img 
            src="/images/profile/my-avatar.png" 
            alt="Hoàng Minh Dương" 
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Account Name */}
        <h1 className="text-white text-[15.5px] font-semibold tracking-wide drop-shadow-sm mb-5">
          Hoàng Minh Dương
        </h1>

        {/* Password Form */}
        <form onSubmit={submit} className="w-full flex flex-col items-center gap-3">
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full bg-white/10 dark:bg-black/25 text-white placeholder:text-white/45 text-[12.5px] rounded-[18px] pl-3.5 pr-10 py-1.5 border border-white/12 outline-none focus:ring-1 focus:ring-primary/45 transition-all text-center tracking-wide"
              autoFocus
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer flex items-center justify-center"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            )}
          </div>

          {error && (
            <span className="text-red-400/90 text-[11px] font-medium text-center drop-shadow-sm">
              {error}
            </span>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="bg-[#007AFF] hover:bg-[#0063CC] disabled:opacity-40 disabled:hover:bg-[#007AFF] text-white text-xs font-semibold rounded-md px-5 py-1.5 mt-2 transition-all active:scale-95 shadow-md border-none cursor-pointer"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};
