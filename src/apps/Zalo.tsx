import React, { useState, useEffect } from 'react';
import { MessageSquare, Copy, Check } from 'lucide-react';
import { useOSStore } from '../store/useOSStore';
import { profileService } from '../services/profileService';

export const ZaloApp: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const language = useOSStore((state) => state.language);
  const [phone, setPhone] = useState<string>('0911818016');

  useEffect(() => {
    const loadProfile = () => {
      profileService.getProfile(language)
        .then((p) => {
          if (p && p.phone) setPhone(p.phone);
        })
        .catch(() => {});
    };

    loadProfile();

    window.addEventListener('profile-updated', loadProfile);
    return () => {
      window.removeEventListener('profile-updated', loadProfile);
    };
  }, [language]);

  // Clean phone number for URL (strip 'tel:' prefix and non-digits/+)
  const cleanPhone = phone.replace(/^tel:/i, '').replace(/[^\d+]/g, '');
  
  // Format phone number for display (e.g. 0911 818 016)
  let displayPhone = cleanPhone;
  if (displayPhone.startsWith('+84')) {
    displayPhone = '0' + displayPhone.slice(3);
  }
  displayPhone = displayPhone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanPhone);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative flex h-full w-full bg-slate-50/80 dark:bg-zinc-900/80 select-text overflow-hidden backdrop-blur-md">
      {/* Toast Notification */}
      <div 
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none'}`}
      >
        <div className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-full px-5 py-2.5 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-[12px] font-semibold text-gray-800 dark:text-white/90">
            Đã sao chép số điện thoại
          </span>
        </div>
      </div>

      {/* LEFT COLUMN: QR Code (45% width) */}
      <div className="w-[45%] flex flex-col items-center justify-center p-5 border-r border-gray-200/50 dark:border-white/5 relative bg-white/5">
        <div className="rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-5 border border-neutral-100 flex flex-col items-center justify-center w-full max-w-[210px] aspect-square">
          <div className="relative p-1 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden w-full aspect-square flex items-center justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://zalo.me/${cleanPhone}`}
              alt="Zalo QR Code"
              className="w-full h-full object-contain select-none mix-blend-multiply"
              draggable={false}
            />
          </div>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide mt-3 text-center leading-tight">
            Quét mã để kết nối Zalo
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: Contact Details (55% width) */}
      <div className="w-[55%] flex flex-col justify-between p-6 pl-7 select-text">
        <div className="flex flex-col items-start">
          {/* Avatar */}
          <div className="relative">
            <img
              src="/my-avatar.jpg"
              alt="Hoàng Minh Dương"
              className="w-16 h-16 rounded-full border-4 border-white dark:border-zinc-800 shadow-[0_4px_12px_rgba(0,0,0,0.12)] object-cover bg-neutral-100 select-none"
              draggable={false}
            />
            <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-[#0068FF] border-2 border-white dark:border-zinc-800 rounded-full"></div>
          </div>

          {/* Name */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-3.5 leading-tight tracking-tight">
            Hoàng Minh Dương
          </h2>

          {/* Title */}
          <p className="text-[11px] text-gray-500/90 dark:text-neutral-400/80 font-medium mt-1.5 tracking-wide">
            Web Developer tại Song Phương Technology
          </p>

          {/* Phone Number */}
          <div className="flex items-center gap-2 mt-3.5">
            <span className="text-[15px] font-semibold text-gray-900 dark:text-white tracking-wide">
              {displayPhone}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-5">
          <a
            href={`https://zalo.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0068FF] hover:bg-[#005AE0] text-white text-[13px] font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-[0_2px_6px_rgba(0,104,255,0.25)] transition-all active:scale-[0.98] w-full select-none cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Nhắn tin Zalo
          </a>

          <button
            onClick={handleCopy}
            className="bg-white/5 hover:bg-white/10 text-gray-800 dark:text-white/90 border border-gray-200 dark:border-white/10 shadow-sm text-[13px] font-semibold py-2.5 px-4 rounded-lg transition-all active:scale-[0.98] w-full flex items-center justify-center gap-2 select-none cursor-pointer backdrop-blur-sm"
          >
            <Copy className="w-4 h-4" />
            Sao chép SĐT
          </button>
        </div>
      </div>
    </div>
  );
};
