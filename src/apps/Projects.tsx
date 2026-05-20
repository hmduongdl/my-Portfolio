import React, { useState, useMemo, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { projectService } from '../services/projectService';
import type { ProjectCategory, Project } from '../types/project';

type TabId = 'all' | ProjectCategory;

const TABS: { id: TabId; label: string; labelVN: string }[] = [
  { id: 'all', label: 'All Projects', labelVN: 'Tất cả' },
  { id: 'web', label: 'Web Apps', labelVN: 'Lập trình' },
  { id: 'design', label: '2D Graphic Designs', labelVN: 'Thiết kế' },
  { id: 'tools', label: 'Utilities & Tools', labelVN: 'Công cụ' },
];

export const ProjectsApp: React.FC = () => {
  const language = useOSStore((s) => s.language);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="h-full flex flex-col select-text bg-paper">
      {/* Toolbar */}
      <div className="px-4 pt-3 pb-2.5 flex items-center gap-2 border-b border-rule bg-paper-2 flex-shrink-0">
        <div className="flex gap-1 flex-1 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1 text-[12.5px] font-medium border-none rounded-md cursor-pointer transition-colors duration-150 whitespace-nowrap ${activeTab === t.id
                  ? 'bg-primary text-white'
                  : 'text-ink-2 hover:bg-black/5 dark:hover:bg-white/8 bg-transparent'
                }`}
            >
              {language === 'vn' ? t.labelVN : t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-shrink-0">
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
            className="pl-8 pr-3 py-1 text-[12px] bg-black/5 dark:bg-white/6 border border-rule rounded-md outline-none focus:ring-1 focus:ring-primary/40 text-ink w-36 placeholder:text-ink-3 transition-all"
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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-4">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-paper-2 border border-rule rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col"
              >
                {/* Header with gradient + initial */}
                <div
                  className="h-[76px] relative flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${p.color}28, ${p.color}10)` }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[18px] shadow-md select-none"
                    style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}bb)` }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-2.5 flex-1">
                  <div className="text-[13px] font-semibold text-ink leading-snug">{p.name}</div>
                  <div className="text-[11.5px] text-ink-3 leading-relaxed flex-1">{p.desc}</div>

                  {/* Tech badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300 text-xs px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer links */}
                {(p.demoUrl || p.githubUrl) && (
                  <div className="px-4 pb-3 pt-2 flex gap-3 border-t border-rule">
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11.5px] text-primary font-medium hover:underline"
                      >
                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Demo
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11.5px] text-ink-2 font-medium hover:underline"
                      >
                        <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          />
                        </svg>
                        GitHub Code
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
