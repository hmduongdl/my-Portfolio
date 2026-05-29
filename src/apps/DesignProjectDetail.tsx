import React, { useState, useRef, useEffect } from 'react';
import type { Project, DesignDetails } from '../types/project';
import { useOSStore } from '../store/useOSStore';

interface DesignProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const DesignProjectDetail: React.FC<DesignProjectDetailProps> = ({ project, onBack }) => {
  const language = useOSStore((s) => s.language);
  const isVn = language === 'vn';
  const details: DesignDetails = project.designDetails || {};

  // Slider State
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Lightbox State
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as MouseEvent).clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <div className="h-full flex flex-col bg-[#050914] text-white overflow-y-auto overflow-x-hidden custom-scrollbar relative animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="pt-8 px-6 pb-6 max-w-6xl mx-auto w-full">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[13px] font-semibold mb-6 group w-fit"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          {isVn ? 'Tất cả dự án' : 'All projects'}
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="text-[11px] font-bold text-[#9C27B0] uppercase tracking-widest mb-3">
              {project.category === 'design' ? (isVn ? 'Nhận diện thương hiệu' : 'Brand Identity') : project.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2 text-white">
              {project.name}
            </h1>
            {details.client && (
              <p className="text-[14px] text-white/50 font-medium">
                Client: {details.client}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {project.demoUrl && (
              <a 
                href={project.demoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#9C27B0] hover:bg-[#b83bcc] text-white px-5 py-2.5 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                {isVn ? 'Xem Case Study' : 'View full case study'}
              </a>
            )}
            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] font-bold text-white/70">
              {project.duration || '2024'}
            </div>
          </div>
        </div>
      </div>

      {/* META INFO ROW */}
      <div className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          <div className="p-4 md:p-6">
            <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 font-semibold">{isVn ? 'Thời gian' : 'Duration'}</div>
            <div className="text-[14px] font-bold text-white/90">{project.duration || '-'}</div>
          </div>
          <div className="p-4 md:p-6">
            <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 font-semibold">{isVn ? 'Vai trò' : 'Role'}</div>
            <div className="text-[14px] font-bold text-white/90">{project.role || '-'}</div>
          </div>
          <div className="p-4 md:p-6">
            <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 font-semibold">{isVn ? 'Hạng mục' : 'Deliverables'}</div>
            <div className="text-[14px] font-bold text-white/90 line-clamp-1" title={details.deliverables?.join(', ')}>
              {details.deliverables?.join(', ') || '-'}
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 font-semibold">{isVn ? 'Công cụ' : 'Tools used'}</div>
            <div className="text-[14px] font-bold text-white/90 line-clamp-1" title={details.tools?.join(', ')}>
              {details.tools?.join(' · ') || '-'}
            </div>
          </div>
        </div>
      </div>

      {/* BEFORE/AFTER SLIDER */}
      {details.beforeAfter?.beforeImg && details.beforeAfter?.afterImg && (
        <div className="max-w-6xl mx-auto w-full px-6 py-12">
          <div 
            ref={sliderRef}
            className="relative w-full aspect-video rounded-xl overflow-hidden select-none bg-black cursor-ew-resize border border-white/10"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            {/* Before Image (Base) */}
            <img src={details.beforeAfter.beforeImg} alt="Before" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold tracking-widest uppercase border border-white/10">Before</div>
            
            {/* After Image (Clipped) */}
            <div 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <img src={details.beforeAfter.afterImg} alt="After" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
              <div className="absolute top-4 right-4 bg-[#9C27B0] px-3 py-1 rounded-full text-white text-[11px] font-bold tracking-widest uppercase shadow-lg">After</div>
            </div>

            {/* Slider Divider */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none z-10"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-[#9C27B0]/20 pointer-events-auto">
                <span className="material-symbols-outlined text-[#050914] text-[20px] select-none">swap_horiz</span>
              </div>
            </div>
          </div>
          {details.beforeAfter.caption && (
            <p className="text-center text-[13px] text-white/50 mt-4 italic">{details.beforeAfter.caption}</p>
          )}
        </div>
      )}

      {/* DESIGN ASSETS GALLERY */}
      {details.gallery && details.gallery.length > 0 && (
        <div className="max-w-6xl mx-auto w-full px-6 py-6">
          <div className="columns-1 sm:columns-2 gap-6 space-y-6">
            {details.gallery.map((asset, i) => (
              <div key={i} className="break-inside-avoid relative group cursor-zoom-in" onClick={() => setLightboxImage(asset.url)}>
                <img 
                  src={asset.url} 
                  alt={asset.caption || 'Design asset'} 
                  className="w-full h-auto rounded-xl border border-white/10 group-hover:border-white/30 transition-colors"
                />
                {asset.caption && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-[12px] font-medium">{asset.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-3xl mx-auto w-full px-6 py-12 space-y-16">
        
        {/* The Brief */}
        {details.brief && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#9C27B0]/20 text-[#9C27B0] flex items-center justify-center text-[14px]">1</span>
              {isVn ? 'Bài toán thiết kế' : 'The brief'}
            </h2>
            <div className="text-[15px] leading-relaxed text-white/70 space-y-4">
              <p>{details.brief}</p>
            </div>
          </section>
        )}

        {/* Design Process */}
        {details.process && details.process.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#9C27B0]/20 text-[#9C27B0] flex items-center justify-center text-[14px]">2</span>
              {isVn ? 'Quy trình thực hiện' : 'Design process'}
            </h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {details.process.map((step, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#9C27B0] bg-[#050914] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="text-[12px] font-bold">{i + 1}</span>
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-5 rounded-xl bg-white/[0.03] border border-white/5">
                    <h3 className="font-bold text-white mb-2 text-[15px]">{step.step}</h3>
                    <p className="text-[14px] text-white/60 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Outcome */}
        {details.outcome && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#9C27B0]/20 text-[#9C27B0] flex items-center justify-center text-[14px]">3</span>
              {isVn ? 'Kết quả' : 'Outcome'}
            </h2>
            <div className="bg-[#9C27B0]/5 border border-[#9C27B0]/20 rounded-2xl p-6 md:p-8">
              <p className="text-[16px] italic leading-relaxed text-white/80">
                "{details.outcome}"
              </p>
            </div>
          </section>
        )}

        {/* Tools & Deliverables */}
        {(details.tools?.length || details.deliverables?.length) ? (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#9C27B0]/20 text-[#9C27B0] flex items-center justify-center text-[14px]">4</span>
              {isVn ? 'Công cụ & Hạng mục' : 'Tools & Deliverables'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {details.tools && details.tools.length > 0 && (
                <div>
                  <h3 className="text-[13px] font-bold uppercase tracking-widest text-white/40 mb-4">{isVn ? 'Công cụ' : 'Tools'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.tools.map((tool, i) => (
                      <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[13px] font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {details.deliverables && details.deliverables.length > 0 && (
                <div>
                  <h3 className="text-[13px] font-bold uppercase tracking-widest text-white/40 mb-4">{isVn ? 'Hạng mục bàn giao' : 'Deliverables'}</h3>
                  <ul className="space-y-2">
                    {details.deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[14px] text-white/70">
                        <span className="material-symbols-outlined text-[#9C27B0] text-[18px]">check_circle</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        ) : null}

      </div>

      {/* LIGHTBOX */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <img src={lightboxImage} alt="Expanded" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
        </div>
      )}

    </div>
  );
};
