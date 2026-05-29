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
  duration_vn: string;
  duration_en: string;
  role_vn: string;
  role_en: string;
  status: string;
  type_vn: string;
  type_en: string;
  achievement_vn: string;
  achievement_en: string;
  tech_stack: any[];
  features_vn: any[];
  features_en: any[];
  design_details_vn?: any;
  design_details_en?: any;
  tool_details_vn?: any;
  tool_details_en?: any;
}

interface TechOption {
  name: string;
  icon: string;
  category: string;
}

interface TechStackOptionsData {
  categories: string[];
  techs: TechOption[];
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
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeDescTab, setActiveDescTab] = useState<'vn' | 'en'>('vn');
  const [isNewProject, setIsNewProject] = useState(false);
  const [techOptionsData, setTechOptionsData] = useState<TechStackOptionsData>({ categories: [], techs: [] });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.get<Project[]>('/admin/projects');
      const parsedData = (data ?? []).map(p => ({
        ...p,
        tags: Array.isArray(p.tags) ? p.tags : [],
        tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack : (typeof p.tech_stack === 'string' ? JSON.parse(p.tech_stack || '[]') : []),
        features_vn: Array.isArray(p.features_vn) ? p.features_vn : (typeof p.features_vn === 'string' ? JSON.parse(p.features_vn || '[]') : []),
        features_en: Array.isArray(p.features_en) ? p.features_en : (typeof p.features_en === 'string' ? JSON.parse(p.features_en || '[]') : []),
        design_details_vn: typeof p.design_details_vn === 'string' ? JSON.parse(p.design_details_vn || '{}') : (p.design_details_vn || {}),
        design_details_en: typeof p.design_details_en === 'string' ? JSON.parse(p.design_details_en || '{}') : (p.design_details_en || {}),
        tool_details_vn: typeof p.tool_details_vn === 'string' ? JSON.parse(p.tool_details_vn || '{}') : (p.tool_details_vn || {}),
        tool_details_en: typeof p.tool_details_en === 'string' ? JSON.parse(p.tool_details_en || '{}') : (p.tool_details_en || {}),
      }));
      setProjects(parsedData);
      
      const settingsData = await api.get<any>('/admin/settings');
      if (settingsData?.seoSettings?.tech_stack_options) {
        setTechOptionsData(JSON.parse(settingsData.seoSettings.tech_stack_options));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAddProject = () => {
    const newProj: Project = {
      id: '',
      name: '',
      category: 'web',
      color: '#2563EB',
      tags: [],
      desc_vn: '',
      desc_en: '',
      demo_url: '',
      github_url: '',
      order_index: projects.length + 1,
      visible: true,
      duration_vn: '',
      duration_en: '',
      role_vn: '',
      role_en: '',
      status: 'live',
      type_vn: '',
      type_en: '',
      achievement_vn: '',
      achievement_en: '',
      tech_stack: [],
      features_vn: [],
      features_en: [],
      design_details_vn: {},
      design_details_en: {},
      tool_details_vn: {},
      tool_details_en: {},
    };
    setIsNewProject(true);
    setEditingProject(newProj);
    setActiveDescTab('vn');
  };

  const handleEditProject = (p: Project) => {
    setIsNewProject(false);
    setEditingProject({ ...p });
    setActiveDescTab('vn');
  };

  const normalizeSlug = (val: string) => {
    return val.toLowerCase().replace(/[^a-z0-9-]/g, '');
  };

  const handleSave = async () => {
    if (!editingProject) return;
    if (!editingProject.id || editingProject.id.trim() === '') {
      alert('Please enter a unique ID (Slug)');
      return;
    }
    if (!editingProject.name || editingProject.name.trim() === '') {
      alert('Please enter a project name');
      return;
    }

    setSaveStatus('saving');
    try {
      if (isNewProject) {
        await api.post('/admin/projects', editingProject);
      } else {
        await api.put('/admin/projects', editingProject);
      }
      setSaveStatus('ok');
      setEditingProject(null);
      await loadProjects();
      window.dispatchEvent(new Event('projects-updated'));
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      alert(`Save failed: ${String(err)}`);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch('/api/admin/projects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ id })
      });
      setEditingProject(null);
      await loadProjects();
      window.dispatchEvent(new Event('projects-updated'));
    } catch (e) {
      console.error(e);
      alert('Delete failed');
    }
  };

  return (
    <div className="p-window-padding space-y-6 relative">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[19px] font-bold text-on-surface">Projects Portfolio</h2>
          <p className="text-[13px] text-on-surface-variant">Manage your digital projects, technology stacks, and localizations.</p>
        </div>
        <button
          onClick={handleAddProject}
          className="bg-[#30D158] hover:bg-[#28C840] text-white px-4 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Project
        </button>
      </div>

      {/* Grid of Mini Square Cards */}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-20">
          {projects.map((p) => (
            <div 
              key={p.id} 
              onClick={() => handleEditProject(p)}
              className="aspect-square rounded-xl p-4 flex flex-col justify-between cursor-pointer border hover:shadow-md transition-all scale-100 active:scale-95 group relative overflow-hidden bg-surface-container-lowest"
              style={{ 
                borderColor: `${p.color}30`, 
                background: `linear-gradient(135deg, ${p.color}08 0%, ${p.color}03 100%)` 
              }}
            >
              {/* Category & Slug */}
              <div className="flex justify-between items-start gap-1">
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                  {p.category}
                </span>
                <span className="text-[9px] font-mono text-on-surface-variant/60 truncate max-w-[80px]" title={p.id}>{p.id}</span>
              </div>
              
              {/* Info */}
              <div className="space-y-1">
                <h4 className="font-bold text-[13px] leading-tight text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                  {p.name || 'Untitled'}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {(p.tags || []).slice(0, 3).map((t, idx) => (
                    <span key={idx} className="text-[9px] font-semibold text-on-surface-variant/75">#{t}</span>
                  ))}
                </div>
              </div>
              
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: p.color }} />
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-on-surface/25 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface border border-outline-variant rounded-xl w-full max-w-[700px] h-[640px] shadow-[0_20px_50px_rgba(0,0,0,0.2),_0_0_0_1px_rgba(0,0,0,0.05)] flex flex-col relative overflow-hidden">
            
            {/* Modal Titlebar */}
            <header className="flex justify-between items-center w-full px-6 h-12 bg-surface border-b border-outline-variant/60 shrink-0">
              <h3 className="font-bold text-[15px] text-on-surface">
                {isNewProject ? 'Add New Project' : 'Edit Project Details'}
              </h3>
              <button 
                onClick={() => setEditingProject(null)} 
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">close</span>
              </button>
            </header>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 pb-24">
              
              {/* 1. Basic Information */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Basic Info / Thông tin cơ bản</h4>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Project Name / Tên dự án *</label>
                      <input 
                        type="text"
                        value={editingProject.name}
                        onChange={e => setEditingProject({ ...editingProject, name: e.target.value })}
                        placeholder="e.g. Song Phương macOS Portfolio"
                        className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Slug ID / Mã ID *</label>
                      <input 
                        type="text"
                        value={editingProject.id}
                        disabled={!isNewProject}
                        onChange={e => setEditingProject({ ...editingProject, id: normalizeSlug(e.target.value) })}
                        placeholder="e.g. macos-portfolio"
                        className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface font-mono outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-60"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Category / Danh mục</label>
                      <div className="relative flex items-center">
                        <select 
                          value={editingProject.category}
                          onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer"
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                        </select>
                        <span className="material-symbols-outlined text-outline-variant text-[18px] absolute right-2 pointer-events-none">unfold_more</span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Tags (Technology, comma separated)</label>
                      <input 
                        type="text"
                        value={editingProject.tags.join(', ')}
                        onChange={e => setEditingProject({ ...editingProject, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                        placeholder="React, TypeScript, Zustand"
                        className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Style & Ordering */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Style & Ordering / Giao diện & Sắp xếp</h4>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Theme Color / Màu sắc hiển thị</label>
                      <div className="flex gap-2">
                        {THEME_COLORS.map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditingProject({ ...editingProject, color: c })}
                            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 shrink-0 ${
                              editingProject.color === c ? 'border-primary scale-105' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                        <input 
                          type="color"
                          value={editingProject.color}
                          onChange={e => setEditingProject({ ...editingProject, color: e.target.value })}
                          className="w-8 h-6 rounded cursor-pointer bg-transparent border-none shrink-0"
                        />
                        <input 
                          type="text"
                          value={editingProject.color}
                          onChange={e => setEditingProject({ ...editingProject, color: e.target.value })}
                          className="flex-1 bg-surface-container-low border border-outline-variant/50 rounded-lg px-2 text-[12px] font-mono outline-none text-on-surface h-6"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Order Index / Thứ tự</label>
                      <input 
                        type="number"
                        value={editingProject.order_index}
                        onChange={e => setEditingProject({ ...editingProject, order_index: Number(e.target.value) || 0 })}
                        className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-1.5 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Description (multilingual tabs) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Description / Mô tả chi tiết</h4>
                  <div className="bg-surface-container-low p-0.5 rounded-lg flex gap-0.5">
                    <button
                      type="button"
                      onClick={() => setActiveDescTab('vn')}
                      className={`px-3 py-0.5 text-[11px] font-semibold rounded-[6px] transition-all ${
                        activeDescTab === 'vn'
                          ? 'bg-surface shadow-sm text-on-surface'
                          : 'text-on-surface-variant/60 hover:text-on-surface-variant'
                      }`}
                    >
                      VN
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDescTab('en')}
                      className={`px-3 py-0.5 text-[11px] font-semibold rounded-[6px] transition-all ${
                        activeDescTab === 'en'
                          ? 'bg-surface shadow-sm text-on-surface'
                          : 'text-on-surface-variant/60 hover:text-on-surface-variant'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
                  {activeDescTab === 'vn' ? (
                    <textarea 
                      value={editingProject.desc_vn}
                      onChange={e => setEditingProject({ ...editingProject, desc_vn: e.target.value })}
                      placeholder="Mô tả dự án chi tiết bằng tiếng Việt..."
                      rows={4}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg p-2.5 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                    />
                  ) : (
                    <textarea 
                      value={editingProject.desc_en}
                      onChange={e => setEditingProject({ ...editingProject, desc_en: e.target.value })}
                      placeholder="Detail project description in English..."
                      rows={4}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg p-2.5 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                    />
                  )}
                </div>
              </div>

              {/* Advanced Details (Duration, Role, Type, Achievements) */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Advanced Details</h4>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Thời gian (VN)</label>
                      <input type="text" value={editingProject.duration_vn || ''} onChange={e => setEditingProject({ ...editingProject, duration_vn: e.target.value })} placeholder="VD: 3 tháng · Jan–Mar 2024" className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Duration (EN)</label>
                      <input type="text" value={editingProject.duration_en || ''} onChange={e => setEditingProject({ ...editingProject, duration_en: e.target.value })} placeholder="e.g. 3 months · Jan–Mar 2024" className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Vai trò (VN)</label>
                      <input type="text" value={editingProject.role_vn || ''} onChange={e => setEditingProject({ ...editingProject, role_vn: e.target.value })} placeholder="VD: Lập trình viên độc lập" className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Role (EN)</label>
                      <input type="text" value={editingProject.role_en || ''} onChange={e => setEditingProject({ ...editingProject, role_en: e.target.value })} placeholder="e.g. Solo developer" className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Loại dự án (VN)</label>
                      <input type="text" value={editingProject.type_vn || ''} onChange={e => setEditingProject({ ...editingProject, type_vn: e.target.value })} placeholder="VD: Dự án cá nhân" className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Type (EN)</label>
                      <input type="text" value={editingProject.type_en || ''} onChange={e => setEditingProject({ ...editingProject, type_en: e.target.value })} placeholder="e.g. Personal project" className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">Project Status / Trạng thái</label>
                    <select value={editingProject.status || 'live'} onChange={e => setEditingProject({ ...editingProject, status: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary">
                      <option value="live">Live (Hoạt động)</option>
                      <option value="in-progress">In progress (Đang phát triển)</option>
                      <option value="archived">Archived (Lưu trữ)</option>
                    </select>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Thành tựu nổi bật (VN)</label>
                      <textarea rows={2} value={editingProject.achievement_vn || ''} onChange={e => setEditingProject({ ...editingProject, achievement_vn: e.target.value })} className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary resize-none" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Key Achievement (EN)</label>
                      <textarea rows={2} value={editingProject.achievement_en || ''} onChange={e => setEditingProject({ ...editingProject, achievement_en: e.target.value })} className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary resize-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Stack Selector */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Tech Stack Selection</h4>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {editingProject.tech_stack?.map((t: any, idx: number) => (
                      <span key={idx} className="bg-primary/10 text-primary px-2.5 py-1 rounded-lg text-[12px] flex items-center gap-1.5 font-medium border border-primary/20">
                        <i className={`devicon-${t.icon}-plain`} /> {t.name}
                        <button onClick={() => {
                          const newStack = [...editingProject.tech_stack];
                          newStack.splice(idx, 1);
                          setEditingProject({ ...editingProject, tech_stack: newStack });
                        }} className="hover:text-error ml-1 transition-colors leading-none"><span className="material-symbols-outlined text-[14px]">close</span></button>
                      </span>
                    ))}
                    {!editingProject.tech_stack?.length && <span className="text-[12px] text-on-surface-variant/50">Chưa chọn công nghệ nào...</span>}
                  </div>
                  <div className="border-t border-outline-variant/40 pt-3">
                    <label className="text-[11px] font-semibold text-on-surface-variant mb-2 block">Thêm từ thư viện Tech Stack Settings:</label>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {techOptionsData.techs.map((tech, i) => {
                        const isSelected = editingProject.tech_stack?.some((t: any) => t.name === tech.name);
                        return (
                          <button
                            key={i}
                            disabled={isSelected}
                            onClick={() => setEditingProject({ ...editingProject, tech_stack: [...(editingProject.tech_stack || []), tech] })}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium border ${isSelected ? 'bg-surface-container-highest border-outline-variant/30 text-on-surface-variant/40 cursor-not-allowed' : 'bg-surface-container border-outline-variant/50 hover:border-primary hover:text-primary transition-colors'}`}
                          >
                            {tech.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Features Builder */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Key Features / Tính năng chính</h4>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
                  <div className="mb-4">
                    <label className="text-[12px] font-semibold text-on-surface mb-2 block">Tính năng (VN)</label>
                    <div className="space-y-2">
                      {editingProject.features_vn?.map((f: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" value={f.title} onChange={e => { const arr = [...editingProject.features_vn]; arr[i].title = e.target.value; setEditingProject({ ...editingProject, features_vn: arr }); }} placeholder="Title" className="w-1/3 bg-surface-container-low border border-outline-variant/50 rounded-lg px-2 py-1 text-[12px] outline-none" />
                          <input type="text" value={f.desc} onChange={e => { const arr = [...editingProject.features_vn]; arr[i].desc = e.target.value; setEditingProject({ ...editingProject, features_vn: arr }); }} placeholder="Description" className="flex-1 bg-surface-container-low border border-outline-variant/50 rounded-lg px-2 py-1 text-[12px] outline-none" />
                          <button onClick={() => { const arr = [...editingProject.features_vn]; arr.splice(i, 1); setEditingProject({ ...editingProject, features_vn: arr }); }} className="text-error hover:bg-error/10 p-1 rounded"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setEditingProject({ ...editingProject, features_vn: [...(editingProject.features_vn || []), { title: '', desc: '' }] })} className="mt-2 text-[11px] text-primary hover:underline font-semibold">+ Thêm tính năng (VN)</button>
                  </div>
                  <div className="border-t border-outline-variant/40 pt-4">
                    <label className="text-[12px] font-semibold text-on-surface mb-2 block">Features (EN)</label>
                    <div className="space-y-2">
                      {editingProject.features_en?.map((f: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" value={f.title} onChange={e => { const arr = [...editingProject.features_en]; arr[i].title = e.target.value; setEditingProject({ ...editingProject, features_en: arr }); }} placeholder="Title" className="w-1/3 bg-surface-container-low border border-outline-variant/50 rounded-lg px-2 py-1 text-[12px] outline-none" />
                          <input type="text" value={f.desc} onChange={e => { const arr = [...editingProject.features_en]; arr[i].desc = e.target.value; setEditingProject({ ...editingProject, features_en: arr }); }} placeholder="Description" className="flex-1 bg-surface-container-low border border-outline-variant/50 rounded-lg px-2 py-1 text-[12px] outline-none" />
                          <button onClick={() => { const arr = [...editingProject.features_en]; arr.splice(i, 1); setEditingProject({ ...editingProject, features_en: arr }); }} className="text-error hover:bg-error/10 p-1 rounded"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setEditingProject({ ...editingProject, features_en: [...(editingProject.features_en || []), { title: '', desc: '' }] })} className="mt-2 text-[11px] text-primary hover:underline font-semibold">+ Add feature (EN)</button>
                  </div>
                </div>
              </div>

              {/* Design Project Specifics */}
              {editingProject.category === 'design' && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-[#9C27B0] px-1 uppercase tracking-wider">Design Details (Brand/UI)</h4>
                  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
                    <p className="text-[12px] text-on-surface-variant mb-4">
                      Vì đây là dự án thiết kế, hãy nhập cấu hình JSON chứa thông tin chi tiết:
                      <br/>
                      <code className="bg-surface-container text-[10px] p-1 mt-1 rounded block">
                        {`{ "client": "", "deliverables": [], "tools": [], "beforeAfter": { "beforeImg": "", "afterImg": "", "caption": "" }, "gallery": [{ "url": "", "caption": "", "type": "image|palette|typography" }], "brief": "", "process": [{ "step": "", "desc": "" }], "outcome": "" }`}
                      </code>
                    </p>
                    
                    <div className="mb-4">
                      <label className="text-[12px] font-semibold text-on-surface mb-2 block">Design Details (VN) - JSON Format</label>
                      <textarea 
                        value={typeof editingProject.design_details_vn === 'string' ? editingProject.design_details_vn : JSON.stringify(editingProject.design_details_vn || {}, null, 2)}
                        onChange={e => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setEditingProject({ ...editingProject, design_details_vn: parsed });
                          } catch (err) {
                            // If invalid JSON, just store the string temporarily
                            setEditingProject({ ...editingProject, design_details_vn: e.target.value });
                          }
                        }}
                        rows={12}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg p-2 text-[11px] font-mono outline-none focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[12px] font-semibold text-on-surface mb-2 block">Design Details (EN) - JSON Format</label>
                      <textarea 
                        value={typeof editingProject.design_details_en === 'string' ? editingProject.design_details_en : JSON.stringify(editingProject.design_details_en || {}, null, 2)}
                        onChange={e => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setEditingProject({ ...editingProject, design_details_en: parsed });
                          } catch (err) {
                            setEditingProject({ ...editingProject, design_details_en: e.target.value });
                          }
                        }}
                        rows={12}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg p-2 text-[11px] font-mono outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tool Project Specifics */}
              {editingProject.category === 'tools' && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-[#FF9800] px-1 uppercase tracking-wider">Tool Details (CLI / Automation)</h4>
                  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
                    <p className="text-[12px] text-on-surface-variant mb-4">
                      Cấu hình JSON cho công cụ CLI/Automation:
                      <br/>
                      <code className="bg-surface-container text-[10px] p-1 mt-1 rounded block">
                        {`{ "version": "", "platforms": [], "terminalDemo": { "command": "", "output": [{ "type": "success|error|info", "text": "" }] }, "installCmd": "", "usageCmds": [{ "cmd": "", "desc": "" }], "screenshots": [{ "url": "", "caption": "" }], "whyBuilt": "", "howItWorks": [{ "step": "", "desc": "" }] }`}
                      </code>
                    </p>
                    
                    <div className="mb-4">
                      <label className="text-[12px] font-semibold text-on-surface mb-2 block">Tool Details (VN) - JSON Format</label>
                      <textarea 
                        value={typeof editingProject.tool_details_vn === 'string' ? editingProject.tool_details_vn : JSON.stringify(editingProject.tool_details_vn || {}, null, 2)}
                        onChange={e => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setEditingProject({ ...editingProject, tool_details_vn: parsed });
                          } catch (err) {
                            setEditingProject({ ...editingProject, tool_details_vn: e.target.value });
                          }
                        }}
                        rows={12}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg p-2 text-[11px] font-mono outline-none focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[12px] font-semibold text-on-surface mb-2 block">Tool Details (EN) - JSON Format</label>
                      <textarea 
                        value={typeof editingProject.tool_details_en === 'string' ? editingProject.tool_details_en : JSON.stringify(editingProject.tool_details_en || {}, null, 2)}
                        onChange={e => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setEditingProject({ ...editingProject, tool_details_en: parsed });
                          } catch (err) {
                            setEditingProject({ ...editingProject, tool_details_en: e.target.value });
                          }
                        }}
                        rows={12}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg p-2 text-[11px] font-mono outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Links */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Links / Liên kết</h4>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">Demo Link / Đường dẫn Demo</label>
                      <input 
                        type="text"
                        value={editingProject.demo_url ?? ''}
                        onChange={e => setEditingProject({ ...editingProject, demo_url: e.target.value || null })}
                        placeholder="https://..."
                        className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-on-surface-variant mb-1">GitHub Link / Mã nguồn</label>
                      <input 
                        type="text"
                        value={editingProject.github_url ?? ''}
                        onChange={e => setEditingProject({ ...editingProject, github_url: e.target.value || null })}
                        placeholder="https://github.com/..."
                        className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Visibility Switch */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Status / Trạng thái hiển thị</h4>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-on-surface">Visible on Homepage / Hiển thị trên portfolio</span>
                    <span className="text-[11px] text-on-surface-variant">Toggle whether this project is displayed to visitors.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProject({ ...editingProject, visible: !editingProject.visible })}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      editingProject.visible ? 'bg-[#30D158]' : 'bg-[#E3E3E3] dark:bg-surface-container-highest'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        editingProject.visible ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Sticky Footer Actions */}
            <footer className="absolute bottom-0 right-0 w-full h-16 bg-surface/95 backdrop-blur-md border-t border-outline-variant/60 px-6 flex items-center justify-between z-30">
              <div>
                {!isNewProject && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingProject.id)}
                    className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[13px] rounded-lg transition-colors border border-red-200/50 flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Delete
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setEditingProject(null)} 
                  className="px-5 py-1.5 font-semibold text-[13px] text-on-surface-variant hover:bg-surface-container-high rounded-md transition-colors border border-outline-variant/50 bg-surface-container-lowest"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="px-5 py-1.5 font-bold text-[13px] text-on-primary bg-primary hover:bg-primary-container active:scale-95 rounded-md shadow-md shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saveStatus === 'saving' && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {saveStatus === 'saving' ? 'Saving...' : 
                   saveStatus === 'ok' ? '✓ Saved' : 
                   saveStatus === 'error' ? '✗ Error' : 'Save Changes'}
                </button>
              </div>
            </footer>

          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .p-window-padding {
          padding: 24px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
    </div>
  );
};
