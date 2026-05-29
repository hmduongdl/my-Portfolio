import React, { useState, useEffect } from 'react';
import type { Project, ToolDetails } from '../types/project';
import { useOSStore } from '../store/useOSStore';

interface ToolProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ToolProjectDetail: React.FC<ToolProjectDetailProps> = ({ project, onBack }) => {
  const language = useOSStore((s) => s.language);
  const isVn = language === 'vn';
  const details: ToolDetails = project.toolDetails || {};

  // Terminal Typewriter Effect State
  const [typedCommand, setTypedCommand] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const fullCommand = details.terminalDemo?.command || '';

  useEffect(() => {
    if (!fullCommand) {
      setShowOutput(true);
      return;
    }
    
    let currentIndex = 0;
    setShowOutput(false);
    setTypedCommand('');
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullCommand.length) {
        setTypedCommand(fullCommand.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setShowOutput(true), 400); // Small pause before showing output
      }
    }, 50); // Typing speed

    return () => clearInterval(typingInterval);
  }, [fullCommand]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const getStatusColor = (status?: string) => {
    const s = status?.toLowerCase();
    if (s === 'stable' || s === 'live') return 'text-green-500 border-green-500/30 bg-green-500/10';
    if (s === 'beta' || s === 'in-progress') return 'text-amber-500 border-amber-500/30 bg-amber-500/10';
    if (s === 'deprecated') return 'text-red-500 border-red-500/30 bg-red-500/10';
    return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
  };

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
            <div className="text-[11px] font-bold text-[#FF9800] uppercase tracking-widest mb-3">
              {project.category === 'tools' ? (isVn ? 'Công cụ CLI & Tự động hoá' : 'CLI TOOL / AUTOMATION') : project.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-mono leading-tight mb-2 text-white">
              {project.name}
            </h1>
            <p className="text-[15px] text-white/60 font-medium font-mono">
              {project.desc}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#FF9800] hover:bg-[#ffb74d] text-[#050914] px-5 py-2.5 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <i className="devicon-github-original text-[18px]"></i>
                {isVn ? 'Mã nguồn' : 'GitHub Repo'}
              </a>
            )}
            {details.version && (
              <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] font-bold text-[#FF9800]">
                {details.version}
              </div>
            )}
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
            <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 font-semibold">{isVn ? 'Trạng thái' : 'Status'}</div>
            <div className={`inline-block px-2 py-0.5 rounded border text-[12px] font-bold capitalize ${getStatusColor(project.status)}`}>
              {project.status || 'Stable'}
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 font-semibold">{isVn ? 'Nền tảng' : 'Platform'}</div>
            <div className="text-[14px] font-bold text-white/90 line-clamp-1" title={details.platforms?.join(' · ')}>
              {details.platforms?.join(' · ') || '-'}
            </div>
          </div>
        </div>
      </div>

      {/* TERMINAL DEMO BLOCK */}
      <div className="max-w-4xl mx-auto w-full px-6 py-12">
        <div className="rounded-xl overflow-hidden bg-[#03050a] border border-white/10 shadow-2xl">
          {/* Window Chrome */}
          <div className="px-4 py-3 flex items-center gap-2 bg-white/5 border-b border-white/10 relative">
            <div className="flex gap-1.5 z-10">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[12px] font-mono text-white/40">{project.name}</span>
            </div>
          </div>
          
          {/* Terminal Body */}
          <div className="p-6 font-mono text-[13px] leading-relaxed overflow-x-auto">
            {fullCommand && (
              <div className="flex items-start">
                <span className="text-green-500 mr-3">❯</span>
                <span className="text-white">{typedCommand}</span>
                {!showOutput && <span className="w-2 h-4 bg-white/70 animate-pulse ml-1 inline-block align-middle"></span>}
              </div>
            )}
            
            {showOutput && details.terminalDemo?.output?.map((line, i) => (
              <div key={i} className={`mt-2 ${line.type === 'error' ? 'text-red-400' : line.type === 'success' ? 'text-green-400' : 'text-white/70'}`}>
                {line.type === 'success' && <span className="mr-2">✓</span>}
                {line.type === 'error' && <span className="mr-2">✖</span>}
                {line.text}
              </div>
            ))}

            {showOutput && (
              <div className="flex items-start mt-2">
                <span className="text-green-500 mr-3">❯</span>
                <span className="w-2 h-4 bg-white/70 animate-pulse mt-1"></span>
              </div>
            )}
          </div>
        </div>

        {/* Copyable Install Command below terminal */}
        {details.installCmd && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-3 bg-[#0a1128] border border-white/10 rounded-full pl-5 pr-1.5 py-1.5">
              <span className="font-mono text-[13px] text-white/80 select-all">$ {details.installCmd}</span>
              <button 
                onClick={() => copyToClipboard(details.installCmd!)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#FF9800]/20 text-white/50 hover:text-[#FF9800] flex items-center justify-center transition-colors"
                title="Copy to clipboard"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SCREENSHOTS (If any) */}
      {details.screenshots && details.screenshots.length > 0 && (
        <div className="border-y border-white/5 bg-white/[0.01]">
          <div className="max-w-6xl mx-auto w-full px-6 py-12">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-6">{isVn ? 'Thực tế hoạt động' : 'In action'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {details.screenshots.map((shot, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="rounded-lg overflow-hidden border border-[#1a2342] shadow-lg">
                    <img src={shot.url} alt={shot.caption || 'Screenshot'} className="w-full h-auto object-cover bg-[#03050a]" />
                  </div>
                  {shot.caption && <p className="text-[13px] text-white/50 text-center">{shot.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-3xl mx-auto w-full px-6 py-16 space-y-16">
        
        {/* Why I built this */}
        {details.whyBuilt && (
          <section>
            <h2 className="text-xl font-bold mb-4 font-mono text-white flex items-center gap-2">
              <span className="text-[#FF9800]">#</span> {isVn ? 'Vì sao tôi tạo ra công cụ này?' : 'Why I built this'}
            </h2>
            <div className="text-[15px] leading-relaxed text-white/70 space-y-4">
              <p>{details.whyBuilt}</p>
            </div>
          </section>
        )}

        {/* How it works */}
        {details.howItWorks && details.howItWorks.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6 font-mono text-white flex items-center gap-2">
              <span className="text-[#FF9800]">#</span> {isVn ? 'Cách hoạt động' : 'How it works'}
            </h2>
            <div className="space-y-4">
              {details.howItWorks.map((step, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="w-8 h-8 rounded-full bg-[#FF9800]/10 text-[#FF9800] border border-[#FF9800]/20 flex items-center justify-center font-mono font-bold text-[13px] shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] text-white mb-1">{step.step}</h3>
                    <p className="text-[14px] text-white/60">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features Grid */}
        {project.features && project.features.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6 font-mono text-white flex items-center gap-2">
              <span className="text-[#FF9800]">#</span> {isVn ? 'Tính năng' : 'Features'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.features.map((f: any, i: number) => (
                <div key={i} className="p-5 rounded-xl border border-white/5 bg-white/[0.02] flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#FF9800] text-[20px] mt-0.5">verified</span>
                  <div>
                    <h3 className="font-bold text-[14px] text-white mb-1">{f.title}</h3>
                    <p className="text-[13px] text-white/60">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tech & Tools */}
        {project.techStack && project.techStack.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6 font-mono text-white flex items-center gap-2">
              <span className="text-[#FF9800]">#</span> {isVn ? 'Công nghệ' : 'Tech & tools'}
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech: any, i: number) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5">
                  <i className={`devicon-${tech.icon}-plain text-[#FF9800]`}></i>
                  <span className="text-[13px] font-medium text-white">{tech.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Installation & Usage Code Blocks */}
        {details.usageCmds && details.usageCmds.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6 font-mono text-white flex items-center gap-2">
              <span className="text-[#FF9800]">#</span> {isVn ? 'Sử dụng' : 'Usage'}
            </h2>
            <div className="space-y-6">
              {details.usageCmds.map((uc, i) => (
                <div key={i}>
                  <p className="text-[13px] text-white/60 mb-2 font-medium">{uc.desc}</p>
                  <div className="relative group">
                    <pre className="p-4 rounded-xl bg-[#0a1128] border border-[#1a2342] overflow-x-auto text-[13px] font-mono leading-relaxed">
                      <code className="text-white/90">{uc.cmd}</code>
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(uc.cmd)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/10 hover:bg-[#FF9800] text-white/60 hover:text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
