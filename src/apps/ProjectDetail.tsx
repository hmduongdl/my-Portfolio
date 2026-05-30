import React from 'react';
import { ArrowLeft, Code2, ExternalLink, Play } from 'lucide-react';
import type { Project } from '../types/project';
import { useOSStore } from '../store/useOSStore';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const language = useOSStore((s) => s.language);
  const isVn = language === 'vn';

  return (
    <div className="h-full flex flex-col bg-[#050914] text-white overflow-y-auto overflow-x-hidden custom-scrollbar relative animate-fade-in">
      {/* HEADER SECTION */}
      <div className="pt-8 px-6 pb-6 max-w-6xl mx-auto w-full">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[13px] font-semibold mb-6 group w-fit"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {isVn ? 'Tất cả dự án' : 'All projects'}
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="text-[11px] font-bold text-[#64FFDA] uppercase tracking-widest mb-3">
              {project.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 text-white">
              {project.name}
            </h1>
            <p className="text-[15px] text-white/60 leading-relaxed max-w-2xl">
              {project.desc}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            {project.demoUrl && (
              <a 
                href={project.demoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#64FFDA] hover:bg-[#88ffeb] text-[#050914] px-5 py-2.5 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink size={18} />
                {isVn ? 'Xem thực tế' : 'View Live Demo'}
              </a>
            )}
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Code2 size={18} />
                {isVn ? 'Mã nguồn' : 'GitHub Code'}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* META INFO ROW */}
      <div className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          <div className="p-4 md:p-6">
            <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 font-semibold">{isVn ? 'Thời gian' : 'Duration'}</div>
            <div className="text-[14px] font-bold text-white/90">{project.duration || '2026'}</div>
          </div>
          <div className="p-4 md:p-6">
            <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 font-semibold">{isVn ? 'Vai trò' : 'Role'}</div>
            <div className="text-[14px] font-bold text-white/90">{project.role || 'Solo developer'}</div>
          </div>
          <div className="p-4 md:p-6">
            <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 font-semibold">{isVn ? 'Trạng thái' : 'Status'}</div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${project.status === 'live' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : project.status === 'in-progress' ? 'bg-amber-500' : 'bg-gray-500'}`}></div>
              <span className="text-[14px] font-bold text-white/90 capitalize">{project.status || 'Live'}</span>
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 font-semibold">{isVn ? 'Loại hình' : 'Type'}</div>
            <div className="text-[14px] font-bold text-white/90">{project.type || 'Personal project'}</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT (60/40) */}
      <div className="max-w-6xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* LEFT COLUMN (60%) */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* About */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-[#64FFDA]">01.</span> {isVn ? 'Về dự án này' : 'About this project'}
            </h2>
            <div className="text-[14px] leading-relaxed text-white/70 space-y-4">
              <p>{project.desc}</p>
            </div>
          </section>

          {/* Key Features */}
          {(project.features || []).length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="text-[#64FFDA]">02.</span> {isVn ? 'Tính năng chính' : 'Key Features'}
              </h2>
              <div className="grid gap-4">
                {project.features?.map((f: any, i: number) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:bg-white/[0.05] transition-colors">
                    <h3 className="text-[15px] font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-[13px] text-white/60 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {project.achievement && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-[#64FFDA]">03.</span> {isVn ? 'Thành tựu' : 'Key Achievement'}
              </h2>
              <div className="border-l-2 border-[#64FFDA] pl-5 py-2">
                <p className="text-[15px] italic text-white/80 leading-relaxed">
                  "{project.achievement}"
                </p>
              </div>
            </section>
          )}

        </div>

        {/* RIGHT COLUMN (40%) */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-8">
            
            {/* Tech Stack List */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
              <h3 className="text-[14px] font-bold uppercase tracking-widest text-white/50 mb-5">
                Tech Stack
              </h3>
              <div className="space-y-4">
                {project.techStack?.length > 0 ? project.techStack.map((tech: any, i: number) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#64FFDA]/50 transition-colors">
                        <i className={`devicon-${tech.icon}-plain text-[18px] text-white/70 group-hover:text-[#64FFDA] transition-colors`}></i>
                      </div>
                      <span className="text-[14px] font-medium text-white/90">{tech.name}</span>
                    </div>
                    <span className="text-[11px] text-white/30 uppercase tracking-wider">{tech.category}</span>
                  </div>
                )) : project.tags?.map((tag: string, i: number) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#64FFDA]/50 transition-colors">
                        <Code2 size={16} className="text-white/70 group-hover:text-[#64FFDA] transition-colors" />
                      </div>
                      <span className="text-[14px] font-medium text-white/90">{tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Embed / Demo placeholder */}
            <div className="aspect-video bg-gradient-to-br from-[#1a2342] to-[#0a1128] rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden relative group">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              {project.demoUrl ? (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="z-10 flex flex-col items-center gap-3 cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-[#64FFDA] text-[#050914] flex items-center justify-center shadow-[0_0_20px_rgba(100,255,218,0.4)] group-hover:scale-110 transition-transform">
                    <Play size={24} className="ml-1" fill="currentColor" />
                  </div>
                  <span className="text-[12px] font-bold text-white uppercase tracking-wider">{isVn ? 'Xem dự án' : 'View Project'}</span>
                </a>
              ) : (
                <div className="text-white/20 text-[12px] font-mono">No visual preview</div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
