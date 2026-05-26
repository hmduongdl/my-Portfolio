import React from 'react';

export const WelcomeApp: React.FC = () => {
  return (
    <div className="px-11 py-9 max-w-[600px] mx-auto select-text leading-relaxed font-sans">
      <h1 className="text-[26px] font-bold tracking-tight mb-5 text-ink flex items-center gap-2">
        <span className="text-2xl">🖥️</span> Chào mừng bạn đến với Song Phương OS!
      </h1>
      
      <p className="text-[14px] text-ink-2 mb-6 leading-[1.6]">
        Đây là Hệ điều hành Portfolio cá nhân của <b>Hoàng Minh Dương</b> - Web Developer tại <i>Song Phương Technology</i> & Sinh viên CNTT trường <i>Đại học Đà Lạt</i>.
      </p>

      <p className="text-[14px] text-ink-2 mb-8 leading-[1.6]">
        Hệ thống được thiết kế giả lập hoàn hảo giao diện macOS Big Sur/Sonoma mượt mà kết hợp cùng hạ tầng cơ sở dữ liệu thời gian thực <b>Neon SQL (PostgreSQL)</b>.
      </p>
      
      <h3 className="text-[16px] font-bold text-ink mb-4 flex items-center gap-2">
        <span className="text-lg">🚀</span> Các tính năng bạn có thể tương tác:
      </h3>
      
      <ul className="space-y-4 mb-8">
        <li className="flex gap-3 text-[14px] text-ink-2 leading-[1.5]">
          <span className="text-lg shrink-0">📂</span>
          <div><b>Finder App</b>: Xem danh sách các cấu hình PC Gaming và Laptop chính hãng từ Song Phương Technology.</div>
        </li>
        <li className="flex gap-3 text-[14px] text-ink-2 leading-[1.5]">
          <span className="text-lg shrink-0">👤</span>
          <div><b>About Me</b>: Khám phá thông tin cá nhân, định hướng nghề nghiệp, kỹ năng lập trình (Tech Stack) và lịch sử học tập/làm việc của tôi.</div>
        </li>
        <li className="flex gap-3 text-[14px] text-ink-2 leading-[1.5]">
          <span className="text-lg shrink-0">💼</span>
          <div><b>Projects App</b>: Trình diễn các dự án lập trình thực tế, nhấp "View Demo" hoặc "GitHub" để xem mã nguồn thời gian thực.</div>
        </li>
        <li className="flex gap-3 text-[14px] text-ink-2 leading-[1.5]">
          <span className="text-lg shrink-0">💬</span>
          <div><b>Zalo Contact</b>: Click để mở cửa sổ Zalo nội bộ, quét mã QR hoặc sao chép nhanh SĐT để liên hệ trực tiếp với tôi.</div>
        </li>

      </ul>
      
      <div className="p-4 bg-blue-500/10 dark:bg-blue-500/5 text-blue-700 dark:text-blue-200 border border-blue-500/20 rounded-xl text-[13px] leading-[1.6] italic">
        Chúc bạn có những trải nghiệm tương tác thú vị trên hệ điều hành Portfolio của tôi!
      </div>
    </div>
  );
};
