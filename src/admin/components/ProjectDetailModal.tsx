import React, { useMemo, useState } from 'react';
import { api } from '../api';

type ProjectType = 'code' | 'design' | 'tool';

interface ProjectRecord {
  id?: string | number | null;
  name?: string | null;
  category?: string | null;
  project_type?: ProjectType | string | null;
  projectType?: ProjectType | string | null;
  color?: string | null;
  tags?: string[] | string | null;
  desc_vn?: string | null;
  desc_en?: string | null;
  demo_url?: string | null;
  demoUrl?: string | null;
  github_url?: string | null;
  githubUrl?: string | null;
  order_index?: number | string | null;
  orderIndex?: number | string | null;
  visible?: boolean | null;
  duration_vn?: string | null;
  duration_en?: string | null;
  role_vn?: string | null;
  role_en?: string | null;
  status?: string | null;
  type_vn?: string | null;
  type_en?: string | null;
  achievement_vn?: string | null;
  achievement_en?: string | null;
  tech_stack?: unknown;
  techStack?: unknown;
  features_vn?: unknown;
  features_en?: unknown;
  design_details_vn?: unknown;
  design_details_en?: unknown;
  tool_details_vn?: unknown;
  tool_details_en?: unknown;
}

interface ProjectDetailModalProps {
  project: ProjectRecord | null;
  onClose: () => void;
  onSave: () => void;
}

interface ProjectFormState {
  project_type: ProjectType;
  id: string;
  name: string;
  color: string;
  order_index: number;
  visible: boolean;
  desc_vn: string;
  desc_en: string;
  github_url: string;
  demo_url: string;
  tagsText: string;
  figma_url: string;
  dribbble_url: string;
  install_cmd: string;
  platforms: string[];
}

const PROJECT_TYPES: Array<{ value: ProjectType; label: string; category: string }> = [
  { value: 'code', label: 'Lập trình (Code)', category: 'web' },
  { value: 'design', label: 'Thiết kế (Design)', category: 'design' },
  { value: 'tool', label: 'Công cụ (Tool)', category: 'tools' },
];

const PLATFORM_OPTIONS = ['Windows', 'macOS', 'Linux'];
const COLOR_SWATCHES = ['#2563EB', '#E91E63', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4', '#607D8B'];

function stringValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

function normalizeObject(value: unknown): Record<string, any> {
  if (!value) return {};
  if (typeof value === 'object' && !Array.isArray(value)) return value as Record<string, any>;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

function normalizeTags(value: ProjectRecord['tags']): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') {
    return value.split(',').map(tag => tag.trim()).filter(Boolean);
  }
  return [];
}

function splitTags(value: string): string[] {
  return value.split(',').map(tag => tag.trim()).filter(Boolean);
}

function deriveProjectType(project: ProjectRecord | null): ProjectType {
  const explicit = project?.project_type ?? project?.projectType;
  if (explicit === 'code' || explicit === 'design' || explicit === 'tool') return explicit;
  if (project?.category === 'design') return 'design';
  if (project?.category === 'tools' || project?.category === 'tool') return 'tool';
  return 'code';
}

function categoryFromType(type: ProjectType): string {
  return PROJECT_TYPES.find(item => item.value === type)?.category ?? 'web';
}

function normalizeSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function togglePlatform(values: string[], platform: string): string[] {
  return values.includes(platform)
    ? values.filter(item => item !== platform)
    : [...values, platform];
}

function initialState(project: ProjectRecord | null): ProjectFormState {
  const projectType = deriveProjectType(project);
  const designDetails = normalizeObject(project?.design_details_vn);
  const toolDetails = normalizeObject(project?.tool_details_vn);
  const platforms = Array.isArray(toolDetails.platforms)
    ? toolDetails.platforms.map(String)
    : stringValue(toolDetails.platforms).split(',').map(item => item.trim()).filter(Boolean);

  return {
    project_type: projectType,
    id: stringValue(project?.id),
    name: stringValue(project?.name),
    color: stringValue(project?.color) || '#2563EB',
    order_index: Number(project?.order_index ?? project?.orderIndex ?? 0) || 0,
    visible: project?.visible !== false,
    desc_vn: stringValue(project?.desc_vn),
    desc_en: stringValue(project?.desc_en),
    github_url: stringValue(project?.github_url ?? project?.githubUrl),
    demo_url: stringValue(project?.demo_url ?? project?.demoUrl),
    tagsText: normalizeTags(project?.tags).join(', '),
    figma_url: stringValue(designDetails.figmaUrl ?? designDetails.figma_url),
    dribbble_url: stringValue(designDetails.dribbbleUrl ?? designDetails.dribbble_url),
    install_cmd: stringValue(toolDetails.installCmd ?? toolDetails.install_cmd),
    platforms,
  };
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose, onSave }) => {
  const [form, setForm] = useState<ProjectFormState>(() => initialState(project));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(project?.id);
  const projectTypeLabel = useMemo(
    () => PROJECT_TYPES.find(type => type.value === form.project_type)?.label ?? 'Lập trình (Code)',
    [form.project_type]
  );

  const updateForm = <K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const setProjectType = (projectType: ProjectType) => {
    setForm(prev => ({
      ...prev,
      project_type: projectType,
      github_url: projectType === 'code' ? prev.github_url : '',
      demo_url: projectType === 'code' ? prev.demo_url : '',
      tagsText: projectType === 'code' ? prev.tagsText : '',
      figma_url: projectType === 'design' ? prev.figma_url : '',
      dribbble_url: projectType === 'design' ? prev.dribbble_url : '',
      install_cmd: projectType === 'tool' ? prev.install_cmd : '',
      platforms: projectType === 'tool' ? prev.platforms : [],
    }));
  };

  const buildPayload = () => {
    const tags = form.project_type === 'code' ? splitTags(form.tagsText) : [];
    const designDetails = form.project_type === 'design'
      ? { figmaUrl: form.figma_url.trim(), dribbbleUrl: form.dribbble_url.trim() }
      : {};
    const toolDetails = form.project_type === 'tool'
      ? { installCmd: form.install_cmd.trim(), platforms: form.platforms }
      : {};

    return {
      id: normalizeSlug(form.id),
      name: form.name.trim(),
      project_type: form.project_type,
      category: categoryFromType(form.project_type),
      color: form.color || '#2563EB',
      tags,
      desc_vn: form.desc_vn.trim(),
      desc_en: form.desc_en.trim(),
      demo_url: form.project_type === 'code' ? (form.demo_url.trim() || null) : null,
      github_url: form.project_type === 'code' ? (form.github_url.trim() || null) : null,
      order_index: form.order_index,
      visible: form.visible,
      duration_vn: project?.duration_vn ?? null,
      duration_en: project?.duration_en ?? null,
      role_vn: project?.role_vn ?? null,
      role_en: project?.role_en ?? null,
      status: project?.status ?? 'live',
      type_vn: project?.type_vn ?? projectTypeLabel,
      type_en: project?.type_en ?? form.project_type,
      achievement_vn: project?.achievement_vn ?? null,
      achievement_en: project?.achievement_en ?? null,
      tech_stack: form.project_type === 'code' ? (project?.tech_stack ?? project?.techStack ?? '[]') : '[]',
      features_vn: project?.features_vn ?? '[]',
      features_en: project?.features_en ?? '[]',
      figma_url: form.project_type === 'design' ? form.figma_url.trim() : '',
      dribbble_url: form.project_type === 'design' ? form.dribbble_url.trim() : '',
      design_details_vn: designDetails,
      design_details_en: designDetails,
      install_cmd: form.project_type === 'tool' ? form.install_cmd.trim() : '',
      platforms: form.project_type === 'tool' ? form.platforms : [],
      tool_details_vn: toolDetails,
      tool_details_en: toolDetails,
    };
  };

  const handleSave = async () => {
    const slug = normalizeSlug(form.id);
    if (!slug) {
      setError('Slug ID là bắt buộc.');
      return;
    }

    if (!form.name.trim()) {
      setError('Tên dự án là bắt buộc.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const payload = buildPayload();
      if (isEditing) {
        await api.put('/admin/projects', payload);
      } else {
        await api.post('/admin/projects', payload);
      }

      window.dispatchEvent(new Event('projects-updated'));
      onSave();
      onClose();
    } catch (err) {
      console.error('Failed to save project:', err);
      setError(err instanceof Error ? err.message : 'Không thể lưu dự án.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/30 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-[980px] flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-outline-variant/60 px-6">
          <div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {isEditing ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
            </h3>
            <p className="text-[12px] text-on-surface-variant">Conditional Project Detail Form</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
            aria-label="Đóng modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.1fr]">
            <section className="space-y-4 rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wide text-on-surface-variant">Thông tin cơ bản</h4>

              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Loại dự án</span>
                <select
                  required
                  value={form.project_type}
                  onChange={event => setProjectType(event.target.value as ProjectType)}
                  className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {PROJECT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Tên dự án</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={event => updateForm('name', event.target.value)}
                  className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Tên dự án"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Slug ID</span>
                <input
                  type="text"
                  value={form.id}
                  disabled={isEditing}
                  onChange={event => updateForm('id', normalizeSlug(event.target.value))}
                  className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 font-mono text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
                  placeholder="Slug ID"
                />
              </label>

              <div>
                <span className="mb-2 block text-[12px] font-semibold text-on-surface-variant">Color Picker</span>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={event => updateForm('color', event.target.value)}
                    className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-outline-variant/60 bg-transparent"
                    aria-label="Màu card"
                  />
                  <input
                    type="text"
                    value={form.color}
                    onChange={event => updateForm('color', event.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 font-mono text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {COLOR_SWATCHES.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateForm('color', color)}
                      className={`h-7 w-7 rounded-md border transition ${form.color === color ? 'border-on-surface ring-2 ring-primary/30' : 'border-outline-variant/60'}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Chọn màu ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-end gap-4">
                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Thứ tự hiển thị</span>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={event => updateForm('order_index', Number(event.target.value) || 0)}
                    className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => updateForm('visible', !form.visible)}
                  className="mb-[1px] flex h-10 items-center gap-2 rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 text-[12px] font-semibold text-on-surface"
                >
                  <span className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${form.visible ? 'bg-[#30D158]' : 'bg-[#B8B8B8]'}`}>
                    <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.visible ? 'translate-x-4' : 'translate-x-0'}`} />
                  </span>
                  Visible
                </button>
              </div>
            </section>

            <section className="space-y-4 rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wide text-on-surface-variant">Mô tả dự án</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Tiếng Việt (desc_vn)</span>
                  <textarea
                    value={form.desc_vn}
                    onChange={event => updateForm('desc_vn', event.target.value)}
                    rows={8}
                    className="w-full resize-none rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Mô tả dự án bằng tiếng Việt..."
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">English (desc_en)</span>
                  <textarea
                    value={form.desc_en}
                    onChange={event => updateForm('desc_en', event.target.value)}
                    rows={8}
                    className="w-full resize-none rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Mô tả dự án bằng tiếng Anh..."
                  />
                </label>
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-4">
            <h4 className="mb-4 text-[12px] font-bold uppercase tracking-wide text-on-surface-variant">Trường theo loại dự án</h4>

            {form.project_type === 'code' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Link GitHub</span>
                  <input
                    type="url"
                    value={form.github_url}
                    onChange={event => updateForm('github_url', event.target.value)}
                    className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Đường dẫn GitHub"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Link Demo Live</span>
                  <input
                    type="url"
                    value={form.demo_url}
                    onChange={event => updateForm('demo_url', event.target.value)}
                    className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Đường dẫn demo live"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Mảng công nghệ</span>
                  <input
                    type="text"
                    value={form.tagsText}
                    onChange={event => updateForm('tagsText', event.target.value)}
                    className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Danh sách công nghệ"
                  />
                  <span className="mt-1 block text-[11px] text-on-surface-variant">Khi lưu sẽ split theo dấu phẩy thành mảng `tags`.</span>
                </label>
              </div>
            )}

            {form.project_type === 'design' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Link Figma</span>
                  <input
                    type="url"
                    value={form.figma_url}
                    onChange={event => updateForm('figma_url', event.target.value)}
                    className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Đường dẫn Figma"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Link Dribbble</span>
                  <input
                    type="url"
                    value={form.dribbble_url}
                    onChange={event => updateForm('dribbble_url', event.target.value)}
                    className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Đường dẫn Dribbble"
                  />
                </label>
              </div>
            )}

            {form.project_type === 'tool' && (
              <div className="grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Lệnh cài đặt</span>
                  <input
                    type="text"
                    value={form.install_cmd}
                    onChange={event => updateForm('install_cmd', event.target.value)}
                    className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 font-mono text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Lệnh cài đặt"
                  />
                </label>

                <div>
                  <span className="mb-2 block text-[12px] font-semibold text-on-surface-variant">Môi trường tương thích</span>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORM_OPTIONS.map(platform => (
                      <label
                        key={platform}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[12px] font-semibold text-on-surface"
                      >
                        <input
                          type="checkbox"
                          checked={form.platforms.includes(platform)}
                          onChange={() => updateForm('platforms', togglePlatform(form.platforms, platform))}
                        />
                        {platform}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-700">
              {error}
            </div>
          )}
        </div>

        <footer className="flex h-16 shrink-0 items-center justify-end gap-3 border-t border-outline-variant/60 bg-surface/95 px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-outline-variant/60 bg-surface-container-lowest px-5 py-2 text-[13px] font-semibold text-on-surface-variant transition hover:bg-surface-container-high"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-md bg-primary px-5 py-2 text-[13px] font-bold text-on-primary shadow-md shadow-primary/20 transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
