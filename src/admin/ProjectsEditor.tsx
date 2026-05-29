import React, { useEffect, useState } from 'react';
import { api } from './api';
import { ProjectModal, type Project } from './components/ProjectModal';

type SaveStatus = 'idle' | 'saving' | 'ok' | 'error';

export const ProjectsEditor: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

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
      project_type: 'code',
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
  };

  const handleEditProject = (p: Project) => {
    setIsNewProject(false);
    setEditingProject({ ...p });
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
      await api.del('/admin/projects', { id });
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
        <ProjectModal
          project={editingProject}
          isNewProject={isNewProject}
          saveStatus={saveStatus}
          onChange={setEditingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
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
