import React, { useState, useMemo, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { projectService } from '../services/projectService';
import type { ProjectCategory, Project } from '../types/project';
import { ProjectDetail } from './ProjectDetail';
import { DesignProjectDetail } from './DesignProjectDetail';
import { ToolProjectDetail } from './ToolProjectDetail';

type TabId = 'all' | ProjectCategory;

const TABS: { id: TabId; label: string; labelVN: string }[] = [
  { id: 'all', label: 'All', labelVN: 'Tất cả' },
  { id: 'web', label: 'Code', labelVN: 'Lập trình' },
  { id: 'design', label: 'Design', labelVN: 'Thiết kế' },
  { id: 'tools', label: 'Tools', labelVN: 'Công cụ' },
];

export const ProjectsApp: React.FC = () => {
  const language = useOSStore((s) => s.language);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | number | null>(null);

  const loadProjects = () => {
    setIsLoading(true);
    setError(null);
    projectService
      .getProjects(language)
      .then((items) => {
        if (!items || items.length === 0) {
          throw new Error(language === 'vn' ? 'Không có dự án nào từ API' : 'No projects available from API');
        }
        setProjects(items);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load projects'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProjects();

    const handleProjectsUpdated = () => {
      loadProjects();
    };

    window.addEventListener('projects-updated', handleProjectsUpdated);
    return () => {
      window.removeEventListener('projects-updated', handleProjectsUpdated);
    };
  }, [language]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return projects.filter((p) => {
      if (activeTab !== 'all' && p.category !== activeTab) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [projects, activeTab, searchQuery]);

  const ErrorPane: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-ink-3">
      <div className="text-3xl">⚠️</div>
      <div className="text-sm text-red-500">{error}</div>
      <button
        onClick={loadProjects}
        className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-[12px] font-medium hover:bg-blue-600 active:scale-95 transition-all cursor-pointer"
      >
        Thử lại
      </button>
    </div>
  );

  if (selectedProjectId) {
    const selectedProject = projects.find(p => String(p.id) === String(selectedProjectId));
    if (selectedProject) {
      if (selectedProject.category === 'design') {
        return <DesignProjectDetail project={selectedProject} onBack={() => setSelectedProjectId(null)} />;
      }
      if (selectedProject.category === 'tools') {
        return <ToolProjectDetail project={selectedProject} onBack={() => setSelectedProjectId(null)} />;
      }
      return <ProjectDetail project={selectedProject} onBack={() => setSelectedProjectId(null)} />;
    }
  }

  return (
    <div className="h-full flex flex-col select-text bg-paper">
      {/* Toolbar */}
      <div className="px-4 pt-3 pb-2.5 flex items-center justify-between gap-4 border-b border-rule bg-paper-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
        <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {TABS.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-1.5 text-[12px] font-medium rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap border ${
                  isActive
                    ? 'bg-primary text-white border-primary'
                    : 'bg-transparent text-ink-2 border-rule hover:border-ink-3 hover:text-ink'
                }`}
              >
                {language === 'vn' ? t.labelVN : t.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-44 flex-shrink-0">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
            width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'vn' ? 'Tìm kiếm...' : 'Search...'}
            className="pl-8 pr-3 py-1.5 text-[12px] bg-black/5 dark:bg-white/6 border border-rule rounded-lg outline-none focus:ring-1 focus:ring-primary/40 text-ink w-full placeholder:text-ink-3 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-5 overflow-auto">
        {isLoading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="bg-paper-2 border border-rule rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] animate-pulse">
                <div className="h-[76px] bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-5/6 rounded-md bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorPane />
        ) : filtered.length === 0 ? (
          <div className="h-full flex items-center justify-center text-ink-3 text-sm">
            {language === 'vn' ? 'Không tìm thấy dự án nào.' : 'No projects found.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
            {filtered.map((p, index) => {
              const isFeatured = index === 0;
              const cardClass = `group relative bg-[#0a1128] border border-white/10 rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-[3px] flex ${isFeatured ? 'flex-col md:flex-row md:col-span-full' : 'flex-col'} h-full cursor-pointer`;

              // ----- DESIGN CARD VARIANT -----
              if (p.category === 'design') {
                return (
                  <div key={p.id} onClick={() => setSelectedProjectId(p.id)} className={cardClass}>
                    {/* Visual Preview Area */}
                    <div className={`${isFeatured ? 'w-full md:w-[50%] md:aspect-auto' : 'w-full aspect-[4/3]'} bg-[#111a3a] relative overflow-hidden flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/10`}>
                      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white px-2.5 py-1 text-[10px] font-semibold rounded-full z-10 border border-white/10">
                        {p.tags[0] || 'UI Design'}
                      </div>
                      
                      <div className="w-full h-full min-h-[160px] bg-gradient-to-tr from-[#1a2342] to-[#252f52] rounded-lg border border-white/5 flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]">
                        <div className="w-1/2 h-1/2 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center opacity-50">
                          <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>

                      <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#7B61FF] border border-white/20"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-[#ff7b93] border border-white/20"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-[#ffc371] border border-white/20"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-[#36d1dc] border border-white/20"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-[#ffffff] border border-white/20"></div>
                      </div>
                    </div>

                    {/* Content area */}
                    <div className={`p-5 flex flex-col gap-3 flex-1 ${isFeatured ? 'justify-center md:p-8' : ''}`}>
                      <div>
                        <div className="text-[10px] font-bold text-[#7B61FF] uppercase tracking-widest mb-1.5">
                          {p.category === 'design' ? 'UI/UX' : 'BRAND IDENTITY'}
                        </div>
                        <div className={`${isFeatured ? 'text-2xl' : 'text-lg'} font-bold text-white leading-tight truncate`}>{p.name}</div>
                      </div>
                      <div className="text-[13px] text-white/60 leading-relaxed line-clamp-2 flex-1">{p.desc}</div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.tags.map((tag) => (
                          <span key={tag} className="bg-[#7B61FF]/10 text-[#a390ff] px-2.5 py-0.5 text-[10px] rounded-full font-medium border border-[#7B61FF]/20">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="w-full h-px bg-white/10 my-1"></div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {(p.demoUrl || p.githubUrl) && (
                            <a href={p.demoUrl || p.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] font-medium text-[#7B61FF] hover:text-[#9b85ff] transition-colors">
                              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                              View on Behance
                            </a>
                          )}
                        </div>
                        <span className="text-[11px] text-white/40">2026</span>
                      </div>
                    </div>
                  </div>
                );
              }

              // ----- TOOLS CARD VARIANT -----
              if (p.category === 'tools') {
                return (
                  <div key={p.id} onClick={() => setSelectedProjectId(p.id)} className={cardClass}>
                    {/* Terminal Preview Area */}
                    <div className={`${isFeatured ? 'w-full md:w-[50%]' : ''} bg-[#03050a] flex flex-col flex-shrink-0 relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5`}>
                      <div className="px-3 py-2 flex items-center border-b border-white/5 bg-[#03050a]">
                        <div className="flex gap-1.5 flex-shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                        </div>
                        <div className="flex-1 text-center text-[10px] text-white/40 font-mono pr-5 truncate">
                          ~/{p.name.toLowerCase().replace(/\s+/g, '-')}
                        </div>
                      </div>
                      <div className="flex-1 p-4 text-[12px] font-mono text-white/70 leading-relaxed overflow-hidden">
                        <div className="flex items-start">
                          <span className="text-[#F59E0B] mr-2 shrink-0">$</span>
                          <span className="text-white">run {p.name.toLowerCase().replace(/\s+/g, '-')} --sync</span>
                        </div>
                        <div className="flex mt-1 text-[#27c93f]">
                          <span className="mr-2">✓</span>
                          <span>Execution completed successfully</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="text-[#F59E0B] mr-2 shrink-0">$</span>
                          <span className="w-1.5 h-4 bg-white/70 animate-pulse group-hover:animate-ping"></span>
                        </div>
                      </div>
                    </div>

                    {/* Content area */}
                    <div className={`p-5 flex flex-col gap-3 flex-1 ${isFeatured ? 'justify-center md:p-8' : ''}`}>
                      <div>
                        <div className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1.5">
                          AUTOMATION TOOL
                        </div>
                        <div className={`${isFeatured ? 'text-2xl' : 'text-lg'} font-bold text-white leading-tight truncate`}>{p.name}</div>
                      </div>
                      <div className="text-[13px] text-white/60 leading-relaxed line-clamp-2 flex-1">{p.desc}</div>

                      <div className="flex flex-wrap gap-2 mt-1">
                        {p.tags.slice(0, 3).map((tag, idx) => (
                          <span key={tag} className="border border-white/20 text-white/70 px-2.5 py-0.5 text-[10px] rounded-full font-medium">
                            {idx === 0 ? 'CronJob scheduled' : idx === 1 ? 'Auto-retry' : 'Cross-platform'}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-2">
                        <div className="bg-white/5 rounded-md px-2 py-1 text-[9px] text-white/50 font-medium">v1.2 / Stable</div>
                        <div className="bg-white/5 rounded-md px-2 py-1 text-[9px] text-white/50 font-medium">Solo / Open source</div>
                      </div>

                      <div className="w-full h-px bg-white/10 my-1"></div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {(p.githubUrl || p.demoUrl) && (
                            <a href={p.githubUrl || p.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] font-medium text-[#F59E0B] hover:text-[#fbbf24] transition-colors">
                              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                              GitHub
                            </a>
                          )}
                        </div>
                        <span className="bg-[#27c93f]/20 text-[#27c93f] px-2.5 py-0.5 rounded-full text-[10px] font-bold">Stable</span>
                      </div>
                    </div>
                  </div>
                );
              }

              // ----- DEFAULT / CODE CARD VARIANT -----
              return (
                <div key={p.id} onClick={() => setSelectedProjectId(p.id)} className={cardClass}>
                  {/* Preview area (Terminal style) */}
                  <div className={`${isFeatured ? 'w-full md:w-[50%]' : 'h-[160px]'} bg-[#050914] flex flex-col flex-shrink-0 relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5`}>
                    <div className="px-3 py-2 flex items-center justify-between border-b border-white/5 bg-[#050914]">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                      </div>
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{p.tags[0] || 'CODE'}</span>
                    </div>
                    <div className="flex-1 p-4 text-[12px] font-mono text-white/80 overflow-hidden leading-relaxed">
                      <div className="flex">
                        <span className="text-[#c678dd]">const</span>
                        <span className="text-[#61afef] ml-2">{p.name.replace(/[\s-]/g, '')}</span>
                        <span className="text-[#56b6c2] ml-2">=</span>
                        <span className="text-[#e5c07b] ml-2">()</span>
                        <span className="text-[#c678dd] ml-2">{'=>'}</span>
                        <span className="text-white ml-2">{'{'}</span>
                      </div>
                      <div className="ml-5 flex mt-1">
                        <span className="text-[#c678dd]">return</span>
                        <span className="text-[#98c379] ml-2 truncate">"{p.desc}"</span>;
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-white">{'}'}</span>
                        <span className="w-1.5 h-4 bg-[#64FFDA] ml-1.5 animate-pulse"></span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Content area */}
                  <div className={`p-5 flex flex-col gap-3 flex-1 ${isFeatured ? 'justify-center md:p-8' : ''}`}>
                    <div>
                      <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">{p.category}</div>
                      <div className={`${isFeatured ? 'text-2xl' : 'text-lg'} font-bold text-white leading-tight line-clamp-2`}>{p.name}</div>
                    </div>
                    <div className="text-[13px] text-white/60 leading-relaxed line-clamp-2 flex-1">{p.desc}</div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {p.tags.map((tag) => (
                        <span key={tag} className="border border-white/20 text-white/70 px-2.5 py-0.5 text-[10px] rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="w-full h-px bg-white/10 my-1"></div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {p.githubUrl && (
                          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] font-medium text-[#64FFDA] hover:text-[#88ffeb] transition-colors">
                            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                            GitHub
                          </a>
                        )}
                        {p.demoUrl && (
                          <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] font-medium text-[#64FFDA] hover:text-[#88ffeb] transition-colors">
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            Live demo
                          </a>
                        )}
                      </div>
                      <span className="text-[11px] text-white/40">2026</span>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
        )}
      </div>
    </div>
  );
};
