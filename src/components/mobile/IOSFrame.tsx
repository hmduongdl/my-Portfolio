import React from 'react';

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
interface IOSStatusBarProps {
  dark?: boolean;
  time?: string;
}

export const IOSStatusBar: React.FC<IOSStatusBarProps> = ({ dark = false, time = '9:41' }) => {
  const c = dark ? '#fff' : '#000';
  return (
    <div className="flex gap-[154px] items-center justify-center px-6 pt-[21px] pb-[19px] box-border relative z-20 w-full select-none">
      <div className="flex-1 h-[22px] flex items-center justify-center pt-[1.5px]">
        <span
          className="font-sans font-medium text-[17px] leading-[22px]"
          style={{ color: c }}
        >
          {time}
        </span>
      </div>
      <div className="flex-1 h-[22px] flex items-center justify-center gap-[7px] pt-[1px] pr-[1px]">
        <svg width="19" height="12" viewBox="0 0 19 12" style={{ fill: c }}>
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" />
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" />
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" />
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" style={{ fill: c }}>
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" />
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" />
          <circle cx="8.5" cy="10.5" r="1.5" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.35" fill="none" />
          <rect x="2" y="2" width="20" height="9" rx="2" fill={c} />
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
interface IOSGlassPillProps {
  children: React.ReactNode;
  dark?: boolean;
  style?: React.CSSProperties;
}

export const IOSGlassPill: React.FC<IOSGlassPillProps> = ({ children, dark = false, style = {} }) => {
  return (
    <div
      className={`h-11 min-w-[44px] rounded-full relative overflow-hidden flex items-center justify-center ${
        dark
          ? 'shadow-[0_2px_6px_rgba(0,0,0,0.35),0_6px_16px_rgba(0,0,0,0.2)]'
          : 'shadow-[0_1px_3px_rgba(0,0,0,0.07),0_3px_10px_rgba(0,0,0,0.06)]'
      }`}
      style={style}
    >
      {/* blur + tint */}
      <div
        className={`absolute inset-0 rounded-full backdrop-blur-md saturate-[180%] ${
          dark ? 'bg-[rgba(120,120,128,0.28)]' : 'bg-white/50'
        }`}
      />
      {/* shine */}
      <div
        className={`absolute inset-0 rounded-full ${
          dark
            ? 'shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.15),inset_-1px_-1px_1px_rgba(255,255,255,0.08)] border border-white/15'
            : 'shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.7),inset_-1px_-1px_1px_rgba(255,255,255,0.4)] border border-black/6'
        }`}
      />
      <div className="relative z-1 flex items-center px-1">{children}</div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
interface IOSNavBarProps {
  title?: string;
  dark?: boolean;
  trailingIcon?: boolean;
}

export const IOSNavBar: React.FC<IOSNavBarProps> = ({ title = 'Title', dark = false, trailingIcon = true }) => {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  
  const pillIcon = (content: React.ReactNode) => (
    <IOSGlassPill dark={dark}>
      <div className="w-9 h-9 flex items-center justify-center">{content}</div>
    </IOSGlassPill>
  );

  return (
    <div className="flex flex-col gap-2.5 pt-[62px] pb-2.5 relative z-[5]">
      <div className="flex items-center justify-between px-4">
        {/* back chevron */}
        {pillIcon(
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" className="-ml-0.5">
            <path d="M10 2L2 10l8 8" stroke={muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {/* trailing ellipsis */}
        {trailingIcon &&
          pillIcon(
            <svg width="22" height="6" viewBox="0 0 22 6">
              <circle cx="3" cy="3" r="2.5" fill={muted} />
              <circle cx="11" cy="3" r="2.5" fill={muted} />
              <circle cx="19" cy="3" r="2.5" fill={muted} />
            </svg>
          )}
      </div>
      {/* large title */}
      <div
        className="px-4 font-sans text-[34px] font-bold leading-[41px] tracking-[0.4px]"
        style={{ color: text }}
      >
        {title}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card) + row (52px)
// ─────────────────────────────────────────────────────────────
interface IOSListRowProps {
  title: string;
  detail?: string;
  icon?: string;
  chevron?: boolean;
  isLast?: boolean;
  dark?: boolean;
}

export const IOSListRow: React.FC<IOSListRowProps> = ({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false,
}) => {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  
  return (
    <div className="flex items-center min-h-[52px] px-4 relative font-sans text-[17px] tracking-[-0.43px]">
      {icon && (
        <div
          className="w-[30px] h-[30px] rounded-[7px] mr-3 flex-shrink-0"
          style={{ background: icon }}
        />
      )}
      <div className="flex-1" style={{ color: text }}>
        {title}
      </div>
      {detail && (
        <span className="mr-1.5" style={{ color: sec }}>
          {detail}
        </span>
      )}
      {chevron && (
        <svg width="8" height="14" viewBox="0 0 8 14" className="flex-shrink-0">
          <path d="M1 1l6 6-6 6" stroke={ter} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {!isLast && (
        <div
          className="absolute bottom-0 right-0 h-[0.5px]"
          style={{
            left: icon ? 58 : 16,
            backgroundColor: sep,
          }}
        />
      )}
    </div>
  );
};

interface IOSListProps {
  header?: string;
  children: React.ReactNode;
  dark?: boolean;
}

export const IOSList: React.FC<IOSListProps> = ({ header, children, dark = false }) => {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  
  return (
    <div>
      {header && (
        <div
          className="font-sans text-[13px] uppercase px-9 pt-2 pb-1.5 tracking-[-0.08px]"
          style={{ color: hc }}
        >
          {header}
        </div>
      )}
      <div className="rounded-[26px] mx-4 overflow-hidden" style={{ background: bg }}>
        {children}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
interface IOSKeyboardProps {
  dark?: boolean;
}

export const IOSKeyboard: React.FC<IOSKeyboardProps> = ({ dark = false }) => {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  const icons = {
    shift: (
      <svg width="19" height="17" viewBox="0 0 19 17" style={{ fill: glyph }}>
        <path d="M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z" />
      </svg>
    ),
    del: (
      <svg width="23" height="17" viewBox="0 0 23 17" className="stroke-current" style={{ color: glyph }}>
        <path d="M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M10 5l7 7M17 5l-7 7" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    ret: (
      <svg width="20" height="14" viewBox="0 0 20 14" className="stroke-white">
        <path d="M18 1v6H4m0 0l4-4M4 7l4 4" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  const renderKey = (
    content: React.ReactNode,
    options: { w?: number; flex?: boolean; ret?: boolean; fs?: number; k: string }
  ) => (
    <div
      key={options.k}
      className={`h-[42px] rounded-[8.5px] shadow-[0_1px_0_rgba(0,0,0,0.075)] flex items-center justify-center select-none`}
      style={{
        flex: options.flex ? 1 : undefined,
        width: options.w,
        minWidth: 0,
        backgroundColor: options.ret ? '#08f' : keyBg,
        fontFamily: '-apple-system, "SF Compact", system-ui',
        fontSize: options.fs ?? 25,
        fontWeight: 458,
        color: options.ret ? '#fff' : glyph,
      }}
    >
      {content}
    </div>
  );

  const renderRow = (keys: string[], pad = 0) => (
    <div className="flex gap-[6.5px] justify-center" style={{ padding: `0 ${pad}px` }}>
      {keys.map((l) => renderKey(l, { flex: true, k: l }))}
    </div>
  );

  return (
    <div
      className={`relative z-15 rounded-[27px] overflow-hidden pt-[11px] pb-0.5 flex flex-col items-center ${
        dark
          ? 'shadow-[0_-2px_20px_rgba(0,0,0,0.09)]'
          : 'shadow-[0_-1px_6px_rgba(0,0,0,0.018),0_-3px_20px_rgba(0,0,0,0.012)]'
      }`}
    >
      <div
        className={`absolute inset-0 rounded-[27px] backdrop-blur-md saturate-[180%] ${
          dark ? 'bg-[rgba(120,120,128,0.14)]' : 'bg-white/25'
        }`}
      />
      <div
        className={`absolute inset-0 rounded-[27px] border pointer-events-none ${
          dark
            ? 'shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.15)] border-white/15'
            : 'shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.7),inset_-1px_-1px_1px_rgba(255,255,255,0.4)] border-black/6'
        }`}
      />

      {/* autocorrect bar */}
      <div className="flex gap-5 items-center px-[22px] pt-2 pb-[13px] w-full box-border relative">
        {['"The"', 'the', 'to'].map((word, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="w-[1px] h-[25px] bg-gray-300/30" />}
            <div
              className="flex-1 text-center font-sans text-[17px] tracking-[-0.43px] leading-[22px]"
              style={{ color: sugg }}
            >
              {word}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* key layout */}
      <div className="flex flex-col gap-3 px-[6.5px] w-full box-border relative">
        {renderRow(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'])}
        {renderRow(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20)}
        <div className="flex gap-[14.25px] items-center">
          {renderKey(icons.shift, { w: 45, k: 'shift' })}
          <div className="flex gap-[6.5px] flex-1">
            {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map((l) => renderKey(l, { flex: true, k: l }))}
          </div>
          {renderKey(icons.del, { w: 45, k: 'del' })}
        </div>
        <div className="flex gap-1.5 items-center">
          {renderKey('ABC', { w: 92.25, fs: 18, k: 'abc' })}
          {renderKey('', { flex: true, k: 'space' })}
          {renderKey(icons.ret, { w: 92.25, ret: true, k: 'ret' })}
        </div>
      </div>

      {/* bottom spacer */}
      <div className="h-14 w-full relative" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
interface IOSDeviceProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  dark?: boolean;
  title?: string;
  keyboard?: boolean;
}

export const IOSDevice: React.FC<IOSDeviceProps> = ({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false,
}) => {
  return (
    <div
      className={`rounded-[48px] overflow-hidden relative shadow-[0_40px_80px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.12)] font-sans antialiased select-none`}
      style={{
        width,
        height,
        backgroundColor: dark ? '#000' : '#F2F2F7',
      }}
    >
      {/* dynamic island */}
      <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] rounded-3xl bg-black z-50" />
      
      {/* status bar (absolute) */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <IOSStatusBar dark={dark} />
      </div>
      
      {/* nav + content */}
      <div className="h-full flex flex-col">
        {title !== undefined && <IOSNavBar title={title} dark={dark} />}
        <div className="flex-1 overflow-auto">{children}</div>
        {keyboard && <IOSKeyboard dark={dark} />}
      </div>
      
      {/* home indicator */}
      <div className="absolute bottom-0 left-0 right-0 z-[60] h-[34px] flex justify-center items-end pb-2 pointer-events-none">
        <div
          className="width-[139px] w-[139px] h-1.2 rounded-full"
          style={{
            backgroundColor: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)',
          }}
        />
      </div>
    </div>
  );
};
