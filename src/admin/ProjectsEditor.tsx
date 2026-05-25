import React, { useEffect, useState } from 'react';
import { api } from './api';

interface Project {
  id: string;
  name: string;
  category: string;
  color: string;
  tags: string[];
  desc_vn: string;
  desc_en: string;
  demo_url: string | null;
  github_url: string | null;
  order_index: number;
  visible: boolean;
}

type SaveStatus = 'idle' | 'saving' | 'ok' | 'error';

const THEME_COLORS = [
  '#2563EB', // Blue
  '#E91E63', // Pink
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#607D8B', // Blue Grey
];

const CATEGORIES = ['web', 'design', 'tools', 'other'];



export const ProjectsEditor: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [originalProjects, setOriginalProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [activeTabMap, setActiveTabMap] = useState<Record<string, 'vn' | 'en'>>({});

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.get<Project[]>('/admin/projects');
      
      // Parse tags as string array safely if they arrive formatted differently
      const parsedData = (data ?? []).map(p => ({
        ...p,
        tags: Array.isArray(p.tags) ? p.tags : []
      }));

      setProjects(JSON.parse(JSON.stringify(parsedData)));
      setOriginalProjects(JSON.parse(JSON.stringify(parsedData)));
      setDeletedIds([]);

      // Initialize tabs for description fields
      const tabs: Record<string, 'vn' | 'en'> = {};
      parsedData.forEach((p) => {
        tabs[p.id] = 'vn';
      });
      setActiveTabMap(tabs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAddField = () => {
    const tempId = `temp-${Date.now()}`;
    const newProj: Project = {
      id: '', // Blank slug for user to fill
      name: 'New Project',
      category: 'web',
      color: '#2563EB',
      tags: ['React'],
      desc_vn: '',
      desc_en: '',
      demo_url: '',
      github_url: '',
      order_index: projects.length + 1,
      visible: true,
    };
    
    // Use tempId as the key in states
    setProjects([...projects, { ...newProj, id: tempId }]);
    setActiveTabMap(prev => ({ ...prev, [tempId]: 'vn' }));
  };

  const handleUpdateField = (id: string, key: keyof Project, value: any) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, [key]: value } : p))
    );
  };

  const handleDeleteField = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setProjects(prev => prev.filter(p => p.id !== id));
    if (!id.startsWith('temp-')) {
      setDeletedIds(prev => [...prev, id]);
    }
  };

  const handleDiscard = () => {
    if (window.confirm('Discard all unsaved changes?')) {
      loadProjects();
    }
  };

  const handleSaveAll = async () => {
    // Validate empty slug IDs
    const hasEmptySlug = projects.some(p => !p.id || p.id.trim() === '');
    if (hasEmptySlug) {
      alert('Please fill out the unique project ID (slug) for all new projects.');
      return;
    }

    setSaveStatus('saving');
    try {
      // 1. Process deletes
      for (const id of deletedIds) {
        await fetch('/api/admin/projects', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          },
          body: JSON.stringify({ id })
        });
      }

      // 2. Process inserts & updates
      for (const p of projects) {
        const isNew = !originalProjects.some(orig => orig.id === p.id);
        
        if (isNew) {
          // If the ID was a temporary client ID, we let user rename it, but wait!
          // We need to verify if the user left it as "temp-xxx"
          if (p.id.startsWith('temp-')) {
            alert('Please change the temporary slug ID to a friendly name (e.g. my-app).');
            setSaveStatus('error');
            return;
          }
          await api.post('/admin/projects', p);
        } else {
          await api.put('/admin/projects', p);
        }
      }

      setSaveStatus('ok');
      await loadProjects();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      console.error(e);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const toggleTab = (id: string, tab: 'vn' | 'en') => {
    setActiveTabMap(prev => ({ ...prev, [id]: tab }));
  };

  return (
    <div className="p-window-padding space-y-6">
      
      {/* Top Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[19px] font-bold text-on-surface">Projects Portfolio</h2>
          <p className="text-[13px] text-on-surface-variant">Manage your digital projects, technology stacks, and localizations.</p>
        </div>
        <button
          onClick={handleAddField}
          className="bg-primary hover:bg-primary-container text-on-primary px-4 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Project
        </button>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2 text-on-surface-variant text-[13px]">
          <div className="w-4 h-4 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="py-12 text-center text-on-surface-variant text-[13px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
          No projects found. Click "Add Project" to get started.
        </div>
      ) : (
        <div className="space-y-[32px] pb-24">
          {projects.map((p) => {
            const isTempId = p.id.startsWith('temp-');
            const tab = activeTabMap[p.id] ?? 'vn';

            return (
              <section key={p.id} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-section-header font-section-header text-on-surface-variant uppercase">
                    {p.name || 'NEW PROJECT'}
                  </h3>
                  <button
                    onClick={() => handleDeleteField(p.id)}
                    className="text-[11px] text-error hover:underline flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    Delete
                  </button>
                </div>

                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden divide-y divide-outline-variant/30">
                  
                  {/* Row 1: Name, Slug (ID) & Tags Pills */}
                  <div className="p-[12px] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-wider mb-1">Project Name</div>
                        <input
                          type="text"
                          value={p.name}
                          onChange={e => handleUpdateField(p.id, 'name', e.target.value)}
                          className="w-full bg-transparent border-none p-0 focus:ring-0 font-bold text-on-surface text-[14px]"
                          placeholder="Project name"
                        />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-wider mb-1">Unique ID (Slug)</div>
                        {isTempId ? (
                          <input
                            type="text"
                            value={p.id.startsWith('temp-') ? '' : p.id}
                            onChange={e => handleUpdateField(p.id, 'id', e.target.value)}
                            className="w-full bg-transparent border-none p-0 focus:ring-0 font-mono text-[13px] text-primary"
                            placeholder="e.g. awesome-tool"
                          />
                        ) : (
                          <span className="text-[13px] font-mono text-on-surface-variant block mt-0.5 select-all">{p.id}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Tags Pills Preview */}
                    <div className="flex flex-wrap gap-1.5 justify-end md:max-w-[240px]">
                      {p.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Row 2: Category & Tags Edit */}
                  <div className="p-[12px] grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-wider mb-1">Category</div>
                      <select
                        value={p.category}
                        onChange={e => handleUpdateField(p.id, 'category', e.target.value)}
                        className="bg-transparent border-none p-0 text-[13px] text-on-surface focus:ring-0 outline-none w-full cursor-pointer"
                      >
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-wider mb-1">Tags (Comma separated)</div>
                      <input
                        type="text"
                        value={p.tags.join(', ')}
                        onChange={e => handleUpdateField(p.id, 'tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-[13px] text-on-surface placeholder:text-on-surface-variant/40"
                        placeholder="React, TypeScript, CSS"
                      />
                    </div>
                  </div>

                  {/* Row 3: Demo & GitHub URLs */}
                  <div className="p-[12px] grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-wider mb-1">Demo URL</div>
                      <input
                        type="text"
                        value={p.demo_url || ''}
                        onChange={e => handleUpdateField(p.id, 'demo_url', e.target.value || null)}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-[13px] text-primary placeholder:text-on-surface-variant/40"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-wider mb-1">GitHub URL</div>
                      <input
                        type="text"
                        value={p.github_url || ''}
                        onChange={e => handleUpdateField(p.id, 'github_url', e.target.value || null)}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-[13px] text-primary placeholder:text-on-surface-variant/40"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  {/* Row 4: Descriptions (Multilingual Tabs) */}
                  <div className="p-[12px]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-wider">Description</div>
                      <div className="bg-surface-container-high p-0.5 rounded-lg flex gap-0.5">
                        <button
                          onClick={() => toggleTab(p.id, 'vn')}
                          className={`px-3 py-1 text-[11px] font-semibold rounded-[6px] transition-all ${
                            tab === 'vn'
                              ? 'bg-surface-container-lowest shadow-sm text-on-surface'
                              : 'text-on-surface-variant/60 hover:text-on-surface-variant'
                          }`}
                        >
                          VN
                        </button>
                        <button
                          onClick={() => toggleTab(p.id, 'en')}
                          className={`px-3 py-1 text-[11px] font-semibold rounded-[6px] transition-all ${
                            tab === 'en'
                              ? 'bg-surface-container-lowest shadow-sm text-on-surface'
                              : 'text-on-surface-variant/60 hover:text-on-surface-variant'
                          }`}
                        >
                          EN
                        </button>
                      </div>
                    </div>

                    {tab === 'vn' ? (
                      <textarea
                        value={p.desc_vn}
                        onChange={e => handleUpdateField(p.id, 'desc_vn', e.target.value)}
                        className="w-full h-16 bg-transparent border-none p-0 focus:ring-0 text-[13px] text-on-surface resize-none placeholder:text-on-surface-variant/40"
                        placeholder="Mô tả dự án bằng tiếng Việt..."
                      />
                    ) : (
                      <textarea
                        value={p.desc_en}
                        onChange={e => handleUpdateField(p.id, 'desc_en', e.target.value)}
                        className="w-full h-16 bg-transparent border-none p-0 focus:ring-0 text-[13px] text-on-surface resize-none placeholder:text-on-surface-variant/40"
                        placeholder="Project description in English..."
                      />
                    )}
                  </div>

                  {/* Row 5: Theme Color & Live Status & Order Index */}
                  <div className="p-[12px] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-wider">Theme Color</span>
                      <div className="flex items-center gap-2">
                        {THEME_COLORS.map(c => {
                          const isActive = p.color === c;
                          return (
                            <button
                              key={c}
                              onClick={() => handleUpdateField(p.id, 'color', c)}
                              className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
                                isActive ? 'border-primary ring-1 ring-primary/30 scale-105' : 'border-surface-container-lowest'
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          );
                        })}
                        
                        {/* Manual Color Picker Input */}
                        <div className="flex items-center gap-1 border-l border-outline-variant/30 pl-2">
                          <input
                            type="color"
                            value={p.color}
                            onChange={e => handleUpdateField(p.id, 'color', e.target.value)}
                            className="w-5 h-5 rounded border border-outline-variant cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={p.color}
                            onChange={e => handleUpdateField(p.id, 'color', e.target.value)}
                            className="w-16 bg-transparent border-none p-0 text-[11px] text-on-surface-variant font-mono focus:ring-0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-wider">Order Index</span>
                        <input
                          type="number"
                          value={p.order_index}
                          onChange={e => handleUpdateField(p.id, 'order_index', Number(e.target.value))}
                          className="w-12 bg-transparent border-none p-0 focus:ring-0 text-[13px] text-on-surface-variant text-center"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-wider">Live Status</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateField(p.id, 'visible', !p.visible)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                            p.visible ? 'bg-[#30D158]' : 'bg-[#E3E3E3] dark:bg-surface-container-highest'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              p.visible ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Footer Batch Save Controls */}
      {!loading && projects.length > 0 && (
        <footer className="absolute bottom-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-md flex items-center justify-end px-window-padding gap-3 border-t border-outline-variant/60 z-35">
          <button
            onClick={handleDiscard}
            className="px-5 py-1.5 rounded-lg text-[13px] font-semibold text-on-surface-variant border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saveStatus === 'saving'}
            className="px-6 py-1.5 rounded-lg text-[13px] font-semibold text-on-primary bg-primary shadow-md shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saveStatus === 'saving' && (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {saveStatus === 'saving' ? 'Saving...' : 
             saveStatus === 'ok' ? '✓ Saved' : 
             saveStatus === 'error' ? '✗ Error' : 'Save Changes'}
          </button>
        </footer>
      )}

      {/* CSS Styles */}
      <style>{`
        .z-35 {
          z-index: 35;
        }
      `}</style>
      
    </div>
  );
};
