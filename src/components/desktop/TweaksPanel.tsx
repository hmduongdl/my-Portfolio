import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TweakSectionProps {
  title: string;
  children: React.ReactNode;
}

export const TweakSection: React.FC<TweakSectionProps> = ({ title, children }) => {
  return (
    <>
      <div className="text-[10px] font-bold tracking-wider uppercase text-ink-3/70 mt-3.5 first:mt-0 pt-2 border-t border-rule/50 first:border-t-0 first:pt-0">
        {title}
      </div>
      {children}
    </>
  );
};

interface TweakRowProps {
  label: string;
  value?: string | number;
  children: React.ReactNode;
  inline?: boolean;
}

const TweakRow: React.FC<TweakRowProps> = ({ label, value, children, inline = false }) => {
  return (
    <div className={`flex ${inline ? 'flex-row items-center justify-between gap-2.5' : 'flex-col gap-1.5'}`}>
      <div className="flex justify-between items-baseline text-[12px] text-ink-2/90 font-medium">
        <span>{label}</span>
        {value !== undefined && <span className="text-ink-4 tabular-nums font-normal">{value}</span>}
      </div>
      {children}
    </div>
  );
};

interface TweakSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

export const TweakSlider: React.FC<TweakSliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange,
}) => {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 my-1.5 bg-black/12 rounded-full appearance-none outline-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black/12 [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.2)] [&::-webkit-slider-thumb]:appearance-none"
      />
    </TweakRow>
  );
};

interface TweakToggleProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export const TweakToggle: React.FC<TweakToggleProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-row items-center justify-between gap-2.5 py-0.5">
      <div className="text-[12px] text-ink-2/90 font-medium">{label}</div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-8 h-4.5 rounded-full border-none transition-colors duration-150 cursor-pointer ${
          value ? 'bg-[#34c759]' : 'bg-black/15'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-transform duration-150 ${
            value ? 'translate-x-3.5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

interface TweakRadioProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: any) => void;
}

export const TweakRadio: React.FC<TweakRadioProps> = ({ label, value, options, onChange }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const n = options.length;

  const segAt = (clientX: number) => {
    if (!trackRef.current) return value;
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    const clampIdx = Math.max(0, Math.min(n - 1, i));
    return options[clampIdx].value;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== value) onChange(v0);
    
    const move = (ev: PointerEvent) => {
      const v = segAt(ev.clientX);
      if (v !== value) onChange(v);
    };
    
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div
        ref={trackRef}
        role="radiogroup"
        onPointerDown={handlePointerDown}
        className={`relative flex p-0.5 rounded-lg bg-black/5 select-none ${
          dragging ? 'cursor-grabbing' : 'cursor-pointer'
        }`}
      >
        {/* Slidable Segmented Thumb */}
        <div
          className="absolute top-0.5 bottom-0.5 rounded-md bg-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-all duration-150 ease-calm"
          style={{
            left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
            width: `calc((100% - 4px) / ${n})`,
          }}
        />
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            className="relative z-[1] flex-1 border-none bg-transparent text-ink text-[11px] font-medium min-h-[22px] rounded-md cursor-pointer px-1.5 py-1 line-height-[1.2] whitespace-nowrap overflow-hidden text-center text-ellipsis"
          >
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
};

interface TweaksPanelProps {
  title?: string;
  children: React.ReactNode;
}

export const TweaksPanel: React.FC<TweaksPanelProps> = ({ title = 'Tweaks', children }) => {
  const [open, setOpen] = useState<boolean>(true);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth;
    const h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  useEffect(() => {
    if (!open) return;
    clampToViewport();
    
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  const handleDragStart = (e: React.MouseEvent) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX;
    const sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    
    const move = (ev: MouseEvent) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) {
    // Render a small floating gear button to re-open the tweaks panel
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-black/10 shadow-[0_4px_12px_rgba(0,0,0,0.12)] flex items-center justify-center text-ink hover:bg-white z-[2000] cursor-pointer"
        title="Open Settings Tweaks"
      >
        ⚙️
      </button>
    );
  }

  return (
    <div
      ref={dragRef}
      className="fixed z-[2147483646] w-[280px] max-h-[calc(100vh-32px)] flex flex-col bg-white/75 text-ink-2 backdrop-blur-mac-dropdown border border-white/60 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_40px_rgba(0,0,0,0.18)] select-none font-sans overflow-hidden transition-all"
      style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}
    >
      {/* Tweaks Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 cursor-move" onMouseDown={handleDragStart}>
        <b className="text-[12px] font-semibold tracking-wide text-ink">{title}</b>
        <button
          className="appearance-none border-none bg-transparent text-ink-3 hover:bg-black/5 hover:text-ink w-[22px] h-[22px] rounded-md flex items-center justify-center cursor-pointer text-[12px] line-height-none transition-colors"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
      </div>

      {/* Tweaks List */}
      <div className="px-3.5 pb-4.5 flex flex-col gap-3 overflow-y-auto min-h-0 text-[11.5px] leading-[1.4] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-black/15 [&::-webkit-scrollbar-thumb]:rounded-full">
        {children}
      </div>
    </div>
  );
};
