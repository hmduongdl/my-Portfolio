import React, { useMemo } from 'react';

export type ProjectType = 'code' | 'design' | 'tool';

export interface Project {
  id: string;
  name: string;
  category: string;
  project_type?: ProjectType;
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

interface ProjectModalProps {
  project: Project;
  isNewProject: boolean;
  saveStatus: 'idle' | 'saving' | 'ok' | 'error';
  onChange: (project: Project) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: (id: string) => void;
}

const PROJECT_TYPES: Array<{ value: ProjectType; label: string; category: string }> = [
  { value: 'code', label: 'Lập trình (Code)', category: 'web' },
  { value: 'design', label: 'Thiết kế (Design)', category: 'design' },
  { value: 'tool', label: 'Công cụ (Tool)', category: 'tools' },
];

const THEME_COLORS = ['#2563EB', '#E91E63', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4', '#607D8B'];
const PLATFORMS = ['Windows', 'macOS', 'Linux'];

function deriveProjectType(project: Project): ProjectType {
  if (project.project_type) return project.project_type;
  if (project.category === 'design') return 'design';
  if (project.category === 'tools') return 'tool';
  return 'code';
}

function normalizeSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

function normalizeObject(value: any) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value;
}

function splitTags(value: string) {
  return value.split(',').map((tag) => tag.trim()).filter(Boolean);
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isNewProject,
  saveStatus,
  onChange,
  onClose,
  onSave,
  onDelete,
}) => {
  const projectType = deriveProjectType(project);
  const designDetails = useMemo(() => normalizeObject(project.design_details_vn), [project.design_details_vn]);
  const toolDetails = useMemo(() => normalizeObject(project.tool_details_vn), [project.tool_details_vn]);
  const toolPlatforms = Array.isArray(toolDetails.platforms) ? toolDetails.platforms.map(String) : [];

  const setProjectType = (nextType: ProjectType) => {
    const category = PROJECT_TYPES.find((type) => type.value === nextType)?.category ?? 'web';
    const nextProject: Project = { ...project, project_type: nextType, category };

    if (nextType === 'code') {
      onChange(nextProject);
      return;
    }

    if (nextType === 'design') {
      onChange({ ...nextProject, tags: [], github_url: null, tech_stack: [] });
      return;
    }

    onChange({ ...nextProject, tags: [], demo_url: null, github_url: null, tech_stack: [] });
  };

  const updateDesignDetail = (key: 'figmaUrl' | 'dribbbleUrl', value: string) => {
    const nextDetails = { ...designDetails, [key]: value };
    onChange({
      ...project,
      design_details_vn: nextDetails,
      design_details_en: { ...normalizeObject(project.design_details_en), [key]: value },
    });
  };

  const updateToolDetail = (patch: Record<string, any>) => {
    const nextDetails = { ...toolDetails, ...patch };
    onChange({
      ...project,
      tool_details_vn: nextDetails,
      tool_details_en: { ...normalizeObject(project.tool_details_en), ...patch },
    });
  };

  return (
    <div className="fixed inset-0 bg-on-surface/25 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-surface border border-outline-variant rounded-xl w-full max-w-[720px] max-h-[88vh] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden">
        <header className="flex justify-between items-center px-6 h-12 bg-surface border-b border-outline-variant/60 shrink-0">
          <h3 className="font-bold text-[15px] text-on-surface">
            {isNewProject ? 'Add New Project' : 'Edit Project Details'}
          </h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 pb-24">
          <section className="space-y-3">
            <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Basic Info / Thông tin cơ bản</h4>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col text-[11px] font-semibold text-on-surface-variant gap-1">
                  Project Name / Tên dự án *
                  <input
                    type="text"
                    value={project.name}
                    onChange={(event) => onChange({ ...project, name: event.target.value })}
                    className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary"
                  />
                </label>

                <label className="flex flex-col text-[11px] font-semibold text-on-surface-variant gap-1">
                  Slug ID / Mã ID *
                  <input
                    type="text"
                    value={project.id}
                    disabled={!isNewProject}
                    onChange={(event) => onChange({ ...project, id: normalizeSlug(event.target.value) })}
                    className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface font-mono outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                  />
                </label>

                <label className="flex flex-col text-[11px] font-semibold text-on-surface-variant gap-1">
                  Loại dự án / Project Type *
                  <select
                    required
                    value={projectType}
                    onChange={(event) => setProjectType(event.target.value as ProjectType)}
                    className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col text-[11px] font-semibold text-on-surface-variant gap-1">
                  Order Index / Thứ tự
                  <input
                    type="number"
                    value={project.order_index}
                    onChange={(event) => onChange({ ...project, order_index: Number(event.target.value) || 0 })}
                    className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary"
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Conditional Fields / Trường theo loại dự án</h4>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
              {projectType === 'code' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col text-[11px] font-semibold text-on-surface-variant gap-1">
                    Link GitHub
                    <input type="url" value={project.github_url ?? ''} onChange={(event) => onChange({ ...project, github_url: event.target.value || null })} placeholder="https://github.com/..." className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary" />
                  </label>
                  <label className="flex flex-col text-[11px] font-semibold text-on-surface-variant gap-1">
                    Link Demo Live
                    <input type="url" value={project.demo_url ?? ''} onChange={(event) => onChange({ ...project, demo_url: event.target.value || null })} placeholder="https://..." className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary" />
                  </label>
                  <label className="flex flex-col text-[11px] font-semibold text-on-surface-variant gap-1 sm:col-span-2">
                    Mảng công nghệ (tags)
                    <input type="text" value={project.tags.join(', ')} onChange={(event) => onChange({ ...project, tags: splitTags(event.target.value) })} placeholder="React, TypeScript, Node.js" className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary" />
                  </label>
                </div>
              )}

              {projectType === 'design' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col text-[11px] font-semibold text-on-surface-variant gap-1">
                    Link Figma
                    <input type="url" value={designDetails.figmaUrl ?? ''} onChange={(event) => updateDesignDetail('figmaUrl', event.target.value)} placeholder="https://figma.com/..." className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary" />
                  </label>
                  <label className="flex flex-col text-[11px] font-semibold text-on-surface-variant gap-1">
                    Link Dribbble
                    <input type="url" value={designDetails.dribbbleUrl ?? ''} onChange={(event) => updateDesignDetail('dribbbleUrl', event.target.value)} placeholder="https://dribbble.com/..." className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary" />
                  </label>
                </div>
              )}

              {projectType === 'tool' && (
                <div className="grid grid-cols-1 gap-4">
                  <label className="flex flex-col text-[11px] font-semibold text-on-surface-variant gap-1">
                    Lệnh cài đặt
                    <input type="text" value={toolDetails.installCmd ?? ''} onChange={(event) => updateToolDetail({ installCmd: event.target.value })} placeholder="npm install -g package-name" className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-[13px] text-on-surface font-mono outline-none focus:ring-1 focus:ring-primary" />
                  </label>
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-on-surface-variant">Môi trường tương thích</span>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((platform) => (
                        <label key={platform} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/50 text-[12px] text-on-surface cursor-pointer">
                          <input
                            type="checkbox"
                            checked={toolPlatforms.includes(platform)}
                            onChange={() => updateToolDetail({ platforms: toggleValue(toolPlatforms, platform) })}
                          />
                          {platform}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Description / Mô tả</h4>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4 grid grid-cols-1 gap-4">
              <textarea value={project.desc_vn} onChange={(event) => onChange({ ...project, desc_vn: event.target.value })} placeholder="Mô tả tiếng Việt..." rows={3} className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg p-2.5 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary resize-none" />
              <textarea value={project.desc_en} onChange={(event) => onChange({ ...project, desc_en: event.target.value })} placeholder="English description..." rows={3} className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg p-2.5 text-[13px] text-on-surface outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Style & Status</h4>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {THEME_COLORS.map((color) => (
                  <button key={color} type="button" onClick={() => onChange({ ...project, color })} className={`w-7 h-7 rounded-full border-2 ${project.color === color ? 'border-primary' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                ))}
                <input type="color" value={project.color} onChange={(event) => onChange({ ...project, color: event.target.value })} className="w-9 h-7 rounded cursor-pointer bg-transparent border-none" />
              </div>
              <label className="flex items-center justify-between gap-4">
                <span className="text-[13px] font-semibold text-on-surface">Visible on Homepage / Hiển thị trên portfolio</span>
                <input type="checkbox" checked={project.visible} onChange={() => onChange({ ...project, visible: !project.visible })} />
              </label>
            </div>
          </section>
        </div>

        <footer className="h-16 bg-surface/95 backdrop-blur-md border-t border-outline-variant/60 px-6 flex items-center justify-between shrink-0">
          <div>
            {!isNewProject && (
              <button type="button" onClick={() => onDelete(project.id)} className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[13px] rounded-lg border border-red-200/50 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Delete
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-5 py-1.5 font-semibold text-[13px] text-on-surface-variant hover:bg-surface-container-high rounded-md border border-outline-variant/50 bg-surface-container-lowest">
              Cancel
            </button>
            <button onClick={onSave} disabled={saveStatus === 'saving'} className="px-5 py-1.5 font-bold text-[13px] text-on-primary bg-primary hover:bg-primary-container active:scale-95 rounded-md shadow-md shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-1.5">
              {saveStatus === 'saving' && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'ok' ? 'Saved' : saveStatus === 'error' ? 'Error' : 'Save Changes'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
