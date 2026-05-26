import React, { useState } from 'react';
import { MessageSquare, Copy, Check } from 'lucide-react';

export const ZaloApp: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const phoneNumber = '0911818016';
  const displayPhone = '0911 818 016';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-50/50 dark:bg-zinc-900/50 select-text">
      {/* LEFT COLUMN: QR Code (45% width) */}
      <div className="w-[45%] flex flex-col items-center justify-center p-4 border-r border-gray-100 dark:border-zinc-800">
        <div className="rounded-2xl bg-white shadow-inner p-4 flex flex-col items-center justify-center border border-gray-100">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://zalo.me/${phoneNumber}`}
            alt="Zalo QR Code"
            className="w-[120px] h-[120px] object-contain select-none"
            draggable={false}
          />
          <span className="text-[10px] text-gray-400 mt-2 font-medium">
            Quét mã để kết nối Zalo
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: Contact Details (55% width) */}
      <div className="w-[55%] flex flex-col justify-between p-6 select-text">
        <div className="flex flex-col items-start">
          {/* Avatar */}
          <img
            src="/my-avatar.jpg"
            alt="Hoàng Minh Dương"
            className="w-14 h-14 rounded-full border-2 border-white dark:border-zinc-800 shadow-md object-cover overflow-hidden bg-neutral-100 select-none"
            draggable={false}
          />

          {/* Name */}
          <h2 className="text-lg font-bold text-gray-950 dark:text-white mt-3 leading-tight">
            Hoàng Minh Dương
          </h2>

          {/* Title */}
          <p className="text-xs text-gray-500 dark:text-neutral-400 font-medium mt-1">
            Web Developer tại Song Phương Technology
          </p>

          {/* Phone Number */}
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-2 tracking-wide">
            {displayPhone}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <a
            href={`https://zalo.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0068FF] hover:bg-[#005AE0] text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors w-full select-none"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Nhắn tin Zalo
          </a>

          <button
            onClick={handleCopy}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 text-xs font-medium py-2 px-4 rounded-lg transition-colors w-full flex items-center justify-center gap-1.5 select-none"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                Đã sao chép SĐT
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Sao chép SĐT
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
