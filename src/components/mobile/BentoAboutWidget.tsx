import React from 'react';
import { MapPin, MessageCircle, Mail, Globe } from 'lucide-react';

interface BentoAboutWidgetProps {
  onClick: () => void;
  scale?: number;
}

export const BentoAboutWidget: React.FC<BentoAboutWidgetProps> = ({ onClick, scale = 1 }) => {
  return (
    <div
      onClick={onClick}
      className="col-span-4 cursor-pointer select-none hover:scale-[0.98] transition-transform duration-300 mx-auto w-full max-w-[338px]"
      style={{
        backgroundColor: '#F2F2F7',
        borderRadius: 22,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      <div className="flex flex-col gap-[6px] w-full">
        {/* IDENTITY ROW */}
        <div className="bg-white relative flex items-center gap-3 p-3 w-full shadow-sm" style={{ borderRadius: 14 }}>
          {/* Status Dot */}
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#30d158] border-2 border-white shadow-sm" />
          
          {/* Avatar */}
          <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#a78bfa] to-[#60a5fa] flex items-center justify-center text-white font-bold text-[22px] flex-shrink-0 shadow-sm">
            SP
          </div>
          
          {/* Info */}
          <div className="flex flex-col justify-center">
            <span className="text-[#8e8e93] text-[9px] font-bold uppercase tracking-wider mb-[2px]">ABOUT ME</span>
            <span className="text-[#1c1c1e] text-[15px] font-bold leading-tight">Song Phương</span>
            <span className="text-[#636366] text-[10.5px] font-medium mt-[2px]">Product Designer & Dev</span>
          </div>
        </div>

        {/* BENTO GRID ROW 1 */}
        <div className="grid grid-cols-3 gap-[6px] w-full h-[76px]">
          {/* Cell 1: FOCUS */}
          <div className="bg-[#ede9fe] p-2.5 flex flex-col justify-between shadow-sm" style={{ borderRadius: 14 }}>
            <span className="text-[#7c3aed] text-[9px] font-bold uppercase tracking-wide opacity-80">FOCUS</span>
            <div className="flex flex-col">
              <span className="text-[#6d28d9] text-[14px] font-bold leading-tight">UI/UX</span>
              <span className="text-[#6d28d9] text-[10px] font-medium opacity-80">Design</span>
            </div>
          </div>
          
          {/* Cell 2: STACK */}
          <div className="bg-[#e0f0ff] p-2.5 flex flex-col justify-between shadow-sm" style={{ borderRadius: 14 }}>
            <span className="text-[#2563eb] text-[9px] font-bold uppercase tracking-wide opacity-80">STACK</span>
            <div className="flex flex-col">
              <span className="text-[#1d4ed8] text-[14px] font-bold leading-tight">React</span>
              <span className="text-[#1d4ed8] text-[10px] font-medium opacity-80">Node · TS</span>
            </div>
          </div>

          {/* Cell 3: STATUS */}
          <div className="bg-[#dcfce7] p-2.5 flex flex-col justify-between shadow-sm" style={{ borderRadius: 14 }}>
            <span className="text-[#16a34a] text-[9px] font-bold uppercase tracking-wide opacity-80">STATUS</span>
            <div className="flex flex-col">
              <span className="text-[#15803d] text-[14px] font-bold leading-tight">Open</span>
              <span className="text-[#15803d] text-[10px] font-medium opacity-80">to work</span>
            </div>
          </div>
        </div>

        {/* BENTO GRID ROW 2 */}
        <div className="grid grid-cols-2 gap-[6px] w-full h-[76px]">
          {/* Cell 4: LOCATION */}
          <div className="bg-white p-3 flex flex-col justify-between relative shadow-sm" style={{ borderRadius: 14 }}>
            <span className="text-[#8e8e93] text-[9px] font-bold uppercase tracking-wide">LOCATION</span>
            <div className="flex flex-col">
              <span className="text-[#1c1c1e] text-[14px] font-bold leading-tight">Hanoi, VN</span>
              <span className="text-[#8e8e93] text-[10.5px] font-medium mt-[1px]">GMT+7</span>
            </div>
            <MapPin className="absolute bottom-3 right-3 w-5 h-5 text-[#8e8e93] opacity-50" strokeWidth={2.5} />
          </div>

          {/* Cell 5: TOOLS */}
          <div className="bg-white p-3 flex flex-col justify-between shadow-sm" style={{ borderRadius: 14 }}>
            <span className="text-[#8e8e93] text-[9px] font-bold uppercase tracking-wide">TOOLS</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span className="bg-[#f3e8ff] text-[#7e22ce] text-[9.5px] font-bold px-2 py-[2px] rounded-full">Figma</span>
              <span className="bg-[#dbeafe] text-[#1e40af] text-[9.5px] font-bold px-2 py-[2px] rounded-full">VS Code</span>
              <span className="bg-[#dcfce7] text-[#166534] text-[9.5px] font-bold px-2 py-[2px] rounded-full">Git</span>
            </div>
          </div>
        </div>

        {/* SOCIAL QUICK-LINKS ROW */}
        <div className="grid grid-cols-4 gap-[6px] w-full h-[56px]">
          {[
            { 
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              ), 
              label: 'GitHub' 
            },
            { icon: <MessageCircle className="w-5 h-5 text-[#1c1c1e]" strokeWidth={2} />, label: 'Zalo' },
            { icon: <Mail className="w-5 h-5 text-[#1c1c1e]" strokeWidth={2} />, label: 'Email' },
            { icon: <Globe className="w-5 h-5 text-[#1c1c1e]" strokeWidth={2} />, label: 'Portfolio' },
          ].map((item, i) => (
            <div key={i} className="bg-white shadow-sm flex flex-col items-center justify-center gap-1 hover:bg-neutral-50 transition-colors" style={{ borderRadius: 12 }}>
              {item.icon}
              <span className="text-[#8e8e93] text-[9px] font-bold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
